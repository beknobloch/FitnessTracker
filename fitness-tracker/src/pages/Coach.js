import React, { useState, useEffect } from "react";
import { auth } from '../config/firebase';
import FitbitDataComponent from '../components/FitbitDataComponent.js';

function Coach() {
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
                    <FitbitDataComponent redirectTo={'coach'}/>
                </div>
            ) : (
              <p>Not logged in but we know you're a health coach</p>
            )}
            
        </div>
    );
}

export default Coach;
