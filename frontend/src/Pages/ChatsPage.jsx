import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Flex } from '@chakra-ui/react';
import SideDrawer from '../components/Authentication/SideDrawer';
import MyChats from '../components/Authentication/MyChats';
import ChatBox from '../components/Authentication/ChatBox';


const ChatsPage = () => {
  const {user}=ChatState();
  const[fetchAgain,setFetchAgain]=useState(false);
  return (
    <div style={{width:'100%',height:"100%"}}>
      {user && <SideDrawer/>}
      {/* <Flex> */}
      <Box
      display="flex"
      justifyContent='space-between'
      w='100%'
      height='91.5wh'
      p='10px'
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
      {/* </Flex> */}
    </div>
  )
}

export default ChatsPage
