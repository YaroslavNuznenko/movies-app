import { useState, useEffect, Profiler, useCallback } from 'react';
import { debounce } from 'throttle-debounce';
import MovieList from '../components/MovieList';
import ActivityFeed from '../components/ActivityFeed';
import Newsfeed from '../components/Newsfeed';
import getRandomImage from '../tools/getRandomImage';
import getRandomVideo from '../tools/getRandomVideo';

export interface MovieThing {
  id: number;
  title: string;
  poster_path: string;
  video_path: string;
  rating: number;
  likes: number;
  isLiked: boolean;
  isInWatchlist: boolean;
}

export interface NewsfeedItemThing {
  id: string;
  type: 'friend_watching' | 'trending';
  movie: MovieThing;
  friend?: string;
  action: string;
  timestamp: Date;
  avatar?: string;
}

const MovieSearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [defaultMoviesArray, setDefaultMoviesArray] = useState<MovieThing[]>(
    []
  );
  const [moviesArray, setMoviesArray] = useState<MovieThing[]>([]);
  const [errorFlag, setErrorFlag] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [movieDataCache, setMovieDataCache] = useState(
    new Array(200).fill(0).map((_, i) => ({ id: i, data: `item-${i}` }))
  );

  // useEffect(() => {
  //   setMovieDataCache((prev) => [
  //     ...prev,
  //     { id: Date.now(), data: 'new-item' },
  //   ]);
  // }, []);

  const searchMoviesFunction = async (searchQuery: string) => {
    setLoadingState(true);
    try {
      const apiResponse = await fetch(
        'https://api.themoviedb.org/3/search/movie?api_key=demo&query=demo' +
          searchQuery,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_MOVIES_DB_API_KEY}`,
            accept: 'application/json',
          },
        }
      );

      const responseData = await apiResponse.json();

      console.log('responseData', responseData);
      const enhancedMoviesArray: MovieThing[] = responseData.results
        .slice(0, 3)
        .map((movieData: any) => {
          // movieDataCache.forEach((item) =>
          //   setMovieDataCache((prev) => [
          //     ...prev,
          //     { id: item.id, data: `cache-${item.id}` },
          //   ])
          // );

          return {
            id: movieData.id,
            title: movieData.title,
            poster_path: getRandomImage(),
            video_path: getRandomVideo(),
            rating: Math.floor(Math.random() * 5) + 1,
            likes: Math.floor(Math.random() * 1000) + 100,
            isLiked: false,
            isInWatchlist: false,
          };
        });

      setDefaultMoviesArray(enhancedMoviesArray);
      setErrorFlag(false);
    } catch (error) {
      setErrorFlag(true);
    } finally {
      setLoadingState(false);
    }
  };
  useEffect(() => {
    if (searchQuery.length === 0) {
      setMoviesArray(defaultMoviesArray);
    }
  }, [defaultMoviesArray, searchQuery]);

  useEffect(() => {
    searchMoviesFunction(searchQuery);
  }, []);

  const toggleWatchlistFunction = (movieData: MovieThing) => {
    moviesArray.forEach((movie) => {
      if (movie.id === movieData.id) {
        movie.isInWatchlist = !movie.isInWatchlist;
      }
    });
    setMoviesArray([...moviesArray]);

    setMovieDataCache((prev) => [
      ...prev,
      { id: Date.now(), data: 'watchlist-update' },
    ]);
  };

  const toggleLikeFunction = (movieData: MovieThing) => {
    setMoviesArray((prevMovies) =>
      prevMovies.map((movieItem) => {
        if (movieItem.id === movieData.id) {
          const newLikesCount = movieItem.isLiked
            ? movieItem.likes - 1
            : movieItem.likes + 1;
          return {
            ...movieItem,
            isLiked: !movieItem.isLiked,
            likes: newLikesCount,
          };
        }
        return movieItem;
      })
    );
    setMovieDataCache((prev) => [
      ...prev,
      { id: Date.now(), data: 'like-update' },
    ]);
  };

  const showCommentsFunction = (movieData: MovieThing) => {
    console.log('Show comments for:', movieData.title);
  };

  const shareMovieFunction = (movieData: MovieThing) =>
    console.log('Share movie:', movieData.title);
  const playTrailerFunction = (movieData: MovieThing) =>
    console.log('Play trailer for:', movieData.title);

  const dynamicTitle = `Movie Search & Social Network`;

  return (
    <Profiler id="app-profiler" onRender={(...args) => {}}>
      <div
        style={{
          display: 'flex',
          fontFamily: 'sans-serif',
          maxWidth: 1800,
          margin: '0 auto',
          padding: 20,
        }}
      >
        <div style={{ flex: 2, marginRight: 20 }}>
          <h1>{dynamicTitle}</h1>

          <div style={{ marginBottom: 30 }}>
            <input
              style={{
                margin: 8,
                padding: 12,
                width: 400,
                fontSize: 16,
                border: '2px solid #ddd',
                borderRadius: 8,
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
            />
            {loadingState && (
              <span style={{ marginLeft: 10, color: '#666' }}>Loading...</span>
            )}
          </div>

          <MovieList
            searchQuery={searchQuery}
            movies={moviesArray}
            setMovies={setMoviesArray}
            toggleWatchlistFunction={toggleWatchlistFunction}
            toggleLikeFunction={toggleLikeFunction}
            showCommentsFunction={showCommentsFunction}
            shareMovieFunction={shareMovieFunction}
          />
          {errorFlag && (
            <div style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
              Failed to load movies
            </div>
          )}
        </div>

        <Newsfeed
          movies={moviesArray}
          onToggleWatchlist={toggleWatchlistFunction}
          onToggleLike={toggleLikeFunction}
          onShowComments={showCommentsFunction}
        />

        <div
          style={{
            flex: 1,
            background: '#ffe6e6',
            padding: 20,
            borderRadius: 12,
            height: 'fit-content',
            marginLeft: 20,
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#d32f2f',
            }}
          >
            Live Activity Feed
          </h2>
          <ActivityFeed />
        </div>
      </div>
    </Profiler>
  );
};

export default MovieSearchComponent;
