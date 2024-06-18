import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

const CustomerChart = ({customers}) => {

    const [customersData, setCustomersData] = useState([
        { name: 'Jan', Customers: 0, },
        { name: 'Feb', Customers: 0, },
        { name: 'Mar', Customers: 0, },
        { name: 'Apr', Customers: 0, },
        { name: 'May', Customers: 0, },
        { name: 'Jun', Customers: 0, },
        { name: 'Jul', Customers: 0, },
        { name: 'Aug', Customers: 0, },
        { name: 'Sep', Customers: 0, },
        { name: 'Oct', Customers: 0, },
        { name: 'Nov', Customers: 0, },
        { name: 'Dec', Customers: 0, },
    ])

    const chartOptions = {
        chart: {
        id: 'basic-bar',
        height: 350,
         type: 'bar',
         toolbar :{
            show : true,
            tools: {
                download: true,
                selection: true,
                zoom: false,
                zoomin: true,
                zoomout: true,
                pan: false,
                reset: false ,
                customIcons: []
              },
         },
         margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
        title: {
            text: 'Customers data',
            align: 'left', // Positions the title at the top center
            style: {
                fontSize: '17px',
                fontWeight: 'bold',
                color: '#263238'
            }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        grid: {
            show: false // This will remove the grid lines
          },
        
        dataLabels: {
            enabled: true,
            
          },
          markers: {
            size: 4, // Adjust the size of the circles
            strokeWidth: 0, // Set to 0 to remove the stroke around the circles
          },
          stroke: {
            curve: 'smooth'
          },
          legend: {
            position: 'top',
            offsetY: 3, // Adjust the offset as needed
            height: 18, // Adjust the height as needed
          },
    };
    
    const chartSeries = [
        {
            name: 'Customers',
            type: 'bar',
            data: customersData.map((customer)=> customer.Customers),
            yAxisIndex: 0,
          },
    ];

    // Getting the number of customers per month
    useEffect(()=>{
        const groupedData = customers.reduce((acc, obj) => {
            const monthYear = obj.created_at.slice(0, 7)
            if(!acc[monthYear]){
                acc[monthYear] = []
            }
            acc[monthYear].push(obj)
            return acc;
        }, {})


        const dataArray = Object.entries(groupedData).map(([monthYear, array]) => ({
            monthYear : new Date(monthYear).toDateString().split(" ")[1],
            length: array.length,
        }));

        dataArray.map((customers) => {
            const index = customersData.findIndex((customer)=>customer.name === customers.monthYear)
            setCustomersData((prevData) => [
                ...prevData.slice(0, index),
                {...prevData[index], Customers : customers["length"] },
                ...prevData.slice(index + 1)
            ])
        })

    },[customers])


  return (
    <div>
        <Chart
      options={chartOptions}
      series={chartSeries}
      type="bar"
      height="170" 
      width="100%"
    />
    </div>
  )
}

export default CustomerChart