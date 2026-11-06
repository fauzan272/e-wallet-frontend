import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const err = {};
    if (username.trim() === '') err.username = 'Username wajib diisi';
    if (email.trim() === '') err.email = 'Email wajib diisi';
    if (phoneNumber.trim() === '') err.phoneNumber = 'Nomor telepon wajib diisi';
    if (password.length < 8) err.password = 'Password minimal 8 karakter';
    
    setError(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    // onRegister adalah fungsi props yang nanti ditembak ke API backend register
    const pesan = await onRegister(username, email, phoneNumber, password);
    setLoading(false);

    if (pesan) {
      setError({ umum: pesan });
      return;
    }

    // Alihkan ke halaman login setelah pendaftaran berhasil
    navigate('/login');
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-90px)] bg-gray-50 font-sans px-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h1>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            {error.username && <p className="text-red-500 text-xs mt-1 px-1">{error.username}</p>}
          </div>

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
              type="text"
              placeholder="Nomor Telepon"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            {error.phoneNumber && <p className="text-red-500 text-xs mt-1 px-1">{error.phoneNumber}</p>}
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password (Min. 8 Karakter)"
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
            {loading ? 'Memproses...' : 'Daftar Akun'}
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default Register;
