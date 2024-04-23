import React, { useState, useEffect } from 'react';
import { auth, db } from "../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Query from "../Query";

const FitbitGoalData = ({ accessToken, userType }) => {

    // stores the original goals from the most recent fetch
    const [goals, setGoals] = useState({});
    const [displayGoals, setDisplayGoals] = useState(false);

    // initially this will match the original goals but when the user changes a goal's value, this is the object that's updated
    const [newGoals, setNewGoals] = useState();
    const [showPendingGoals, setShowPendingGoals] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [pendingGoals, setPendingGoals] = useState({});

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

    // goals if trainee
    useEffect(() => {
        if (accessToken && userType !== 'coach') {
            getGoals(accessToken)
        }
    }, [accessToken])

    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
    };

    const isNewGoal = async () => {
        try {
            const currentUser = auth?.currentUser;
            const uid = currentUser.uid;

            const q = query(collection(db, "users"), where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            const usersData = querySnapshot.docs.map(doc => {
                const userData = doc.data();
                const id = doc.id;
                const goals = userData.goals || {}; // Retrieve the goals map, default to empty object if undefined
                const pendingGoals = userData.pendingGoals || {}; // Retrieve the pendingGoals map, default to empty object if undefined
                return {id, ...userData, goals, pendingGoals}; // Include goals and pendingGoals in the returned object
            });

            if (usersData.length === 0) {
                console.error('User data not found');
                return false;
            }

            const user = usersData[0]; // Assuming there is only one user document matching the query
            return Object.entries(user.pendingGoals);
        } catch (error) {
            console.error("Error comparing goals:", error);
            return false;
        }
    };

    const fetchPendingGoals = async () => {
        try {
            const currentUser = auth?.currentUser;
            const uid = currentUser.uid;

            const q = query(collection(db, "users"), where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            const userData = querySnapshot.docs[0]?.data() || {};
            const pendingGoalsData = userData.pendingGoals || {}; // Ensure pendingGoalsData is an object
            setPendingGoals(pendingGoalsData);
        } catch (error) {
            console.error("Error fetching pending goals:", error);
            setPendingGoals({}); // Set pendingGoals to an empty object in case of error
        }
    };

    useEffect(() => {
        fetchPendingGoals();
    }, []);


    const handleShowPendingGoals = () => {
        setShowPendingGoals(true);
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

        // uploads goals to firebase if not a coach
        if (userType !== 'coach') {
            await Query.pushData(auth?.currentUser?.uid, 'goals', goalData['goals'])
        }
    };

    // pushes new goal values, only pushes changed goals
    const sendGoals = async (accessToken) => {
        // checks if any goal has been changed
        if (newGoals !== goals) {

            // iterates through each type of goal in newGoals (entry = a type of goal)
            for (const [key, value] of Object.entries(newGoals)) {

                // checks if a goal has been changed
                if (goals[key] !== value) {
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
        } else {
            alert('No goals were changed')
        }
    };

    return (
        <>
            {userType === 'coach' ? (
                <div>
                    <button className={'button'} onClick={() => getGoals(accessToken)}>Get Goals</button>
                    {displayGoals && (
                        <>
                            {/* Your existing code for displaying and updating goals */}
                        </>
                    )}
                </div>
            ) : (
                <div>
                    <h3>Here's your activity goals:</h3>
                    {goals && (
                        <>
                            {Object.entries(goals).map(([key]) => (
                                <p key={key}>
                                    {key.charAt(0).toUpperCase() + key.split(/(?=[A-Z])/).join(' ').substring(1)}: {goals[key]}
                                </p>
                            ))}
                            {/* Conditionally render the "Show Pending Goals" button if isNewGoals returns true and showPendingGoals is false */}
                            {isNewGoal() && showPendingGoals === false && (
                                <button className={'button'} onClick={() => handleShowPendingGoals()}>Show Pending
                                    Goals</button>
                            )}
                            {/* Conditionally render the "Accept" and "Reject" buttons if showPendingGoals is true */}
                            {showPendingGoals === true && (
                                <>
                                    {/* Render pending goals if they exist */}
                                    {(
                                        <div>
                                            {/* Render pending goals if they exist */}
                                            {Object.keys(pendingGoals).length > 0 && (
                                                <div>
                                                    <h4>Pending Goals:</h4>
                                                    {Object.entries(pendingGoals).map(([key, value]) => (
                                                        <p key={key}>
                                                            {key.charAt(0).toUpperCase() + key.split(/(?=[A-Z])/).join(' ').substring(1)}: {value}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Your accept and reject buttons */}
                                    <button className={'button'}>Reject</button>
                                    <button className={'button'}>Accept</button>
                                </>

                            )}
                        </>
                    )}
                </div>
            )}
            <br/>
        </>
    );

};

export default FitbitGoalData;
