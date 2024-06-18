import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

const SalesChart = ({customers}) => {
    const [SalesData, setSalesData] = useState([
        { name: 'Jan', Sales: 0, },
        { name: 'Feb', Sales: 0, },
        { name: 'Mar', Sales: 0, },
        { name: 'Apr', Sales: 0, },
        { name: 'May', Sales: 0, },
        { name: 'Jun', Sales: 0, },
        { name: 'Jul', Sales: 0, },
        { name: 'Aug', Sales: 0, },
        { name: 'Sep', Sales: 0, },
        { name: 'Oct', Sales: 0, },
        { name: 'Nov', Sales: 0, },
        { name: 'Dec', Sales: 0, },
    ])

    const chartOptions = {
        chart: {
            id: "simple-bar",
            height: 350,
          },
          title: {
            text: 'Sales data',
            align: 'left', // Positions the title at the top center
            style: {
                fontSize: '17px',
                fontWeight: 'bold',
                color: '#263238'
            }
        },
          xaxis: {
            categories: 
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            ,
          },
          grid: {
            show: false // This will remove the grid lines
          },
          stroke: {
            curve: 'smooth'
          },
          dataLabels: {
            enabled: false,
            
          },
          markers: {
            size: 4, // Adjust the size of the circles
            strokeWidth: 0, // Set to 0 to remove the stroke around the circles
          },
        
    };
    
    const chartSeries = [
        {
            name: 'Sales data',
            data: SalesData.map((sale)=> sale.Sales),
            type: 'area',
        }
    ];

    useEffect(()=>{
                const groupedData = customers.reduce((acc, obj) => {
                    const monthYear = obj.created_at.slice(0, 7)
                    if(!acc[monthYear]){
                        acc[monthYear] = []
                    }
                    acc[monthYear].push(obj)
                    return acc;
                }, {})

                const sumPerGroup = Object.keys(groupedData).map((key) => ({
                    monthYear: new Date(key).toDateString().split(" ")[1],
                    sum: groupedData[key].reduce((total, obj) => total + Number(obj.total_price), 0),
                  }));

                sumPerGroup.map((sum) => {
                    const index = SalesData.findIndex((data)=>data.name === sum.monthYear)
                    setSalesData((prevData) => [
                        ...prevData.slice(0, index),
                        {...prevData[index], Sales : sum["sum"] },
                        ...prevData.slice(index + 1)
                    ])
                })

    },[customers])

  return (
    <div>
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="area"
      height="170" 
      width="100%"
    />
    </div>
  )
}

export default SalesChart