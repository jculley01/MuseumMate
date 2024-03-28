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
          categories: ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'], // Adjust categories according to your data
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
