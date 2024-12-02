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


        {/* Usage Info Bubble */}
        <div className="w-full flex items-center gap-4 bg-blue-100 p-4 rounded-lg shadow-md">
          {/* Icon */}
          <div className="flex-shrink-0 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 18.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5z"
              />
            </svg>
          </div>

          {/* Text */}
          <p className="text-lg text-blue-800 leading-7">
            Flickpedia is a free to use tool created to help you find what epsiode your favorite scene is from! Simply
            enter a quote or word you remember and let us find your epsiode!
          </p>
        </div>

        {/* Container for Image and Form */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6 w-full">
          {/* Friends Picture */}
          <div className="flex-shrink-0">
            <Image
              src="/friends.jpg"
              alt="Friends Photo"
              width={150} // Adjust width for a smaller image
              height={100} // Adjust height proportionally
              className="object-contain"
              style={{ margin: 0, padding: 0 }}
            />
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full sm:w-auto">
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
        </div>


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