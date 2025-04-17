import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const FavoritesDashboard = ({ favoriteImages, onViewImage }) => {
  //------------------- State management -----------------
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = useState("");
  const navigate = useNavigate();

  //------------------- Helper fns -----------------
  const filteredImages = useMemo(() => {
    return favoriteImages.filter((image) => {
      // Search by author or date
      const matchesSearch =
        searchQuery === "" ||
        (image.copyright &&
          image.copyright.toLowerCase().includes(searchQuery.toLowerCase())) ||
        image.date.includes(searchQuery);

      // Multiple Filters
      // by author
      const matchesAuthor =
        authorFilter === ""
          ? true
          : authorFilter === "unknown"
          ? !image.copyright || image.copyright.trim() === ""
          : image.copyright === authorFilter;

      // by rating
      const matchesRating =
        ratingFilter === "" || image.rating >= parseInt(ratingFilter);

      // by media type
      const matchesMediaType =
        mediaTypeFilter === "" || image.media_type === mediaTypeFilter;

      return (
        matchesSearch && matchesAuthor && matchesRating && matchesMediaType
      );
    });
  }, [
    favoriteImages,
    searchQuery,
    authorFilter,
    ratingFilter,
    mediaTypeFilter,
  ]);

  // stats
  const stats = useMemo(() => {
    const totalFavorites = favoriteImages.length;
    const avgRating = totalFavorites
      ? favoriteImages.reduce((sum, img) => sum + img.rating, 0) /
        totalFavorites
      : 0;
    const mediaTypeCounts = favoriteImages.reduce((counts, img) => {
      counts[img.media_type] = (counts[img.media_type] || 0) + 1;
      return counts;
    }, {});

    // Get unique authors
    const authors = [
      ...new Set(
        favoriteImages
          .filter((img) => img.copyright)
          .map((img) => img.copyright)
      ),
    ];

    return {
      totalFavorites,
      avgRating: avgRating.toFixed(2),
      mediaTypeCounts,
      authorCount: authors.length,
    };
  }, [favoriteImages]);

  // for filter dropdown
  const uniqueAuthors = useMemo(() => {
    return [
      ...new Set(
        favoriteImages
          .filter((img) => img.copyright)
          .map((img) => img.copyright)
      ),
    ];
  }, [favoriteImages]);

  const handleImageClick = (image) => {
    onViewImage(image, true);
    navigate("/");
  };

  const formatAuthorName = (author) => {
    return author.length > 10 ? `${author.slice(0, 10)} , Et al.` : author;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Your Favorite Astronomy Pictures</h1>
        <div className="nav-link-container">
          <Link
            to="/analytics"
            className={`nav-link ${
              favoriteImages.length === 0 ? "disabled-link" : ""
            }`}
            onClick={(e) => {
              if (favoriteImages.length === 0) {
                e.preventDefault();
                // Optionally show a tooltip or message here
              }
            }}
          >
            See Analytics
          </Link>
          <Link to="/" className="nav-link">
            Back to Explorer
          </Link>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Favs</h3>
          <p className="stat-value">{stats.totalFavorites}</p>
        </div>
        <div className="stat-card">
          <h3>Average Likes</h3>
          <p className="stat-value">{stats.avgRating} ❤️</p>
        </div>
        <div className="stat-card">
          <h3>Images vs Videos</h3>
          <p className="stat-value">
            📷 {stats.mediaTypeCounts.image || 0} / 🎬{" "}
            {stats.mediaTypeCounts.video || 0}
          </p>
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by author or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <div className="filter">
            <label htmlFor="author-filter">Author:</label>
            <select
              id="author-filter"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
            >
              <option value="">All Authors</option>
              <option value="unknown">Unknown</option>
              {uniqueAuthors.map((author) => (
                <option key={author} value={author}>
                  {formatAuthorName(author)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter">
            <label htmlFor="rating-filter">Min Likes:</label>
            <select
              id="rating-filter"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">Any Likes</option>
              <option value="3">3+ ❤️</option>
              <option value="4">4+ ❤️</option>
              <option value="5">5 ❤️</option>
            </select>
          </div>

          <div className="filter">
            <label htmlFor="media-filter">Media Type:</label>
            <select
              id="media-filter"
              value={mediaTypeFilter}
              onChange={(e) => setMediaTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="favorites-table-container">
        <table className="favorites-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Type</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredImages.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">
                  No favs match your filters
                </td>
              </tr>
            ) : (
              filteredImages.map((image) => (
                <tr
                  key={image.id || `fav_${image.date}`}
                  onClick={() => handleImageClick(image)}
                  className="clickable-row"
                >
                  <td className="image-cell">
                    {image.media_type === "image" ? (
                      <img
                        src={image.url}
                        alt={image.title}
                        className="thumbnail"
                      />
                    ) : (
                      <div className="video-thumbnail">
                        <span className="video-icon">▶</span>
                      </div>
                    )}
                  </td>
                  <td>{image.title}</td>
                  <td>{formatAuthorName(image.copyright || "Unknown")}</td>
                  <td>{image.date}</td>
                  <td>{image.media_type === "image" ? "📷" : "🎬"}</td>
                  <td>{Array(image.rating).fill("❤️").join("")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FavoritesDashboard;
