import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-[100dvh] bg-[#F8F7F4] flex items-center justify-center px-5"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="w-full max-w-sm">
        <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold bg-violet-100 text-violet-700 ring-1 ring-violet-200">
          Admin
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] text-[#111]">Sign in</h1>
        <p className="mt-2 text-sm text-[#999]">Norwegian Language Coach dashboard</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#aaa]">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 border-[#ddd] bg-white focus-visible:ring-violet-400"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#aaa]">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5 border-[#ddd] bg-white focus-visible:ring-violet-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
