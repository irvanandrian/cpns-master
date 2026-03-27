"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

function UjianContent() {
  const [soal, setSoal] = useState<any[]>([]);
  const [indexSekarang, setIndexSekarang] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<any>({}); 
  const [timeLeft, setTimeLeft] = useState(100 * 60); // 100 Menit
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [skor, setSkor] = useState({ twk: 0, tiu: 0, tkp: 0, total: 0 });

  const router = useRouter();
  const searchParams = useSearchParams();
  const paketDipilih = searchParams.get('paket') || "1";

  useEffect(() => {
    const fetchSoal = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Ambil soal berdasarkan paket_id sesuai database kamu
      const { data, error } = await supabase
        .from('soal')
        .select('*')
        .eq('paket_id', paketDipilih);

      if (error) {
        console.error("Error fetch soal:", error);
      } else {
        // Mengurutkan Kategori: TWK -> TIU -> TKP
        const urutan = { "TWK": 1, "TIU": 2, "TKP": 3 };
        const sortedData = data.sort((a: any, b: any) => 
          (urutan[a.kategori as keyof typeof urutan] || 99) - (urutan[b.kategori as keyof typeof urutan] || 99)
        );
        setSoal(sortedData);
      }
      setLoading(false);
    };
    fetchSoal();
  }, [paketDipilih, router]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) { hitungSkor(); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const hitungSkor = () => {
    let sTWK = 0, sTIU = 0, sTKP = 0;

    soal.forEach((item) => {
      const pilihanUser = jawabanUser[item.id];
      if (!pilihanUser) return;

      if (item.kategori === 'TWK' || item.kategori === 'TIU') {
        // Bandingkan dengan kolom 'kunci' di database kamu (case insensitive)
        if (pilihanUser.toLowerCase() === item.kunci?.toLowerCase()) {
          item.kategori === 'TWK' ? sTWK += 5 : sTIU += 5;
        }
      } else if (item.kategori === 'TKP') {
        // Ambil poin dari kolom poin_a sampai poin_e
        const poin = parseInt(item[`poin_${pilihanUser.toLowerCase()}`]) || 0;
        sTKP += poin;
      }
    });

    setSkor({ twk: sTWK, tiu: sTIU, tkp: sTKP, total: sTWK + sTIU + sTKP });
    setIsFinished(true);
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-blue-600 animate-pulse">MEMUAT SOAL PAKET {paketDipilih}...</div>;

  if (isFinished) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">Hasil Simulasi</h2>
        <div className="space-y-3 mb-8 text-left">
          <div className="flex justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <span className="font-bold text-blue-700 uppercase text-xs tracking-widest">Skor TWK</span>
            <span className="font-black text-blue-900">{skor.twk}</span>
          </div>
          <div className="flex justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <span className="font-bold text-indigo-700 uppercase text-xs tracking-widest">Skor TIU</span>
            <span className="font-black text-indigo-900">{skor.tiu}</span>
          </div>
          <div className="flex justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <span className="font-bold text-purple-700 uppercase text-xs tracking-widest">Skor TKP</span>
            <span className="font-black text-purple-900">{skor.tkp}</span>
          </div>
          <div className="flex justify-between p-6 bg-slate-900 rounded-3xl mt-6 shadow-xl shadow-slate-200">
            <span className="font-bold text-white uppercase text-xs tracking-widest">Total Poin</span>
            <span className="font-black text-yellow-400 text-2xl">{skor.total}</span>
          </div>
        </div>
        <button onClick={() => router.push('/dashboard')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-lg">KEMBALI KE DASHBOARD</button>
      </div>
    </div>
  );

  const s = soal[indexSekarang];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-10">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black">{indexSekarang + 1}</div>
          <div>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
              {s?.kategori} - PAKET {paketDipilih}
            </span>
            <h2 className="font-black text-slate-800 leading-tight">Soal Simulasi</h2>
          </div>
        </div>
        <div className={`px-6 py-2 rounded-2xl font-mono font-black text-xl ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Area Soal */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
             <p className="text-xl text-slate-700 leading-relaxed font-semibold">{s?.pertanyaan}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {['a', 'b', 'c', 'd', 'e'].map((opt) => (
              <button
                key={opt}
                onClick={() => setJawabanUser({...jawabanUser, [s.id]: opt})}
                className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                  jawabanUser[s.id] === opt ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-white bg-white hover:border-slate-200 text-slate-600'
                }`}
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${jawabanUser[s.id] === opt ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {opt.toUpperCase()}
                </span>
                {/* Menampilkan opsi_a, opsi_b, dst sesuai database baru kamu */}
                <span className="font-bold flex-1">{s[`opsi_${opt}`]}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button disabled={indexSekarang === 0} onClick={() => setIndexSekarang(i => i - 1)} className="px-8 py-4 font-black text-slate-400 hover:text-slate-800 disabled:opacity-0 transition">← KEMBALI</button>
            {indexSekarang === soal.length - 1 ? (
              <button onClick={() => { if(confirm("Kumpulkan jawaban sekarang?")) hitungSkor() }} className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl hover:bg-red-700 transition">SELESAI UJIAN</button>
            ) : (
              <button onClick={() => setIndexSekarang(i => i + 1)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition">LANJUT →</button>
            )}
          </div>
        </div>

        {/* Sidebar Navigasi */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-28">
            <h4 className="font-black text-slate-800 mb-6 text-sm uppercase tracking-widest">Nomor Soal</h4>
            <div className="grid grid-cols-5 gap-2 pr-2">
              {soal.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setIndexSekarang(i)}
                  className={`h-11 rounded-xl text-xs font-black transition-all ${
                    indexSekarang === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 
                    jawabanUser[item.id] ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UjianPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-black">MEMUAT...</div>}>
      <UjianContent />
    </Suspense>
  );
}