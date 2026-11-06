import './App.css';
import Navbar from './page/Navbar';
import Dashboard from './page/Dashboard';
import Login from './page/Login';
import Register from './page/Register';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useState } from 'react';
import useFetch from './hooks/useFetch.js';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const { post } = useFetch();

  /**
   * Fungsi Login
   * Mengirim kredensial ke backend dan menyimpan data sesi user
   */
  async function login(email, password) {
    try {
      const res = await post('/auth/login', { email, password });

      if (!res || res.success === false) {
        return res?.message || 'Email atau password salah';
      }

      const loginData = res.data;
      
      const userData = {
        id: loginData.user.id,
        username: loginData.user.username,
        email: loginData.user.email,
        phone_number: loginData.user.phone_number,
        token: loginData.token
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', loginData.token);
      return null;

    } catch (err) {
      return err?.message || 'Gagal terhubung ke server backend';
    }
  }

  /**
   * Fungsi Register
   * Menangani pembuatan akun baru dan pembuatan dompet otomatis melalui backend
   */
  async function register(username, email, phone_number, password) {
    try {
      const res = await post('/auth/register', { username, email, phone_number, password });

      if (!res || res.success === false) {
        return res?.message || 'Pendaftaran gagal. Silakan periksa kembali data Anda.';
      }

      return null; // Mengembalikan null jika sukses agar diarahkan ke halaman login

    } catch (err) {
      return err?.message || 'Gagal terhubung ke server backend';
    }
  }

  /**
   * Fungsi Logout
   * Membersihkan seluruh data sesi lokal pengguna
   */
  function logout() {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return (
    <>
      <Navbar user={user} onLogout={logout}/>
      
      <main>
        <Routes>
          {/* Proteksi halaman utama menggunakan ProtectedRoute bawaan Anda */}
          <Route path="/" element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Pengalihan URL alternatif dashboard */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />

          {/* Rute Otentikasi Pengguna */}
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={login} />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register onRegister={register} />} />
          
          {/* Fallback halaman tidak ditemukan */}
          <Route path="*" element={
            <h1 className="text-center text-2xl font-bold text-gray-800 py-20">
              404 - Halaman Tidak Ditemukan
            </h1>
          } />
        </Routes>
      </main>
    </>
  );
}

export default App;
