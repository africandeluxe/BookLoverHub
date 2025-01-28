'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .textSearch('search_vector', query);

      if (error) {
        console.error('Error searching posts:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
      }
    } catch (error) {
      console.error('Unexpected error during search:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
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
    <header className="bg-greenLight text-white py-4 px-6">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-3xl font-funnel">
          Book Lovers Hub
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white text-2xl focus:outline-none">☰</button>
        <nav
          className={`${
            menuOpen ? 'block' : 'hidden'
          } lg:flex lg:items-center lg:space-x-4 lg:static absolute bg-greenLight w-full lg:w-auto top-full left-0 z-50`}
        >
          <div className="relative lg:mr-4">
            <div className="flex items-center">
              <input type="text" placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="px-2 py-1 text-black rounded lg:w-64"/>
              {searchQuery && (
                <button onClick={clearSearch}
                  className="ml-2 text-white hover:text-gray-300">✕</button>
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-10 right-0 bg-white text-black rounded shadow-lg z-50 w-64">
                {searchResults.map((post) => (
                  <Link key={post.id} href={`/posts/${post.slug}`}
                    className="block px-4 py-2 hover:bg-gray-100">{post.title}</Link>
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
              <Link href="/create-post"
                className="block lg:inline text-white underline mt-2 lg:mt-0">Create Post</Link>
              <button onClick={handleLogout}
                className="block lg:inline bg-orange text-white py-2 px-4 rounded hover:bg-red-500 mt-2 lg:mt-0">Logout
              </button>
            </>
          ) : (
            <Link href="/auth"
              className="block lg:inline text-white underline mt-2 lg:mt-0">Login / Sign Up</Link>
          )}
        </nav>
      </div>
    </header>
  );
}