"use client"; // This makes the component a Client Component

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link'; // Import Link for routing

// Define types for the episode and match structures
interface Match {
  line: string;
  lineNumber: number;
}

interface Episode {
  id: string;
  title: string;
  transcript: string;
  matches?: Match[];
}

// This component is the logic inside a Suspense boundary
function SearchResultsContent() {
  const searchParams = useSearchParams(); // Get the search parameters from the URL
  const quote = searchParams ? searchParams.get('quote') : null; // Get the 'quote' from search params

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
  const [matches, setMatches] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [selectedEpisode, setSelectedEpisode] = useState<string>(''); 

  // Fetch episode list from the API when the component loads
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch('/api/episodes');
        if (!response.ok) throw new Error("Failed to fetch episodes");
        const data: Episode[] = await response.json();
        setEpisodes(data);
        setFilteredEpisodes(data);
      } catch (err) {
        const errorMessage = (err instanceof Error) ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  useEffect(() => {
    const fetchAndSearchTranscripts = async () => {
      if (!quote || filteredEpisodes.length === 0) return;
      setLoading(true);
      const results: Episode[] = [];

      for (const episode of filteredEpisodes) {
        try {
          const response = await fetch(`/transcripts/${episode.transcript}`);
          if (!response.ok) throw new Error(`Failed to fetch transcript for ${episode.title}`);
          const content = await response.text();

          const lines = content.split('\n');
          const lineMatches = lines
            .map((line, index) => {
              const regex = new RegExp(quote, "i");
              if (regex.test(line)) {
                return { line, lineNumber: index + 1 };
              }
              return null;
            })
            .filter(Boolean) as Match[];

          if (lineMatches.length > 0) {
            results.push({
              ...episode,
              matches: lineMatches,
            });
          }
        } catch (error) {
          const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';
          console.error(`Failed to fetch transcript for ${episode.title}:`, errorMessage);
        }
      }

      setMatches(results);
      setLoading(false);
    };

    if (quote && filteredEpisodes.length > 0) {
      fetchAndSearchTranscripts();
    }
  }, [quote, filteredEpisodes]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedEpisode(selected);
    if (selected === '') {
      setFilteredEpisodes(episodes);
    } else {
      setFilteredEpisodes(episodes.filter((episode) => episode.title === selected));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-8 sm:p-20 font-sans">
      {/* Navigation Tabs */}
      <nav className="flex justify-start gap-4 mb-6">
        <Link href="/">
          <a className="px-4 py-2 bg-gray-100 hover:bg-[#822f12] text-gray-700 hover:text-white rounded-lg">
            Home
          </a>
        </Link>
        <Link href="#">
          <a className="px-4 py-2 bg-[#822f12] text-white rounded-lg">
            Search Results
          </a>
        </Link>
      </nav>

      {/* Content Section */}
      <div className="flex flex-1"> {/* This ensures the content takes up remaining space */}
        <aside className="w-64 bg-[#f5eec9] shadow-md rounded-md p-6 mr-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter by Episode</h2>
          <select
            value={selectedEpisode}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Episodes</option>
            {episodes.map((episode, index) => (
              <option key={index} value={episode.title}>
                {episode.title}
              </option>
            ))}
          </select>
        </aside>

        <main className="flex flex-col gap-8 items-center sm:items-start w-full">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Search Results for: <span className="text-[#822f12]">"{quote}"</span>
          </h1>

          {loading && <p className="text-lg text-gray-600">Loading...</p>}
          {error && <p className="text-red-500 text-lg">Error: {error}</p>}

          {!loading && matches.length > 0 ? (
            <ul className="w-full max-w-4xl space-y-6">
              {matches.map((episode, index) => (
                <li key={index} className="bg-[#f5eec9] shadow-lg rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900">{episode.title}</h2>
                  <ul className="mt-4 space-y-2">
                    {episode.matches?.map((match, matchIndex) => (
                      <li key={matchIndex} className="text-gray-700">
                        <span className="font-bold text-[#822f12]">Line {match.lineNumber}:</span> {match.line}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            !loading && !error && (
              <p className="text-gray-700 text-lg">No matches found for "{quote}".</p>
            )
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 w-full flex justify-center text-gray-500 text-sm">
        <p>Created by Flickpedia Team © 2024</p>
      </footer>
    </div>
  );
}

// This is the main exported component with Suspense boundary
export default function SearchResults() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      {/* The actual content wrapped in Suspense */}
      <SearchResultsContent />
    </Suspense>
  );
}
