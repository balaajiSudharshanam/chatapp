import React, { useState } from 'react';
import { VStack, FormControl, Input, FormLabel, Button, InputGroup, InputRightElement,useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const[loading,setLoading]=useState(false);
  const toast=useToast();
  const navigate = useNavigate();

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handlePicChange = (e) => {
    setLoading(true);
    if(e===undefined){
      toast({
        title: 'please select an image',
        description: "please select an image ",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"bottom"
      })
      setLoading(false);
      return;
    }
    if(e.type==="image/jpeg"||e.type==="image/png"){
      const data = new FormData();
      data.append('file',e);
      data.append("upload_preset","chatapp");
      data.append("cloud_name",'djlishmg4');
      fetch("https://api.cloudinary.com/v1_1/djlishmg4/image/upload",{
        method:'post',
        body:data,
      }).then((res)=>res.json()
    
    )
      .then(data=>{
        console.log('Success:', data); 
        setPic(data.url.toString());
        setLoading(false);
      })
      .catch((err)=>{
        console.log(err);
        setLoading(false);
      })
      
      
    }else{
      toast({
        title: 'please select an image',
        description: "please select an image ",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"bottom"
      })
      setLoading(false);
      return;
    }
  };

  const handleShowPasswordClick = () => setShowPassword(!showPassword);
  const handleShowConfirmPasswordClick = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async () => {
    setLoading(true);

    // Form validation logic
    if (!name || !email || !password || !confirmPassword) {
        toast({
            title: 'Error',
            description: 'All fields are required',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
        });
        setLoading(false);
        return;
    }

    if (password !== confirmPassword) {
        toast({
            title: 'Error',
            description: 'Passwords do not match',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
        });
        setLoading(false);
        return;
    }

    if (!pic) {
        toast({
            title: 'Error',
            description: 'Please upload a profile picture',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
        });
        setLoading(false);
        return;
    }

    try {
        const config = {
            headers: {
                "Content-type": 'application/json',
            }
        };
        const { data } = await axios.post(
            "http://localhost:5000/api/user", // Update with your backend URL
            { name, email, password, pic },
            config
        );
        toast({
            title: 'Success',
            description: 'Registration successful!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
        });
        localStorage.setItem('userInfo', JSON.stringify(data));

        setLoading(false);
        navigate('/chats');
    } catch (error) {
      
        toast({
            title: 'Error',
            description: error.response?.data?.message || 'An error occurred',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
        });
        setLoading(false);
    }
};



  return (
    <VStack spacing='5px'>
      <FormControl id='name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter your name'
          value={name}
          onChange={handleNameChange}
        />
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={handleEmailChange}
        />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            value={password}
            onChange={handlePasswordChange}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleShowPasswordClick}>
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='confirmPassword' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Confirm your password'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleShowConfirmPasswordClick}>
              {showConfirmPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type='file'
          accept='image/*'
          onChange={(e)=>handlePicChange(e.target.files[0])}
        />
      </FormControl>

      <Button colorScheme='blue' width='100%'onClick={handleSubmit} isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
