"use client";
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: authData.user.id, nama, whatsapp, email }]);
        if (profileError) throw profileError;
        alert("Pendaftaran Berhasil, Pejuang! Silakan Login.");
        router.push('/login');
      }
    } catch (error: any) {
      alert("Terjadi Kesalahan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FDFBF9] p-4 font-sans text-[#42271E]">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(93,64,55,0.1)] w-full max-w-md border border-[#E6CEA0]/30 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#E6CEA0]/20 rounded-full blur-3xl"></div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#5D4037] tracking-tighter uppercase">GASKEUN<span className="text-[#A67C52]">NIP</span></h1>
          <p className="text-[#A67C52] font-semibold mt-1 text-xs tracking-widest uppercase italic italic italic">"Mulai Langkahmu Hari Ini"</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-black text-[#5D4037] uppercase tracking-widest mb-1.5 ml-1">Nama Lengkap</label>
            <input type="text" placeholder="Masukkan nama" required className="w-full px-5 py-3.5 rounded-2xl border border-[#E6CEA0] outline-none focus:ring-2 focus:ring-[#A67C52] bg-[#FDFBF9]" onChange={(e) => setNama(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-black text-[#5D4037] uppercase tracking-widest mb-1.5 ml-1">Email</label>
            <input type="email" placeholder="nama@email.com" required className="w-full px-5 py-3.5 rounded-2xl border border-[#E6CEA0] outline-none focus:ring-2 focus:ring-[#A67C52] bg-[#FDFBF9]" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-black text-[#5D4037] uppercase tracking-widest mb-1.5 ml-1">WhatsApp</label>
            <input type="text" placeholder="08xxxxxxxx" required className="w-full px-5 py-3.5 rounded-2xl border border-[#E6CEA0] outline-none focus:ring-2 focus:ring-[#A67C52] bg-[#FDFBF9]" onChange={(e) => setWhatsapp(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-black text-[#5D4037] uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input type="password" placeholder="Min 6 karakter" required className="w-full px-5 py-3.5 rounded-2xl border border-[#E6CEA0] outline-none focus:ring-2 focus:ring-[#A67C52] bg-[#FDFBF9]" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#5D4037] text-[#E6CEA0] py-4 rounded-2xl font-black text-lg hover:bg-[#3E2723] shadow-xl shadow-[#5D4037]/20 transition active:scale-95 uppercase tracking-widest mt-6">
            {loading ? "Memproses..." : "Daftar Pejuang"}
          </button>
        </form>
        <div className="mt-10 pt-6 border-t border-[#E6CEA0]/30 text-center">
          <p className="text-sm text-[#795548] font-medium italic italic">Sudah punya akun? <Link href="/login" className="text-[#A67C52] font-black hover:underline uppercase tracking-tighter">Login</Link></p>
        </div>
      </div>
    </div>
  );
}