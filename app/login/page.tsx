"use client";
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  // State untuk menyimpan input user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fungsi utama untuk Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman refresh
    setLoading(true);

    try {
      // 1. Proses Autentikasi ke Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      // 2. Cek jika ada error (Password salah atau Email belum dikonfirmasi)
      if (error) {
        if (error.message === "Email not confirmed") {
          alert("Gagal: Email kamu belum dikonfirmasi. Silakan matikan 'Confirm Email' di Dashboard Supabase agar bisa langsung login.");
        } else {
          alert("Gagal Masuk: " + error.message);
        }
        return;
      }

      // 3. Jika berhasil, arahkan ke halaman ujian
      if (data.user) {
        alert("Selamat Datang Kembali!");
        router.push('/dashboard');
      }
      
    } catch (err: any) {
      alert("Terjadi kesalahan sistem: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h1 className="text-4xl font-black text-blue-600 mb-2 text-center">Masuk</h1>
        <p className="text-gray-400 text-center mb-10 text-sm">Akses akun simulasi ujian kamu</p>

        {/* Form dengan onSubmit agar tombol enter & klik berfungsi */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Terdaftar</label>
            <input 
              type="email" 
              placeholder="irvan@email.com"
              required
              className="w-full px-4 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition bg-gray-50 focus:bg-white"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              className="w-full px-4 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition bg-gray-50 focus:bg-white"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition active:scale-95 disabled:bg-gray-400 disabled:shadow-none"
          >
            {loading ? "Menghubungkan..." : "Masuk Sekarang"}
          </button>

        </form>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-center text-sm text-gray-500">
            Belum punya akun? <Link href="/register" className="text-blue-600 font-extrabold hover:underline">Daftar Akun Baru</Link>
          </p>
        </div>
      </div>
    </div>
  );
}