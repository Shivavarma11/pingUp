import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodeMailer.js";
import Story from "../models/Story.js";
import Message from "../models/Message.js";

// Create client
export const inngest = new Inngest({ id: "pingup-app" });

/* ---------------- USER SYNC ---------------- */

const syncUserCreation = inngest.createFunction(
  { id: "sync/user_creation" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    let username = email_addresses[0].email_address.split("@")[0];
    const existing = await User.findOne({ username });
    if (existing) username += Math.floor(Math.random() * 1000);

    await User.create({
      _id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username,
    });
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    });
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await User.findByIdAndDelete(event.data.id);
  }
);

/* ---------------- CONNECTION REMINDER ---------------- */

const sendNewConnectionRequestRemainder = inngest.createFunction(
  { id: "send-connection-request-remainder" },
  { event: "app/connection-request" },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run("send-initial-mail", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );
      if (!connection) return;

      await sendEmail({
        to: connection.to_user_id.email,
        subject: "New Connection Request",
        body: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>Hi ${connection.to_user_id.full_name},</h2>
          <p>You have a new connection request from 
            ${connection.from_user_id.full_name} (@${connection.from_user_id.username})
          </p>
          <p>
            Click <a href="${process.env.FRONT_URL}/connections" style="color:#10b981;">
            here</a> to respond.
          </p>
          <p>Thanks,<br/>PingUp</p>
        </div>`
      });
    });

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-24-hours", in24Hours);

    await step.run("send-reminder-mail", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );
      if (!connection || connection.status === "accepted") return;

      await sendEmail({
        to: connection.to_user_id.email,
        subject: "Reminder: Connection Request",
        body: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>Hi ${connection.to_user_id.full_name},</h2>
          <p>You still have a pending connection request from 
            ${connection.from_user_id.full_name}
          </p>
          <p>
            <a href="${process.env.FRONT_URL}/connections" style="color:#10b981;">
            View request</a>
          </p>
        </div>`
      });
    });
  }
);

/* ---------------- STORY DELETE ---------------- */

const deleteStory = inngest.createFunction(
  { id: "story-delete" },
  { event: "app/story.delete" },
  async ({ event, step }) => {
    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("delete-after-24h", in24Hours);
    await Story.findByIdAndDelete(event.data.storyId);
  }
);

/* ---------------- UNSEEN MESSAGE NOTIFICATION ---------------- */

const sendNotificationOfUnsenMessages = inngest.createFunction(
  { id: "send-unseen-messages-notification" },
  { cron: "TZ=America/New_York 0 9 * * *" },
  async () => {
    const messages = await Message.find({ seen: false }).populate("to_user_id");
    const unseenCount = {};

    messages.forEach(msg => {
      if (!msg.to_user_id) return;
      unseenCount[msg.to_user_id._id] =
        (unseenCount[msg.to_user_id._id] || 0) + 1;
    });

    for (const userId in unseenCount) {
      const user = await User.findById(userId);
      if (!user) continue;

      await sendEmail({
        to: user.email,
        subject: `You have ${unseenCount[userId]} unseen messages`,
        body: `
        <div style="font-family:Arial, sans-serif; padding:20px;">
          <h2>Hi ${user.full_name},</h2>
          <p>You have ${unseenCount[userId]} unseen messages.</p>
          <a href="${process.env.FRONT_URL}/messages" style="color:#10b981;">
            View messages
          </a>
        </div>`
      });
    }
  }
);

/* ---------------- EXPORT ---------------- */

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendNewConnectionRequestRemainder,
  deleteStory,
  sendNotificationOfUnsenMessages,
];
