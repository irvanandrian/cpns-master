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
      if (!user) { router.push('/login'); return; }

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

  // DATABASE MASTER PAKET
  const dataMasterPaket: any = {
    cpns: [
      { id: "1", nama: "CPNS Paket 01", desc: "Simulasi SKD standar BKN terbaru.", jenis: "cpns" },
      { id: "2", nama: "CPNS Paket 02", desc: "Fokus materi HOTS (TWK, TIU, TKP).", jenis: "cpns" },
      { id: "3", nama: "CPNS Paket 03", desc: "Latihan intensif Master NIP.", jenis: "cpns" },
      { id: "4", nama: "CPNS Paket 04", desc: "Prediksi soal paling akurat.", jenis: "cpns" },
      { id: "5", nama: "CPNS Paket 05", desc: "Drilling khusus TIU Logika.", jenis: "cpns" },
      { id: "6", nama: "CPNS Paket 06", desc: "Simulasi Final penutup.", jenis: "cpns" },
    ],
    kedinasan: [
      { id: "1", nama: "Kedinasan Paket 01", desc: "Persiapan masuk STIS/IPDN/STAN.", jenis: "kedinasan" },
      { id: "2", nama: "Kedinasan Paket 02", desc: "Latihan soal integritas & logika.", jenis: "kedinasan" },
      { id: "3", nama: "Kedinasan Paket 03", desc: "Simulasi perangkingan nasional.", jenis: "kedinasan" },
    ],
    bumn: [
      { id: "1", nama: "BUMN Paket 01", desc: "Tes Kemampuan Dasar (TKD) & Akhlak.", jenis: "bumn" },
      { id: "2", nama: "BUMN Paket 02", desc: "Tes Bahasa Inggris & TKB.", jenis: "bumn" },
    ],
    snbt: [
      { id: "1", nama: "SNBT Paket 01", desc: "Pengetahuan Kuantitatif (PK).", jenis: "snbt" },
      { id: "2", nama: "SNBT Paket 02", desc: "Penalaran Matematika (PM).", jenis: "snbt" },
    ]
  };

  // --- LOGIKA AKSES ---
  let daftarPaket = [];
  const isAdmin = profile?.role === 'admin';
  const isPremium = profile?.is_premium === true; // Cek status premium
  const userKategori = profile?.paket || "cpns";

  if (isAdmin) {
    daftarPaket = Object.values(dataMasterPaket).flat();
  } else {
    daftarPaket = dataMasterPaket[userKategori] || [];
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFBF9] font-black text-[#5D4037] tracking-widest text-[10px]">
      MENYIAPKAN DASHBOARD PEJUANG...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans pb-20">
      
      {/* Header Dashboard */}
      <div className="bg-[#5D4037] p-8 md:p-12 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black tracking-[0.2em] uppercase ${isAdmin ? 'bg-yellow-400 text-black' : 'bg-[#E6CEA0] text-[#5D4037]'}`}>
                  {isAdmin ? '🔥 Super Admin Mode' : isPremium ? `🌟 Premium ${userKategori}` : `☁️ Free Member`}
                </span>
            </div>
            <h2 className="text-[#E6CEA0] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {profile?.nama || "Pejuang"}
            </h2>
            <p className="text-[#E6CEA0]/60 text-[10px] font-bold uppercase mt-2 tracking-widest italic">
              {isAdmin ? "Akses Tanpa Batas ke Seluruh Paket Soal" : isPremium ? "Selamat Belajar, Akses Paket Terbuka!" : "Upgrade ke Premium untuk Membuka Soal"}
            </p>
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
        
        {/* Notifikasi Belum Bayar (Hanya Muncul Jika Bukan Admin & Bukan Premium) */}
        {!isAdmin && !isPremium && (
          <div className="mb-10 p-6 bg-white rounded-[2.5rem] border-2 border-dashed border-[#A67C52] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-[#5D4037] uppercase tracking-widest">⚠️ Akun Belum Aktif</p>
              <p className="text-[9px] text-[#A67C52] font-bold mt-1">Selesaikan pembayaran untuk membuka akses paket soal {userKategori}.</p>
            </div>
            <a 
              href="https://wa.me/628978720373?text=Halo%20Admin%20GaskeunNIP,%20saya%20ingin%20aktivasi%20akun%20Premium" 
              target="_blank"
              className="bg-[#25D366] text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
            >
              Konfirmasi via WhatsApp
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {daftarPaket.map((paket: any, index: number) => {
            // Logika kunci: kebuka jika Admin ATAU User sudah Premium
            const isLocked = !isAdmin && !isPremium;

            return (
              <div 
                key={index} 
                className={`bg-white rounded-[2.5rem] p-8 shadow-xl border-2 transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${isLocked ? 'border-gray-200 grayscale' : 'border-[#E6CEA0]/30 hover:-translate-y-2'}`}
              >
                {isAdmin && (
                  <div className="absolute top-0 right-0 bg-[#A67C52] text-white px-4 py-1 text-[8px] font-black uppercase rounded-bl-xl">
                    {paket.jenis}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${isLocked ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-700'}`}>
                      {isLocked ? 'TERKUNCI' : 'TERSEDIA'}
                    </span>
                    <span className="text-xs font-black text-[#A67C52]">#{paket.id}</span>
                  </div>
                  
                  <h3 className="text-xl font-black text-[#5D4037] mb-3 uppercase tracking-tighter leading-tight">
                    {paket.nama}
                  </h3>
                  <p className="text-[#795548] text-[11px] leading-relaxed mb-8">
                    {paket.desc}
                  </p>
                </div>

                {isLocked ? (
                  <button 
                    onClick={() => alert("Silakan aktivasi akun premium terlebih dahulu untuk membuka paket ini!")}
                    className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-200 cursor-not-allowed"
                  >
                    🔒 Paket Terkunci
                  </button>
                ) : (
                  <Link href={`/ujian?paket=${paket.id}&jenis=${paket.jenis || userKategori}`}>
                    <button className="w-full py-4 bg-[#5D4037] text-[#E6CEA0] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#A67C52] transition-all">
                      Mulai Simulasi →
                    </button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Admin info */}
        {isAdmin && (
           <div className="mt-12 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-3xl text-center">
              <p className="text-[10px] font-black text-yellow-800 uppercase tracking-widest">Dashboard Monitoring Admin</p>
              <p className="text-[9px] text-yellow-700 mt-1 font-bold">Total {daftarPaket.length} paket terdeteksi dalam database sistem.</p>
           </div>
        )}
      </div>
    </div>
  );
}