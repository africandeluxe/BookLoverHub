'use client';

import { useState } from 'react';
import { supabase } from '../../supabase';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      let response;
      if (isSignUp) {
        // Sign-up logic
        response = await supabase.auth.signUp({ email, password });
        if (response.error) {
          throw new Error(response.error.message);
        }
        alert('Sign-up successful! Check your email to verify your account.');
      } else {
        // Login logic
        response = await supabase.auth.signInWithPassword({ email, password });
        if (response.error) {
          throw new Error(response.error.message);
        }
        router.push('/'); // Redirect to home page after successful login
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Unexpected Error:', err.message);
        setError(err.message);
      } else {
        console.error('Unexpected Error:', err);
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-greenPale p-4">
      <h1 className="text-2xl font-funnel text-orange mb-6">
        {isSignUp ? 'Sign Up' : 'Login'}
      </h1>
      <form onSubmit={handleAuth} className="w-full max-w-sm bg-white p-6 rounded shadow-md space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading} // Disable button while loading
          className="w-full py-2 px-4 bg-greenLight text-white rounded hover:bg-greenPale disabled:opacity-50"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="text-sm text-blue-500 w-full text-center"
        >
          {isSignUp
            ? 'Already have an account? Login'
            : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
}