"use client"; // This makes the component a Client Component

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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

export default function SearchResults() {
  const searchParams = useSearchParams();
  const quote = searchParams ? searchParams.get('quote') : null; // Add a null check for searchParams

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
  const [matches, setMatches] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // error is now of type string or null
  const [selectedEpisode, setSelectedEpisode] = useState<string>(''); // For filtering by episode

  // Fetch episode list from the API when the component loads
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch('/api/episodes');
        if (!response.ok) throw new Error("Failed to fetch episodes");
        const data: Episode[] = await response.json(); // Explicitly cast the response to Episode[]
        setEpisodes(data);
        setFilteredEpisodes(data); // Initially set filteredEpisodes to all episodes
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

          // Split the content into lines
          const lines = content.split('\n');

          // Find lines that match the quote
          const lineMatches = lines
            .map((line, index) => {
              const regex = new RegExp(quote, "i"); // Case-insensitive search
              if (regex.test(line)) {
                return { line, lineNumber: index + 1 }; // Capture matching line and line number
              }
              return null;
            })
            .filter(Boolean) as Match[];

          if (lineMatches.length > 0) {
            results.push({
              ...episode,
              matches: lineMatches, // Add matches to the episode
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

  // Filter episodes based on selected episode
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedEpisode(selected);
    if (selected === '') {
      setFilteredEpisodes(episodes); // Show all episodes when no filter is selected
    } else {
      setFilteredEpisodes(episodes.filter((episode) => episode.title === selected));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-20 sm:p-20 font-sans flex">
      {/* Sidebar for Filters */}
      <aside className="w-64 bg-white shadow-md rounded-md p-6 mr-10">
        <h2 className="text-lg font-semibold mb-4">Filter by Episode</h2>
        <select
          value={selectedEpisode}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Episodes</option>
          {episodes.map((episode, index) => (
            <option key={index} value={episode.title}>
              {episode.title}
            </option>
          ))}
        </select>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-col gap-8 items-center sm:items-start w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Search Results for: <span className="text-blue-600">"{quote}"</span>
        </h1>

        {/* Loading or Error */}
        {loading && <p className="text-lg text-gray-600">Loading...</p>}
        {error && <p className="text-red-500 text-lg">Error: {error}</p>}

        {/* Results */}
        {!loading && matches.length > 0 ? (
          <ul className="w-full max-w-4xl space-y-6">
            {matches.map((episode, index) => (
              <li key={index} className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900">{episode.title}</h2>
                <ul className="mt-4 space-y-2">
                  {episode.matches?.map((match, matchIndex) => (
                    <li key={matchIndex} className="text-gray-700">
                      <span className="font-bold text-blue-500">Line {match.lineNumber}:</span> {match.line}
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
  );
}
