import Banner from '@/components/Banner';
import Row from '@/components/Row';
import {
  getNetflixOriginals,
  getTrending,
  getTopRated,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getDocumentaries,
} from '@/lib/tmdb';

export default async function Home() {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    getNetflixOriginals(),
    getTrending(),
    getTopRated(),
    getActionMovies(),
    getComedyMovies(),
    getHorrorMovies(),
    getRomanceMovies(),
    getDocumentaries(),
  ]);

  return (
    <main className="relative h-screen bg-gradient-to-b from-transparent to-netflix-black lg:h-[140vh]">
      <Banner netflixOriginals={netflixOriginals} />
      
      <section className="md:space-y-12 pb-24">
        <Row title="Netflix Originals" movies={netflixOriginals} isLargeRow />
        <Row title="Trending Now" movies={trendingNow} />
        <Row title="Top Rated" movies={topRated} />
        <Row title="Action Thrillers" movies={actionMovies} />
        <Row title="Comedies" movies={comedyMovies} />
        <Row title="Scary Movies" movies={horrorMovies} />
        <Row title="Romance Movies" movies={romanceMovies} />
        <Row title="Documentaries" movies={documentaries} />
      </section>
    </main>
  );
}
