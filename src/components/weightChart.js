import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Segment, Button } from "semantic-ui-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "moment";
import "chartjs-adapter-moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

const UserWeightChart = ({ data }) => {
  const [chartData, setChartData] = useState();
  const [chartType, setChartType] = useState("Bar");

  // Define an array of colors for the trend lines
  const lineChartColors = [
    "rgba(255, 99, 132, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(255, 206, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 159, 64, 0.5)",
  ];

  useEffect(() => {
    if (chartType === "Bar") {
      const barData = {
        labels: data.map((item) => item.name),
        datasets: [
          {
            label: "Weight",
            data: data.map((item) => {
              if (item.weights) {
                const weights = Object.entries(item.weights);
                const mostRecent = weights.reduce((a, b) => (a[0] > b[0] ? a : b));
                return mostRecent[1];
              }
              return 0;
            }),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };
      setChartData(barData);
    } else {
      const lineData = data.map((item, index) => ({
        label: item.name,
        data: item.weights
          ? Object.entries(item.weights).map(([timestamp, weight]) => ({
              x: new Date(parseInt(timestamp)),
              y: weight,
            }))
          : [],
        borderColor: lineChartColors[index % lineChartColors.length], // Cycle through the color array
        backgroundColor: lineChartColors[index % lineChartColors.length],
        borderWidth: 2,
        fill: false,
      }));
      setChartData({ datasets: lineData });
    }
//  eslint-disable-next-line
  }, [data, chartType]);

  const options = {
    line: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
              tooltipFormat: "MMM D, YYYY",
            },
          }
        }
    },
    bar: {
      indexAxis: "y",
    },
  };

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === "Bar" ? "Line" : "Bar"));
  };

  return (
    <Segment basic style={{ padding: 0 }}>
      <Button onClick={toggleChartType}>Toggle to {chartType === "Bar" ? "Line" : "Bar"}</Button>
      {chartData && (
        chartType === "Bar" ? (
          <Bar data={chartData} options={options.bar} />
        ) : (
          <Line data={chartData} options={options.line} />
        )
      )}
    </Segment>
  );
};

export default UserWeightChart;
