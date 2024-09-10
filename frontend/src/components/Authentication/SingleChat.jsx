import io from 'socket.io-client';
import React, { useEffect, useState, useRef } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../Config/ChatLogic';
import ProfileModel from '../../miscellaneous/ProfileModel';
import UpdateGroupChatModal from '../../miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import '../style.css';
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie';
import animationData from '../../animations/typing.json'

const ENDPOINT = "http://localhost:5000"; 
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const typingRef = useRef(false);  // Ref to keep track of typing state
  const lastTypingTimeRef = useRef(null);  // Ref to track the last typing time
  const defaultOptions={
    loop:true,
    autoplay:true,
    animationData:animationData,
    rendereSettings:{
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  const toast = useToast();
  const { user, selectedChat, setSelectedChat } = ChatState();

  // Fetching messages
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/messages/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to fetch the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Setting up the socket connection
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    
    socket.on('connected', () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Send message
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          }
        };

        setNewMessage("");
        const { data } = await axios.post("http://localhost:5000/api/messages", {
          content: newMessage,
          chatId: selectedChat._id
        }, config);

        socket.emit('new message', data); 
        
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // Typing handler using useRef for typing state and time tracking
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typingRef.current) {
      typingRef.current = true;
      socket.emit("typing", selectedChat._id);
    }

    lastTypingTimeRef.current = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTimeRef.current;

      if (timeDiff >= timerLength && typingRef.current) {
        socket.emit('stop typing', selectedChat._id);
        typingRef.current = false;
      }
    }, timerLength);
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      console.log(newMessageRecieved);
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        //give notification
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <div>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <ScrollableChat messages={messages} />
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div><Lottie
              options={defaultOptions}
              width={70}
              style={{marginBottom:15, marginLeft:0}}
              /></div> : <></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">Click on a user to start chatting</Text>
        </Box>
      )}
    </div>
  );
};

export default SingleChat;
