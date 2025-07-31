import React, { useState } from "react";

const UrlForm = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(url);
    setUrl("");
  };

  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const urlIsValid = url === "" || isValidYouTubeUrl(url);

  return (
    <div className="url-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="input-container">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="🎥 Enter YouTube video URL here..."
              disabled={loading}
              required
              className={!urlIsValid ? "invalid" : ""}
            />
            {url && !urlIsValid && (
              <div className="error-message">
                ⚠️ Please enter a valid YouTube URL
              </div>
            )}
          </div>
          <button type="submit" disabled={loading || !urlIsValid}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>🚀 Generate MCQs</>
            )}
          </button>
        </div>
      </form>
      <div className="examples">
        <p className="hint">💡 Example formats:</p>
        <div className="example-urls">
          <code>https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>
        </div>
      </div>
    </div>
  );
};

export default UrlForm;
