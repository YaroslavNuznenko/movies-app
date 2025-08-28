import React from 'react';
import type { MovieThing } from '../pages/MoviesPage';
import MovieRow from './MovieRow';
import {
  FixedSizeList as List,
  type ListChildComponentProps,
} from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

type MoviesListProps = {
  movies: MovieThing[];
  searchQuery: string;
  setMovies: React.Dispatch<React.SetStateAction<MovieThing[]>>;
  toggleWatchlistFunction: (movie: MovieThing) => void;
  toggleLikeFunction: (movie: MovieThing) => void;
  showCommentsFunction: (movie: MovieThing) => void;
  shareMovieFunction: (movie: MovieThing) => void;
};

function useDebouncedValue<T>(value: T, delay = 400) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
const MovieList = ({
  movies,
  searchQuery: query,
  setMovies,
  toggleWatchlistFunction,
  toggleLikeFunction,
  showCommentsFunction,
  shareMovieFunction,
}: MoviesListProps) => {
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const searchQuery = useDebouncedValue(query, 400);
  const inFlight = React.useRef(false);
  const listRef = React.useRef<List>(null);

  React.useEffect(() => {
    inFlight.current = false;
    setMovies([]);
    setHasNextPage(true);
    listRef.current?.scrollTo(0);
    setCurrentPage(1);
  }, [searchQuery]);

  const isItemLoaded = (index: number) => !hasNextPage || index < movies.length;
  const itemCount = hasNextPage ? movies.length + 1 : movies.length;

  const loadMoreItems = React.useCallback(
    async (_start: number, _end: number) => {
      if (!hasNextPage || inFlight.current || searchQuery.length < 3) return;
      inFlight.current = true;

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=demo&query=${encodeURIComponent(searchQuery)}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_MOVIES_DB_API_KEY}`,
              accept: 'application/json',
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const mappedData = data.results.map((item: any) => ({
          id: item.id,
          title: item.title,
          poster_path: item.poster_path,
          rating: Math.floor(Math.random() * 5) + 1,
          likes: Math.floor(Math.random() * 1000) + 100,
          isLiked: false,
          isInWatchlist: false,
        }));
        const nextPage = currentPage + 1;

        setMovies((prev) => [...prev, ...mappedData]);

        setHasNextPage(nextPage <= data.total_pages);

        setCurrentPage(nextPage);
      } catch (e) {
        if ((e as any).name !== 'AbortError') {
          console.error(e);
          setHasNextPage(false);
        }
      } finally {
        inFlight.current = false;
      }
    },
    [hasNextPage, searchQuery, setMovies, currentPage]
  );

  const Item = ({ index, style }: ListChildComponentProps) => {
    if (!isItemLoaded(index)) {
      return (
        <div style={style}>{searchQuery.length > 2 ? 'Loading...' : ''}</div>
      );
    }

    const movieData = movies[index];
    return (
      <div style={style}>
        <MovieRow
          key={movieData.id}
          movieData={movieData}
          toggleWatchlistFunction={toggleWatchlistFunction}
          toggleLikeFunction={toggleLikeFunction}
          showCommentsFunction={showCommentsFunction}
          shareMovieFunction={shareMovieFunction}
        />
      </div>
    );
  };
  return (
    <InfiniteLoader
      key={searchQuery}
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      threshold={10}
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={600}
          width={420}
          itemCount={itemCount}
          itemSize={275}
          overscanCount={5}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
          onItemsRendered={onItemsRendered}
          ref={(node) => {
            (ref as any)(node);
            listRef.current = node;
          }}
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
};

export default MovieList;
