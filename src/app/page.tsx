"use client"; // This makes the component a Client Component

import { useState, useEffect } from "react";
import Fuse, { FuseResult } from "fuse.js";

export default function Home() {
  const [scripts, setScripts] = useState([]);
  const [results, setResults] = useState<FuseResult<any>[]>([]);
  const [quote, setQuote] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log("MongoDB URI:", process.env.MONGODB_URI);

        const response = await fetch('/api/episode/scripts');
        const data = await response.json();
        if (response.ok) {
          setScripts(data)
          console.log(data); // Log success message
        } else {
          console.error("Error connecting:", data.error); // Log error message
        }
      }
      catch(error){
        console.error("Fetch error:", error); // Log any fetch errors
      }
    };
    fetchData();
  }, []);


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

    const options = {
      includeScore: true,
      ignoreLocation: true,
      keys: ['script']
    }

    const fuse = new Fuse(scripts, options);
    
    const result = fuse.search(quote)
    setResults(result);
    console.log(results)
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
