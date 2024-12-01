"use client"; // This makes the component a Client Component

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Fuse from "fuse.js";
import { EpisodeInfo, getEpisodesInfoWithScript } from "@/db/actions/results";

// Function to highlight the searched word/phrase with yellow background
const highlightText = (text, highlight) => {
  if (!highlight) return text;
  const regex = new RegExp(`(${highlight})`, "gi"); // Case-insensitive matching
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <strong key={index} className="bg-[#f5eec9] text-[#822f12]">
        {part}
      </strong>
    ) : (
      part
    )
  );
};

// Learned about modals: https://www.dhiwise.com/post/a-comprehensive-guide-to-react-modals-everything-you-need-to-know
function Modal({ isOpen, onClose, transcript, searchTerm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl relative">
        {" "}
        {}
        {/* Close putton on the top right of the modal for ease of user */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Full Transcript</h2>
        <div className="overflow-y-auto max-h-[70vh]">
          <pre className="whitespace-pre-wrap break-words">
            {highlightText(transcript, searchTerm)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const quote = searchParams ? searchParams.get("quote") : null;

  const [scripts, setScripts] = useState<Script[]>([]);
  const [results, setResults] = useState<EpisodeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState(null); // Need this for display for the modal

  // Fetch scripts from the API when the component loads and perform search using Fuse.js
  useEffect(() => {
    const fetchDataAndSearch = async () => {
      try {
        const response = await fetch("/api/episode/scripts");
        const data = await response.json();
        if (response.ok) {
          setScripts(data); // Update the scripts state
          console.log("Fetched scripts: ", data);

          if (quote && data.length > 0) {
            // Use the fetched data directly
            const options = {
              includeScore: true,
              ignoreLocation: true,
              keys: ["script"],
            };

            const fuse = new Fuse(data, options); // Use data instead of scripts
            const result = fuse.search(quote);
            const episodes = await getEpisodesInfoWithScript(result);
            setResults(episodes);
            console.log("Search results:", episodes);
          }
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

    fetchDataAndSearch();
  }, [quote]); // Add quote as a dependency

  const getMatchingLines = (scriptText: string, targetQuote: string) => {
    // Split the transcript into lines and only show the line that has the searched term in it
    const lines = scriptText.split("\n");
    // Learned about the filter function: https://www.geeksforgeeks.org/filter-in-python/
    return lines.filter((line) =>
      line.toLowerCase().includes(targetQuote.toLowerCase())
    );
  };

  // Highlight the word/phrase that the user searched for
  const highlightMatchingText = (line: string, targetQuote: string) => {
    const regex = new RegExp(`(${targetQuote})`, "gi");
    return line.split(regex).map((part, index) =>
      part.toLowerCase() === targetQuote.toLowerCase() ? (
        <strong key={index} className="text-[#822f12]">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  // Open modal with full transcript
  const openModal = (transcript: string) => {
    setSelectedTranscript(transcript);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTranscript(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-8 sm:p-20 font-sans">
      <nav className="flex justify-start gap-4 mb-6">
        <Link
          href="/"
          className="px-4 py-2 bg-gray-100 hover:bg-[#822f12] text-gray-700 hover:text-white rounded-lg"
        >
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
              const matchingLines = getMatchingLines(result.script, quote);
              console.log("Matching lines: ", matchingLines);

              // If there are lines that match what the user inputed
              if (matchingLines.length > 0) {
                const { episode_name, show_name, season_num, episode_num } =
                  result;

                return (
                  // If the user clicks on a box, open up the modal with the full transcript displayed
                  <li
                    key={index}
                    className="bg-[#f5eec9] shadow-lg rounded-lg p-6 cursor-pointer"
                    onClick={() => openModal(result.script)}
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      {episode_name}
                    </h2>{" "}
                    {/* Smaller title */}
                    <h2 className="text-l font-normal text-gray-900">
                      {show_name}: Season {season_num}, Episode {episode_num}
                    </h2>
                    {matchingLines.map((line, lineIndex) => (
                      <p key={lineIndex} className="text-lg text-gray-700 mt-4">
                        {" "}
                        {/* Content text */}
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
          !loading &&
          !error && (
            <p className="text-gray-700 text-lg">
              No matches found for "{quote}".
            </p>
          )
        )}
      </main>

      <footer className="mt-16 w-full flex justify-center text-gray-500 text-sm">
        <p>Created by Flickpedia Team © 2024</p>
      </footer>

      {}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        transcript={selectedTranscript}
        searchTerm={quote}
      />
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
