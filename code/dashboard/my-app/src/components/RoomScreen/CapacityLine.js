import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const CapacityLine = () => {
  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#5856d6'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Capacity',
      align: 'left'
    },
    grid: {
      borderColor: '#757575',
      row: {
        colors: ['#ffffff', 'transparent'],
        opacity: 0.5
      },
    },
    markers: {
      size: 4,
      hover: {
        size: 7
      }
    },
    xaxis: {
      categories: [], // Initialize empty because we'll set this via API
    },
    yaxis: {
      min: 0,
      max: 100
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
    }
  });

  const [series, setSeries] = useState([{
    name: "Capacity",
    data: [] // Initialize empty because we'll set this via API
  }]);



  useEffect(() => {
    const fetchOccupancyData = async () => {
      try {
        const response = await fetch('http://128.197.53.112:3000/api/occupancy-trends');
        const { categories, data } = await response.json();

        const formattedCategories = categories.map(timestamp => {
          const date = new Date(timestamp);
          return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        });
        console.log("formattedCats: ", formattedCategories);
        setOptions(prevOptions => ({
          ...prevOptions,
          xaxis: { ...prevOptions.xaxis, categories: formattedCategories }
        }));
        setSeries([{ name: "Capacity", data }]);
      } catch (error) {
        console.error('Failed to fetch occupancy trends:', error);
      }
    };

    fetchOccupancyData();
  }, []);


  return (
    <div style={{ display: 'flex', justifyContent: 'left' }}>
      <div style={{ width: '100%' }} id="chart">
        <ApexCharts options={options} series={series} type="line" height={350} />
      </div>
    </div>
  );
}

export default CapacityLine;
