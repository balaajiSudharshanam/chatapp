import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box, Button, Tooltip, Text, Flex, Menu, MenuButton, MenuList, MenuItem, MenuDivider,
  Avatar, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
  Input, useToast,
  Spinner
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from '../../miscellaneous/ProfileModel';
import { useNavigate } from 'react-router-dom';
import ChatLoading from './ChatLoading';
import axios from 'axios';
import UserListItem from './UserAvtar/UserListItem';


const SideDrawer = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const[loadingChat,setLoadingChat]=useState(false);
  const { user, selectedChat, chats, setchats, setSelectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate('/');
  };

  const searchHandler = async () => {
    if (!search) {
      toast({
        title: "Please enter a valid user name or email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
      setSearchResult(Array.isArray(data) ? data : []);

      
      setLoading(false);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      });
      setLoading(false);
    }
  };

  const accessChat = async(userId) => {
   try{
    setLoadingChat(true);
    const config = {
        headers: {
            "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const{data}= await axios.post("http://localhost:5000/api/chat",{userId},config);

      if(!chats.find((c)=>c._id===data._id)) setchats([data,...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
   }catch(err){
    toast({
        title:"Error fetching the chat",
        description:error.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
    })
   }
  };

  return (
    <Flex direction="column">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} ml={2}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work Sans">
          Ours
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon />
            </MenuButton>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
              </MenuButton>
              <MenuList>
                <ProfileModel user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModel>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
              </MenuList>
            </Menu>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" mb={4}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={searchHandler}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
               
              searchResult.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
                // console.log(user)
              ))
            )}

            {/* {loadingChat && <Spinner ml='auto' d="flex"/>} */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default SideDrawer;
