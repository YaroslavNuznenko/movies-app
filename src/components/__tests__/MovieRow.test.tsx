import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieRow from '../MovieRow';
import type { MovieThing } from '../../pages/MoviesPage';

// Sample movie data for testing
const mockMovieData: MovieThing = {
  id: 1,
  title: 'Test Movie',
  poster_path: 'https://picsum.photos/300/200?random=1',
  video_path: 'https://www.w3schools.com/html/mov_bbb.mp4',
  rating: 4,
  likes: 150,
  isLiked: false,
  isInWatchlist: false,
};

// Mock functions for props
const mockToggleWatchlistFunction = jest.fn();
const mockToggleLikeFunction = jest.fn();
const mockShowCommentsFunction = jest.fn();
const mockShareMovieFunction = jest.fn();

// Default props for testing
const defaultProps = {
  movieData: mockMovieData,
  toggleWatchlistFunction: mockToggleWatchlistFunction,
  toggleLikeFunction: mockToggleLikeFunction,
  showCommentsFunction: mockShowCommentsFunction,
  shareMovieFunction: mockShareMovieFunction,
};

describe('MovieRow Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders movie information correctly', () => {
    render(<MovieRow {...defaultProps} />);

    // Check if movie title is displayed
    expect(screen.getByText('Test Movie')).toBeInTheDocument();

    // Check if rating stars are displayed
    expect(screen.getByText('⭐⭐⭐⭐☆')).toBeInTheDocument();

    // Check if likes count is displayed
    expect(screen.getByText('🤍 150')).toBeInTheDocument();

    // Check if all buttons are present
    expect(screen.getByText('+ Watchlist')).toBeInTheDocument();
    expect(screen.getByText('💬')).toBeInTheDocument();
    expect(screen.getByText('📤')).toBeInTheDocument();
  });

  it('renders movie poster image correctly', () => {
    render(<MovieRow {...defaultProps} />);

    const posterImage = screen.getByAltText('Test Movie');
    expect(posterImage).toBeInTheDocument();
    expect(posterImage).toHaveAttribute('src', mockMovieData.poster_path);
  });

  it('calls functions when buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<MovieRow {...defaultProps} />);

    // Click watchlist button
    const watchlistButton = screen.getByText('+ Watchlist');
    await user.click(watchlistButton);
    expect(mockToggleWatchlistFunction).toHaveBeenCalledWith(mockMovieData);

    // Click like button
    const likeButton = screen.getByText('🤍 150');
    await user.click(likeButton);
    expect(mockToggleLikeFunction).toHaveBeenCalledWith(mockMovieData);

    // Click comments button
    const commentsButton = screen.getByText('💬');
    await user.click(commentsButton);
    expect(mockShowCommentsFunction).toHaveBeenCalledWith(mockMovieData);

    // Click share button
    const shareButton = screen.getByText('📤');
    await user.click(shareButton);
    expect(mockShareMovieFunction).toHaveBeenCalledWith(mockMovieData);
  });

  it('displays correct button text based on movie state', () => {
    const likedMovie = {
      ...mockMovieData,
      isLiked: true,
      isInWatchlist: true,
    };

    render(<MovieRow {...defaultProps} movieData={likedMovie} />);

    // Check if watchlist button shows correct state
    expect(screen.getByText('✓ Watchlist')).toBeInTheDocument();

    // Check if like button shows correct state
    expect(screen.getByText('❤️ 150')).toBeInTheDocument();
  });
});
