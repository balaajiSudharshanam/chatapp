const mongoose = require('mongoose');
const bcrypt=require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true ,unique:true},
    password: { type: String, required: true },
    pic: { type: String, required: true, default: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
    refreshToken: String,
}, { timestamps: true });

userSchema.methods.matchPassword=async function(enteredPassword){
    console.log(enteredPassword);
    return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.pre('save',async(next)=>{
    if(!this.ismodified){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt(this.password,salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
