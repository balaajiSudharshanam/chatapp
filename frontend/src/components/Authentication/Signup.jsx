import React, { useState } from 'react';
import { VStack, FormControl, Input, FormLabel, Button, InputGroup, InputRightElement } from '@chakra-ui/react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handlePicChange = (e) => setPic(e.target.files[0]);

  const handleShowPasswordClick = () => setShowPassword(!showPassword);
  const handleShowConfirmPasswordClick = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = () => {
    // Add form submission logic here
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
          onChange={handlePicChange}
        />
      </FormControl>

      <Button colorScheme='blue' width='100%'onClick={handleSubmit}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
