import React, { useState, useEffect } from 'react';
import type { MovieThing, NewsfeedItemThing } from '../pages/MoviesPage';
import getRandomImage from '../tools/getRandomImage';
import getRandomVideo from '../tools/getRandomVideo';

interface NewsfeedProps {
  movies: MovieThing[];
  onToggleWatchlist: (movie: MovieThing) => void;
  onToggleLike: (movie: MovieThing) => void;
  onShowComments: (movie: MovieThing) => void;
}

const Newsfeed: React.FC<NewsfeedProps> = ({
  movies,
  onToggleWatchlist,
  onToggleLike,
  onShowComments,
}) => {
  const [newsfeedItems, setNewsfeedItems] = useState<NewsfeedItemThing[]>([]);
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    const initialItems: NewsfeedItemThing[] = [
      ...Array(3)
        .fill(null)
        .map((_, i) => ({
          id: `trending-${i}`,
          type: 'trending' as const,
          movie: {
            id: i,
            title: `Trending Movie ${i + 1}`,
            poster_path: getRandomImage(),
            video_path: getRandomVideo(),
            rating: Math.floor(Math.random() * 5) + 1,
            likes: Math.floor(Math.random() * 1000) + 100,
            isLiked: false,
            isInWatchlist: false,
          },
          action: 'is trending',
          timestamp: new Date(Date.now() - i * 60 * 1000),
          avatar: `https://ui-avatars.com/api/?name=Trending&background=${Math.floor(Math.random() * 0xffffff).toString(16)}`,
        })),
      {
        id: 'friend-1',
        type: 'friend_watching',
        movie: {
          id: 100,
          title: 'Inception',
          poster_path: getRandomImage(),
          video_path: getRandomVideo(),
          rating: 5,
          likes: 1250,
          isLiked: false,
          isInWatchlist: false,
        },
        friend: 'John Doe',
        action: 'is watching',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
      },
    ];
    setNewsfeedItems(initialItems);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateCounter((prev) => prev + 1);

      if (Math.random() > 0.7) {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        if (randomMovie) {
          const newItem: NewsfeedItemThing = {
            id: `live-${Date.now()}`,
            type: Math.random() > 0.5 ? 'trending' : 'friend_watching',
            movie: {
              ...randomMovie,
              poster_path: getRandomImage(),
              video_path: getRandomVideo(),
            },
            friend: Math.random() > 0.5 ? 'Movie Fan' : 'Cinephile',
            action: Math.random() > 0.5 ? 'just liked' : 'added to watchlist',
            timestamp: new Date(),
            avatar: `https://ui-avatars.com/api/?name=User&background=${Math.floor(Math.random() * 0xffffff).toString(16)}`,
          };

          setNewsfeedItems((prev) => [newItem, ...prev.slice(0, 9)]); // Keep max 10 items
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  const getTimeAgo = (timestamp: Date): string => {
    const timeDifferenceInMinutes = Math.floor(
      (new Date().getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (timeDifferenceInMinutes < 1) return 'just now';
    if (timeDifferenceInMinutes < 60) return `${timeDifferenceInMinutes}m ago`;
    if (timeDifferenceInMinutes < 1440)
      return `${Math.floor(timeDifferenceInMinutes / 60)}h ago`;
    return `${Math.floor(timeDifferenceInMinutes / 1440)}d ago`;
  };

  const handleToggleWatchlist = (movie: MovieThing) => {
    onToggleWatchlist(movie);

    const newItem: NewsfeedItemThing = {
      id: `watchlist-${Date.now()}`,
      type: 'friend_watching',
      movie: {
        ...movie,
        poster_path: getRandomImage(),
        video_path: getRandomVideo(),
      },
      friend: 'You',
      action: movie.isInWatchlist
        ? 'removed from watchlist'
        : 'added to watchlist',
      timestamp: new Date(),
      avatar: 'https://ui-avatars.com/api/?name=You&background=007bff',
    };

    setNewsfeedItems((prev) => [newItem, ...prev.slice(0, 9)]);
  };

  const handleToggleLike = (movie: MovieThing) => {
    onToggleLike(movie);

    const newItem: NewsfeedItemThing = {
      id: `like-${Date.now()}`,
      type: 'trending',
      movie: {
        ...movie,
        poster_path: getRandomImage(),
        video_path: getRandomVideo(),
      },
      friend: 'You',
      action: movie.isLiked ? 'unliked' : 'liked',
      timestamp: new Date(),
      avatar: 'https://ui-avatars.com/api/?name=You&background=e74c3c',
    };

    setNewsfeedItems((prev) => [newItem, ...prev.slice(0, 9)]);
  };

  return (
    <div
      style={{
        background: '#f8f9fa',
        padding: 20,
        borderRadius: 12,
        height: 'fit-content',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0, color: 'black' }}>Newsfeed</h2>
        <div
          style={{
            fontSize: 12,
            color: '#666',
            background: '#fff',
            padding: '4px 8px',
            borderRadius: 12,
            border: '1px solid #ddd',
          }}
        >
          🔴 Live • Updates: {updateCounter}
        </div>
      </div>

      {newsfeedItems.map((item) => (
        <div
          key={item.id}
          style={{
            background: 'white',
            color: 'black',
            padding: 15,
            marginBottom: 15,
            borderRadius: 10,
            border:
              item.timestamp.getTime() > Date.now() - 10000
                ? '2px solid #28a745'
                : '1px solid #ddd',
            boxShadow:
              item.timestamp.getTime() > Date.now() - 10000
                ? '0 4px 12px rgba(40, 167, 69, 0.3)'
                : '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
              color: 'black',
            }}
          >
            <img
              src={item.avatar}
              style={{ width: 40, height: 40, borderRadius: '50%' }}
              alt="Avatar"
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, lineHeight: 1.4, color: 'black' }}>
                {item.friend && (
                  <span
                    style={{
                      // color: '#007bff',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.friend}
                  </span>
                )}{' '}
                {item.action} <strong>{item.movie.title}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                {getTimeAgo(item.timestamp)}
                {item.timestamp.getTime() > Date.now() - 10000 && (
                  <span style={{ color: '#28a745', marginLeft: 8 }}>🆕</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => handleToggleWatchlist(item.movie)}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderRadius: 6,
                background: item.movie.isInWatchlist ? '#28a745' : '#007bff',
                color: 'white',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = item.movie.isInWatchlist
                  ? '#218838'
                  : '#0056b3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = item.movie.isInWatchlist
                  ? '#28a745'
                  : '#007bff';
              }}
            >
              {item.movie.isInWatchlist ? '✓ Watchlist' : '+ Watchlist'}
            </button>
            <button
              onClick={() => handleToggleLike(item.movie)}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderRadius: 6,
                background: item.movie.isLiked ? '#e74c3c' : '#ff6b6b',
                color: 'white',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = item.movie.isLiked
                  ? '#c0392b'
                  : '#e74c3c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = item.movie.isLiked
                  ? '#e74c3c'
                  : '#ff6b6b';
              }}
            >
              {item.movie.isLiked ? '❤️' : '🤍'} {item.movie.likes}
            </button>
            <button
              onClick={() => onShowComments(item.movie)}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderRadius: 6,
                background: '#6c757d',
                color: 'white',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5a6268';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#6c757d';
              }}
            >
              💬
            </button>
          </div>
        </div>
      ))}

      {newsfeedItems.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', padding: 20 }}>
          No activity yet. Start interacting with movies to see live updates!
        </div>
      )}
    </div>
  );
};

export default Newsfeed;
