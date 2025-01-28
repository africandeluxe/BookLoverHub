'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';

export default function CreatePost() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bucketName = 'post-images';

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  const handleImageUpload = async (file: File) => {
    if (!file) return null;

    console.log(`Starting upload to bucket: ${bucketName}`);

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5 MB.');
      return null;
    }

    try {
      const sanitizedFileName = file.name
        .replace(/[^a-zA-Z0-9.\-_]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      const filePath = `${Date.now()}-${sanitizedFileName}`;

      console.log(`Uploading file: ${file.name}, to path: ${filePath}`);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error.message);
        setError(`Failed to upload image: ${error.message}`);
        return null;
      }

      console.log('Image uploaded successfully:', data);

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      const publicUrl = publicUrlData?.publicUrl || null;

      if (!publicUrl) {
        console.error('Failed to generate public URL.');
        setError('Failed to generate public URL for the uploaded image.');
        return null;
      }

      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Unexpected error during upload:', err.message);
        setError('An unexpected error occurred while uploading the image.');
      }
      return null;
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Both title and content are required!');
      return;
    }

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile);
      if (!imageUrl) return;
    }

    console.log('User ID:', user?.id);

    try {
      console.log('Creating post...');
      const { data, error } = await supabase.from('posts').insert([
        {
          title,
          content,
          slug,
          user_id: user?.id,
          image_url: imageUrl,
        },
      ]);

      if (error) {
        console.error('Error creating post:', error.message);
        setError(`Error creating post: ${error.message}`);
      } else {
        console.log('Post created successfully:', data);
        router.push('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Unexpected Error:', err.message);
        setError(err.message);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-peach p-4">
      <h1 className="text-2xl font-funnel text-orange mb-6">Create a New Post</h1>
      <form onSubmit={handleCreatePost} className="w-full max-w-md bg-white p-6 rounded shadow-md space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required/>
        <textarea placeholder="Post Content" value={content}
          onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded h-32" required/>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded"/>
        <button type="submit"
          className="w-full py-2 px-4 bg-greenLight text-white rounded hover:bg-greenPale">Create Post</button>
      </form>
    </div>
  );
}