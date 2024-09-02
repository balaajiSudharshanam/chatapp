import { useDisclosure ,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    FormControl,
    Input,
    Box,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../components/Authentication/UserAvtar/UserListItem';
import UserBadgeItem from '../components/Authentication/UserAvtar/UserBadgeItem';

const GroupChatModal = ({children}) => {
    const {isOpen,onOpen,onClose}=useDisclosure();
    const [groupChatName,setGroupChatName]=useState();
    const [selectedUser,setSelectedUser]=useState([]);
    const [search,setSearch]=useState("");
    const[searchResult,setSearchResult]=useState([]);
    const[loading,setLoading]=useState(false);

    const toast=useToast();
    const{user,chats,setChats}=ChatState();

    const handleSearch=async(query)=>{
        setSearch(query);
        if(!query){
            setSearchResult([]);
            return;
        }

        try{
            setLoading(true);

            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                }
            };

            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
            // console.log(searchResult);
        }catch(error){
            toast({
                title:"Error occured",
                description: "Failed to Load the Search Results",
                status:"error",
                duration:5000,
                isClosable:true,
                position: "bottom-left"
            });
        }
    }

    const handleSubmit=async()=>{
        if(!groupChatName ||!selectedUser){
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            });
            return;
        }
        try{
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                }
                
            };

            const body={
                name:groupChatName,
                users:JSON.stringify(selectedUser.map((u)=>u._id)),
            }

            const{data}=await axios.post("http://localhost:5000/api/chat/group",body,config)

            setChats([data,...chats]);
            setGroupChatName(''); 
    setSelectedUser([]); 
    onClose(); 
            onClose();
            toast({
                title:"New Group Chat Created",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
        }catch (e){
            console.log(e)
        }
    }

    const handleDelete = (user) => {
        // console.log("clicked");
        setSelectedUser(selectedUser.filter(sel => sel._id !== user._id));
    };
    const handleGroup=(user)=>{
        console.log(user);
        if(selectedUser.includes(user)){
            toast({
                title:"user already added",
                status:"waring",
                duration:5000,
                isClosable:true,
                position:"top"
            });
            return;
        }

        setSelectedUser([...selectedUser, user]);
        console.log(selectedUser);
    }
  return (
    <div>
      <span onClick={onOpen}>{children}</span>

<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
    fontSize="35px"
    fontFamily="work sans"
    d="flex"
    justifyContent="center"
    >Create Group Chat</ModalHeader>
    <ModalCloseButton />
    <ModalBody d="flex" flexDir="column" alignItems="center">
    <FormControl>
        <Input placeholder='Chat Name' mb={3} onChange={(e)=>setGroupChatName(e.target.value)}/>
        
    </FormControl>
    <FormControl>
        <Input placeholder='Add Users eg: John,' mb={3} onChange={(e)=>handleSearch(e.target.value)}/>
        
    </FormControl>
    <Box w="100%" display="flex" flexwrap="wrap">
    {selectedUser.map((user)=>(
        <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)}/>
       ))}
    </Box>

       
        {loading?<div>Loading</div>:<div>{searchResult?searchResult.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={()=>handleGroup(user)}
                />
                
                // console.log(user)
              )):<div></div>}</div>}
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={handleSubmit} >
        Create Chat
      </Button>
      <Button  colorScheme='red' onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </div>
  )
}

export default GroupChatModal
