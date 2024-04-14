import React, { useEffect, useState } from 'react';
import FitbitDailyData from './FitbitDailyData';
import FitbitStepGraph from './FitbitStepGraph';
import config from '../../config/config';
import FitbitGoalData from './FitbitGoalData';
import { useNavigate } from 'react-router-dom';

const FitbitDataComponent = ({ redirectTo }) => {
    const [accessToken, setAccessToken] = useState('');
    let navigate = useNavigate(); 
    const [profile, setProfile] = useState('');

    /************ Change for your app *************/
    const clientId = config.client_id;
    const clientSecret = config.client_secret;
    const redirectUri = `http://localhost:3000/${redirectTo}`; // the redirectURL in FitBit app

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
                
                // temporarily stores accessToken
                sessionStorage.setItem("token", accessTokenLocal);

                // Now you can use the access token to make requests to the Fitbit API
                functionsRan(accessTokenLocal);
            }
            else {
                if(accessToken){
                    console.error('Error exchanging authorization code for access token');
                }else{
                    navigate(`/${redirectTo}`)
                }
                
            }
        } catch (error) {
            console.error('Error during token exchange:', error);
        }
    };

    /*  ------------------------------ API Calls ------------------------------  */

    // functions called after the authorization is complete
    const functionsRan = async (accessToken) => {
        getProfile(accessToken);
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

    const APIRequest = async (endpoint, requestHeaders) => {
        const response = await fetch(endpoint, requestHeaders);

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Error fetching Fitbit data');
        }
    }


    return (
        <>
        {redirectTo === 'home' ? (
            <div className={"container"}>
                <div className="left-panel">
                   {/* Content for the left panel */}
                   <h2>Hi {profile && profile.user ? profile.user.fullName : "World"}</h2>
                   <FitbitDailyData accessToken={accessToken}/>
                </div>
                <div className="right-panel">
                {/* Content for the right panel */}
                   <hr></hr>
                   <FitbitStepGraph accessToken={accessToken}/>
                </div>
            </div>
        ):(
            <div>
                <p>Coach</p>
                <FitbitGoalData accessToken={accessToken}/>
            </div>
        )}
 
        </>
    )
};

export default FitbitDataComponent;