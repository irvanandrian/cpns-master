"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [namaUser, setNamaUser] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('nama')
        .eq('id', user.id)
        .single();

      if (profile) setNamaUser(profile.nama);
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const startExam = (nomorPaket: string) => {
    router.push(`/ujian?paket=${nomorPaket}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Navbar Atas */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
              C
            </div>
            <h1 className="text-xl font-black text-slate-800">CPNS<span className="text-blue-600">MASTER</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-sm font-black text-slate-700">{namaUser}</span>
            <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold">Keluar</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-10 text-white mb-12 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl font-black mb-4">Siap Tembus NIP 2026? 🚀</h2>
          <p className="text-blue-100 max-w-xl">Pilih paket simulasi SKD. Setiap paket berisi 110 soal (TWK, TIU, TKP) durasi 100 menit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all">
              <h4 className="text-2xl font-black text-slate-800 mb-6">Paket Simulasi {num}</h4>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-sm font-bold text-slate-500">Total Soal</span>
                  <span className="text-sm font-black text-slate-800">110 Butir</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 px-2">
                  <span>⏱️</span> <span className="text-sm font-bold">100 Menit</span>
                </div>
              </div>
              <button 
                onClick={() => startExam(num.toString())}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100"
              >
                MULAI UJIAN →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}