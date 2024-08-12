"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import styles from './signup.module.css'; // Adjust the path according to your project structure

export default function Home1() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpFromBackend, setOtpFromBackend] = useState('');
  const [verificationSuccessful, setVerificationSuccessful] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('');
  const [timer, setTimer] = useState(60);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setShowResendOtp(true);
      setOtpExpired(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendOtp = async () => {
    setAlertMessage('');
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const response = await fetch('http://localhost:8000/api/generate-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: generatedOtp,
        }),
      });
      
      const result = await response.json();
      if (response.ok) {
        setOtpFromBackend(generatedOtp);
        setOtpSent(true);
        setTimer(60);
        setShowResendOtp(false);
        setOtpExpired(false);
        console.log(generatedOtp);
      } else {
        setErrors({ otp: result.error || 'Failed to send OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({ otp: 'Failed to send OTP. Please try again.' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
    }

    setErrors(newErrors);

    if (valid && !otpSent) {
      setAlertMessage('Please verify your email by clicking the "Send OTP" button.');
    } else if (valid && otpSent && !verificationSuccessful) {
      setAlertMessage('Please complete OTP verification.');
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpExpired) {
      setErrors({ otp: 'Invalid or expired OTP. Please request a new OTP.' });
    } else if (otp === otpFromBackend) {
      setVerificationSuccessful(true);
      setOtpSent(false);
      setOtp('');
      setOtpFromBackend('');
      setAlertMessage('OTP verified successfully!');
      setAlertColor('green'); // Set alert color to green on success
    } else {
      setErrors({ otp: 'Invalid OTP. Please try again.' });
      setAlertMessage('Invalid OTP. Please try again.');
      setAlertColor('red'); // Set alert color to red on failure
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      setErrors(newErrors);
      return;
    }

    // API call to register the user
    const formDataToSend = new FormData();
    formDataToSend.append('user_email', email);
    formDataToSend.append('user_password', newPassword);

    try {
      const response = await axios.post('http://localhost:8000/api/register/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setAlertMessage('Registration successful!');
        setAlertColor('green');
        router.push('/login'); // Redirect to login page after successful signup
        console.log('Registration successful:', response.data.id);
      } else {
        console.error('Registration failed:', response.data.error);
        setErrors({ ...errors, user_email: response.data.error });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors({ ...errors, user_email: error.response.data.error });
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const idToken = response.credential;
  
      // Send the ID token to your backend for verification
      const backendResponse = await fetch('http://localhost:8000/api/google-signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
  
      if (backendResponse.ok) {
        const result = await backendResponse.json();
        // If successful, redirect the user or show a success message
        setAlertMessage('Google Sign-Up successful!');
        setAlertColor('green');
        router.push('/SignIn'); // Redirect to a relevant page after signup
      } else {
        const errorData = await backendResponse.json();
        setAlertMessage(`Google Sign-Up failed: ${errorData.error}`);
        setAlertColor('red');
      }
    } catch (error) {
      console.error('Google Sign-Up error:', error);
      setAlertMessage('Google Sign-Up failed. Please try again.');
      setAlertColor('red');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error(error);
    setAlertMessage('Google Sign-Up failed. Please try again.');
    setAlertColor('red');
  };

  return (
    <GoogleOAuthProvider clientId="896447012011-mnfigne1bhvjm1cj5tfjb33mb7fn3mpr.apps.googleusercontent.com">
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Signup</h1>
          <div className={styles.formContent}>
            {alertMessage && <p className={styles.alert} style={{ color: alertColor }}>{alertMessage}</p>}
            {!otpSent && !verificationSuccessful && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Email Address*</label>
                  <div className={styles.inputWithButton}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                      required
                    />
                    {!verificationSuccessful && (
                      <button
                        type="button"
                        onClick={sendOtp}
                        className={styles.otpButton}
                      >
                        Send OTP
                      </button>
                    )}
                  </div>
                  {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>
                
                <div className={styles.checkboxGroup}>
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms" className={styles.checkboxLabel}>
                    I have read and agree to the <a href="#" className={styles.link}>Terms and Conditions</a> and{' '}
                    <a href="#" className={styles.link}>Privacy Policy</a>.
                  </label>
                </div>
                <button type="submit" className={styles.submitButton}>
                  {verificationSuccessful ? 'Proceed' : 'Continue'}
                </button>
                {errors.submit && <span className={styles.error}>{errors.submit}</span>}
              </form>
            )}
            {otpSent && !verificationSuccessful && (
              <form onSubmit={handleOtpSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Enter OTP*</label>
                  <div className={styles.inputWithButton}>
                    <input
                      type="text"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`${styles.input} ${errors.otp ? styles.errorInput : ''}`}
                      required
                    />
                    {showResendOtp && !otpExpired && (
                      <p className={styles.timer}>Resend OTP in: {timer} seconds</p>
                    )}
                    {otpExpired && (
                      <button
                        type="button"
                        onClick={sendOtp}
                        className={styles.resendOtpButton}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  {errors.otp && <span className={styles.error}>{errors.otp}</span>}
                </div>
                <button type="submit" className={styles.submitButton}>
                  Verify OTP
                </button>
              </form>
            )}
            {verificationSuccessful && (
              <form onSubmit={handlePasswordSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>New Password*</label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${styles.input} ${errors.newPassword ? styles.errorInput : ''}`}
                    required
                  />
                  {errors.newPassword && <span className={styles.error}>{errors.newPassword}</span>}
                </div>
                <div className={styles.inputGroup}>
                  <label>Confirm Password*</label>
                  <input
                    type="password"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ''}`}
                    required
                  />
                  {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                </div>
                <button type="submit" className={styles.submitButton}>
                  Set Password
                </button>
              </form>
            )}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
              buttonText="Sign Up with Google"
              className={styles.googleButton}
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
