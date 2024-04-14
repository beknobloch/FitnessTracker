import React, { useEffect, useState } from 'react';

const FitbitGoalData = ({ accessToken }) => {

    const [activity, setActivity] = useState('')
    const [displayGoals, setDisplayGoals] = useState(false)
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

    const getGoals = async (accessToken) => {
        const timeSeriesEndpoint = `https://api.fitbit.com/1/user/-/activities/goals/daily.json`;
        const timeSeriesHeaders = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        };
        const activityData = await APIRequest(timeSeriesEndpoint, timeSeriesHeaders)
        console.log(activityData)
        setActivity(activityData)
        setDisplayGoals(true)
        
    };

    /*  ------------------------------ Other Functions ------------------------------  */
    
    return (
        <div>
            <button onClick={() => getGoals(accessToken)}>get goals</button>
            {displayGoals && (
                <>
                    <pre>{JSON.stringify(activity, null, 2)}</pre>
                </>
            )}
        </div>
    )
};

export default FitbitGoalData;