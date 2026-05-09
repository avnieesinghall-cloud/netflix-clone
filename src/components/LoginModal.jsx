function LoginModal({ setShowLogin }) {
  return (
    <div className="login-overlay">
      <div className="login-box">
        <button className="close-btn" onClick={() => setShowLogin(false)}>
          ✕
        </button>

        <h2>Login to StreamFlix</h2>

        <input type="email" placeholder="Email address" />
        <input type="password" placeholder="Password" />

        <button className="login-submit">Login</button>

        <p>New to StreamFlix? Sign up now.</p>
      </div>
    </div>
  );
}

export default LoginModal;