"use client"
import React, { useState } from 'react';
import axios from 'axios';
import './ChangePassword.css';

const ChangePassword = () => {
  const [user_email, setEmail] = useState('');
  const [user_password, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyNewPassword, setVerifyNewPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  const checkEmailExists = async (user_email) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/check-email/?email=${user_email}`);
      if (response.data.exists) {
        setEmailError('');
      } else {
        setEmailError('Email not found');
      }
    } catch (error) {
      setEmailError('Error checking email');
    }
  };

  const checkOldPassword = async (user_password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/check-old-password/', {
        user_email,
        user_password
      });
      if (response.data.valid) {
        setPasswordError('');
      } else {
        setPasswordError('Incorrect old password');
      }
    } catch (error) {
      setPasswordError('Error checking old password');
    }
  };
  
  
  

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    if (value === user_password) {
      setNewPasswordError('New password cannot be the same as old password');
    } else if (value !== verifyNewPassword) {
      setNewPasswordError('New password and verify password do not match');
    } else {
      setNewPasswordError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (newPassword !== verifyNewPassword) {
      alert("New passwords don't match!");
      return;
    }
  
    axios.post('http://127.0.0.1:8000/api/update-password/', {
      user_email,
      user_password,
      new_password: newPassword,
      verify_new_password: verifyNewPassword,
    })
    .then(response => {
      alert('Password changed successfully!');
    })
    .catch(error => {
      alert(error.response.data.message);
    });
  };
  

  return (
    <div className="container">
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={user_email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => checkEmailExists(user_email)}
          />
          {emailError && <span>{emailError}</span>}
        </div>
        <div>
          <label>Old Password</label>
          <input
            type="password"
            value={user_password}
            onChange={(e) => setOldPassword(e.target.value)}
            onBlur={() => checkOldPassword(user_password)}
          />
          {passwordError && <span>{passwordError}</span>}
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          {newPasswordError && <span>{newPasswordError}</span>}
        </div>
        <div>
          <label>Verify New Password</label>
          <input
            type="password"
            value={verifyNewPassword}
            onChange={(e) => setVerifyNewPassword(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ChangePassword;