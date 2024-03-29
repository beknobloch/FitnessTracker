import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth } from '../config/firebase';
import SignOut from '../components/SignOut';

function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate(); // Use useNavigate hook for navigation

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setLoggedIn(!!user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <p>Home screen!</p>
            <button onClick={() => navigate('/start')}>Go back to starting page</button>
            {loggedIn ? (
              <p>Logged in, hello {auth.currentUser?.email}</p>
            ) : (
              <p>Not logged in</p>
            )}
            <SignOut loggedIn={loggedIn} />
        </div>
    );
}

export default Home;
