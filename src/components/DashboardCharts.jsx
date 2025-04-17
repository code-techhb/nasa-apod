import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const DashboardCharts = ({ favoriteImages }) => {
  const [activeChart, setActiveChart] = useState("ratings");
  const navigate = useNavigate();

  // Check if there are any favorite images
  if (favoriteImages.length === 0) {
    return (
      <div className="dashboard-charts empty-state">
        <div className="empty-state-message">
          <h3>Data Visualization</h3>
          <p>
            You haven't saved any astronomy pictures yet 🥲. Start exploring now
            to see some great analysis here 🤩!
          </p>
          <button className=" nav-link" onClick={() => navigate("/")}>
            Start Exploring
          </button>
        </div>
      </div>
    );
  }

  // Process data for Ratings Distribution Chart
  const prepareRatingData = () => {
    const ratingCounts = [0, 0, 0];

    favoriteImages.forEach((image) => {
      if (image.rating >= 3 && image.rating <= 5) {
        ratingCounts[image.rating - 3]++;
      }
    });

    return [
      { name: "3 ❤️", value: ratingCounts[0] },
      { name: "4 ❤️", value: ratingCounts[1] },
      { name: "5 ❤️", value: ratingCounts[2] },
    ];
  };

  // Process data for Media Type Distribution Chart
  const prepareMediaTypeData = () => {
    const counts = { image: 0, video: 0 };

    favoriteImages.forEach((image) => {
      if (image.media_type in counts) {
        counts[image.media_type]++;
      }
    });

    return [
      { name: "Images 📷", value: counts.image },
      { name: "Videos 🎬", value: counts.video },
    ];
  };

  const ratingData = prepareRatingData();
  const mediaTypeData = prepareMediaTypeData();

  const COLORS = ["#00B4D8", "#0096C7", "#0077B6", "#023E8A"];

  return (
    <div className="dashboard-charts">
      <div className="chart-controls">
        <h3>Visualize Your Favs Data</h3>
        <div className="chart-toggle">
          <button
            className={`chart-toggle-btn ${
              activeChart === "ratings" ? "active" : ""
            }`}
            onClick={() => setActiveChart("ratings")}
          >
            Ratings Distribution
          </button>
          <button
            className={`chart-toggle-btn ${
              activeChart === "mediaType" ? "active" : ""
            }`}
            onClick={() => setActiveChart("mediaType")}
          >
            Media Type Distribution
          </button>
        </div>
      </div>

      <div className="chart-container">
        {activeChart === "ratings" && (
          <>
            <h4>Ratings Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={ratingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Number of Media" fill="#00B4D8" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {activeChart === "mediaType" && (
          <>
            <h4>Media Type Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mediaTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {mediaTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      <div className="view-more">
        <button
          className="view-analytics-btn"
          onClick={() => navigate("/analytics")}
        >
          View Full Analytics
        </button>
      </div>
    </div>
  );
};

export default DashboardCharts;
