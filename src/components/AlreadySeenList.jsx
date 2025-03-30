import React from "react";

const AlreadySeenList = ({ seenImages, onViewImage }) => {
  return (
    <div className="already-seen-list">
      <h3>Already Seen</h3>
      {seenImages.length === 0 ? (
        <p className="empty-message">No images viewed yet</p>
      ) : (
        <div className="image-grid">
          {seenImages.map((image) => (
            <div
              key={image.id || `image_${image.date}`}
              className="thumbnail"
              onClick={() => onViewImage(image)}
            >
              {image.media_type === "image" ? (
                <img src={image.url} alt={image.title} />
              ) : (
                <div className="video-thumbnail">
                  <span className="video-icon">▶</span>
                </div>
              )}
              <div className="thumbnail-date">{image.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlreadySeenList;
