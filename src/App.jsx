import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import NasaImageViewer from "./components/NasaImageViewer";
import AlreadySeenList from "./components/AlreadySeenList";
import BannedList from "./components/BannedList";
import FavoritesDashboard from "./components/FavoritesDashboard";
import DashboardCharts from "./components/DashboardCharts";
import AnalyticsPage from "./components/AnalyticsPage";

function App() {
  //-------------- State management w/ localStorage ------------------
  const [currentImage, setCurrentImage] = useState(null);
  const [seenImages, setSeenImages] = useState(() => {
    const saved = localStorage.getItem("seenImages");
    return saved ? JSON.parse(saved) : [];
  });
  const [bannedImages, setBannedImages] = useState(() => {
    const saved = localStorage.getItem("bannedImages");
    return saved ? JSON.parse(saved) : [];
  });
  const [favoriteImages, setFavoriteImages] = useState(() => {
    const saved = localStorage.getItem("favoriteImages");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //-------------- localStorage effect hooks ------------------
  useEffect(() => {
    localStorage.setItem("seenImages", JSON.stringify(seenImages));
  }, [seenImages]);

  useEffect(() => {
    localStorage.setItem("bannedImages", JSON.stringify(bannedImages));
  }, [bannedImages]);

  useEffect(() => {
    localStorage.setItem("favoriteImages", JSON.stringify(favoriteImages));
  }, [favoriteImages]);

  //--------------Fetch data fn -----------------------
  const fetchNasaImage = async (date = "") => {
    setLoading(true);
    try {
      const API_KEY = import.meta.env.VITE_NASA_API_KEY;
      let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

      if (date) {
        url += `&date=${date}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      if (bannedImages.some((img) => img.date === data.date)) {
        const yesterday = getPreviousDay(date || new Date());
        fetchNasaImage(yesterday);
        return;
      }
      // Check if date E
      if (!data.date) {
        console.error("Missing date in NASA API response:", data);
        setError("Invalid data received from NASA API. Please try again.");
        setLoading(false);
        return;
      }

      const imageWithId = {
        ...data,
        id: `image_${data.date}`,
      };

      setCurrentImage(imageWithId);

      const isDuplicate = seenImages.some((img) => img.id === imageWithId.id);

      if (!isDuplicate) {
        setSeenImages((prev) => [imageWithId, ...prev]);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch NASA image. Please try again later.");
      setLoading(false);
      console.error("Error fetching NASA APOD:", err);
    }
  };

  //-------------- Helper functions -----------------------
  const getPreviousDay = (date) => {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    return previousDay.toISOString().split("T")[0];
  };

  const handleDiscover = () => {
    //random date between June 16, 1995 (first APOD) and today
    const start = new Date(1995, 5, 16).getTime();
    const end = new Date().getTime();
    const randomDate = new Date(start + Math.random() * (end - start));
    const formattedDate = randomDate.toISOString().split("T")[0];

    setLoading(true);
    setCurrentImage(null);
    setTimeout(() => {
      fetchNasaImage(formattedDate);
    }, 100);
  };

  const handleBanImage = () => {
    if (currentImage) {
      const bannedImage = {
        ...currentImage,
        id: `banned_${currentImage.date}`,
      };
      const isAlreadyBanned = bannedImages.some(
        (img) => img.id === bannedImage.id
      );
      if (!isAlreadyBanned) {
        setBannedImages((prev) => [bannedImage, ...prev]);
      }
      handleDiscover();
    }
  };

  const handleRemoveFromBanned = (id) => {
    setBannedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleViewImage = (image, isFromDashboard = false) => {
    if (!image || !image.date) {
      console.error("Attempting to view an invalid image:", image);
      return;
    }
    if (isFromDashboard) {
      setLoading(true);
      setCurrentImage(null);
      fetchNasaImage(image.date);
    } else {
      const imageWithId = {
        ...image,
        id: image.id || `image_${image.date}`,
      };
      setCurrentImage(imageWithId);
      const isDuplicate = seenImages.some((img) => img.id === imageWithId.id);
      if (!isDuplicate && !imageWithId.id.startsWith("banned_")) {
        setSeenImages((prev) => [imageWithId, ...prev]);
      }
    }
  };

  const clearAllData = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to clear all your saved data? This will remove your current image, viewing history, banned list, and favorites."
    );
    if (userConfirmed) {
      setCurrentImage(null);
      setSeenImages([]);
      setBannedImages([]);
      setFavoriteImages([]);
      localStorage.removeItem("currentImage");
      localStorage.removeItem("seenImages");
      localStorage.removeItem("bannedImages");
      localStorage.removeItem("favoriteImages");
    }
  };

  const handleFavoriteImage = (rating) => {
    if (!currentImage) return;
    const existingIndex = favoriteImages.findIndex(
      (img) => img.id === currentImage.id || img.date === currentImage.date
    );
    const favoriteImage = {
      ...currentImage,
      id: currentImage.id || `image_${currentImage.date}`,
      rating: rating,
      addedToFavoritesAt: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      const updatedFavorites = [...favoriteImages];
      updatedFavorites[existingIndex] = favoriteImage;
      setFavoriteImages(updatedFavorites);
    } else {
      setFavoriteImages((prev) => [favoriteImage, ...prev]);
    }
  };

  //-------------- UI-----------------------
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <>
                <FavoritesDashboard
                  favoriteImages={favoriteImages}
                  onViewImage={handleViewImage}
                />
                <DashboardCharts favoriteImages={favoriteImages} />
              </>
            }
          />

          <Route
            path="/analytics"
            element={<AnalyticsPage favoriteImages={favoriteImages} />}
          />

          <Route
            path="/"
            element={
              <>
                <header>
                  <h1>NASA Astronomy Picture of the Day</h1>
                  <button className="clear-data-btn" onClick={clearAllData}>
                    Clear All Data
                  </button>
                  <nav className="main-nav">
                    <Link to="/dashboard" className="nav-link">
                      View Favorites Dashboard
                    </Link>
                  </nav>
                </header>

                <main className="content-container">
                  <div className="left-column">
                    <NasaImageViewer
                      currentImage={currentImage}
                      loading={loading}
                      error={error}
                      onDiscover={handleDiscover}
                      onBanImage={handleBanImage}
                      onFavorite={handleFavoriteImage}
                      favoriteImages={favoriteImages}
                    />
                  </div>

                  <div className="right-column">
                    <div className="top-section">
                      <AlreadySeenList
                        seenImages={seenImages}
                        onViewImage={handleViewImage}
                      />
                    </div>

                    <div className="bottom-section">
                      <BannedList
                        bannedImages={bannedImages}
                        onRemoveFromBanned={handleRemoveFromBanned}
                        onViewImage={handleViewImage}
                      />
                    </div>
                  </div>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
