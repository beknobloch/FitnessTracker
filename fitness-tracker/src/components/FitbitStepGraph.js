import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FitbitStepGraph = ({ accessToken }) => {

    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(false);

    const showGraph = async () => {
        setChartLoading(true);

        try {
            // Initialize an array to store the dates
            let dates = [];
            const today = new Date();

            // Iterate through the last seven days
            for (let i = 0; i < 7; i++) {
                let date = new Date(today); // Create a new date object for each iteration
                date.setDate(today.getDate() - i);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                dates.push(formattedDate);
            }
    
            let stepData = []; // Create an array to store step data
    
            // Use for...of loop to ensure await inside loop waits for each iteration
            for (const date of dates) {
                const activitySummary = await getActivitySummary(accessToken, date);
                if (activitySummary && activitySummary.summary) {
                    stepData.unshift(activitySummary.summary.steps);
                } else {
                    console.error(`Activity summary for date ${date} is invalid or missing.`);
                }
            }
    
            let chartData = [];
            stepData.forEach((stepCount, i) => {
                chartData.push({
                    name: dates[i],
                    steps: stepCount
                });
            });
    
            setChartData(chartData);
            setChartLoading(false);
        } catch (error) {
            console.error('Error fetching activity data:', error);
        }
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
    }

    const getActivitySummary = async (accessToken, date) => {
        const timeSeriesEndpoint = `https://api.fitbit.com/1/user/-/activities/date/${date}.json`;
        const timeSeriesHeaders = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        };

        return await APIRequest(timeSeriesEndpoint, timeSeriesHeaders);
    };


    return (
        <div>
            {!chartLoading && !chartData[0] && <button id='showStepGraph' onClick={accessToken ? () => {showGraph()} : () => {}}>See this week's steps</button>}
            {chartLoading && <h3>Loading...</h3>}
            {chartData[0] && <LineChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="steps" stroke="#8884d8" activeDot={{ r: 8 }}/>
            </LineChart>}
        </div>
    )

};

export default FitbitStepGraph;