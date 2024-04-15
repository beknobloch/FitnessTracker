import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { useNavigate } from "react-router-dom";
import { auth } from '../config/firebase';

function SelectCoach({ isCoach }) {
    const [coaches, setCoaches] = useState([]);
    const [selectedCoachId, setSelectedCoachId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                // Fetch only health coaches
                const q = query(collection(db, "users"), where("isCoach", "==", true));
                const querySnapshot = await getDocs(q);
                const coachesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCoaches(coachesData);
            } catch (error) {
                console.error("Error fetching coaches:", error);
            }
        };
        fetchCoaches();
    }, [isCoach]);

    const handleCoachSelection = (coachId) => {
        setSelectedCoachId(coachId);
    };

    const handleSubmit = async () => {
        try {
            const user = auth?.currentUser?.uid;
            console.log("Current user UID:", user); // Log the UID

            // Get the user document by UID
            const usersCollectionRef = collection(db, "users");
            const querySnapshot = await getDocs(query(usersCollectionRef, where("uid", "==", user)));

            if (!querySnapshot.empty) {
                // There should be only one document with the given UID
                const userDocRef = querySnapshot.docs[0].ref;
                const userSnapshot = await getDoc(userDocRef);

                if (userSnapshot.exists()) {
                    await updateDoc(userDocRef, { coachId: selectedCoachId });
                    navigate('/home');
                } else {
                    // Document does not exist, handle this case (e.g., create a new document)
                    console.error("User document does not exist");
                }
            } else {
                // Document with given UID not found
                console.error("User document not found");
            }
        } catch (error) {
            console.error("Error updating user document:", error);
        }
    };

    return (
        <div>
            <label htmlFor="coach" style={{ fontSize: "14px" }}>Select your health coach: </label>
            <select
                id="coach"
                onChange={(e) => handleCoachSelection(e.target.value)}
            >
                <option value="">Select a coach</option>
                {coaches.map(coach => (
                    <option key={coach.id} value={coach.id}>{coach.name}</option>
                ))}
            </select>
            <button className={'button'} onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default SelectCoach;