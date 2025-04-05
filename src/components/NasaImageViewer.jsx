import React from "react";

const NasaImageViewer = ({
  currentImage,
  loading,
  error,
  onDiscover,
  onBanImage,
  onFavorite,
  favoriteImages,
}) => {
  if (loading) {
    return (
      <div className="nasa-viewer loading">
        <div className="loading-spinner"></div>
        <p>Loading astronomy picture...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nasa-viewer error">
        <p className="error-message">{error}</p>
        <button className="discover-btn" onClick={onDiscover}>
          Try Again
        </button>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div className="nasa-viewer empty">
        <p>👩🏾‍🚀 Heyyyy, Space Lover 🌌</p>
        <p className="helper-text">
          Click the button below to discover amazing astronomy pictures!
        </p>
        <button className="discover-btn" onClick={onDiscover}>
          Discover
        </button>
      </div>
    );
  }

  const getCurrentRating = () => {
    if (!currentImage) return 0;

    const favorite = favoriteImages.find(
      (img) => img.id === currentImage.id || img.date === currentImage.date
    );

    return favorite ? favorite.rating : 0;
  };

  const currentRating = getCurrentRating();

  return (
    <div className="nasa-viewer">
      <div className="image-container">
        {currentImage.media_type === "image" ? (
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="nasa-image"
          />
        ) : (
          <iframe
            title={currentImage.title}
            src={currentImage.url}
            className="nasa-video"
            allowFullScreen
          />
        )}
      </div>

      <div className="image-info">
        <h2>{currentImage.title}</h2>
        <p className="date">{currentImage.date}</p>
        <p className="explanation">{currentImage.explanation}</p>

        <div className="image-actions">
          <button className="discover-btn" onClick={onDiscover}>
            Show me more 😍
          </button>
          <button className="ban-btn" onClick={onBanImage}>
            Don't show again 😊
          </button>

          {/* <label htmlFor="rating-select">Rate this image: </label> */}
          <select
            id="rating-select"
            className="rating-select rating-container"
            value={currentRating || ""}
            onChange={(e) => onFavorite(Number(e.target.value))}
          >
            <option value="" disabled>
              Add to Favs Dashboard ♥️
            </option>
            <option value="3">❤️❤️❤️ (3 stars)</option>
            <option value="4">❤️❤️❤️❤️ (4 stars)</option>
            <option value="5">❤️❤️❤️❤️❤️ (5 stars)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default NasaImageViewer;
