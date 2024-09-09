import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../Config/ChatLogic';
import ProfileModel from '../../miscellaneous/ProfileModel';
import UpdateGroupChatModal from '../../miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import '../style.css';
import ScrollableChat from './ScrollableChat';

const SingleChat = ({fetchAgain,setFetchAgain}) => {

  const[messages,setMessages]=useState([]);
  const [loading, setloading] = useState(false);
  const [newMessage, setnewMessage] = useState()
  const toast=useToast();

    const {user, selectedChat, setSelectedChat}=ChatState();

    const fetchMessages=async()=>{
      if(!selectedChat){
        return;
      }

      try {
        const config={
          headers:{
           
            Authorization:`Bearer ${user.token}`,
          }
        }
        setloading(true);
        const {data}= await axios.get(`http://localhost:5000/api/messages/${selectedChat._id}`,config);

        console.log(messages);
        setMessages(data);
        setloading(false);
      } catch (error) {
        toast({
          title:"Error Occured",
          description:"Failed to send the message",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom"
        });
      }
    }

    useEffect(()=>{
      fetchMessages();
    },[selectedChat]);

    const sendMessage=async(event)=>{
      if(event.key==="Enter" && newMessage){
        try {
          const config={
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${user.token}`,
            }
          }
          setnewMessage("");
            const{data}= await axios.post("http://localhost:5000/api/messages",{
              content:newMessage,
              chatId:selectedChat._id
            },config);
            console.log(data);
          setMessages([...messages,data]);
        } catch (error) {
           console.log(error);
          toast({
            title:"Error Occured",
            description:"Failed to send the message",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
          });
        }
      }
    }
    const typingHandler=(e)=>{
      setnewMessage(e.target.value);

      // typing indicator logic
    }
  
  return (
    <div>
      {
        selectedChat?(<>
        <Text
        fontSize={{base:"28px",md:"30px"}}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        >
            <IconButton d={{base:"flex",md:"none"}}
            icon={<ArrowBackIcon/>}
            onClick={()=>setSelectedChat("")}/>
            {!selectedChat.isGroupChat?(
                <>
                {[getSender(user,selectedChat.users)]}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                </>
            ):(<>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal fectAgain={fetchAgain} setFetchAgain={setFetchAgain}
            fetchMessages={fetchMessages}
            />
            </>)}
            </Text>
            <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-start"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            >
              {loading?(
                <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                
                />
              ):(
                // <div>messages</div>
                <div>
                  <div className="messages">

                    <ScrollableChat messages={messages}/>
                  </div>
                </div>
              )}
            <FormControl  onKeyDown={sendMessage}isRequired mt={3}>
              <Input
              varriant="filled"
              bg="#E0E0E0"
              placeholder="Enter a message..."
              onChange={typingHandler}
              value={newMessage}
              />
            </FormControl>
            </Box>
            </>):(<Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work  sans">Click on a user to start chatting</Text>
        </Box>)
      }
    </div>
  )
}

export default SingleChat
