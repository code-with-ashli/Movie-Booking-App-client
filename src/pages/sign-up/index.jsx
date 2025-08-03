import React from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from 'react-router-dom'
import { Button, Typography } from "@mui/material";

import "./style.css";
import { useState } from "react";
import { useMemo } from "react";
import { useLoggedInUser, useSignup } from "../../hooks/auth.hooks";
import { useEffect } from "react";

const SignUpPage = () => {
    const navigate = useNavigate();
    const {mutateAsync : signUpAsync} = useSignup();
    const { data : loggedInUser } = useLoggedInUser();

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
      if (loggedInUser) navigate("/dashboard");
    }, [loggedInUser, navigate]);
  
    const isConfirmPasswordMatch = useMemo(
      () => password === confirmPassword || confirmPassword === "",
      [confirmPassword, password]
    );
  

    console.log({loggedInUser});

    const handleFormSubmit = async(e) => {
        e.preventDefault();
        if(!isConfirmPasswordMatch){
            return ;
        }
            
        await signUpAsync({firstname, lastname, email, password});
        

    }

  return (
    <div className="sign-up-page-container">
      <div>
        <Typography variant="h2">Sign Up</Typography>
        <Box component="form" onSubmit={handleFormSubmit}>
          <div className="form-row">
            <TextField
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              required
              id="firstName"
              label="FirstName"
            />
            <TextField
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              id="lastname"
              label="LastName"
            />
          </div>
          <div className="form-row">
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              id="email"
              label="Email"
            />
          </div>

          <div className="form-row">
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              type="password"
              id="password"
              label="Password"
            />
          </div>
          <div className="form-row">
            <TextField
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!isConfirmPasswordMatch}
              helperText={
                !isConfirmPasswordMatch ? "Password is not matching" : undefined
              }
              type="password"
              fullWidth
              required
              id="confirm-password"
              label="Confirm Password"
            />
          </div>
          <div className="form-row">
            <Button
              disabled={!isConfirmPasswordMatch}
              fullWidth
              variant="contained"
              type="submit"
            >
              Create Account
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default SignUpPage;
