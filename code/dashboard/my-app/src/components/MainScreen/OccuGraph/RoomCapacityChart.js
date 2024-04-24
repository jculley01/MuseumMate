import React from 'react';
import Chart from 'react-apexcharts';
import Card from './ChartCard';

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
          categories: [],
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
          data: [],
        },
      ],
      noOccupancy: false,
    };

    this.intervalId = null; // Initialize a variable to hold the interval ID
  }

  componentDidMount() {
    this.fetchRoomOccupancies();
    // Set up an interval to refresh the data every 3 seconds
    this.intervalId = setInterval(this.fetchRoomOccupancies, 3000);
  }

  componentWillUnmount() {
    // Clear the interval on component unmount to prevent memory leaks
    clearInterval(this.intervalId);
  }

  fetchRoomOccupancies = async () => {
    try {
      const response = await fetch('http://128.197.53.112:3000/api/room-occupancies');
      const data = await response.json();
      const categories = data.occupancies.map(d => d.roomID);
      const occupancyData = data.occupancies.map(d => d.occupancy);

      const noOccupancy = occupancyData.every(value => value === 0);

      this.setState(prevState => ({
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: categories,
          }
        },
        series: [{ data: occupancyData }],
        noOccupancy: noOccupancy,
      }));
    } catch (error) {
      console.error('Failed to fetch room occupancies:', error);
    }
  }

  render() {
    return (
      <Card className="chart-card-container">
        <div className="chart-header"></div>
        <div id="chart" style={{ textAlign: 'center', fontSize: '1.5rem' }}>
          {this.state.noOccupancy ? (
            <p>There are no users in any of the rooms currently.</p>
          ) : (
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              height={350}
            />
          )}
        </div>
      </Card>
    );
  }
}

export default RoomCapacityChart;
