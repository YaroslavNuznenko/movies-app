import React, { useState } from 'react';
import type { MovieThing } from '../pages/MoviesPage';

type MoviesRowProps = {
  movieData: MovieThing;
  toggleWatchlistFunction: (movie: MovieThing) => void;
  toggleLikeFunction: (movie: MovieThing) => void;
  showCommentsFunction: (movie: MovieThing) => void;
  shareMovieFunction: (movie: MovieThing) => void;
};

const MovieRow = ({
  movieData,
  toggleWatchlistFunction,
  toggleLikeFunction,
  showCommentsFunction,
  shareMovieFunction,
}: MoviesRowProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleImageClick = () => {
    setIsPlaying(!isPlaying);
  };

  const renderStarsFunction = (ratingValue: number) =>
    '⭐'.repeat(ratingValue) + '☆'.repeat(5 - ratingValue);

  return (
    <div
      style={{
        height: 275,
        border: '1px solid #ddd',
        borderRadius: 12,
        background: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '125px',
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
          borderRadius: '12px 12px 0 0',
        }}
        onClick={handleImageClick}
      >
        {isPlaying ? (
          <video
            src={movieData.video_path}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px 12px 0 0',
            }}
            autoPlay
            muted
            loop
            onError={(e) => {
              console.error('Video error:', e);
              setIsPlaying(false);
            }}
          />
        ) : (
          <img
            src={movieData.poster_path}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px 12px 0 0',
            }}
            alt={movieData.title}
          />
        )}

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            opacity: 0.8,
          }}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            pointerEvents: 'none',
            opacity: 0.7,
          }}
        >
          Click to {isPlaying ? 'stop' : 'play'}
        </div>
      </div>

      <div style={{ padding: 15 }}>
        <h3 style={{ color: 'black', margin: 0 }}>{movieData.title}</h3>
        <div style={{ color: '#666', marginBottom: 10 }}>
          {renderStarsFunction(movieData.rating)}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => toggleWatchlistFunction(movieData)}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: 6,
              background: movieData.isInWatchlist ? '#28a745' : '#007bff',
              color: 'white',
            }}
          >
            {movieData.isInWatchlist ? '✓ Watchlist' : '+ Watchlist'}
          </button>
          <button
            onClick={() => toggleLikeFunction(movieData)}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: 6,
              background: movieData.isLiked ? '#e74c3c' : '#ff6b6b',
              color: 'white',
            }}
          >
            {movieData.isLiked ? '❤️' : '🤍'} {movieData.likes}
          </button>
          <button
            onClick={() => showCommentsFunction(movieData)}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: 6,
              background: '#6c757d',
              color: 'white',
            }}
          >
            💬
          </button>
          <button
            onClick={() => shareMovieFunction(movieData)}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: 6,
              background: '#17a2b8',
              color: 'white',
            }}
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MovieRow);
