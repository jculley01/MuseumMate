import React from 'react';
import Chart from 'react-apexcharts';
import Card from './ChartCard';
import Dropdown from './ChartDropdown';

class RoomCapacityChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          height: 350,
          type: 'bar',
          events: {
            click: function (chart, w, e) {
              // Handle chart click event
              console.log(chart, w, e);
            },
          },
        },
        colors: ['#5856d6'],
        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        xaxis: {
          categories: [
            '2.1', '2.2', '2.3', '3.1', '3.2', '3.3',
          ],
          labels: {
            style: {
              colors: ['#5856d6'],
              fontSize: '12px',
            },
          },
        },
        title: {
          text: 'Room capacity overview',
          align: 'left',
        },
      },
      series: [
        {
          data: [25, 50, 50, 75, 50, 100], // Update these values with your actual data
        },
      ],
    };
  }

  render() {
    return (
      <Card className="chart-card-container">
        <div className="chart-header">
          <Dropdown />
        </div>
        <div id="chart">
          <Chart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={350}
          />
        </div>
      </Card>
    );
  }
}

export default RoomCapacityChart;
