import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const AnalyticsPage = ({ favoriteImages }) => {
  const [activeChart, setActiveChart] = useState("ratings");

  // Prepare rating distribution data
  const ratingData = useMemo(() => {
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
  }, [favoriteImages]);

  // Prepare media type distribution data
  const mediaTypeData = useMemo(() => {
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
  }, [favoriteImages]);

  // Prepare author data
  const formatAuthorName = (author) => {
    return author.length > 10 ? `${author.slice(0, 10)} , Et al.` : author;
  };

  const authorData = useMemo(() => {
    const authorCounts = {};
    const authorRatings = {};

    favoriteImages.forEach((image) => {
      const author = formatAuthorName(image.copyright || "Unknown");
      authorCounts[author] = (authorCounts[author] || 0) + 1;
      authorRatings[author] = (authorRatings[author] || 0) + image.rating;
    });
    return Object.keys(authorCounts)
      .map((author) => ({
        name: author,
        count: authorCounts[author],
        avgRating: authorRatings[author] / authorCounts[author],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 authors
  }, [favoriteImages]);

  // Prepare timeline data
  const timelineData = useMemo(() => {
    const yearData = {};

    favoriteImages.forEach((image) => {
      const date = new Date(image.date);
      const year = date.getFullYear();

      if (!yearData[year]) {
        yearData[year] = {
          name: `${year}`,
          count: 0,
          avgRating: 0,
          totalRating: 0,
        };
      }

      yearData[year].count++;
      yearData[year].totalRating += image.rating;
      yearData[year].avgRating =
        yearData[year].totalRating / yearData[year].count;
    });
    // Sort by year in ascending order
    return Object.values(yearData).sort(
      (a, b) => parseInt(a.name) - parseInt(b.name)
    );
  }, [favoriteImages]);

  const COLORS = ["#00B4D8", "#0096C7", "#0077B6", "#023E8A", "#03045E"];

  const renderChartExplanation = () => {
    switch (activeChart) {
      case "ratings":
        return (
          <div className="chart-explanation">
            <h4>Understanding Your Likes Patterns</h4>
            <p>
              This chart shows the distribution of likes across your favorite
              astronomy pictures. You can see which rating you tend to give most
              frequently, helping you understand your preferences for cosmic
              imagery 🪐.
            </p>
            <p>
              {ratingData[2].value > ratingData[1].value &&
              ratingData[2].value > ratingData[0].value
                ? "You seem to really love the images you save 😍 ! You've given the maximum rating of 5 ❤️ most frequently 🎊."
                : ratingData[1].value > ratingData[0].value
                ? "You appear to be somewhat selective 🤓, with 4 ❤️ ratings being your most common choice."
                : "You tend to be more conservative with your highest ratings, with 3 ❤️ being your most common rating 😄."}
            </p>
          </div>
        );

      case "mediaType":
        return (
          <div className="chart-explanation">
            <h4>Images vs Videos Preference</h4>
            <p>
              This pie chart illustrates your preference between still images
              and videos from NASA's Astronomy Picture of the Day collection.
            </p>
            <p>
              {mediaTypeData[0].value > mediaTypeData[1].value
                ? `You strongly prefer still images (${mediaTypeData[0].value}) over videos (${mediaTypeData[1].value}). This might be because still images allow for more contemplation of cosmic wonders 🌌.`
                : mediaTypeData[1].value > mediaTypeData[0].value
                ? `You prefer video content (${mediaTypeData[1].value}) over still images (${mediaTypeData[0].value}). Videos can provide a more dynamic view of astronomical phenomena 🛸.`
                : "You have an equal appreciation for both still images and videos in your collection 😍."}
            </p>
          </div>
        );

      case "authors":
        return (
          <div className="chart-explanation">
            <h4>Favorite Content Creators</h4>
            <p>
              This chart shows the top contributors whose work you've saved to
              your favorites, along with the average rating you've given to
              their content.
            </p>
            <p>
              {authorData.length > 0
                ? `Your top favorite contributor is ${
                    authorData[0].name
                  } with ${
                    authorData[0].count
                  } saved images and an average rating of ${authorData[0].avgRating.toFixed(
                    1
                  )} ❤️.`
                : "You haven't saved enough content to establish clear patterns of favorite contributors yet. Keep Exploring 😍!"}
            </p>
          </div>
        );

      case "timeline":
        return (
          <div className="chart-explanation">
            <h4>Your Collection in Years </h4>
            <p>
              This timeline highlights how your favorites are distributed across
              the years, showcasing your timeless appreciation for astronomy
              imagery 🌟.
            </p>
            <p>
              {timelineData.length > 1
                ? timelineData[timelineData.length - 1].count >
                  timelineData[0].count
                  ? "Your collection has been growing more rapidly showing an increasing interest in astronomy imagery ✨."
                  : "You've been building your collection steadily over the years, with some fluctuations in collecting frequency 🚀."
                : "Start building your collection over time to see interesting patterns emerge across different years🤩!"}
            </p>
          </div>
        );

      default:
        return null;
    }
  };
  //------------- UI -------------------------------
  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Astronomy Collection Analytics</h1>
        <div className="nav-link-container">
          <Link to="/" className="nav-link">
            Back to Explorer
          </Link>
          <Link to="/dashboard" className="nav-link">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="analytics-intro">
        <p>
          Explore patterns and insights about your saved astronomy pictures.
          These visualizations reveal your preferences and collection habits
          over time.
        </p>
      </div>

      <div className="chart-selection">
        <button
          className={`chart-btn ${activeChart === "ratings" ? "active" : ""}`}
          onClick={() => setActiveChart("ratings")}
        >
          Rating Distribution
        </button>
        <button
          className={`chart-btn ${activeChart === "mediaType" ? "active" : ""}`}
          onClick={() => setActiveChart("mediaType")}
        >
          Media Types
        </button>
        <button
          className={`chart-btn ${activeChart === "authors" ? "active" : ""}`}
          onClick={() => setActiveChart("authors")}
        >
          Top Contributors
        </button>
        <button
          className={`chart-btn ${activeChart === "timeline" ? "active" : ""}`}
          onClick={() => setActiveChart("timeline")}
        >
          Collection Timeline
        </button>
      </div>

      <div className="analytics-chart-container">
        {activeChart === "ratings" && (
          <ResponsiveContainer width="100%" height={400}>
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
        )}

        {activeChart === "mediaType" && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={mediaTypeData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {mediaTypeData.map((_, index) => (
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
        )}

        {activeChart === "authors" && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={authorData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ angle: -45, textAnchor: "end" }}
                height={60}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#00B4D8" />
              <YAxis yAxisId="right" orientation="right" stroke="#EF476F" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="count"
                name="Number of Images"
                fill="#00B4D8"
              />
              <Bar
                yAxisId="right"
                dataKey="avgRating"
                name="Average Rating"
                fill="#EF476F"
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === "timeline" && (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={timelineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#00B4D8" />
              <YAxis yAxisId="right" orientation="right" stroke="#EF476F" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="count"
                name="Images Saved"
                fill="#00B4D8"
                stroke="#00B4D8"
                fillOpacity={0.3}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgRating"
                name="Average Rating"
                stroke="#EF476F"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {renderChartExplanation()}
    </div>
  );
};

export default AnalyticsPage;
