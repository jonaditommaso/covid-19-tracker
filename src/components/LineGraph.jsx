import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import options from './graphOptions';
import '../styles/lineGraph.css';

const LineGraph = ({typeData='cases'}) => {

    const [data, setData] = useState({})
   
    useEffect(() => {
        const getHistoricalData = async ()=> {
            const {data} = await axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=120");
            const chartData = buildChartData(data, typeData);
            setData(chartData);
        }
        
        getHistoricalData();
        
    }, [typeData])

    const buildChartData = (data, typeData="cases") => {
        const chartData = [];
        let yesterdayTotal = 0;

        const dates = Object.keys(data[typeData])
        //data.cases is an array [{date: totalCasesThatToday}]
        dates.forEach(date => {
            const todayTotal = data[typeData][date]
                
            //Avoid the first day because they loaded +25 million cases in one day
            if (yesterdayTotal !==0) {
                const newDataPoint = {
                    x: date, 
                    y: todayTotal - yesterdayTotal
                }
                chartData.push(newDataPoint)
            }
            yesterdayTotal = todayTotal
        })
        return chartData;
    }

    return ( 
        <div className="lineGraph">   
            {data?.length > 0 && (
                <Line 
                    options={options}
                    data={{
                        datasets: [{
                            backgroundColor: 'rgba(204, 16, 52, 0.5)',
                            borderColor: "#CC1034",
                            data: data
                        }]
                    }}          
                />
            )}
            
        </div>
    );
}
 
export default LineGraph;