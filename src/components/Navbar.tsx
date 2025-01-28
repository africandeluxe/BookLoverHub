'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .textSearch('search_vector', query);

    if (error) {
      console.error('Error searching posts:', error);
    } else {
      setSearchResults(data);
    }

    setIsSearching(false);
  };

  const debouncedSearch = debounce(performSearch, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <header className="bg-greenLight text-white py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-3xl font-funnel">Book Lovers Hub</Link>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="flex items-center">
            <input type="text" placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2 py-1 text-black rounded"/>
            {searchQuery && (
              <button onClick={clearSearch} className="ml-2 text-white hover:text-gray-300">
                ✕
              </button>
            )}
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-10 right-0 bg-white text-black rounded shadow-lg z-50">
              {searchResults.map((post) => (
                <Link key={post.id} href={`/posts/${post.slug}`}
                  className="block px-4 py-2 hover:bg-gray-100">
                  {post.title}</Link>
              ))}
            </div>
          )}
          {isSearching && (
            <div className="absolute top-10 right-0 bg-white text-black rounded shadow-lg z-50 px-4 py-2">
              Searching...
            </div>
          )}
        </div>

        {user ? (
          <>
            <Link href="/create-post" className="text-white underline">Create Post</Link>
            <button onClick={handleLogout} className="bg-orange text-white py-2 px-4 rounded hover:bg-red-500">Logout</button></>
        ) : (
          <Link href="/auth" className="text-white underline">Login / Sign Up</Link>
        )}
      </div>
    </header>
  );
}