import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase'; // Import your Firebase authentication instance

function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user ? { uid: user.uid, isCoach: user.isCoach } : null);
        });

        return () => unsubscribe();
    }, []);

    return { user };
}

export default useAuth;
