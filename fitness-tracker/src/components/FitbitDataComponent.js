import React, { useEffect, useState } from 'react';


const FitbitDataComponent = () => {
    const [accessToken, setAccessToken] = useState('');

    const [profile, setProfile] = useState('');
    const [activity, setActivity] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    /************ Change for your app *************/
    const clientId = '23RRWK';
    const clientSecret = 'd7830394ff0e361521dba4551e48b594';
    const redirectUri = 'http://localhost:3000/home'; // the redirectURL in FitBit app

    /*  ------------------------------ Authorization ------------------------------  */

    useEffect(() => {
        // Check if the authorization code is present in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');

        if (authorizationCode) {
            // Authorization code is present, handle it
            handleAuthorizationCode(authorizationCode);
        } else {
            // Authorization code is not present, initiate the authentication flow
            initiateAuthentication();
        }


        // Get today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
        const day = String(today.getDate()).padStart(2, '0');

        // Format the date as YYYY-MM-DD
        const formattedDate = `${year}-${month}-${day}`;

        // Set the default date
        setSelectedDate(formattedDate);
    }, []);

    const initiateAuthentication = () => {
        const scope = 'activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight'; /************* Add other scopes as needed *************/
        // Construct the Fitbit authorization URL
        const authorizationEndpoint = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

        // Redirect the user to the Fitbit authorization page
        window.location.href = authorizationEndpoint;
    };

    const handleAuthorizationCode = async (code) => {
        const tokenEndpoint = 'https://api.fitbit.com/oauth2/token';
        const body = new URLSearchParams({
            code: code,
            grant_type: 'authorization_code',
            client_id: clientId,
            redirect_uri: redirectUri,
        });

        try {
            const response = await fetch(tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`, // Base64 encoded client_id:client_secret
                },
                body: body.toString(),
            });

            if (response.ok) {
                const data = await response.json();
                const accessTokenLocal = data.access_token;

                setAccessToken(accessTokenLocal);

                // Now you can use the access token to make requests to the Fitbit API
                functionsRan(accessTokenLocal);
            }
            else {
                console.error('Error exchanging authorization code for access token');
            }
        } catch (error) {
            console.error('Error during token exchange:', error);
        }
    };

    /*  ------------------------------ API Calls ------------------------------  */

    // functions called after the authorization is complete
    const functionsRan = async (accessToken) => {
        getProfile(accessToken);
        getActivitySummary(accessToken, '2024-03-29'); // Adjust the date range as needed
    }

    const APIRequest = async (endpoint, requestHeaders) => {
        const response = await fetch(endpoint, requestHeaders);

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        } else {
            console.error('Error fetching Fitbit data');
        }
    }

    const getProfile = async (accessToken) => {
        const profileEndpoint = 'https://api.fitbit.com/1/user/-/profile.json';
        const profileHeaders = { 
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        };

        setProfile(await APIRequest(profileEndpoint, profileHeaders));

    };

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
        <h2>Hi {profile !== "" ? profile.user.fullName : "World"}!
        <br></br>
        <label for="datepicker">Select a date:</label>
            <input type="date" 
                id="datepicker" 
                name="datepicker" 
                value={selectedDate} 
                onChange={handleDateChange} ></input>
        <br></br>
        Your daily steps on {selectedDate ? selectedDate : "???"} is {activity && activity.summary ? activity.summary.steps : "0"} steps.
        <br></br>
        You engaged in light activity for {activity !== "" ? activity.summary.lightlyActiveMinutes : "0"} minutes.
        <br></br>
        You engaged in intense activity for {activity !== "" ? activity.summary.veryActiveMinutes : "0"} minutes.
        </h2>
        </div>
    )
};

export default FitbitDataComponent;