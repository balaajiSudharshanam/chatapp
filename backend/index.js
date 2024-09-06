const express=require('express');
const app=express();
const cors = require('cors');
const dotenv=require('dotenv');
const connectDb=require('./config/db');
const{NotFound,errorHandlder}=require('./middlware/errorMiddleware')
dotenv.config();
const port=process.env.PORT||5000;
const {logger}=require('./middlware/logevents');
const userRoutes=require('./routes/userRoutes');
const chatRoutes=require('./routes/chatRoutes')
const messageRoutes=require('./routes/messageRoutes');
app.use(express.json());///to accept json 
// app.use(logger);
connectDb();
// app.use('/',(req,res)=>{
//     res.send('API is running');
// })
app.use(cors());
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/messages',messageRoutes);

// app.use(NotFound);https://github.com/feder-cr/linkedIn_auto_jobs_applier_with_AI?tab=readme-ov-file#usage
// app.use(errorHandlder);






app.listen(port,console.log(`app is working in ${port}`))
