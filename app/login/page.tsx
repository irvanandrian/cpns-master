"use client";
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        if (error.message === "Email not confirmed") {
          alert("Gagal: Email kamu belum dikonfirmasi. Silakan cek inbox Anda.");
        } else {
          alert("Gagal Masuk: " + error.message);
        }
        return;
      }

      if (data.user) {
        alert("Selamat Datang Kembali, Pejuang NIP!");
        router.push('/dashboard');
      }
      
    } catch (err: any) {
      alert("Terjadi kesalahan sistem: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FDFBF9] p-4 font-sans text-[#42271E] relative">
      
      {/* TOMBOL KEMBALI KE BERANDA (Navigasi ke Laman Utama) */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-[#5D4037] font-black text-xs uppercase tracking-[0.2em] hover:text-[#A67C52] transition-all group"
      >
        <span className="bg-[#E6CEA0] w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
          ←
        </span>
        Kembali ke Beranda
      </Link>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(93,64,55,0.1)] w-full max-w-md border border-[#E6CEA0]/30 relative overflow-hidden mt-12 md:mt-0">
        
        {/* Dekorasi Latar Belakang */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E6CEA0]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#5D4037]/10 rounded-full blur-3xl"></div>

        {/* Logo Brand */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#5D4037] tracking-tighter uppercase">
            GASKEUN<span className="text-[#A67C52]">NIP</span>
          </h1>
          <div className="flex justify-center items-center gap-2 mt-2">
            <span className="h-[1px] w-8 bg-[#E6CEA0]"></span>
            <p className="text-[#A67C52] font-black text-[10px] uppercase tracking-[0.3em] italic italic">Amankan NIP-mu!</p>
            <span className="h-[1px] w-8 bg-[#E6CEA0]"></span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-[#3E2723] mb-2 text-center uppercase tracking-tighter">Masuk Pejuang</h2>
        <p className="text-[#795548] text-center mb-8 text-xs font-medium">Akses panel simulasi ujian eksklusif kamu</p>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          
          <div>
            <label className="block text-[10px] font-black text-[#5D4037] uppercase tracking-[0.2em] mb-2 ml-1">Email Terdaftar</label>
            <input 
              type="email" 
              placeholder="pejuang@nip.com"
              required
              className="w-full px-5 py-4 rounded-2xl border border-[#E6CEA0] outline-none focus:ring-2 focus:ring-[#A67C52] transition bg-[#FDFBF9] text-[#42271E] placeholder-[#A67C52]/30 text-sm font-bold"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#5D4037] uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              className="w-full px-5 py-4 rounded-2xl border border-[#E6CEA0] outline-none focus:ring-2 focus:ring-[#A67C52] transition bg-[#FDFBF9] text-[#42271E] placeholder-[#A67C52]/30 text-sm font-bold"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#5D4037] text-[#E6CEA0] py-4 rounded-2xl font-black text-sm hover:bg-[#3E2723] shadow-xl shadow-[#5D4037]/20 transition active:scale-95 disabled:bg-[#A67C52]/50 uppercase tracking-[0.2em] mt-4"
          >
            {loading ? "Menghubungkan..." : "Gaskeun Masuk"}
          </button>

        </form>

        <div className="mt-10 pt-6 border-t border-[#E6CEA0]/30 text-center">
          <p className="text-xs text-[#795548] font-bold uppercase tracking-widest">
            Belum terdaftar?
          </p>
          <Link href="/register" className="text-[#A67C52] font-black hover:underline mt-2 inline-block uppercase text-sm tracking-tighter">
            Buat Akun Pejuang Baru
          </Link>
        </div>

      </div>
    </div>
  );
}