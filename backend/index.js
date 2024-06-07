const express=require('express');
const app=express();
const port=process.env.PORT||4000;
const {logger}=require('./middlware/logevents');

app.use(logger);











app.listen(port,console.log(`app is working in ${port}`))
