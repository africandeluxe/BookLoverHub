'use client'
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import { Session } from '@supabase/supabase-js';
interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  parent_comment_id: number | null;
  replies?: Comment[];
}
interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  user_id: string;
  image_url?: string;
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);

        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', resolvedParams.slug)
          .single();

        if (postError) {
          setError('Failed to load post.');
          return;
        }

        setPost(postData);

        const { data: commentData, error: commentError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postData.id);

        if (commentError) {
          setError('Failed to load comments.');
          return;
        }

        setComments(commentData || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      }
    };

    fetchData();
  }, [params]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl">{post.title}</h1>
      {post.image_url && <img src={post.image_url} alt={post.title} className="mt-4 w-full" />}
      <p className="mt-4">{post.content}</p>
      <div className="mt-8">
        <h2 className="text-xl">Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="mt-4">
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
}