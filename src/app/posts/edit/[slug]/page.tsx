'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../../../../supabase';
import { useRouter } from 'next/navigation';

export default function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { slug } = await params;

        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error Fetching Post:', error.message);
          setError('Failed to load post. Please try again.');
        } else {
          setPost(data);
          setTitle(data.title);
          setContent(data.content);
        }
      } catch (err) {
        console.error('Unexpected Error:', err.message);
        setError('An unexpected error occurred while loading the post.');
      }
    };

    fetchPost();
  }, [params]);

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required!');
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('posts')
        .update({ title, content })
        .eq('id', post.id)
        .select();

      if (error) {
        console.error('Error Updating Post:', error.message);
        setError('Failed to update the post. Please try again.');
      } else {
        setError('');
        alert('Post updated successfully!');
        router.push('/');
      }
    } catch (err: unknown) {
      console.error('Unexpected Error:', err.message);
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 bg-peach min-h-screen">
      <h1 className="text-2xl font-funnel text-greenDark mb-4">Edit Post</h1>
      <form onSubmit={handleUpdatePost} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg font-funnel">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required/>
        </div>
        <div>
          <label htmlFor="content" className="block text-lg font-funnel">Content</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded h-32" required></textarea>
        </div>
        <button type="submit" className={`w-full py-2 px-4 text-white rounded
          ${
            isSubmitting ? 'bg-gray-400' : 'bg-greenLight hover:bg-greenDark'
          }`} 
          disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}