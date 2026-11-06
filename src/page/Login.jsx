import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const err = {};
    if (email.trim() === '') err.email = 'Email wajib diisi';
    if (password.length < 6) err.password = 'Password minimal 6 karakter';
    setError(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    const pesan = await onLogin(email, password);
    setLoading(false);

    if (pesan) {
      setError({ umum: pesan });
      return;
    }

    navigate('/dashboard');
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-90px)] bg-gray-50 font-sans px-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Alamat Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            {error.email && <p className="text-red-500 text-xs mt-1 px-1">{error.email}</p>}
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            {error.password && <p className="text-red-500 text-xs mt-1 px-1">{error.password}</p>}
          </div>

          {error.umum && <p className="text-red-500 text-sm mb-4 text-center font-medium">{error.umum}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
            Gunakan akun kasir terdaftar:<br />
            <span className="font-medium text-gray-500">yunibaru@mail.com</span> / <span className="font-medium text-gray-500">password123</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
