import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth } from '../config/firebase';
import FitbitDataComponent from '../components/FitbitDataComponent.js';

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
            {loggedIn ? (
                <div>
                    <p>Logged in, hello {auth.currentUser?.email}</p>
                    <FitbitDataComponent />
                </div>
            ) : (
              <p>Not logged in</p>
            )}
            
        </div>
    );
}

export default Home;
