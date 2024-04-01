import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Import custom hook to get authentication status

function NavBar() {
    const { user } = useAuth(); // Get user authentication status
    const isCoach = user ? user.isCoach : false; // Check if user is a coach

    return (
        <nav className="navbar">
            <div className='navbarLinks'>
                {/* Conditionally render link based on user type */}
                {isCoach ? (
                    <Link to="/coach-home" className="link">Home</Link>
                ) : (
                    <Link to="/home" className="link">Home</Link>
                )}
            </div>
            {/* Other navbar components */}
        </nav>
    );
}

export default NavBar;
