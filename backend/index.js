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






const server=app.listen(port,console.log(`app is working in ${port}`));

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:5173",
    },
});

io.on("connection",(socket)=>{
    console.log("connected to socket.io");

    socket.on('setup',(userData)=>{
        socket.join(userData.id);
        console.log(userData.id);
        socket.emit('connected');
    });
    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log('user joined room'+room);
      });

      socket.on('typing',(room)=>socket.in(room).emit("typing"));
      socket.on("stop typing",(room)=>{socket.in(room).emit("stop typing")
        console.log('loading gone');

      });
      socket.on('new message',(newMessageRecieved)=>{
        var chat= newMessageRecieved.chat;
        console.log("got it");
        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user=>{
            console.log(user._id==newMessageRecieved.sender._id);
            if(user._id==newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved",newMessageRecieved);
        })
      });
      socket.off("setup",()=>{
        console.log("user Disconnected");
        socket.leave(userData._id);
      })
})