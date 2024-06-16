const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const port=process.env.PORT||4000;
const {logger}=require('./middlware/logevents');

app.use(logger);

app.use('/',(req,res)=>{
    res.send('API is running');
})









app.listen(port,console.log(`app is working in ${port}`))
