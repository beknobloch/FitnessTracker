import React, { useState, useEffect } from 'react';
import { auth, db } from "../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const FitbitGoalData = ({ accessToken }) => {

    // stores the original goals from the most recent fetch
    const [goals, setGoals] = useState({});
    const [displayGoals, setDisplayGoals] = useState(false);

    // initially this will match the original goals but when the user changes a goal's value, this is the object that's updated
    const [newGoals, setNewGoals] = useState();

    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch users with matching CoachId
                const userID = auth?.currentUser?.uid;
                // Logging user ID to display the coaches ID (For debugging)
                console.log("Current user UID:", userID);
                const q = query(collection(db, "users"), where("coachId", "==", userID));
                const querySnapshot = await getDocs(q);
                const usersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersData);
                console.log("Fetched users:", usersData); // Log the fetched users
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
    };

    /*  ------------------------------ API Calls ------------------------------  */

    const APIRequest = async (endpoint, requestHeaders) => {
        const response = await fetch(endpoint, requestHeaders);

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Error fetching Fitbit data');
        }
    };

    // pulls list of goals and their values
    const getGoals = async (accessToken) => {
        const endpoint = `https://api.fitbit.com/1/user/-/activities/goals/daily.json`;
        const headers = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        };
        const goalData = await APIRequest(endpoint, headers)
        console.log(goalData)
        setGoals(goalData['goals'])
        setNewGoals(goalData['goals'])
        setDisplayGoals(true)
        
    };

    // pushes new goal values, only pushes changed goals
    const sendGoals = async (accessToken) => {
        // checks if any goal has been changed
        if (newGoals !== goals) {

            // iterates through each type of goal in newGoals (entry = a type of goal)
            for (const [key, value] of Object.entries(newGoals)){

                // checks if a goal has been changed
                if(goals[key] !== value){
                    const timeSeriesEndpoint = `https://api.fitbit.com/1/user/-/activities/goals/daily.json?type=${key}&value=${value}`;
                    const timeSeriesHeaders = {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    await APIRequest(timeSeriesEndpoint, timeSeriesHeaders)
                }
            }
            // displays the updated goal
            await getGoals(accessToken) 
        }else{
            alert('No goals were changed')
        }
    };

    return (
        <div>
            <button className={'button'} onClick={() => getGoals(accessToken)}>Get Goals</button>
            {displayGoals && (
                <>
                    {Object.entries(goals).map(([key]) => (
                        <div key={key}>
                            <label htmlFor={key} style={{fontSize: "14px"}}>{key}: </label>
                            <input
                                placeholder={key}
                                type='number'
                                min="1"
                                value={newGoals[key]}
                                onChange={(e) => setNewGoals(prevState => ({
                                    ...prevState,
                                    [key]: e.target.value
                                }))}
                            />
                        </div>
                    ))}

                    <label htmlFor="userSelect" style={{fontSize: "14px"}}>Select a user: </label>
                    <select
                        id="userSelect"
                        onChange={(e) => handleUserSelect(e.target.value)}
                        value={selectedUserId}
                    >
                        <option value="">Select a user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.uid}>{user.name}</option>
                        ))}
                    </select>

                    <br/>

                    <button className={'button'} onClick={() => sendGoals(accessToken)}>Send new goals</button>
                </>
            )}
        </div>
    );
};

export default FitbitGoalData;
