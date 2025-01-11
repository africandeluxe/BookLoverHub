'use client'

import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <header className="bg-greenLight text-white py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-3xl font-funnel">Book Lovers Hub</Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link href="/create-post" className="text-white underline">Create Post</Link>
            <button onClick={handleLogout} className="bg-orange text-white py-2 px-4 rounded hover:bg-red-500">Logout</button>
          </>
        ) : (
          <Link href="/auth" className="text-white underline">Login / Sign Up</Link>
        )}
      </div>
    </header>
  );
}