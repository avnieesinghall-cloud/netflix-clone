import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Navbar({ search, setSearch, setShowLogin, user }) {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar">
      <h1 onClick={() => (window.location.href = "/")}>StreamFlix</h1>

      {setSearch && (
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      )}

      <button
        className="nav-watchlist"
        onClick={() => (window.location.href = "/watchlist")}
      >
        My List
      </button>

      {user ? (
        <div className="user-box">
          <div className="profile-avatar">
            {user.email?.charAt(0).toUpperCase()}
          </div>

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