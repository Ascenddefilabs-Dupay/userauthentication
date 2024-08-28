"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing Font Awesome icons
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from 'next/link'; // Import Next.js Link component
import styles from './signup.module.css'; // Adjust the path according to your project structure

export default function Home1() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpFromBackend, setOtpFromBackend] = useState('');
  const [verificationSuccessful, setVerificationSuccessful] = useState(false);
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
    if (!email) {
      setErrors({ email: 'Email is required.' });
      return;
    }
    try {
      // Check if the email is already in use
      const emailCheckResponse = await fetch('http://localhost:8000/signupapi/check-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
  
      const emailCheckResult = await emailCheckResponse.json();
      if (emailCheckResponse.ok && emailCheckResult.exists) {
        alert('Email is already in use. Please use a different email.');
        return; // Stop further execution if email is already in use
      }
  
      // Generate OTP and send it
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const response = await fetch('http://localhost:8000/signupapi/generate-otp/', {
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
        setTimer(30);
        setShowResendOtp(false);
        setOtpExpired(false);
        alert('OTP sent successfully!');
        console.log(generatedOtp);
      } else {
        alert(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
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
      alert('Please verify your email by clicking the "Send OTP" button.');
    } else if (valid && otpSent && !verificationSuccessful) {
      alert('Please complete OTP verification.');
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpExpired) {
      alert('Invalid or expired OTP. Please request a new OTP.');
    } else if (otp === otpFromBackend) {
      setVerificationSuccessful(true);
      setOtpSent(false);
      setOtp('');
      setOtpFromBackend('');
      alert('OTP verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
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
  
    const formDataToSend = new FormData();
    formDataToSend.append('user_email', email);
    formDataToSend.append('user_password', newPassword);
  
    try {
      const response = await axios.post('http://localhost:8000/signupapi/register/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Response data:', response.data);
  
      if (response.data.success) {
        alert('Registration successful!');
        router.push('/SignIn');
      } else {
        const errorMessage = response.data.error || 'Registration failed. Please try again.';
        console.error('Registration failed:', errorMessage);
        setErrors({ ...errors, user_email: errorMessage });
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again.';
      setErrors({ ...errors, user_email: errorMessage });
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const idToken = response.credential;

      const backendResponse = await fetch('http://localhost:8000/signupapi/google-signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (backendResponse.ok) {
        const result = await backendResponse.json();
        alert('Google Sign-Up successful!');
        router.push('/SignIn');
      } else {
        const errorData = await backendResponse.json();
        alert(`Google Sign-Up failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Google Sign-Up error:', error);
      alert('Google Sign-Up failed. Please try again.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error(error);
    alert('Google Sign-Up failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId="896447012011-mnfigne1bhvjm1cj5tfjb33mb7fn3mpr.apps.googleusercontent.com">
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Signup</h1>
          <div className={styles.formContent}>
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
                <div className={styles.orContainer}>
                  <span className={styles.orLabel}>or</span>
                </div>
                <div className={styles.googleButtonWrapper}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onFailure={handleGoogleFailure}
                    buttonText="Sign Up with Google"
                    className={styles.googleButton}
                    style={{ width: '100%' }} 
                  />
                </div>
                <div className={styles.signInLinkWrapper}>
                  <Link href="/SignIn" className={styles.signInLink}>
                    Already have an account? Sign In
                  </Link>
                </div>
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
                    {/* {sendOtp && !otpExpired } */}
                 
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
                {showResendOtp && !otpExpired && (
                  <p className={styles.timer}>Resend OTP in: {timer} seconds</p>
                )}
                {otpExpired && <p className={styles.error}>OTP expired. Please request a new one.</p>}
                {timer > 0 && <p>Time remaining: {timer} seconds</p>}
              </form>
            )}
            {verificationSuccessful && (
              <form onSubmit={handlePasswordSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>New Password*</label>
                  <div className={styles.inputWithButton}>
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`${styles.input} ${errors.newPassword ? styles.errorInput : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className={styles.eyeButton}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.newPassword && <span className={styles.error}>{errors.newPassword}</span>}
                </div>
                <div className={styles.inputGroup}>
                  <label>Confirm Password*</label>
                  <div className={styles.inputWithButton}>
                    <input
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className={styles.eyeButton}
                    >
                      {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                </div>
                <br />
                <button type="submit" className={styles.submitButton}>
                  SUBMIT
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
