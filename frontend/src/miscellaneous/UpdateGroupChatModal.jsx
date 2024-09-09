import { ViewIcon } from '@chakra-ui/icons'
import { IconButton, useDisclosure ,Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import UserBadgeItem from '../components/Authentication/UserAvtar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../components/Authentication/UserAvtar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain, fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const[groupChatName,setGroupChatName]=useState('');
    const[search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const[loading,setLoading]=useState(false);
    const{selectedChat,setSelectedChat,user}=ChatState();
    const[renameLoading,setRenameLoading]=useState(false);

const toast=useToast();
// console.log(selectedChat);
const handleRemove=async(user1)=>{
    if(selectedChat.groupAdmin._id!==user.id){
        toast({
            title:"only admins can remove someone",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        });
        return;
    }
    try {
        setLoading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`,
            },

        };
        console.log(user1);
        const{data}=await axios.put("http://localhost:5000/api/chat/groupremove",{
            chatId:selectedChat._id,
            userId:user1._id,
        },config)
        user1._id===user._id?setSelectedChat():setSelectedChat(data);
        
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
    } catch (error) {
        console.log(error)
        toast({
            title:"Error Occured",
            // description:error.response.data.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom",
        });
    }
}
const handleAddUser=async(user1)=>{
    if(selectedChat.users.find((u)=>u._id===user1._id)){
        toast({
            title:"User Already in group",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom",
        });
        return;
    }
    
    if(selectedChat.groupAdmin._id!==user.id){
        toast({
            title:"only admins can add someone",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        });
        return;
    }
    try {
        setLoading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`,
            },

        };

        const{data}=await axios.put("http://localhost:5000/api/chat/groupadd",{
            chatId:selectedChat._id,
            userId:user1._id,
        },config)
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
    } catch (error) {
        console.log(error);
        toast({
            title:"Error Occured",
            
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom",
        });
    }
}
const handleRename=async()=>{
    // console.log(groupChatName);
    if(!groupChatName)return;
    try{
        setRenameLoading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        };

        const { data } = await axios.put(`http://localhost:5000/api/chat/rename`,{chatId:selectedChat._id,
            chatName:groupChatName
        },config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
    }catch(e){
        console.log(e);
        toast({
            title:"Error Occured",
            description: e.response.data.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        });
        setRenameLoading(false);
    }
    setGroupChatName("");
}
const handleSearch=async(query)=>{
setSearch(query);
if(!query){
    return ;
}

try{
    setLoading(true);
    const config={
        headers:{
            Authorization:`Bearer ${user.token}`,
        },
    };
    const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        

}catch(e){
    toast({
        title:"Error Occured",
            description: error.response.data.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom" 
    })
}
}
  return (
    <div>
      <IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}>Open Modal</IconButton>

<Modal isOpen={isOpen} onClose={onClose}isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
    fontSize="35px"
    fontFamily="Work sans"
    d="flex"
    justifyContent="center"
    >{selectedChat.chatName}</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {/* <Lorem count={2} /> */}
      <Box w="100%" display='flex' flexWrap="wrap" pb={3}>
        {selectedChat.users.map(user=>(
            <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleRemove(user)}/>
            
        ))}
      </Box>
      <FormControl display="flex">
        <Input placeholder='Chat Name' mb={3} value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}/>
        <Button
        variant="solid"
        colorScheme="teal"
        ml={1}
        isLoading={renameLoading}
        onClick={handleRename}
        >Update</Button>
      </FormControl>
      <FormControl>
        <Input placeholder='Add Users eg: John,' mb={3} onChange={(e)=>handleSearch(e.target.value)}/>
        
    </FormControl>
    {loading?(
        <Spinner size='lg'/>
    ):(
        searchResult?.map((user)=>(
            <UserListItem key={user._id}
            user={user}
            handleFunction={()=>handleAddUser(user)}
            />
        ))
    )}
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)}>
        Leave Group
      </Button>
      
    </ModalFooter>
  </ModalContent>
</Modal>
    </div>
  )
}

export default UpdateGroupChatModal
