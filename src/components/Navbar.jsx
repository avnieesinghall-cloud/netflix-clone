import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Navbar({ search, setSearch, setShowLogin, user }) {
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="navbar">
      <h1>StreamFlix</h1>

      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {user ? (
        <div className="user-box">
          <span>{user.email}</span>
          <button className="login-btn" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <button className="login-btn" onClick={() => setShowLogin(true)}>
          Login
        </button>
      )}
    </nav>
  );
}

export default Navbar;