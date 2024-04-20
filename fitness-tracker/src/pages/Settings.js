import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../config/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import SignOut from '../components/SignOut'; 

function Settings() {
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Ensure there is a current user logged in
        if (auth.currentUser) {
            const usersCollectionRef = collection(db, "users");
            const q = query(usersCollectionRef, where("uid", "==", auth.currentUser.uid)); // Query to find user document by uid

            const fetchData = async () => {
                try {
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        // Assuming each UID only corresponds to one document
                        const userData = querySnapshot.docs[0].data();
                        setUserDetails(userData); // Set the fetched data to state
                        console.log("Fetched user data:", userData);
                    } else {
                        console.log("No such document! Check Firestore for correct user UID.");
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            };
            fetchData();
        } else {
            navigate('/login');  // Redirect to login if not logged in
        }

    }, [navigate]);

    return (
        <div>
            {userDetails ? (
                <div>
                    <h1>Settings</h1>
                    <p>Email: {auth.currentUser.email}</p>  
                    <p>Name: {userDetails.name}</p>
                    <p>Birthday: {userDetails.birthday}</p>
                    <p>Height: {userDetails.height ? `${userDetails.height} inches` : 'Not specified'}</p>
                    <p>Weight: {userDetails.weight ? `${userDetails.weight} lbs` : 'Not specified'}</p>
                    <SignOut loggedIn={!!auth.currentUser} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Settings;
