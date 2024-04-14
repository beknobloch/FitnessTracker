import { Link } from 'react-router-dom';
import AuthStatus from './AuthStatus';

function NavBar() {
    
  return (
    <nav className="navbar">
        <div className='navbarLinks'>
          <Link to="/start" className="button-link">Start</Link>
          <Link to="/home" className="button-link">Home</Link>
        </div>
        <AuthStatus displayLogout={true}/>
    </nav>
  );
}

export default NavBar;