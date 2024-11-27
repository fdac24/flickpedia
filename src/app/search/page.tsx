"use client"; // This makes the component a Client Component

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import Fuse, { FuseResult } from "fuse.js";

interface Script {
  script: string;
  episodeTitle: string;
  episodeId: string;
}

const getTitleFromScript = (scriptText: string) => {
  // Extract the first line (title) of the script
  return scriptText.split('\n')[0].trim();
};

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const quote = searchParams ? searchParams.get('quote') : null;

  const [scripts, setScripts] = useState<Script[]>([]);
  const [results, setResults] = useState<FuseResult<Script>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch scripts from the API when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/episode/scripts');
        const data = await response.json();
        if (response.ok) {
          setScripts(data);
          console.log("Fetched scripts: ", data);
        } else {
          console.error("Error connecting: ", data.error);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch scripts");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Perform search using Fuse.js
  useEffect(() => {
    if (quote && scripts.length > 0) {
      const options = {
        includeScore: true,
        ignoreLocation: true,
        keys: ['script']
      };

      const fuse = new Fuse(scripts, options);
      const result = fuse.search(quote);
      setResults(result);
      console.log("Search results:", result);
    }
  }, [quote, scripts]);

  const getMatchingLines = (scriptText: string, targetQuote: string) => {
    const lines = scriptText.split('\n');
    return lines.filter(line => line.toLowerCase().includes(targetQuote.toLowerCase()));
  };

  // Highlight the word/phrase that the user searched for
  const highlightMatchingText = (line: string, targetQuote: string) => {
    const regex = new RegExp(`(${targetQuote})`, 'gi');
    return line.split(regex).map((part, index) =>
      part.toLowerCase() === targetQuote.toLowerCase() ? <strong key={index} className="text-[#822f12]">{part}</strong> : part
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-8 sm:p-20 font-sans">
      <nav className="flex justify-start gap-4 mb-6">
        <Link href="/" className="px-4 py-2 bg-gray-100 hover:bg-[#822f12] text-gray-700 hover:text-white rounded-lg">
          Home
        </Link>
        <Link href="#" className="px-4 py-2 bg-[#822f12] text-white rounded-lg">
          Search Results
        </Link>
      </nav>

      <main className="flex flex-col gap-8 items-center sm:items-start w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Search Results for: <span className="text-[#822f12]">"{quote}"</span>
        </h1>

        {loading && <p className="text-lg text-gray-600">Loading...</p>}
        {error && <p className="text-red-500 text-lg">Error: {error}</p>}

        {!loading && results.length > 0 ? (
          <ul className="w-full max-w-4xl space-y-6">
            {results.map((result, index) => {
              const matchingLines = getMatchingLines(result.item.script, quote);

              // If there are lines that match what the user inputed
              if (matchingLines.length > 0) {
                const title = getTitleFromScript(result.item.script); // Get the title for each transcript

                return (
                  <li key={index} className="bg-[#f5eec9] shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2> {/* Smaller title */}
                    {matchingLines.map((line, lineIndex) => (
                      <p key={lineIndex} className="text-lg text-gray-700 mt-4"> {/* Content text */}
                        {highlightMatchingText(line, quote)}
                      </p>
                    ))}
                  </li>
                );
              }

              return null; // Does not show anything if there are no matching lines
            })}
          </ul>
        ) : (
          !loading && !error && (
            <p className="text-gray-700 text-lg">No matches found for "{quote}".</p>
          )
        )}
      </main>

      <footer className="mt-16 w-full flex justify-center text-gray-500 text-sm">
        <p>Created by Flickpedia Team © 2024</p>
      </footer>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}