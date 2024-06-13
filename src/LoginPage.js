import React, { useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, VStack, Heading, IconButton, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (values) => {
    if (values.username === 'admin1' && values.password === 'password1') {
      localStorage.setItem('authenticated', 'true');
      navigate('/');
    } else {
      alert('Invalid username or password');
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box height="100vh"  bgSize="cover" bgPosition="center">
      <Flex
        as="header"
        justifyContent="space-between"
        alignItems="center"
        p="4"
        bg="rgba(255, 255, 255, 0.8)"
      >
        <Heading size="md">Company Name</Heading>
        <Flex>
          <Button
            variant="link"
            _hover={{ border: '1px solid', borderRadius: 'md' }}
            color="gray.500"
            mr="4"
          >
            Home
          </Button>
          <Button
            variant="link"
            _hover={{ border: '1px solid', borderRadius: 'md' }}
            color="gray.500"
          >
            Join
          </Button>
        </Flex>
      </Flex>
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        height="calc(100vh - 64px)"
        p="8" 
      >
        <Box w="sm">
          <Heading mb="6">Login</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing="4">
              <FormControl id="username" isInvalid={errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  {...register('username', {
                    required: 'Username is required',
                  })}
                />
                {errors.username && <span>{errors.username.message}</span>}
              </FormControl>
              <FormControl id="password" isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={toggleShowPassword}
                    />
                  </InputRightElement>
                </InputGroup>
                {errors.password && <span>{errors.password.message}</span>}
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Login
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Box>
  );
}

export default LoginPage;