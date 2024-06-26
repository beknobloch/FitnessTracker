import React, { useState, useEffect } from "react";
import { auth } from '../config/firebase';
import Query from "../components/Query.js";

function Coach() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [goals, setGoals] = useState(0)
    const [selectedUserName, setSelectedUserName] = useState("")
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setLoggedIn(!!user);
        });
        
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setUsers(await Query.getMultipleValues(auth?.currentUser?.uid, 'coachId'))
    };

    const handleUserSelect = async (userId) => {
        if(userId === ''){
            setSelectedUserId('')
            setSelectedUserName('')
            setGoals('')
        }else{
            setSelectedUserId(userId);
            setSelectedUserName(await Query.getValue(userId, 'name'))

            let tempGoals = await Query.getValue(userId, 'goals')

            if(tempGoals){
                setGoals(tempGoals)
            }else{
                setGoals('No goals, tell your trainee to sign in!')
            }


        }
    };

    // uploading the trainee's new goals to firebase as pendingGoals
    const handleSubmit = async () => {
        try{
            await Query.pushData(selectedUserId, 'pendingGoals', goals)
            alert('Successfully pushed goals')
        }catch(e){
            alert('Unable to push goals')
            console.log(e)
        }
    }
    return (
        <div>
            {loggedIn ? (
                <div>
                    {Array.isArray(users) ? (
                        <div>
                            <label htmlFor="userSelect" style={{fontSize: "14px"}}>Select a user: </label>
                            <select
                                id="userSelect"
                                onChange={(e) => handleUserSelect(e.target.value)}
                                value={selectedUserId}
                            >
                                <option value="">(none)</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.uid}>{user.name}</option>
                                ))}
                            </select>
                            
                            {typeof goals === 'object' && (
                                <>
                                <h3>Here's {selectedUserName.charAt(0).toUpperCase() + selectedUserName.substring(1)}'s activity goals:</h3>
                                {Object.entries(goals).map(([key]) => (
                                <div key={key}>
                                    <label htmlFor={key} style={{fontSize: "14px"}}>{key.charAt(0).toUpperCase() + key.split(/(?=[A-Z])/).join(' ').substring(1)}: </label>
                                    <input
                                        placeholder={key}
                                        type='number'
                                        min="1"
                                        value={goals[key]}
                                        onChange={(e) => setGoals(prevState => ({
                                            ...prevState,
                                            [key]: parseInt(e.target.value)
                                        }))}
                                    />
                                </div>
                                ))}
                                <button className={'button'} onClick={() => handleSubmit()}>Send new goals</button>
                                </>
                            )}
                            {typeof goals === 'string' && (
                                <h3>{goals}</h3>
                            )}
                        </div>
                    ):(
                        <p>loading</p>
                    )}
                    
                </div>
            ) : (
              <p>Not logged in but we know you're a health coach</p>
            )}
            
        </div>
    );
}

export default Coach;
