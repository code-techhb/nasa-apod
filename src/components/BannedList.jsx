import React from "react";

const BannedList = ({ bannedImages, onRemoveFromBanned }) => {
  return (
    <div className="banned-list">
      <h3>Ban List</h3>
      {bannedImages.length === 0 ? (
        <p className="empty-message">No banned images</p>
      ) : (
        <div className="banned-grid">
          {bannedImages.map((image) => (
            <div
              key={image.id || `banned_${image.date}`}
              className="banned-item"
            >
              {/* <div
                className="banned-thumbnail"
                onClick={() => onViewImage(image)}
              >
                {image.media_type === "image" ? (
                  <img src={image.url} alt={image.title} />
                ) : (
                  <div className="video-thumbnail">
                    <span className="video-icon">▶</span>
                  </div>
                )}
              </div> */}
              <div className="banned-info">
                <p className="banned-title">{image.title}</p>
                <p className="banned-date">{image.date}</p>
                <button
                  className="unban-btn"
                  onClick={() =>
                    onRemoveFromBanned(image.id || `banned_${image.date}`)
                  }
                >
                  Remove from Ban List
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannedList;
