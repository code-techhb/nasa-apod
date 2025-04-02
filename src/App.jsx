import React, { useState } from "react";
import "./App.css";
import NasaImageViewer from "./components/NasaImageViewer";
import AlreadySeenList from "./components/AlreadySeenList";
import BannedList from "./components/BannedList";

function App() {
  //-------------- State management vars ------------------
  const [currentImage, setCurrentImage] = useState(null);
  const [seenImages, setSeenImages] = useState([]);
  const [bannedImages, setBannedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleViewImage = (image) => {
    if (!image || !image.date) {
      console.error("Attempting to view an invalid image:", image);
      return;
    }
    const imageWithId = {
      ...image,
      id: image.id || `image_${image.date}`,
    };

    setCurrentImage(imageWithId);

    const isDuplicate = seenImages.some((img) => img.id === imageWithId.id);

    if (!isDuplicate && !imageWithId.id.startsWith("banned_")) {
      setSeenImages((prev) => [imageWithId, ...prev]);
    }
  };

  //-------------- UI-----------------------
  return (
    <div className="app-container">
      <header>
        <h1>NASA Astronomy Picture of the Day</h1>
      </header>

      <main className="content-container">
        <div className="left-column">
          <NasaImageViewer
            currentImage={currentImage}
            loading={loading}
            error={error}
            onDiscover={handleDiscover}
            onBanImage={handleBanImage}
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
    </div>
  );
}

export default App;
