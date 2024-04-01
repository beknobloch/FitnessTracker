import React, { useEffect, useState } from 'react';

const FitbitDailyData = ({ accessToken }) => {

    const [activity, setActivity] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect( () => {
        // Get today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
        const day = String(today.getDate()).padStart(2, '0');

        // Format the date as YYYY-MM-DD
        const formattedDate = `${year}-${month}-${day}`;

        // Set the default date
        setSelectedDate(formattedDate);

        if (accessToken) { getActivitySummary(accessToken, formattedDate) };
    }, [accessToken])

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

    const getActivitySummary = async (accessToken, date) => {
        const timeSeriesEndpoint = `https://api.fitbit.com/1/user/-/activities/date/${date}.json`;
        const timeSeriesHeaders = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        };

        setActivity(await APIRequest(timeSeriesEndpoint, timeSeriesHeaders));
    };

    /*  ------------------------------ Other Functions ------------------------------  */

    const handleDateChange = (event) => {
        const newDate = event.target.value;
        setSelectedDate(newDate);
        getActivitySummary(accessToken, newDate !== "" ? newDate : "03-29-24");
    };

    return (
        <div>
        <label for="datepicker">Select a date:</label>
            <input type="date" 
                id="datepicker" 
                name="datepicker" 
                value={selectedDate} 
                onChange={handleDateChange} ></input>
        <br></br>
        On {selectedDate ? selectedDate : "???"}, you walked {activity && activity.summary ? activity.summary.steps : "0"} steps...
        <br></br>
        engaged in light activity for {activity && activity.summary ? activity.summary.lightlyActiveMinutes : "0"} minutes...
        <br></br>
        and engaged in intense activity for {activity && activity.summary ? activity.summary.veryActiveMinutes : "0"} minutes.
        </div>
    )
};

export default FitbitDailyData;