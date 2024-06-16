const mongooes=require('mongoose');


const messagemodel=mongooes.Schema({
    sender:{type:mongooes.Schema.Types.ObjectId, ref:"User"},
    content:{type:String,trim: true},
    chat:{type:mongooes.Schema.Types.ObjectId, ref:"Chat"},
},
{
    timestamps:true,
})

const Message=mongooes.model("Message",messagemodel);

module.exports=Message;