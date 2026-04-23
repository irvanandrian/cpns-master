"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// --- KOMPONEN MODAL PSIKOTES ---
function PsikotesDashboard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-[#5D4037]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#FDFBF9] w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-[#5D4037] font-black text-2xl hover:scale-125 transition-transform">✕</button>
        <div className="p-10 md:p-16">
          <h2 className="text-[10px] font-black text-[#A67C52] uppercase tracking-[0.5em] mb-4">Pusat Latihan</h2>
          <h3 className="text-4xl font-black text-[#5D4037] uppercase tracking-tighter mb-10">Pilih Mode Psikotes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/tes-koran" className="group">
              <div className="bg-white border-2 border-[#5D4037]/5 p-8 rounded-[2.5rem] hover:border-[#E6CEA0] hover:shadow-xl transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-4">✍️</div>
                  <h4 className="font-black text-xl uppercase text-[#5D4037] mb-2">Tes Koran</h4>
                  <p className="text-[10px] font-bold text-[#5D4037]/60 uppercase leading-relaxed">Uji ketahanan, stabilitas, dan kecepatan berhitung (Pauli & Kraepelin).</p>
                </div>
                <div className="mt-6 text-[10px] font-black text-[#A67C52] uppercase group-hover:translate-x-2 transition-transform">Mulai Latihan →</div>
              </div>
            </Link>
            <Link href="/tes-kecermatan" className="group">
              <div className="bg-white border-2 border-[#5D4037]/5 p-8 rounded-[2.5rem] hover:border-[#E6CEA0] hover:shadow-xl transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-4">🔍</div>
                  <h4 className="font-black text-xl uppercase text-[#5D4037] mb-2">Tes Kecermatan</h4>
                  <p className="text-[10px] font-bold text-[#5D4037]/60 uppercase leading-relaxed">Latih ketelitian visual mencari angka, huruf, atau simbol yang hilang.</p>
                </div>
                <div className="mt-6 text-[10px] font-black text-[#A67C52] uppercase group-hover:translate-x-2 transition-transform">Mulai Latihan →</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen Konten Utama
function DashboardContent() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPsikotes, setShowPsikotes] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Logika Otomatis Buka Modal jika kembali dari latihan
  useEffect(() => {
    const autoOpen = searchParams.get('showPsikotes');
    if (autoOpen === 'true') {
      setShowPsikotes(true);
    }
  }, [searchParams]);

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
      { id: "1", nama: "Kedinasan Paket 01", desc: "Persiapan masuk Sekolah Kedinasan.", jenis: "kedinasan" },
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

  const isAdmin = profile?.role === 'admin';
  const isPremium = profile?.is_premium === true;
  const userKategori = profile?.paket || "cpns";

  let daftarPaket = isAdmin ? Object.values(dataMasterPaket).flat() : (dataMasterPaket[userKategori] || []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFBF9] font-black text-[#5D4037] tracking-widest text-[10px]">
      MENYIAPKAN DASHBOARD PEJUANG...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans pb-20">
      <PsikotesDashboard isOpen={showPsikotes} onClose={() => setShowPsikotes(false)} />

      <div className="bg-[#5D4037] p-8 md:p-12 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black tracking-[0.2em] uppercase ${isAdmin ? 'bg-yellow-400 text-black' : isPremium ? 'bg-[#E6CEA0] text-[#5D4037]' : 'bg-green-500 text-white'}`}>
                  {isAdmin ? '🔥 Super Admin Mode' : isPremium ? `🌟 Premium ${userKategori}` : `🎁 Akses Gratis Sementara`}
                </span>
            </div>
            <h2 className="text-[#E6CEA0] text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Halo, {profile?.nama || "Pejuang"}
            </h2>
            <p className="text-[#E6CEA0]/60 text-[10px] font-bold uppercase mt-2 tracking-widest italic">
              {isAdmin ? "Akses Tanpa Batas" : (isPremium || userKategori === 'kedinasan') ? "Akses Paket Terbuka!" : "Upgrade ke Premium untuk Membuka Soal"}
            </p>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="bg-[#A67C52] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10">
        {(isPremium || isAdmin) && (
          <div className="mb-8 grid grid-cols-1">
            <button 
              onClick={() => setShowPsikotes(true)}
              className="group bg-gradient-to-r from-[#E6CEA0] to-[#A67C52] p-[2px] rounded-[2.5rem] shadow-xl hover:scale-[1.01] transition-all"
            >
              <div className="bg-[#FDFBF9] rounded-[2.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#5D4037] rounded-3xl flex items-center justify-center text-3xl shadow-inner">📊</div>
                  <div className="text-left">
                    <h3 className="text-xl font-black text-[#5D4037] uppercase tracking-tighter">Menu Psikotes Premium</h3>
                    <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">Tes Koran (Pauli/Kraepelin) & Tes Kecermatan</p>
                  </div>
                </div>
                <div className="bg-[#5D4037] text-[#E6CEA0] px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-black transition-colors">
                  Buka Latihan Psikotes →
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ... Sisa komponen grid paket (sama seperti sebelumnya) ... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {daftarPaket.map((paket: any, index: number) => {
            const isLocked = !isAdmin && !isPremium && paket.jenis !== 'kedinasan';
            return (
              <div key={index} className={`bg-white rounded-[2.5rem] p-8 shadow-xl border-2 transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${isLocked ? 'border-gray-200 grayscale' : 'border-[#E6CEA0]/30 hover:-translate-y-2'}`}>
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${isLocked ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-700'}`}>
                      {isLocked ? 'TERKUNCI' : 'TERSEDIA'}
                    </span>
                    <span className="text-xs font-black text-[#A67C52]">#{paket.id}</span>
                  </div>
                  <h3 className="text-xl font-black text-[#5D4037] mb-3 uppercase tracking-tighter leading-tight">{paket.nama}</h3>
                  <p className="text-[#795548] text-[11px] leading-relaxed mb-8">{paket.desc}</p>
                </div>
                {isLocked ? (
                  <button onClick={() => alert("Aktivasi akun premium untuk membuka ini!")} className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-200 cursor-not-allowed">
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
      </div>
    </div>
  );
}

// Export utama menggunakan Suspense
export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}