import React, { useState } from 'react';

const FitbitGoalData = ({ accessToken }) => {

    const [goals, setGoals] = useState()
    const [displayGoals, setDisplayGoals] = useState(false)
    const [newGoals, setNewGoals] = useState()
    /*  ------------------------------ API Calls ------------------------------  */

    const APIRequest = async (endpoint, requestHeaders) => {
        const response = await fetch(endpoint, requestHeaders);

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Error fetching Fitbit data');
        }
    }

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
        if(newGoals !== goals){

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
            };
            // displays the updated goal
            await getGoals(accessToken) 
        }else{
            alert('No goals were changed')
        }
    };
    /*  ------------------------------ Other Functions ------------------------------  */
    
    return (
        <div>
            <button onClick={() => getGoals(accessToken)}>get goals</button>
            {displayGoals && (
                <>
                    {Object.entries(goals).map(([key, value]) => (
                        <div key={key}>
                            <label htmlFor={key} style={{ fontSize: "14px" }}>{key}:  </label>
                            <input 
                                placeholder={key}
                                type='number'
                                min="1"
                                value={newGoals[key]}
                                onChange={(e) => setNewGoals(prevState => ({
                                    ...prevState,
                                    [key] : e.target.value
                                }))}
                            />
                        </div>
                    ))}

                    <button onClick={() => sendGoals(accessToken)}>Send new goals</button>
                </>
            )}
        </div>
    )
};

export default FitbitGoalData;