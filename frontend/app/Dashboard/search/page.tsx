// app/Dashboard/search/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchGames } from '../../services/searchService';
// import GameCard from '@/components/GameCard';
// import BacklogCard from '@/components/BacklogCard';

// export default function SearchResultsPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get('q') || '';
  
//   const [results, setResults] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   useEffect(() => {
//     async function fetchResults() {
//       if (!query) {
//         setResults([]);
//         setLoading(false);
//         return;
//       }
      
//       try {
//         setLoading(true);
//         const searchResults = await searchGames(query);
//         setResults(searchResults);
//         setError(null);
//       } catch (err) {
//         setError('Error searching for games. Please try again.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
    
//     fetchResults();
//   }, [query]);
  
//   // Separate results into library games and backlog games
//   const libraryGames = results.filter(game => 'status' in game);
//   const backlogGames = results.filter(game => 'priority' in game);
  
//   // Handlers

const page = () => {
    return (
      <div>
        Hello from Page
      </div>
    )
  }
  
  export default page
  