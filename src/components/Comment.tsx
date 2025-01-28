'use client'
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';


interface CommentProps {
  comment: Comment;
  session: Session | null;
  postUserId: string;
  onDeleteComment: (commentId: number) => void;
  onReply: (parentCommentId: number) => void;
}

const Comment = ({ comment, session, postUserId, onDeleteComment, onReply }: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReply(comment.id);
    setIsReplying(false);
    setReplyText('');
  };

  return (
    <div className="mt-2 border-b pb-2 flex flex-col">
      <span>{comment.content}</span>
      <small className="text-gray-500">
        {`By User: ${comment.user_id}, at ${new Date(comment.created_at).toLocaleString()}`}</small>
      {(comment.user_id === session?.user?.id || postUserId === session?.user?.id) && (
        <button onClick={() => onDeleteComment(comment.id)} className="text-red-500 text-sm mt-2">Delete</button>
      )}
      <button onClick={() => setIsReplying(!isReplying)} className="text-blue-500 text-sm mt-2">Reply</button>
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="mt-2">
          <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." className="w-full p-2 border rounded"/>
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Submit Reply</button>
        </form>
      )}

      {comment.replies?.map((reply) => (
        <div key={reply.id} className="ml-4">
          <Comment comment={reply} session={session} postUserId={postUserId} onDeleteComment={onDeleteComment}
            onReply={onReply}/>
        </div>
      ))}
    </div>
  );
};

export default Comment;