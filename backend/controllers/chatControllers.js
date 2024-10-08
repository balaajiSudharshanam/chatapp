const expressAsyncHandler = require("express-async-handler");
const Chat = require('../model/chatModel');
const User = require('../model/UserModel');

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
        console.log('userId param not found');
        res.sendStatus(400);
        return;
    }

    try {
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        }).populate('users', "-password").populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: "name pic email",
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            };

            const createChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({ _id: createChat._id }).populate('users', "-password");
            res.status(200).send(fullChat);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const fetchChat = expressAsyncHandler(async (req, res) => {
    try {
        const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email"
        });
        // console.log(populatedResults);
        res.status(200).send(populatedResults);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


const createGroupChat = expressAsyncHandler(async (req, res) => {
    const { users, name } = req.body;
    console.log(name);
    if (!users || !name) {
        return res.status(400).send({ message: "Please fill the fields" });
    }

    const parsedUsers = JSON.parse(users);

    if (parsedUsers.length < 2) {
        return res.status(400).send({ message: "Requires more than two users" });
    }

    parsedUsers.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: name,
            users: parsedUsers,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

    
});
const renameGroup=expressAsyncHandler(async(req,res)=>{
    const{chatId,chatName}=req.body;


    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
    },
    {
        new:true,
    }
)
.populate("users","-password")
.populate("groupAdmin","-password");
if(!updatedChat){
    res.status(404);
    throw new Error("chat Not found");
}else
{
    res.json(updatedChat);
}
}

);


const addToGroup=expressAsyncHandler(async(req,res)=>{
    const{chatId,userId}=req.body;

    const added= await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
    },{
        new:true
    })
    .populate("users","-password")
    .populate("groupAdmin","-passoword");

    if(!added){
        res.status(404);
        throw new Error("chat not found");
    }else{
        res.json(added);
    }
});
const removefromGroup=expressAsyncHandler(async(req,res)=>{
    const{chatId,userId}=req.body;

    const added= await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
    },{
        new:true
    })
    .populate("users","-password")
    .populate("groupAdmin","-passoword");

    if(!added){
        res.status(404);
        throw new Error("chat not found");
    }else{
        res.json(added);
    }
});

module.exports = { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removefromGroup };
