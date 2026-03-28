"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Ambil data detail dari tabel profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  // Data Paket Soal 1 - 6
  const daftarPaket = [
    { id: "1", nama: "Paket 01: Try Out Gratis", tipe: "FREE", desc: "Uji kemampuan dasarmu dengan soal simulasi pertama." },
    { id: "2", nama: "Paket 02: Pejuang SKD", tipe: "PREMIUM", desc: "45 Soal HOTS (TWK, TIU, TKP) standar BKN terbaru." },
    { id: "3", nama: "Paket 03: Master NIP", tipe: "PREMIUM", desc: "Latihan intensif dengan pembahasan mendalam dan trik cepat." },
    { id: "4", nama: "Paket 04: Prediksi Akurat", tipe: "PREMIUM", desc: "Kumpulan soal yang diprediksi muncul di tahun ini." },
    { id: "5", nama: "Paket 05: Drilling TIU", tipe: "PREMIUM", desc: "Fokus pendalaman materi hitungan dan logika pecahan." },
    { id: "6", nama: "Paket 06: Simulasi Final", tipe: "PREMIUM", desc: "Try out penutup dengan tingkat kesulitan maksimal." },
  ];

  // FUNGSI LOGIKA AKSES (ADMIN & PREMIUM)
  const cekAkses = (tipePaket: string) => {
    if (profile?.role === 'admin') return true; // Admin Sakti tembus semua
    if (tipePaket === 'FREE') return true;      // Paket Free terbuka untuk semua
    return profile?.is_premium === true;       // Sisanya hanya untuk yang sudah Premium
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFBF9] font-black text-[#5D4037] tracking-widest">
      MENYIAPKAN HALAMAN PEJUANG...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans pb-20">
      
      {/* Header Dashboard */}
      <div className="bg-[#5D4037] p-8 md:p-12 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black tracking-[0.2em] uppercase ${
                    profile?.role === 'admin' ? 'bg-yellow-400 text-black' : 
                    profile?.is_premium ? 'bg-[#E6CEA0] text-[#5D4037]' : 'bg-white/20 text-white'
                }`}>
                    {profile?.role === 'admin' ? '🔥 Super Admin' : profile?.is_premium ? '🌟 Premium Member' : '🆓 Free Account'}
                </span>
            </div>
            <h2 className="text-[#E6CEA0] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {profile?.email?.split('@')[0]}
            </h2>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="bg-[#A67C52] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl"
          >
            Log Out
          </button>
        </div>
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-[#E6CEA0] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Paket */}
      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {daftarPaket.map((paket) => {
            const terbuka = cekAkses(paket.tipe);
            
            return (
              <div 
                key={paket.id} 
                className={`bg-white rounded-[2.5rem] p-8 shadow-xl border-2 transition-all duration-500 flex flex-col justify-between ${
                  terbuka ? 'border-[#E6CEA0]/30 hover:-translate-y-2' : 'border-transparent opacity-70 grayscale-[0.5]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black tracking-widest ${
                      paket.tipe === 'FREE' ? 'bg-green-100 text-green-700' : 'bg-[#5D4037] text-[#E6CEA0]'
                    }`}>
                      {paket.tipe}
                    </span>
                    {!terbuka && <span className="text-2xl">🔒</span>}
                  </div>
                  
                  <h3 className="text-xl font-black text-[#5D4037] mb-3 uppercase tracking-tighter leading-tight">
                    {paket.nama}
                  </h3>
                  <p className="text-[#795548] text-[11px] leading-relaxed mb-8">
                    {paket.desc}
                  </p>
                </div>

                {terbuka ? (
                  <Link href={`/ujian?paket=${paket.id}`}>
                    <button className="w-full py-4 bg-[#5D4037] text-[#E6CEA0] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#A67C52] transition-all">
                      Mulai Simulasi →
                    </button>
                  </Link>
                ) : (
                  <button 
                    onClick={() => window.open('https://wa.me/628978720373?text=Halo%20Admin%2C%20saya%20ingin%20aktivasi%20Paket%20Premium%20GaskeunNIP', '_blank')}
                    className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-[#5D4037] hover:text-[#E6CEA0] transition-all"
                  >
                    Beli Akses Premium
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Tambahan */}
        <div className="mt-16 bg-[#E6CEA0]/10 p-10 rounded-[3.5rem] border-2 border-dashed border-[#E6CEA0] text-center">
          <p className="text-[#5D4037] font-black text-xs uppercase tracking-[0.3em] mb-3">Butuh Bantuan Aktivasi?</p>
          <p className="text-[#795548] text-[10px] font-bold max-w-md mx-auto leading-relaxed">
            Jika kamu sudah melakukan pembayaran namun paket masih terkunci, silakan kirim bukti transfer ke Mentor melalui WhatsApp Admin.
          </p>
        </div>
      </div>
    </div>
  );
}