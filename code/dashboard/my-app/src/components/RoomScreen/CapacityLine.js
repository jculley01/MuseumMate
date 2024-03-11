import React from 'react';
import ApexCharts from 'react-apexcharts';

class CapacityLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
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
        colors: ['#77B6EA'],
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
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], 
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
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Adjust categories according to your data
        },
        yaxis: {
          // Adjust according to your data
          min: 0,
          max: 100
        },
        legend: {
          show: true, // set to true to show the legend
          position: 'top',
          horizontalAlign: 'right',
        }
      },
      series: [
        {
          name: "Capacity",
          data: [30, 40, 35, 50, 49, 60, 70, 91] // Replace this array with your actual data
        }
      ],
    };
  }

  render() {
    return (
        <div style={{ display: 'flex', justifyContent: 'left' }}>
          <div style={{ width: '100%' }} id="chart">
            <ApexCharts options={this.state.options} series={this.state.series} type="line" height={350} />
          </div>
        </div>
    );
  }
}

export default CapacityLine;
