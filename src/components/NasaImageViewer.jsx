import React from "react";

const NasaImageViewer = ({
  currentImage,
  loading,
  error,
  onDiscover,
  onBanImage,
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
        </div>
      </div>
    </div>
  );
};

export default NasaImageViewer;
