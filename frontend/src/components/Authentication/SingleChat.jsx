import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../Config/ChatLogic';
import ProfileModel from '../../miscellaneous/ProfileModel';
import UpdateGroupChatModal from '../../miscellaneous/UpdateGroupChatModal';

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user, selectedChat, setSelectedChat}=ChatState();
    // console.log(selectedChat);
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
            <UpdateGroupChatModal fectAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
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
              {/* messages here */}
            </Box>
            </>):(<Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work  sans">Click on a user to start chatting</Text>
        </Box>)
      }
    </div>
  )
}

export default SingleChat
