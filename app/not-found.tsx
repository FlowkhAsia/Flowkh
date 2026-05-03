import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-netflix-black text-center text-white">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-8 text-2xl font-semibold">Page Not Found</h2>
      <p className="mb-8 text-lg text-gray-400">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        href="/"
        className="rounded bg-white px-8 py-3 font-semibold text-black transition hover:bg-opacity-80"
      >
        Go Home
      </Link>
    </div>
  );
}
