import { getMovieDetails, getCast, getTrailer, getGenres, IMAGE_BASE_URL } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, ThumbsUp, Check, Star, ArrowLeft } from 'lucide-react';
import AddToListButton from '@/components/AddToListButton';
import TrailerButton from '@/components/TrailerButton';

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  
  // We don't know the type for sure (movie or tv), so we'll try movie first.
  // Ideally, we'd pass the type in the URL, e.g., /title/[type]/[id]
  // For now, we'll assume movie, or we could try fetching both if one fails.
  const movie = await getMovieDetails(movieId, 'movie');
  
  if (!movie) {
    return (
      <main className="pt-32 px-4 md:px-10 min-h-screen bg-netflix-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Movie not found</h1>
        <Link href="/" className="text-netflix-red hover:underline">Return to Home</Link>
      </main>
    );
  }

  const [cast, trailer, allGenres] = await Promise.all([
    getCast(movieId, 'movie'),
    getTrailer(movieId, 'movie'),
    getGenres()
  ]);

  const movieGenres = allGenres.filter(genre => movie.genre_ids?.includes(genre.id));
  const releaseDate = movie.release_date || movie.first_air_date;
  // Use movie ID to generate a deterministic pseudo-random match percentage
  const matchPercentage = 80 + (movie.id % 20);

  return (
    <main className="min-h-screen bg-[#141414] text-white pb-20">
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <div className="absolute top-24 left-4 md:left-10 z-50">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </Link>
        </div>
        
        <Image
          src={movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : `https://picsum.photos/seed/${movie.id}/1920/1080?blur=2`}
          alt={movie.title || movie.name || 'Movie backdrop'}
          fill
          className="object-cover"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-10 pb-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-shadow-md">
            {movie.title || movie.name || movie.original_name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <button className="flex items-center gap-2 rounded bg-white px-6 py-2 md:px-8 md:py-3 text-sm md:text-lg font-semibold text-black transition hover:bg-opacity-80">
              <Play className="h-5 w-5 md:h-7 md:w-7 fill-black" />
              Play
            </button>
            {trailer && <TrailerButton trailerId={trailer} />}
            <AddToListButton movie={movie} />
            <button className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-white/40 bg-[#2a2a2a]/60 transition hover:border-white hover:bg-white/20">
              <ThumbsUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-10 max-w-7xl mx-auto mt-8">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-2/3">
            <div className="flex items-center gap-x-3 text-sm md:text-base mb-6">
              <span className="font-semibold text-green-400 text-lg">{matchPercentage}% Match</span>
              <span className="font-light">{releaseDate?.substring(0, 4)}</span>
              <span className="flex h-5 items-center justify-center rounded border border-white/40 px-2 text-xs">
                HD
              </span>
              <div className="flex items-center gap-1 ml-2 text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-bold text-white text-lg">{movie.vote_average?.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({movie.vote_count} votes)</span>
              </div>
            </div>
            
            <p className="text-base md:text-lg leading-relaxed text-white/90 mb-8">
              {movie.overview}
            </p>
          </div>
          
          <div className="md:w-1/3 flex flex-col gap-6 text-sm md:text-base">
            {movieGenres.length > 0 && (
              <div>
                <span className="text-gray-400 block mb-1">Genres</span>
                <div className="flex flex-wrap gap-2">
                  {movieGenres.map((genre) => (
                    <Link 
                      key={genre.id} 
                      href={`/search?q=${encodeURIComponent(genre.name)}`} 
                      className="text-white hover:underline bg-[#333] px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-gray-400 block mb-1">Popularity</span>
              <span className="text-white text-lg">{Math.round(movie.popularity)}</span>
            </div>
          </div>
        </div>

        {cast.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6 text-white">Cast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#2a2a2a] mb-3 border border-white/10">
                    {actor.profile_path ? (
                      <Image
                        src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-white line-clamp-1">{actor.name}</span>
                  <span className="text-xs text-gray-400 line-clamp-1 mt-1">{actor.character}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
