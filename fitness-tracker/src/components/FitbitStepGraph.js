import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FitbitStepGraph = ({ accessToken, metric }) => {

    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(true);
    
    const [weeksBack, setWeeksBack] = useState(0);

    useEffect( () => {
        if (accessToken !== undefined && accessToken !== '') showGraph();
    }, [weeksBack, accessToken]);

    const showGraph = async () => {
        setChartLoading(true);

        try {
            // Initialize an array to store the dates
            let dates = [];
            const today = new Date();

            // Iterate through the last seven days
            const weekAdjustment = 7 * weeksBack;
            for (let i = weekAdjustment; i < weekAdjustment + 7; i++) {
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


                    // USE COMPONENT PARAMETER to add relevant metric to the graph data
                    let dataEntry;
                    metric==='steps' ? dataEntry = activitySummary.summary.steps :
                    metric==='calories' ? dataEntry = activitySummary.summary.caloriesOut :
                    metric==='resting heart rate' ? dataEntry = activitySummary.summary.restingHeartRate :
                    metric==='elevation' ? dataEntry = activitySummary.summary.elevation :
                    metric==='very active minutes' ? dataEntry = activitySummary.summary.veryActiveMinutes :
                    dataEntry = activitySummary.summary.steps;


                    stepData.unshift(dataEntry);
                } else {
                    console.log(`Activity summary for date ${date} is invalid or missing.`);
                }
            }
    
            let chartData = [];
            stepData.forEach((stepCount, i) => {
                chartData.push({
                    name: dates[dates.length - 1 - i],
                    steps: stepCount
                });
            });
    
            setChartData(chartData);
            setChartLoading(false);
        } catch (error) {
            console.log('Error fetching activity data:', error);
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
            {chartLoading && <h3>Loading...</h3>}
            {accessToken!==undefined && chartData[0] && 
            <div>
                <button className={'button'} onClick={() => {
                    setWeeksBack(weeksBack + 1);
                }}>&lt; Prev Week</button> <span>      </span>
                <button className={'button'} disabled={weeksBack === 0} onClick={() => {
                    if (weeksBack > 0)  {
                        setWeeksBack(weeksBack - 1);
                    }
                }}>Next Week &gt;</button>
            </div>}
            {chartData[0] && <LineChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 70,
                    bottom: 35
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Date', position: 'insideBottom', offset: -20}}/>
                <YAxis label={{ value: 'Step Count', angle: -90, position: 'insideLeft', offset: -30, style: { textAnchor: 'middle' } }} />
                <Tooltip />
                <Legend verticalAlign="top" align="right"/>  
                <Line type="monotone" dataKey="steps" stroke="#8884d8" activeDot={{ r: 8 }}/>
            </LineChart>}
        </div>
    )

};

export default FitbitStepGraph;