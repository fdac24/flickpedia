"use client"; // This makes the component a Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function Home() {
  const [quote, setQuote] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (quote.trim() === '') {
      setError('Please enter a quote to search.');
      return;
    }

    // Redirect to the search results page with the quote as a query parameter
    router.push(`/search?quote=${encodeURIComponent(quote)}`);
  };

  return (
    <div className="min-h-screen bg-white p-8 pb-20 sm:p-20 font-sans flex flex-col items-center">
      <main className="flex flex-col gap-8 items-center w-full max-w-2xl">
        
        {/* Logo Section */}
        <div className="w-full flex justify-center mb-6">
          <Image
            src="/Flickpedia-logo.png"
            alt="Flickpedia Logo"
            width={1000}
            height={110}
            className="object-contain"
            style={{ margin: 0, padding: 0 }}
          />
        </div>

        {/* Blurb in Yellow Box */}
        <div className="w-full bg-[#f5eec9] p-6 rounded-lg shadow-md">
          <p className="text-lg text-gray-700 leading-7 text-center">
            Flickpedia helps you remember episodes from your favorite TV shows
            using quotes you remember! Simply enter a quote or a phrase, and we 
            will show you which episode it came from, along with other
            matching quotes. Start your search below and relive your favorite moments!
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter a quote..."
            className="border border-gray-300 p-4 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 w-full sm:w-96 transition ease-in-out duration-200"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#822f12] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6b2410] transition duration-300 w-full sm:w-96 shadow-lg"
          >
            Search
          </button>
        </form>

        {/* Error Handling */}
        {error && <p className="text-red-500 text-lg mt-2">{error}</p>}
      </main>

      {/* Footer */}
      <footer className="mt-16 w-full flex justify-center text-gray-500 text-sm">
        <p>Created by Flickpedia Team © 2024</p>
      </footer>
    </div>
  );
}