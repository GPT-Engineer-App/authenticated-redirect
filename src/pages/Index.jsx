import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, useToast, Container, Heading, Text, Image } from "@chakra-ui/react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Check local storage for token on initial load
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:1337/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem("authToken", data.jwt);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          description: "You've been logged in!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.message[0].messages[0].message);
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.toString(),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    toast({
      title: "Logout Successful",
      description: "You've been logged out!",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container centerContent>
      <Box padding="4" maxW="md" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <VStack spacing={4}>
          <Image src="https://images.unsplash.com/photo-1523485474951-78fcd9344f0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwxfHxzZWN1cmUlMjBsb2dpbnxlbnwwfHx8fDE3MTM0NDU3NzZ8MA&ixlib=rb-4.0.3&q=80&w=1080" />
          {!isLoggedIn ? (
            <>
              <Heading>Login</Heading>
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button rightIcon={<FaSignInAlt />} colorScheme="teal" onClick={handleLogin}>
                Sign In
              </Button>
            </>
          ) : (
            <>
              <Text>Welcome back!</Text>
              <Button rightIcon={<FaSignOutAlt />} colorScheme="red" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </Container>
  );
};

export default Index;
