import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

function LoginModal({ setShowLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
      }

      setShowLogin(false);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-overlay">
      <form className="login-box" onSubmit={handleAuth}>
        <button
          type="button"
          className="close-btn"
          onClick={() => setShowLogin(false)}
        >
          ✕
        </button>

        <h2>{isSignup ? "Create Account" : "Login to StreamFlix"}</h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="login-submit" type="submit">
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p onClick={() => setIsSignup(!isSignup)} className="switch-auth">
          {isSignup
            ? "Already have an account? Login"
            : "New to StreamFlix? Sign up now"}
        </p>
      </form>
    </div>
  );
}

export default LoginModal;