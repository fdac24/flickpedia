"use client"; // This makes the component a Client Component

import { useState } from "react";
import Fuse from "fuse.js"


const list = [
  {
    "Year_of_prod": 1994,
    "Season": 1,
    "Episode_Title": "The One with the Sonogram at the End",
    "Duration": 22,
    "Summary": "Ross finds out his ex-wife is pregnant. Rachel returns her engagement ring to Barry. Monica becomes stressed when her and Ross's parents come to visit.",
    "Director": "James Burrows",
    "Stars": 8.1,
    "Votes": 4888
  },
  {
    "Year_of_prod": 1994,
    "Season": 1,
    "Episode_Title": "The One with the Thumb",
    "Duration": 22,
    "Summary": "Monica becomes irritated when everyone likes her new boyfriend more than she does. Chandler resumes his smoking habit. Phoebe is given $7000 when she finds a thumb in a can of soda.",
    "Director": "James Burrows",
    "Stars": 8.2,
    "Votes": 4605
  }
];

const options = {
  includeScore: true,
  keys: ["Episode_Title", "Summary"]
}

export default function Home() {
  const [quote, setQuote] = useState('');
  const [error, setError] = useState('');

  // Add the correct type for the event parameter 'e'
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (quote.trim() === '') {
      setError('Please enter a quote to search.');
      return;
    }

    // This is where the search logic would go (API call or client-side logic).
    console.log("Searching for quote:", quote);
    const fuse = new Fuse(list, options)

    const result = fuse.search(quote)
    console.log(result)
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Flickpedia - Search Friends Quotes</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter a quote..."
            className="border border-gray-300 p-2 rounded-md w-64"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </form>
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
        
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>Created by Flickpedia Team © 2024</p>
      </footer>
    </div>
  );
}
