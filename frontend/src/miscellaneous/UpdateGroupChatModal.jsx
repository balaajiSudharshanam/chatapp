import { ViewIcon } from '@chakra-ui/icons'
import { IconButton, useDisclosure ,Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const[groupChatName,setGroupChatName]=useState();
    const[search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const[loading,setLoading]=useState(false);
    const{selectedChat,setSelectedChat,user}=ChatState();
  return (
    <div>
      <IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}>Open Modal</IconButton>

<Modal isOpen={isOpen} onClose={onClose}isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Modal Title</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {/* <Lorem count={2} /> */}
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={onClose}>
        Close
      </Button>
      
    </ModalFooter>
  </ModalContent>
</Modal>
    </div>
  )
}

export default UpdateGroupChatModal
