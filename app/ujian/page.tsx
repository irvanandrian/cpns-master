"use client";
import React, { useEffect, useState, Suspense, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

function UjianContent() {
  const [soal, setSoal] = useState<any[]>([]);
  const [indexSekarang, setIndexSekarang] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<any>({}); 
  const [timeLeft, setTimeLeft] = useState(100 * 60); 
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [dataReview, setDataReview] = useState<any[]>([]);
  const [skor, setSkor] = useState({ twk: 0, tiu: 0, tkp: 0, total: 0 });

  const router = useRouter();
  const searchParams = useSearchParams();
  const paketDipilih = searchParams.get('paket') || "1";
  const hitungSkorRef = useRef<() => void>();

  useEffect(() => {
    const fetchSoal = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data, error } = await supabase.from('soal').select('*').eq('paket_id', paketDipilih);
      if (!error && data) {
        const urutan = { "TWK": 1, "TIU": 2, "TKP": 3 };
        const sortedData = data.sort((a: any, b: any) => (urutan[a.kategori as keyof typeof urutan] || 99) - (urutan[b.kategori as keyof typeof urutan] || 99));
        setSoal(sortedData);
      }
      setLoading(false);
    };
    fetchSoal();
  }, [paketDipilih, router]);

  const hitungSkor = () => {
    let sTWK = 0, sTIU = 0, sTKP = 0;
    const reviewTemp: any[] = [];
    soal.forEach((item) => {
      const pilihanUser = jawabanUser[item.id] || null;
      let poin = 0;
      if (item.kategori === 'TWK' || item.kategori === 'TIU') {
        if (pilihanUser?.toLowerCase() === item.kunci?.toLowerCase()) {
          item.kategori === 'TWK' ? sTWK += 5 : sTIU += 5;
          poin = 5;
        }
      } else if (item.kategori === 'TKP') {
        poin = parseInt(item[`poin_${pilihanUser?.toLowerCase()}`]) || 0;
        sTKP += poin;
      }
      reviewTemp.push({ ...item, jawabanUser: pilihanUser, poinDidapat: poin });
    });
    setSkor({ twk: sTWK, tiu: sTIU, tkp: sTKP, total: sTWK + sTIU + sTKP });
    setDataReview(reviewTemp);
    setIsFinished(true);
  };

  hitungSkorRef.current = hitungSkor;

  useEffect(() => {
    if (timeLeft <= 0 && !isFinished) {
      if (hitungSkorRef.current) hitungSkorRef.current();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#FDFBF9] font-black text-[#5D4037]">MEMUAT...</div>;

  // VIEW: HASIL & REVIEW
  if (isFinished) {
    if (showReview) {
      return (
        <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] pb-10">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-50">
            <h2 className="font-black uppercase text-sm">Review Pembahasan</h2>
            <button onClick={() => router.push('/dashboard')} className="bg-[#5D4037] text-white px-4 py-2 rounded-lg text-xs font-black">KELUAR</button>
          </div>
          <div className="max-w-3xl mx-auto p-4 space-y-4">
            {dataReview.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E6CEA0]/30 shadow-sm">
                <p className="font-bold text-sm mb-3">{idx + 1}. {item.pertanyaan}</p>
                <div className="text-xs p-3 bg-green-50 rounded-lg border border-green-200 text-green-800 italic">
                  <b>Pembahasan:</b> {item.pembahasan || "Belum ada pembahasan."}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="h-screen bg-[#FDFBF9] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-[#E6CEA0]/20 max-w-xs w-full">
          <h2 className="font-black text-[#5D4037] mb-4 uppercase text-sm tracking-widest">Skor Akhir</h2>
          <div className="text-5xl font-black text-[#A67C52] mb-6">{skor.total}</div>
          <button onClick={() => setShowReview(true)} className="w-full bg-[#5D4037] text-white py-3 rounded-xl font-black text-xs mb-2 uppercase">Pembahasan</button>
          <button onClick={() => router.push('/dashboard')} className="w-full border border-[#5D4037] py-3 rounded-xl font-black text-xs uppercase">Dashboard</button>
        </div>
      </div>
    );
  }

  const s = soal[indexSekarang];

  // VIEW: UJIAN (LAYOUT RINGKAS)
  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans">
      {/* Header Kecil */}
      <div className="bg-white border-b border-[#E6CEA0]/30 px-4 py-2 sticky top-0 z-30 flex justify-between items-center shadow-sm">
        <div className="text-[10px] font-black uppercase tracking-widest text-[#A67C52]">Soal {indexSekarang + 1} / {soal.length}</div>
        <div className="bg-[#5D4037] text-[#E6CEA0] px-3 py-1 rounded-lg font-mono font-black text-sm">{formatTime(timeLeft)}</div>
      </div>

      <div className="max-w-6xl mx-auto p-3 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Kolom Soal */}
        <div className="lg:col-span-3">
          <div className="bg-white p-5 rounded-2xl border border-[#E6CEA0]/20 shadow-sm mb-3">
            <p className="text-sm md:text-base font-bold leading-relaxed">{s?.pertanyaan}</p>
          </div>

          <div className="space-y-2">
            {['a', 'b', 'c', 'd', 'e'].map((opt) => (
              <button
                key={opt}
                onClick={() => setJawabanUser({...jawabanUser, [s.id]: opt})}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left text-xs font-bold ${
                  jawabanUser[s.id] === opt ? 'border-[#5D4037] bg-[#5D4037]/5' : 'border-white bg-white hover:border-[#E6CEA0]'
                }`}
              >
                <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${jawabanUser[s.id] === opt ? 'bg-[#5D4037] text-white' : 'bg-[#FDFBF9] text-[#A67C52]'}`}>{opt.toUpperCase()}</span>
                <span>{s?.[`opsi_${opt}`]}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button disabled={indexSekarang === 0} onClick={() => setIndexSekarang(i => i - 1)} className="text-[10px] font-black text-[#A67C52] uppercase tracking-widest disabled:opacity-0">← Kembali</button>
            {indexSekarang === soal.length - 1 ? (
              <button onClick={() => { if(confirm("Selesai?")) hitungSkor() }} className="px-6 py-2 bg-red-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg">Selesai Ujian</button>
            ) : (
              <button onClick={() => setIndexSekarang(i => i + 1)} className="px-6 py-2 bg-[#5D4037] text-white rounded-lg font-black text-[10px] uppercase shadow-lg">Lanjut →</button>
            )}
          </div>
        </div>

        {/* Kolom Navigasi Nomor */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-2xl border border-[#E6CEA0]/20 shadow-sm sticky top-16">
            <p className="text-[9px] font-black text-[#A67C52] uppercase mb-3 text-center tracking-widest">Navigasi Nomor</p>
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {soal.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setIndexSekarang(i)}
                  className={`h-7 rounded flex items-center justify-center text-[9px] font-black transition-all ${
                    indexSekarang === i ? 'bg-[#5D4037] text-white' : jawabanUser[item.id] ? 'bg-[#E6CEA0] text-[#5D4037]' : 'bg-[#FDFBF9] border border-[#E6CEA0]/30'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => { if(confirm("Yakin ingin selesai?")) hitungSkor() }} 
              className="w-full py-2 bg-[#A67C52] text-white rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-[#5D4037] transition"
            >
              Kumpulkan Jawaban
            </button>
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