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
app.use(express.json());///to accept json 
// app.use(logger);
connectDb();
// app.use('/',(req,res)=>{
//     res.send('API is running');
// })
app.use(cors());
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);

// app.use(NotFound);
// app.use(errorHandlder);






app.listen(port,console.log(`app is working in ${port}`))
