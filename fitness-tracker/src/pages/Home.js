import React, { useState, useEffect } from "react";
import { auth } from '../config/firebase';
import FitbitDataComponent from '../components/FitbitDataComponent.js';

function Home() {
    const [loggedIn, setLoggedIn] = useState(false);

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
                    <FitbitDataComponent />
                </div>
            ) : (
              <p>Not logged in</p>
            )}
            
        </div>
    );
}

export default Home;
