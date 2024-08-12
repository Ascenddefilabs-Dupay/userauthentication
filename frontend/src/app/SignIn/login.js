"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from './login.module.css';
import Navbar from '../LandingPage/Navbar';
import Cookies from 'js-cookie';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [loginWithOtp, setLoginWithOtp] = useState(false);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: '896447012011-mnfigne1bhvjm1cj5tfjb33mb7fn3mpr.apps.googleusercontent.com',
          callback: handleGoogleLoginSuccess,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large' }
        );
      };
      document.body.appendChild(script);
    };
    loadGoogleScript();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loginWithOtp) {
      // Handle OTP login here
      try {
        const response = await axios.post('http://localhost:8000/loginapi/generate-otp/', {
          user_email: email,
          user_otp: password,
        });

        if (response.status === 200) {
          const { user_id, user_first_name, user_email, user_phone_number } = response.data;
          setCookies(user_id, user_first_name, user_email, user_phone_number);
          setIsLoggedIn(true);
          setUserData({ user_id, user_first_name, user_email, user_phone_number });
          setLoginMessage('Logged in successfully');
        } else {
          setLoginMessage('Invalid OTP.');
        }
      } catch (error) {
        setLoginMessage('Invalid OTP.');
      }
    } else {
      // Handle password login
      try {
        const response = await axios.post('http://localhost:8000/loginapi/login/', {
          user_email: email,
          user_password: password,
        });

        if (response.status === 200) {
          const { user_id, user_first_name, user_email, user_phone_number } = response.data;
          setCookies(user_id, user_first_name, user_email, user_phone_number);
          setIsLoggedIn(true);
          setUserData({ user_id, user_first_name, user_email, user_phone_number });
          setLoginMessage('Logged in successfully');
        } else {
          setLoginMessage('Invalid email or password.');
        }
      } catch (error) {
        setLoginMessage('Invalid email or password.');
      }
    }

    // Clear form fields
    setEmail('');
    setPassword('');
  };

  const setCookies = (user_id, user_first_name, user_email, user_phone_number) => {
    const expirationTime = 2 / 1440; // 2 minutes in days
    Cookies.set('user_id', user_id);
    Cookies.set('user_first_name', user_first_name, { expires: expirationTime });
    Cookies.set('user_email', user_email, { expires: expirationTime });
    Cookies.set('user_phone_number', user_phone_number, { expires: expirationTime });
  };

  const handleGoogleLoginSuccess = async (response) => {
    const { credential } = response;
    console.log('Google Response:', response);

    try {
        const result = await axios.post('http://127.0.0.1:8000/loginapi/google-login/', {
            token: credential,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Backend Full Response:', result); // Log the entire response object
        console.log('Backend Data:', result.data); // Log the data part of the response

        // Extract data from the response and log it
        const { user_id, user_first_name, user_email, user_phone_number } = result.data || {};
        console.log('user_id:', user_id);
        console.log('user_first_name:', user_first_name);
        console.log('user_email:', user_email);
        // console.log('user_phone_number:', user_phone_number);

        if (user_id && user_first_name && user_email && user_phone_number) {
            // Set cookies if data is present
            setCookies(user_id, user_first_name, user_email, user_phone_number);
            setIsLoggedIn(true);
            setUserData({ user_id, user_first_name, user_email, user_phone_number });
            setLoginMessage('Logged in successfully with Google');
        } else if (result.status === 404) {
            setLoginMessage('Google account not registered. Please sign up.');
        } else {
            setLoginMessage('Failed to login with Google.');
        }
    } catch (error) {
        console.error('Error during Google login:', error);
        setLoginMessage('Failed to login with Google.');
    }
};



  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar /> {/* Add Navbar here */}

      <main className={styles.main} style={{ marginTop: '80px' }}> {/* Add margin top */}
        {!isLoggedIn ? (
          <div className={styles.card}>
            <h1 className={styles.title}>Login</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">
                  {loginWithOtp ? 'OTP' : 'Password'}
                  <input
                    type={loginWithOtp ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <label htmlFor="rememberMe">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className={styles.checkbox}
                  />
                  Remember Me
                </label>
                <a href="/SignIn/ForgotPassword" className={styles.forgotPassword}>Forgot Password?</a>
              </div>

              <button type="submit" className={styles.button}>Login</button>

              <button
                type="button"
                className={styles.button}
                onClick={() => setLoginWithOtp(!loginWithOtp)}
              >
                {loginWithOtp ? 'Login with Password' : 'Login with OTP'}
              </button>
              <label className={styles.or}>or</label>
              <div id="google-signin-button"></div>

              {loginMessage && (
                <p className={styles.loginMessage}>{loginMessage}</p>
              )}
            </form>
          </div>
        ) : (
          <div className={styles.card}>
            <h1 className={styles.title}>Welcome, {userData.user_first_name}</h1>
            <p>Your email: {userData.user_email}</p>
            <p>Your user ID: {userData.user_id}</p>
            {/* <p>Your Number: {userData.user_phone_number}</p> */}
            {/* Add next form here */}
            <form className={styles.form}>
              {/* Add your next form fields here */}
              <div className={styles.formGroup}>
                <label htmlFor="nextField">
                  Next Field
                  <input type="text" id="nextField" />
                </label>
              </div>
              <button type="submit" className={styles.button}>Submit Next Form</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
