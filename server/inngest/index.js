import { Inngest, step } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from '../configs/nodeMailer.js'
import Story from "../models/Story.js";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "pingup-app" });

//Inngest function  to save user data to a database
const syncUserCreation = inngest.createFunction(
    {id:'sync/user_creation'},
    {event : 'clerk/user.created'},
    async({event})=>{
        const {id,first_name,last_name,email_addresses,image_url}=event.data
        let username=email_addresses[0].email_address.split('@')[0]

        //Check availability of username
        const user=await User.findOne({username})

        if(user){
            username=username+Math.floor(Math.random()*1000)
        }

        const userData={
            _id:id,
            email:email_addresses[0].email_address,
            full_name:first_name+' '+last_name,
            profile_picture: image_url,
            username
        }

        await User.create(userData)

    }
) 


//Inngest function  to update user data in database
const syncUserUpdation = inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event : 'clerk/user.updated'},
    async({event})=>{
        const {id,first_name,last_name,email_addresses,image_url}=event.data
 
        const updatedUserData={
            email: email_addresses[0].email_address,
            full_name:first_name+' '+last_name,
            profile_picture: image_url,
        }
        await User.findByIdAndUpdate(id,updatedUserData);

    }
) 

//Inngest function  to delete user data in database
const syncUserDeletion = inngest.createFunction(
    {id:'delete-user-from-clerk'},
    {event : 'clerk/user.deleted'},
    async({event})=>{
        const {id}=event.data
        await User.findByIdAndDelete(id)

    }
) 


//Inngest function to send Remainder when a new connection request is added
const sendConnectionRequestRemainder = inngest.createFunction(
    {id:'send-connection-request-remainder'},
    {event : 'app/connection-request'},
    async({event,step})=>{
        const {connectionId}=event.data;
        await step.run('send-connection-request-mail',async()=>{
            const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
            const subject=`new Connection Request`;
            const body=`
            <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2> Hi ${connection.to_user_id.full_name},</h2>
            <p>You have a new connection request from ${connection.form_user_id.full_name}-@${connection.form_user_id.username}</p>
            <p>Click <a href="${process.env.FRONT_URL}/connections" style="colour:
            #10b981;">here</a> to accept or reject the request</p>
            <br/>
            <p>Thanks,<br/>PingUp - Stay Connected</p>
            <div>`;

            await sendEmail({
                to:connection.to_user_id.email,
                subject,
                body
            })
        })

        const in24Hours= new Date(Date.nov()+24*60*60*1000)
        await step.sleepUntil("await-for-24-hours",in24Hours);
        await step.run('send-connection-request-remainder',async()=>{
            const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');

            if(connection.status==="accepted"){
                return {message: "Already accepted"}
            }
            const subject=`new Connection Request`;
            const body=`
            <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2> Hi ${connection.to_user_id.full_name},</h2>
            <p>You have a new connection request from ${connection.form_user_id.full_name}-@${connection.form_user_id.username}</p>
            <p>Click <a href="${process.env.FRONT_URL}/connections" style="colour:
            #10b981;">here</a> to accept or reject the request</p>
            <br/>
            <p>Thanks,<br/>PingUp - Stay Connected</p>
            <div>`;

            await sendEmail({
                to:connection.to_user_id.email,
                subject,
                body
            })

            return {message:"Reminder sent."}
        })
    }
)

//Inngest Function to delete story after 24 hours
const deleteStory = inngest.createFunction(
    {id:'story-delete'},
    {event : 'app/story.delete'},
    async({event,step})=>{
        const {storyId}=event.data;
        const in24Hours=new Date(Date.now()+24*60*60*1000)
        await step.sleepUntil('wait-for-24-hours',in24Hours)
        await step.run("delete-story",async()=>{
            await Story.findByIdAndDelete(storyId);
            return {message :"Story deleted"}
        })
    }
)




// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendConnectionRequestRemainder,
    deleteStory
];

