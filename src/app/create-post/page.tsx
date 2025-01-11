'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';

export default function CreatePost() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required!');
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^a-z0-9-]/g, '');

    try {
      setIsSubmitting(true);
      const { data, error: supabaseError } = await supabase.from('posts').insert([
        {
          title,
          content,
          slug,
          user_id: user.id,
        },
      ]);

      if (supabaseError) {
        console.error('Supabase Error:', supabaseError.message);
        setError(`Error creating post: ${supabaseError.message}`);
      } else {
        console.log('Post Created:', data);
        setError('');
        setTitle('');
        setContent('');
        router.push('/');
      }
    } catch (err: any) {
      console.error('Unexpected Error:', err.message);
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-peach p-4">
      <h1 className="text-2xl font-funnel text-orange mb-6">Create a New Post</h1>
      <form onSubmit={handleCreatePost} className="w-full max-w-md bg-white p-6 rounded shadow-md space-y-4">
        {error && <p className="text-red-500 text-sm font-noto">{error}</p>}
        <input type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" disabled={isSubmitting} required/>
        <textarea placeholder="Post Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded h-32" disabled={isSubmitting} required/>
        <button type="submit" className={`w-full py-2 px-4 rounded 
          ${
            isSubmitting
              ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
              : 'bg-greenLight text-white hover:bg-greenPale'
          }`} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}