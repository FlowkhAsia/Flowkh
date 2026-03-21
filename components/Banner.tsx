'use client';

import { Movie, IMAGE_BASE_URL } from '@/lib/tmdb';
import Image from 'next/image';
import { Play, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import Modal from './Modal';

interface BannerProps {
  netflixOriginals: Movie[];
}

export default function Banner({ netflixOriginals }: BannerProps) {
  const [showModal, setShowModal] = useState(false);
  const movie = netflixOriginals?.[0];

  if (!movie) return <div className="h-[65vh] lg:h-[85vh] bg-netflix-black" />;

  const imageUrl = movie.backdrop_path || movie.poster_path 
    ? `${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`
    : `https://picsum.photos/seed/${movie.id}/1920/1080?blur=2`;

  return (
    <>
      <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[85vh] lg:justify-end lg:pb-12">
        <div className="absolute top-0 left-0 -z-10 h-[95vh] w-full">
          <Image
            src={imageUrl}
            alt={movie.title || movie.name || 'Banner Image'}
            fill
            priority
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-netflix-black to-transparent" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="px-4 md:px-10 z-10 max-w-2xl"
        >
          <h1 className="text-2xl font-bold md:text-4xl lg:text-7xl text-shadow-md">
            {movie.title || movie.name || movie.original_name}
          </h1>
          
          <p className="max-w-xs text-xs text-shadow-md md:max-w-lg md:text-lg lg:max-w-2xl lg:text-xl mt-4 line-clamp-3">
            {movie.overview}
          </p>

          <div className="flex space-x-3 mt-6">
            <button className="flex items-center gap-2 rounded bg-white px-5 py-1.5 text-sm font-semibold text-black transition hover:bg-opacity-80 md:px-8 md:py-2.5 md:text-xl">
              <Play className="h-5 w-5 md:h-7 md:w-7 fill-black" />
              Play
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded bg-[gray]/70 px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-opacity-80 md:px-8 md:py-2.5 md:text-xl"
            >
              <Info className="h-5 w-5 md:h-7 md:w-7" />
              More Info
            </button>
          </div>
        </motion.div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} movie={movie} />
    </>
  );
}
