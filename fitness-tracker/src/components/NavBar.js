import { Link } from 'react-router-dom';
import AuthStatus from './AuthStatus';

function NavBar() {
    
  return (
    <nav className="navbar">
        <div className='navbarLinks'>
          <Link to="/home" className="link">Home</Link> 
        </div>
        <AuthStatus />
    </nav>
  );
}

export default NavBar;