import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../stylesheets/Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1>CloudGram</h1>
      <div className="nav-links">
        {user ? (
          <>
            <Link style={{margin: '1em'}} to="/">Feed</Link>
            <Link to="/upload">Upload</Link>
            <span style={{ margin: '0 15px', color: '#888' }}>|</span>
            <span style={{ fontWeight: 'bold' }}>@{user.username}</span>
            <button onClick={logout} style={{ marginLeft: '10px', padding: '5px 10px' }}>Logout</button>
          </>
        ) : (
          <Link to="/auth">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;