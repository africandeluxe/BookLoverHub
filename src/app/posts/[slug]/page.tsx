'use client'

import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import { use } from 'react';
import { Session } from '@supabase/supabase-js';
interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
}
interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  user_id: string;
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error Fetching Session:', sessionError.message);
        } else {
          setSession(sessionData?.session);
        }

        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (postError) {
          console.error('Error Fetching Post:', postError.message);
          setError('Failed to load post.');
        } else {
          setPost(postData);
          fetchComments(postData.id);
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

    const fetchComments = async (postId: number) => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId);

        if (error) {
          console.error('Error Fetching Comments:', error.message);
        } else {
          setComments(data || []);
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

    fetchSessionAndData();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const userId = session?.user?.id;
      if (!userId || !post?.id) {
        alert('You need to be logged in to comment.');
        return;
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([{ content: commentText, post_id: post.id, user_id: userId }])
        .select();

      if (error) {
        console.error('Error Adding Comment:', error.message);
        alert('Failed to add comment. Please try again.');
      } else if (data) {
        setComments([...comments, data[0]]);
        setCommentText('');
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

  const handleDeleteComment = async (commentId: number) => {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);

      if (error) {
        console.error('Error Deleting Comment:', error.message);
      } else {
        setComments(comments.filter((comment) => comment.id !== commentId));
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

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 bg-greenPale min-h-screen">
      <h1 className="text-2xl font-funnel text-greenDark">{post.title}</h1>
      <p className="mt-4 text-lg font-noto">{post.content}</p>

      <div className="mt-8 p-4 border rounded bg-white">
        <h2 className="text-xl font-funnel text-greenDark">Comments</h2>

        {session ? (
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" className="w-full p-2 border rounded"></textarea>
            <button type="submit" className="mt-2 px-4 py-2 bg-greenLight text-white rounded">Submit Comment</button>
          </form>
        ) : (
          <p className="mt-4 text-gray-500">You must be logged in to comment.</p>
        )}

        {comments.length > 0 ? (
          <ul className="mt-4">
            {comments.map((comment) => (
              <li key={comment.id} className="mt-2 border-b pb-2 flex flex-col">
                <span>{comment.content}</span>
                <small className="text-gray-500">
                  {`By User: ${comment.user_id}, at ${new Date(comment.created_at).toLocaleString()}`}
                </small>
                {(comment.user_id === session?.user?.id || post.user_id === session?.user?.id) && (
                  <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 text-sm mt-2">Delete</button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
}