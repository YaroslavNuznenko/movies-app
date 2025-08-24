import React from 'react';
import type { MovieThing } from '../pages/MoviesPage';
import MovieRow from './MovieRow';

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

const MovieListSlow = ({
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
  const abortRef = React.useRef<AbortController | null>(null);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  // Скидання списку при зміні запиту
  React.useEffect(() => {
    abortRef.current?.abort();
    inFlight.current = false;
    setMovies([]);
    setHasNextPage(true);
    setCurrentPage(1);
    if (containerRef.current)
      containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
  }, [searchQuery, setMovies]);

  const isItemLoaded = (index: number) => !hasNextPage || index < movies.length;
  const itemCount = hasNextPage ? movies.length + 1 : movies.length;

  const loadMoreItems = React.useCallback(
    async (_start: number, _end: number) => {
      if (!hasNextPage || inFlight.current || searchQuery.length < 3) return;
      inFlight.current = true;

      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=demo&query=${encodeURIComponent(
            searchQuery
          )}&page=${currentPage}`,
          {
            // signal: ac.signal,
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_MOVIES_DB_API_KEY}`,
              accept: 'application/json',
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const mappedData: MovieThing[] = data.results.map((item: any) => ({
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

  // Початкове завантаження для нового пошуку (щоб не чекати скрол)
  React.useEffect(() => {
    if (
      movies.length === 0 &&
      hasNextPage &&
      searchQuery.length >= 3 &&
      !inFlight.current
    ) {
      loadMoreItems(0, 1);
    }
  }, [movies.length, hasNextPage, searchQuery, loadMoreItems]);

  // Ініціалізація IntersectionObserver для "ледачого" підвантаження
  React.useEffect(() => {
    const rootEl = containerRef.current;
    const target = sentinelRef.current;
    if (!rootEl || !target) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // емулюємо поведінку InfiniteLoader: підвантажуємо наступну сторінку
          loadMoreItems(movies.length, movies.length + 1);
        }
      },
      {
        root: rootEl,
        // приблизний аналог threshold=10 елементів — "підтягуємо" заздалегідь
        rootMargin: '800px 0px',
        threshold: 0,
      }
    );

    obs.observe(target);
    return () => obs.disconnect();
  }, [loadMoreItems, movies.length]);

  return (
    <div
      ref={containerRef}
      style={{
        height: 600,
        width: 420,
        overflow: 'auto',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 20,
          padding: 10,
        }}
      >
        {movies.map((movieData) => (
          <MovieRow
            key={movieData.id}
            movieData={movieData}
            toggleWatchlistFunction={toggleWatchlistFunction}
            toggleLikeFunction={toggleLikeFunction}
            showCommentsFunction={showCommentsFunction}
            shareMovieFunction={shareMovieFunction}
          />
        ))}

        {/* "Loading" рядок замість останнього item у віртуалізації */}
        {!isItemLoaded(itemCount - 1) && (
          <div style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>
            Loading…
          </div>
        )}

        {/* Сентінел для IntersectionObserver */}
        {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}

        {!hasNextPage && movies.length > 0 && (
          <div style={{ padding: 12, textAlign: 'center', color: '#9ca3af' }}>
            No more results
          </div>
        )}

        {searchQuery.length > 0 &&
          searchQuery.length < 3 &&
          movies.length === 0 && (
            <div style={{ padding: 12, textAlign: 'center', color: '#9ca3af' }}>
              Type at least 3 characters…
            </div>
          )}
      </div>
    </div>
  );
};

export default MovieListSlow;
