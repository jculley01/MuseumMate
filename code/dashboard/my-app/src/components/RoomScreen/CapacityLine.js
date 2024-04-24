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
        show: true
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
      type: 'datetime',
      tickAmount: 10, // Optional: control the number of ticks
      labels: {
        formatter: function(value, timestamp) {
          return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
        }
      }
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
    data: []
  }]);

  useEffect(() => {
    const fetchOccupancyData = async () => {
      try {
        const response = await fetch('http://128.197.53.112:3000/api/occupancy-trends');
        const { categories, data } = await response.json();

        // Map categories directly to timestamps
        const formattedData = data.map((point, index) => ({
          x: new Date(categories[index]),
          y: point
        }));

        setSeries([{ name: "Capacity", data: formattedData }]);
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
