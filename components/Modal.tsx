'use client';

import { Movie, IMAGE_BASE_URL, getGenres, Genre, getTrailer } from '@/lib/tmdb';
import { X, Play, Plus, ThumbsUp, Share2, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
}

export default function Modal({ isOpen, onClose, movie }: ModalProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [copied, setCopied] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailerNotFound, setTrailerNotFound] = useState(false);

  useEffect(() => {
    getGenres().then(setGenres);
  }, []);

  // Reset state when modal closes or movie changes
  useEffect(() => {
    setTrailerKey(null);
    setIsPlaying(false);
    setTrailerNotFound(false);
  }, [movie, isOpen]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const imageUrl = movie.backdrop_path || movie.poster_path 
    ? `${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`
    : `https://picsum.photos/seed/${movie.id}/1920/1080?blur=2`;

  const releaseDate = movie.release_date || movie.first_air_date;
  const matchPercentage = movie.vote_average ? Math.round(movie.vote_average * 10) : 0;

  const movieGenres = movie.genre_ids
    ? genres.filter((g) => movie.genre_ids.includes(g.id))
    : [];

  const handleShare = async () => {
    if (!movie) return;
    const url = `${window.location.origin}/title/${movie.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleWatchTrailer = async () => {
    if (!movie) return;
    setIsPlaying(true);
    setTrailerNotFound(false);
    
    const type = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
    const key = await getTrailer(movie.id, type);
    
    if (key) {
      setTrailerKey(key);
    } else {
      setTrailerNotFound(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-md bg-[#181818] shadow-2xl z-50 max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#181818] border-2 border-white/20 hover:border-white transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            <div className="relative pt-[56.25%] bg-black">
              {isPlaying && trailerKey ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <>
                  <Image
                    src={imageUrl}
                    alt={movie.title || movie.name || 'Movie poster'}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#181818] to-transparent" />
                  
                  {trailerNotFound && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                      <p className="text-white font-semibold text-lg bg-black/80 px-4 py-2 rounded">No trailer found for this title.</p>
                    </div>
                  )}

                  <div className="absolute bottom-10 left-10 flex items-center gap-4 z-20">
                    <button 
                      onClick={handleWatchTrailer}
                      className="flex items-center gap-2 rounded bg-white px-6 py-2 md:px-8 md:py-2 text-lg md:text-xl font-bold text-black transition hover:bg-[#e6e6e6]"
                    >
                      <Play className="h-6 w-6 md:h-7 md:w-7 fill-black" />
                      Watch Trailer
                    </button>
                    <button className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full border-2 border-white/40 bg-[#2a2a2a]/60 transition hover:border-white hover:bg-white/20">
                      <Plus className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </button>
                    <button className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full border-2 border-white/40 bg-[#2a2a2a]/60 transition hover:border-white hover:bg-white/20">
                      <ThumbsUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="group relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full border-2 border-white/40 bg-[#2a2a2a]/60 transition hover:border-white hover:bg-white/20"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                      ) : (
                        <Share2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      )}
                      {copied && (
                        <span className="absolute -top-10 rounded bg-black/80 px-2 py-1 text-xs text-white whitespace-nowrap">
                          Link copied!
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-6 md:px-10 md:py-8">
              <div className="flex gap-x-10 gap-y-6 flex-col md:flex-row">
                <div className="md:w-2/3">
                  <div className="flex items-center gap-x-2 text-sm mb-4">
                    <span className="font-semibold text-green-400">{matchPercentage}% Match</span>
                    <span className="font-light">{releaseDate?.substring(0, 4)}</span>
                    <span className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-[10px]">
                      HD
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{movie.title || movie.name || movie.original_name}</h2>
                  <p className="text-sm leading-relaxed text-white/90">
                    {movie.overview}
                  </p>
                </div>
                <div className="md:w-1/3 flex flex-col gap-4 text-sm">
                  <div className="flex flex-wrap items-start gap-1">
                    <span className="text-gray-400">Cast:</span>
                    <span className="text-white">Ensemble Cast, Various Artists</span>
                  </div>
                  
                  {movieGenres.length > 0 && (
                    <div className="flex flex-wrap items-start gap-1">
                      <span className="text-gray-400">Genres:</span>
                      {movieGenres.map((genre, index) => (
                        <Link 
                          key={genre.id} 
                          href={`/search?q=${encodeURIComponent(genre.name)}`} 
                          onClick={onClose}
                          className="text-white hover:underline"
                        >
                          {genre.name}{index < movieGenres.length - 1 ? ', ' : ''}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-start gap-1">
                    <span className="text-gray-400">Popularity:</span>
                    <span className="text-white">{Math.round(movie.popularity)}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-start gap-1">
                    <span className="text-gray-400">Total Votes:</span>
                    <span className="text-white">{movie.vote_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
