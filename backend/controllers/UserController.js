const User = require('../model/UserModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const bcrypt = require('bcrypt');

const registerUser = asyncHandler(async (req, res) => {
    // console.log('hit');
    // console.log(req.body);
    const { name, email, password, picture } = req.body;

    // Corrected condition to check missing fields
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("User already exists");
    }
    const hashedPWd=await bcrypt.hash(password,10);
    const user = await User.create({
        name,
        email,
        password,
        picture,
    });

    if (user) {
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Failed to create new user");
    }
});

 const authUser=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;
    const user=await User.findOne({email});
    // console.log(password);
    if(user &&(user.matchPassword(password))){
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }else{
        res.status(401)
        throw new Error("user not found");
    }
 })
 //api/user?search="variables"
 const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});


module.exports = { registerUser,authUser,allUsers };
