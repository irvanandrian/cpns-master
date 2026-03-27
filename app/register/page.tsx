"use client";
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  // 1. State untuk menampung input
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // 2. Fungsi Pendaftaran
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh halaman
    setLoading(true);

    try {
      // LANGKAH A: Daftarkan akun ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // LANGKAH B: Jika sukses, simpan data ke tabel 'profiles'
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id, // ID yang sama dengan Auth
              nama: nama, 
              whatsapp: whatsapp, 
              email: email 
            }
          ]);

        if (profileError) throw profileError;

        alert("Pendaftaran Berhasil! Silakan Login.");
        router.push('/login');
      }
    } catch (error: any) {
      alert("Terjadi Kesalahan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-black text-blue-600 mb-2 text-center">Daftar Akun</h1>
        <p className="text-gray-400 text-center mb-8">Mulai simulasi try out kamu sekarang</p>

        {/* HANYA SATU FORM DI SINI */}
        <form onSubmit={handleRegister} className="space-y-5">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Nama Lengkap</label>
            <input 
              type="text" 
              placeholder="..."
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={(e) => setNama(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Nomor WhatsApp</label>
            <input 
              type="text" 
              placeholder="08xxxxxxxx"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="Minimal 6 karakter"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition active:scale-95 disabled:bg-gray-400"
          >
            {loading ? "Sedang Memproses..." : "Daftar Sekarang"}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}