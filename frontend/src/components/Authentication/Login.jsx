import React, { useState } from 'react';
import { VStack, FormControl, Input, FormLabel, Button, InputGroup, InputRightElement,useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const[loading,setLoading]=useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleShowPasswordClick = () => setShowPassword(!showPassword);
  const toast=useToast();
  const navigate=useNavigate();
  const handleSubmit = async () => {
    setLoading(true);

    if(!email||!password){
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
    try {
      const config = {
          headers: {
              "Content-type": 'application/json',
          }
      };
      const { data } = await axios.post(
          "http://localhost:5000/api/user/login", // Update with your backend URL
          { email, password},
          config
      );
      console.log(data);
      toast({
          title: 'Success',
          description: 'welcome back',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      console.log(JSON.stringify(data));
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

      <Button colorScheme='blue' width='100%' onClick={handleSubmit} isLoading={loading}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
