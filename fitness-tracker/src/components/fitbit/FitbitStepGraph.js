import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FitbitStepGraph = ({ accessToken }) => {

    const [metric, setMetric] = useState('steps');

    const [span, setSpan] = useState(7);
    const [intervalsBack, setintervalsBack] = useState(0);

    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(false);

    const [cachedData, setCachedData] = useState({ });

    useEffect( () => {
        if (!chartLoading && accessToken !== undefined && accessToken !== '')    showGraph();
    }, [intervalsBack, metric, span, accessToken]);

    const handleMetricChange = (event) => {
        setMetric(event.target.value);
    }
    const handleSpanChange = (event) => {
        setSpan(event.target.value==='week' ? 7 :
                event.target.value==='month' ? 30 :
                365);
    }

    const getMetricName = (metric) => {
        return metric==='steps' ? "Step count" :
            metric==='calories' ? "Total calories" :
            metric==='restingHeartRate' ? "Resting heart rate (bpm)" :
            metric==='distance' ? "Distance travelled (miles)" :
            metric==='elevation' ? "Total daily elevation (ft)" :
            metric==='minutesVeryActive' ? "Daily active minutes" :
            "???";
    }

    const fetchDataAndUpdateCachedData = async(date) => {
        
        let tempData = cachedData;
        const activitySummary = await getActivitySummary(accessToken, metric, date);
        for (const valuePair of activitySummary[`activities-${metric}`]) {
            if (!tempData[metric])    tempData[metric] = {};
            tempData[metric][valuePair[`dateTime`]] = valuePair[`value`];
        }
        setCachedData(tempData);

    }

    const showGraph = async () => {
        setChartLoading(true);

        try {
            
            let dates = [];
            const today = new Date();

            // Iterate through the last seven days
            const weekAdjustment = span * intervalsBack;
            for (let i = weekAdjustment; i < weekAdjustment + span; i++) {
                let date = new Date(today);
                date.setDate(today.getDate() - i);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                dates.push(formattedDate);
            }
    
            let stepData = [];
    
            for (const date of dates) {
                
                // If cachedData does not have the right metric or the right date for that metric, request a year's worth of data.
                if (!(cachedData.hasOwnProperty(metric) && cachedData[metric].hasOwnProperty(date))) {
                    await fetchDataAndUpdateCachedData(date);
                }

                const dataEntry = cachedData[metric][date];
                stepData.unshift(dataEntry);      
            }
    
            let chartData = [];
            stepData.forEach((stepCount, i) => {
                chartData.push({
                    name: dates[dates.length - 1 - i],
                    steps: parseInt(stepCount)
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

    const getActivitySummary = async (accessToken, activity, date) => {
        const timeSeriesEndpoint = `https://api.fitbit.com/1/user/-/activities/${activity}/date/${date}/1y.json`;
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
                <option value='minutesVeryActive'>Very active minutes</option>
                <option value='distance'>Distance travelled</option>
                <option value='elevation'>Elevation</option>
            </select>
            <select onChange={handleSpanChange}>
                <option value='week'>Week</option>
                <option value='month'>Month</option>
                <option value='year'>Year</option>
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
            {accessToken!==undefined && chartData[0] &&
            <LineChart
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
                <Tooltip formatter={(value) => [value, getMetricName(metric)]}/>
                <Legend verticalAlign="top" align="right"/>  
                <Line type="monotone" dataKey="steps" stroke="#8884d8" activeDot={{ r: 8 }}/>
            </LineChart>}
        </div>
    )

};

export default FitbitStepGraph;