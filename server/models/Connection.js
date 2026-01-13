import mangoose from "mongoose";

const connectionSchema = new mangoose.Schema({
    from_user_id:{type: String,ref:'User',required:true},
    to_user_id:{type:String,ref:'User',required:true},
    status:{type:String,enum:['pending','accepted'],default:'pending'},
},{timestamps:true})

const Connection = mangoose.model("Connection",connectionSchema)

export default Connection