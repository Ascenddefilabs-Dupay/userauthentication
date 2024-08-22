"use client";
import { useState } from 'react';
import Head from 'next/head';
import styles from './ForgotPassword.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const [showRetypeNewPassword, setShowRetypeNewPassword] = useState(false); // State for retype new password visibility
  const router = useRouter();

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/loginapi/generate-otp/', { user_email: email });
      if (response.status === 200) {
        setShowOtpField(true);
        alert('OTP sent to your email');
      }
    } catch (error) {
      alert('Error sending OTP');
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== retypeNewPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/loginapi/reset-password/', {
        user_email: email,
        otp,
        new_password: newPassword,
      });
      if (response.status === 200) {
        alert('Password reset successfully');
        router.push('/SignIn');
      } else {
        alert('Error resetting password');
      }
    } catch (error) {
      alert('Error resetting password');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Forgot Password</title>
        <meta name="description" content="Forgot Password page" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
          {!showOtpField ? (
            <>
              <h1 className={styles.title}>Forgot Password</h1>
              <form className={styles.form} onSubmit={handleEmailSubmit}>
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
                <button type="submit" className={styles.button}>Send OTP</button>
              </form>
            </>
          ) : (
            <>
              <h1 className={styles.title}>Reset Password</h1>
              <form className={styles.form} onSubmit={handlePasswordSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="otp">
                    Enter OTP
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">
                    New Password
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className={styles.passwordInput}
                      />
                      <i
                        className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.eyeIcon}`}
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      />
                    </div>
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="retypeNewPassword">
                    Retype New Password
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showRetypeNewPassword ? "text" : "password"}
                        id="retypeNewPassword"
                        value={retypeNewPassword}
                        onChange={(e) => setRetypeNewPassword(e.target.value)}
                        required
                        className={styles.passwordInput}
                      />
                      <i
                        className={`fas ${showRetypeNewPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.eyeIcon}`}
                        onClick={() => setShowRetypeNewPassword((prev) => !prev)}
                      />
                    </div>
                  </label>
                </div>
                <button type="submit" className={styles.button}>Reset Password</button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
