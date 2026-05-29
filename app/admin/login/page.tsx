'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Leaf } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) { router.push('/admin'); }
    else { setError('Invalid username or password.'); }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: '#f9fbfd',
        backgroundImage: `radial-gradient(circle at 1px 1px, #d1d9e6 1px, transparent 0)`,
        backgroundSize: '28px 28px',
      }}
    >
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card header stripe */}
          <div
            className="h-1.5 w-full"
            style={{ background: 'linear-gradient(90deg, #152e4d, #5741a8)' }}
          />

          <div className="px-8 py-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(195deg, #152e4d, #5741a8)' }}
              >
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight font-heading">Green BD Admin</p>
                <p className="text-gray-400 text-xs">Management Login</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-100 rounded-lg px-3 py-2.5 text-xs mb-5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  placeholder="Enter username"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    placeholder="Enter password"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 mt-2"
                style={{ backgroundColor: '#2c7be5' }}
              >
                {loading ? 'Signing in…' : 'Login'}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
              Default: <span className="font-mono text-gray-600">admin / greenbd2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
