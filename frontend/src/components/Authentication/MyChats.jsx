import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box, Button, Stack, useToast, Text } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import UserListItem from './UserAvtar/UserListItem';
import { getSender } from '../../Config/ChatLogic';
import GroupChatModal from '../../miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, chats, setChats, setSelectedChat } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get('http://localhost:5000/api/chat', config);
            setChats(data);
            console.log(data);
        } catch (error) {
            toast({
                title: "Error fetching chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        // console.log(loggedUser);
        fetchChats();
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
            height="100%"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                <Button
                    display="flex"
                    fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                    rightIcon={<AddIcon />}
                >
                    New Group Chat
                </Button>
                </GroupChatModal>
            </Box>

            <Box
                display="flex"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflow="hidden"
            >
                {chats ? (
                    <Stack overflowY='scroll'>
                        {chats.map((chat) => (
                          <Box
                          onClick={()=>setSelectedChat(chat)}
                          cursor="pointer"
                          bg={selectedChat===chat?"#38B2AC":"#E8E8E8"}
                          color={selectedChat==chat?"white":"black"}
                          px={3}
                          py={2}
                          borderRadius='lg'
                          key={chat._id}
                          >
                            <Text>{!chat.isGroupChat?getSender(loggedUser,chat.users):chat.chatName}</Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
};

export default MyChats;
