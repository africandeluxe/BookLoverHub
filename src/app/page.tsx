'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  user_id: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  useEffect(() => {
    const fetchSessionAndPosts = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError.message);
        return;
      }
      setSession(sessionData?.session);

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, title, content, slug, user_id');

      console.log('Fetched Posts:', postsData);
      if (postsError) {
        console.error('Error Fetching Posts:', postsError.message);
        setError('Error fetching posts.');
      } else {
        setPosts(postsData || []);
      }
    };

    fetchSessionAndPosts();
  }, []);

  const handleDeletePost = async (postId: number) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
        console.error('Error Deleting Post:', error.message);
        alert('Failed to delete the post.');
      } else {
        setPosts(posts.filter((post) => post.id !== postId));
        alert('Post deleted successfully.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Unexpected Error:', err.message);
        setError(err.message);
      } else {
        console.error('Unexpected Error:', err);
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-funnel text-greenLight">POSTS</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded bg-peach">
            <h2 className="text-lg font-noto font-bold">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mt-2 text-gray-700">{truncateText(post.content, 100)}</p>
            <Link href={`/posts/${post.slug}`} className="mt-2 text-blue-500 underline block">Read More</Link>
            {post.user_id === session?.user?.id && (
              <div className="mt-4 flex gap-4">
                <button onClick={() => router.push(`/posts/edit/${post.slug}`)} className="text-blue-500 underline">Edit</button>
                <button onClick={() => handleDeletePost(post.id)}className="text-red-500 underline">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}