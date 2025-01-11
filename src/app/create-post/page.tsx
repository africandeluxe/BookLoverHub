'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';

export default function CreatePost() {
  const auth = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth?.user) {
      router.push('/auth');
    }
  }, [auth, router]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Both title and content are required!');
      return;
    }

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

    try {
      const { error: supabaseError } = await supabase.from('posts').insert([
        {
          title,
          content,
          slug,
          user_id: auth?.user?.id,
        },
      ]);

      if (supabaseError) {
        console.error('Supabase Error:', supabaseError.message);
        setError(`Error creating post: ${supabaseError.message}`);
      } else {
        setError('');
        router.push('/');
      }
    } catch (err: any) {
      console.error('Unexpected Error:', err.message);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-peach p-4">
      <h1 className="text-2xl font-funnel text-orange mb-6">Create a New Post</h1>
      <form onSubmit={handleCreatePost} className="w-full max-w-md bg-white p-6 rounded shadow-md space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required/>
        <textarea placeholder="Post Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded h-32" required/>
        <button type="submit" className="w-full py-2 px-4 bg-greenLight text-white rounded hover:bg-greenPale">
          Create Post
        </button>
      </form>
    </div>
  );
}