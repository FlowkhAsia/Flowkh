'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '@/lib/tmdb';

interface MyListContextType {
  myList: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (movieId: number) => void;
  isInList: (movieId: number) => boolean;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export function MyListProvider({ children }: { children: ReactNode }) {
  const [myList, setMyList] = useState<Movie[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedList = localStorage.getItem('myList');
    if (savedList) {
      try {
        setMyList(JSON.parse(savedList));
      } catch (error) {
        console.error('Failed to parse myList from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('myList', JSON.stringify(myList));
    }
  }, [myList, isMounted]);

  const addMovie = (movie: Movie) => {
    setMyList((prev) => {
      if (!prev.find((m) => m.id === movie.id)) {
        return [...prev, movie];
      }
      return prev;
    });
  };

  const removeMovie = (movieId: number) => {
    setMyList((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isInList = (movieId: number) => {
    return myList.some((m) => m.id === movieId);
  };

  return (
    <MyListContext.Provider value={{ myList, addMovie, removeMovie, isInList }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const context = useContext(MyListContext);
  if (context === undefined) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
}
