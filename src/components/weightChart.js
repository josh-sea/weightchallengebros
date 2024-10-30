import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Segment, Dropdown, Button } from "semantic-ui-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import zoomPlugin from "chartjs-plugin-zoom";
import "moment";
import "chartjs-adapter-moment";

// Register Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  TimeScale,
  annotationPlugin,
  zoomPlugin // Register the zoom plugin
);

const UserWeightChart = ({ data, goal, userEmail }) => {
  const [chartData, setChartData] = useState();
  const [options, setOptions] = useState({});
  const [visibleGoals, setVisibleGoals] = useState({});
  const chartRef = useRef(null);

  const lineChartColors = [
    "rgba(255, 99, 132, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(255, 206, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 159, 64, 0.5)",
  ];

  // Initialize visibleGoals only once when the component mounts
  useEffect(() => {
    const initialVisibleGoals = data.reduce((acc, item) => {
      acc[item.name] = item.email === userEmail; // Only show the current user's goal initially
      return acc;
    }, {});
    setVisibleGoals(initialVisibleGoals);
  }, [data, userEmail]);

  // Update chart data and options whenever data or visibleGoals change
  useEffect(() => {
    const commonOptions = {
      responsive: true,
      plugins: {
        tooltip: { enabled: true },
        annotation: {
          annotations: {},
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "xy", // Allow panning on both axes
            threshold: 5, // Panning speed threshold
          },
          zoom: {
            wheel: {
              enabled: true, // Enable zooming with the mouse wheel only
              speed: .05, // Set zoom speed to a slower value for smoother zooming
            },
            pinch: {
              enabled: true, // Enable pinch-to-zoom for touch devices
            },
            drag: {
              enabled: false, // Disable drag-to-zoom to prevent conflicts with panning
            },
            mode: "xy", // Allow zooming on both axes
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
            tooltipFormat: "MMM D, YYYY",
          },
        },
      },
    };

    const lineData = data.map((item, index) => {
      // Create trend line data
      const trendData = item.weights
        ? Object.entries(item.weights).map(([timestamp, weight]) => ({
            x: new Date(parseInt(timestamp)),
            y: weight,
          }))
        : [];

      // Create the goal annotation if the user has a goal and it is visible
      if (item.goal && visibleGoals[item.name]) {
        const annotationId = `goalLine_${item.name}`;
        commonOptions.plugins.annotation.annotations[annotationId] = {
          type: "line",
          yMin: item.goal,
          yMax: item.goal,
          borderColor: lineChartColors[index % lineChartColors.length],
          borderWidth: 2,
          borderDash: [5, 5], // Make the goal line dashed
          label: {
            display: true,
            content: `Goal: ${item.goal}`,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            font: { size: 12 },
            position: "end",
          },
        };
      }

      return {
        label: item.name,
        data: trendData,
        borderColor: lineChartColors[index % lineChartColors.length],
        backgroundColor: lineChartColors[index % lineChartColors.length],
        borderWidth: 2,
        fill: false,
      };
    });

    setChartData({ datasets: lineData });
    setOptions(commonOptions);
  }, [data, visibleGoals]);

  const handleDropdownChange = (e, { value }) => {
    // Update visibleGoals state based on dropdown selections
    const updatedVisibleGoals = {};
    data.forEach((item) => {
      updatedVisibleGoals[item.name] = value.includes(item.name);
    });
    setVisibleGoals(updatedVisibleGoals);
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom(); // Reset zoom using the Chart.js Zoom plugin's method
    }
  };

  return (
    <Segment basic style={{ padding: 0 }}>
      <div style={{ marginBottom: "1rem" }}>
        <Dropdown
          placeholder="Select Users to Show Goals"
          multiple
          search
          fluid
          selection
          options={data.map((item, index) => ({
            key: index,
            text: `${item.name}'s Goal`,
            value: item.name,
          }))}
          onChange={handleDropdownChange}
          value={Object.keys(visibleGoals).filter((key) => visibleGoals[key])}
        />
      </div>
      <Button onClick={handleResetZoom} color="pink" style={{ marginBottom: "1rem" }}>
        Reset Zoom
      </Button>
      {chartData && (
        <Line ref={chartRef} data={chartData} options={options} />
      )}
    </Segment>
  );
};

export default UserWeightChart;
