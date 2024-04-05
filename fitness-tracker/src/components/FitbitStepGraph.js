import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FitbitStepGraph = ({ accessToken }) => {

    const [metric, setMetric] = useState('steps');
    const [span, setSpan] = useState(7);
    const [intervalsBack, setintervalsBack] = useState(0);

    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(false);

    useEffect( () => {
        if (!chartLoading && accessToken !== undefined && accessToken !== '')    showGraph();
    }, [intervalsBack, metric, span, accessToken]);

    const handleMetricChange = (event) => {
        setMetric(event.target.value);
    }
    const handleSpanChange = (event) => {
        console.log(event.target.value);
        setSpan(event.target.value==='week' ? 7 : 30);
    }

    const getMetricName = (metric) => {
        return metric==='steps' ? "Step count" :
            metric==='calories' ? "Total calories" :
            metric==='restingHeartRate' ? "Resting heart rate (bpm)" :
            metric==='elevation' ? "Total daily elevation (ft)" :
            metric==='veryActiveMinutes' ? "Daily active minutes" :
            "???";
    }

    const showGraph = async () => {
        console.log("showGraph");
        setChartLoading(true);

        try {
            // Initialize an array to store the dates
            let dates = [];
            const today = new Date();

            // Iterate through the last seven days
            const weekAdjustment = span * intervalsBack;
            for (let i = weekAdjustment; i < weekAdjustment + span; i++) {
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
                    metric==='restingHeartRate' ? dataEntry = activitySummary.summary.restingHeartRate :
                    metric==='elevation' ? dataEntry = activitySummary.summary.elevation :
                    metric==='veryActiveMinutes' ? dataEntry = activitySummary.summary.veryActiveMinutes :
                    dataEntry = activitySummary.summary.steps;


                    stepData.unshift(dataEntry);
                } else {
                    console.error(`Activity summary for date ${date} is invalid or missing.`);
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
            <select onChange={handleMetricChange}>
                <option value='steps'>Steps</option>
                <option value='calories'>Calories</option>
                <option value='restingHeartRate'>Resting heart rate</option>
                <option value='veryActiveMinutes'>Very active minutes</option>
                <option value='elevation'>Elevation</option>
            </select>
            <select onChange={handleSpanChange}>
                <option value='week'>Week</option>
                <option value='month'>Month</option>
            </select>
            {chartLoading && <h3>Loading...</h3>}
            {chartData[0] && 
            <div>
                <button className={'button'} onClick={() => {
                    setintervalsBack(intervalsBack + 1);
                }}>&lt; Prev</button> <span>      </span>
                <button className={'button'} disabled={intervalsBack === 0} onClick={() => {
                    if (intervalsBack > 0)  {
                        setintervalsBack(intervalsBack - 1);
                    }
                }}>Next &gt;</button>
            </div>}
            {accessToken!==undefined && chartData[0] && <LineChart
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
                <YAxis label={{ value: getMetricName(metric), angle: -90, position: 'insideLeft', offset: -30, style: { textAnchor: 'middle' } }} />
                <Tooltip labelFormatter={(value) => [getMetricName(metric), value]}/>
                <Legend verticalAlign="top" align="right"/>  
                <Line type="monotone" dataKey="steps" stroke="#8884d8" activeDot={{ r: 8 }}/>
            </LineChart>}
        </div>
    )

};

export default FitbitStepGraph;