import React, { useState } from 'react';
import { VStack, FormControl, Input, FormLabel, Button, InputGroup, InputRightElement } from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleShowPasswordClick = () => setShowPassword(!showPassword);

  const handleSubmit = () => {
    // Add login logic here
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

      <Button colorScheme='blue' width='100%' onClick={handleSubmit}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
