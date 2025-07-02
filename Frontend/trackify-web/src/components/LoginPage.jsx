import React, { useState } from 'react';
import { Eye, EyeOff, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    userName: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/TrackifyUsers/login', credentials);

      const userData = response.data;
      console.log('Login successful:', userData);

      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Login successful!');
      
      // Trigger App.js login handler
      if (onLogin) {
        onLogin(userData);
      }
    } catch (error) {
      const errorMsg = error.response?.data || 'Login failed';
      toast.error(`Login failed: ${errorMsg}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background decorative elements */}
      <div style={styles.backgroundDecorations}>
        <div style={styles.bgCircle1}></div>
        <div style={styles.bgCircle2}></div>
        <div style={styles.bgCircle3}></div>
      </div>

      {/* Main login container */}
      <div style={styles.mainCard}>
        <div style={styles.loginCard}>         
          <div style={styles.header}>
            <div style={styles.logoContainer}>
              <div style={styles.logoBackground}></div>
              <div style={styles.logo}>
                <i className="bi bi-diagram-3-fill" style={styles.logoIcon}></i>
              </div>
            </div>
            
            <h1 style={styles.title}>TRACKIFY</h1>
            <p style={styles.subtitle}>Asset Management System</p>
            <div style={styles.divider}></div>
          </div>

          {/* Login Form */}
          <div style={styles.form}>
            {/* userName Field */}
            <div style={styles.fieldContainer}>
              <label style={styles.label}>User Name</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  name="userName"
                  value={credentials.userName}
                  onChange={handleChange}
                  placeholder="Enter your user name"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={styles.fieldContainer}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={styles.passwordInput}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={styles.optionsRow}>
              <label style={styles.checkboxLabel}>
                <div style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={styles.hiddenCheckbox}
                  />
                  <div style={{
                    ...styles.customCheckbox,
                    backgroundColor: rememberMe ? '#3b82f6' : 'transparent',
                    borderColor: rememberMe ? '#3b82f6' : '#d1d5db'
                  }}>
                    {rememberMe && <CheckCircle size={12} color="white" />}
                  </div>
                </div>
                <span style={styles.checkboxText}>Remember me</span>
              </label>
              
              <a href="#forgot-password" style={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                ...styles.loginButton,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              <div style={styles.buttonContent}>
                {isLoading ? (
                  <>
                    <div style={styles.spinner}></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </div>
            </button>

            {/* Sign Up Link */}
            <div style={styles.signupSection}>
              <p style={styles.signupText}>
                Don't have an account?{' '}
                <a href="#signup" style={styles.signupLink}>
                  Request access
                </a>
              </p>
            </div>
          </div>

          {/* Security badge */}
          <div style={styles.securityBadge}>
            <Shield size={16} color="#6b7280" />
            <span style={styles.securityText}>Your data is protected with enterprise-grade security</span>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div style={styles.decorativeElement1}></div>
        <div style={styles.decorativeElement2}></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e8eaf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundDecorations: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  bgCircle1: {
    position: 'absolute',
    top: '-160px',
    right: '-160px',
    width: '320px',
    height: '320px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(67, 56, 202, 0.15))',
    borderRadius: '50%',
    filter: 'blur(60px)'
  },
  bgCircle2: {
    position: 'absolute',
    bottom: '-160px',
    left: '-160px',
    width: '320px',
    height: '320px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))',
    borderRadius: '50%',
    filter: 'blur(60px)'
  },
  bgCircle3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '384px',
    height: '384px',
    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))',
    borderRadius: '50%',
    filter: 'blur(60px)'
  },
  mainCard: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '448px'
  },
  loginCard: {
    backdropFilter: 'blur(16px)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    padding: '32px',
    position: 'relative'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logoContainer: {
    position: 'relative',
    margin: '0 auto 24px',
    width: '80px',
    height: '80px'
  },
  logoBackground: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #2563eb, #4338ca)',
    borderRadius: '16px',
    transform: 'rotate(3deg)',
    opacity: 0.8
  },
  logo: {
    position: 'relative',
    background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
    borderRadius: '16px',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  logoIcon: {
     fontSize: '40px',
     color: 'white'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #1f2937, #374151)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    letterSpacing: '0.5px'
  },
  subtitle: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: '16px'
  },
  divider: {
    width: '48px',
    height: '4px',
    background: 'linear-gradient(90deg, #3b82f6, #4f46e5)',
    borderRadius: '2px',
    margin: '16px auto 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    display: 'block'
  },
  inputWrapper: {
    position: 'relative'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    outline: 'none',
    transition: 'all 0.2s',
    fontSize: '16px',
    color: '#1f2937',
    boxSizing: 'border-box'
  },
  passwordContainer: {
    position: 'relative'
  },
  passwordInput: {
    width: '100%',
    padding: '14px 48px 14px 16px',
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    outline: 'none',
    transition: 'all 0.2s',
    fontSize: '16px',
    color: '#1f2937',
    boxSizing: 'border-box'
  },
  passwordToggle: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.2s'
  },
  optionsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '12px'
  },
  checkboxContainer: {
    position: 'relative'
  },
  hiddenCheckbox: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none'
  },
  customCheckbox: {
    width: '20px',
    height: '20px',
    borderRadius: '8px',
    border: '2px solid',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxText: {
    color: '#6b7280',
    transition: 'color 0.2s'
  },
  forgotLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s'
  },
  loginButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
    color: 'white',
    fontWeight: '600',
    padding: '16px 24px',
    borderRadius: '16px',
    border: 'none',
    transition: 'all 0.2s',
    transform: 'scale(1)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    overflow: 'hidden'
  },
  buttonContent: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  signupSection: {
    textAlign: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6'
  },
  signupText: {
    color: '#6b7280',
    margin: 0
  },
  signupLink: {
    color: '#3b82f6',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'color 0.2s'
  },
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '24px',
    gap: '8px'
  },
  securityText: {
    fontSize: '12px',
    color: '#6b7280'
  },
  decorativeElement1: {
    position: 'absolute',
    top: '-16px',
    left: '-16px',
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #60a5fa, #4f46e5)',
    borderRadius: '50%',
    opacity: 0.2,
    animation: 'pulse 2s infinite'
  },
  decorativeElement2: {
    position: 'absolute',
    bottom: '-16px',
    right: '-16px',
    width: '24px',
    height: '24px',
    background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    borderRadius: '50%',
    opacity: 0.2,
    animation: 'pulse 2s infinite 1s'
  }
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.4; }
  }
`;
document.head.appendChild(styleSheet);

export default LoginPage;