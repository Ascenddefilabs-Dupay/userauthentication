"use client";
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
  const [passwordMismatchError, setPasswordMismatchError] = useState('');

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
    validatePasswords(value, verifyNewPassword);
  };

  const handleVerifyNewPasswordChange = (e) => {
    const value = e.target.value;
    setVerifyNewPassword(value);
    validatePasswords(newPassword, value);
  };

  const validatePasswords = (newPassword, verifyNewPassword) => {
    if (newPassword === user_password) {
      setNewPasswordError('New password cannot be the same as old password');
    } else if (newPassword !== verifyNewPassword) {
      setPasswordMismatchError('New password and verify password do not match');
    } else {
      setNewPasswordError('');
      setPasswordMismatchError('');
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
      <div className="formWrapper">
        <h1 className="title">Change Password</h1>
        <form onSubmit={handleSubmit} className="formContent">
          <div className="inputGroup">
            <label>Email</label>
            <input
              type="email"
              value={user_email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => checkEmailExists(user_email)}
              className={`input ${emailError ? 'errorInput' : ''}`}
            />
            {emailError && <span className="error">{emailError}</span>}
          </div>
          <div className="inputGroup">
            <label>Old Password</label>
            <input
              type="password"
              value={user_password}
              onChange={(e) => setOldPassword(e.target.value)}
              onBlur={() => checkOldPassword(user_password)}
              className={`input ${passwordError ? 'errorInput' : ''}`}
            />
            {passwordError && <span className="error">{passwordError}</span>}
          </div>
          <div className="inputGroup">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className={`input ${newPasswordError ? 'errorInput' : ''}`}
            />
            {newPasswordError && <span className="error">{newPasswordError}</span>}
          </div>
          <div className="inputGroup">
            <label>Verify New Password</label>
            <input
              type="password"
              value={verifyNewPassword}
              onChange={handleVerifyNewPasswordChange}
              className="input"
            />
            {passwordMismatchError && <span className="error">{passwordMismatchError}</span>}
          </div>
          <button type="submit" className="submitButton">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
