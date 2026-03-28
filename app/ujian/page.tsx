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
  
  const hitungSkorRef = useRef<() => void>(undefined);

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
        const fieldPoin = `poin_${pilihanUser?.toLowerCase()}`;
        poin = parseInt(item[fieldPoin]) || 0;
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

  if (isFinished) {
    if (showReview) {
      return (
        <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] pb-10">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-50">
            <h2 className="font-black uppercase text-sm tracking-tighter">Review Pembahasan</h2>
            <button onClick={() => router.push('/dashboard')} className="bg-[#5D4037] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase">KELUAR</button>
          </div>
          <div className="max-w-3xl mx-auto p-4 space-y-4">
            {dataReview.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E6CEA0]/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#A67C52]"></div>
                {item.image_url && (
                  <img src={item.image_url} alt="soal" className="max-h-40 mx-auto mb-4 rounded-lg shadow-sm border" />
                )}
                <p className="font-bold text-sm mb-3">{idx + 1}. {item.pertanyaan}</p>
                <div className="text-xs p-4 bg-[#FDFBF9] rounded-xl border border-[#E6CEA0]/20 text-[#5D4037] italic leading-relaxed">
                  <b className="not-italic text-[#A67C52] block mb-1">PEMBAHASAN (Kunci: {item.kunci?.toUpperCase()}):</b> {item.pembahasan || "Belum ada pembahasan."}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="h-screen bg-[#FDFBF9] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#E6CEA0]/20 max-w-xs w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#5D4037]"></div>
          <h2 className="font-black text-[#5D4037] mb-4 uppercase text-[10px] tracking-[0.3em]">Hasil Skor</h2>
          <div className="text-6xl font-black text-[#A67C52] mb-8 tracking-tighter">{skor.total}</div>
          <div className="grid grid-cols-3 gap-2 mb-8 text-[8px] font-black uppercase">
             <div className="bg-[#FDFBF9] p-2 rounded-lg"><div className="text-[#A67C52]">TWK</div>{skor.twk}</div>
             <div className="bg-[#FDFBF9] p-2 rounded-lg"><div className="text-[#A67C52]">TIU</div>{skor.tiu}</div>
             <div className="bg-[#FDFBF9] p-2 rounded-lg"><div className="text-[#A67C52]">TKP</div>{skor.tkp}</div>
          </div>
          <button onClick={() => setShowReview(true)} className="w-full bg-[#5D4037] text-white py-4 rounded-2xl font-black text-[10px] mb-3 uppercase tracking-widest shadow-lg">Lihat Pembahasan</button>
          <button onClick={() => router.push('/dashboard')} className="w-full border-2 border-[#5D4037]/10 py-4 rounded-2xl font-black text-[10px] uppercase text-[#5D4037] hover:bg-[#5D4037]/5">Dashboard</button>
        </div>
      </div>
    );
  }

  const s = soal[indexSekarang];

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans pb-20">
      <div className="bg-white border-b border-[#E6CEA0]/30 px-6 py-4 sticky top-0 z-30 flex justify-between items-center shadow-sm">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A67C52]">SOAL {indexSekarang + 1} / {soal.length}</div>
        <div className="bg-[#5D4037] text-[#E6CEA0] px-4 py-1.5 rounded-xl font-mono font-black text-sm shadow-inner">{formatTime(timeLeft)}</div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#E6CEA0]/20 shadow-sm mb-6 flex flex-col items-center gap-4">
            {s?.image_url && (
              <img src={s.image_url} alt="Figural" className="max-h-60 object-contain rounded-xl border-2 border-[#FDFBF9] shadow-sm" />
            )}
            <p className="text-sm md:text-base font-bold leading-relaxed text-left w-full">{s?.pertanyaan}</p>
          </div>

          <div className="space-y-3">
            {['a', 'b', 'c', 'd', 'e'].map((opt) => (
              <button
                key={opt}
                onClick={() => setJawabanUser({...jawabanUser, [s.id]: opt})}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left text-xs font-bold ${
                  jawabanUser[s.id] === opt ? 'border-[#5D4037] bg-[#5D4037]/5 shadow-md' : 'border-white bg-white hover:border-[#E6CEA0]'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-colors ${jawabanUser[s.id] === opt ? 'bg-[#5D4037] text-white' : 'bg-[#FDFBF9] text-[#A67C52]'}`}>{opt.toUpperCase()}</span>
                <span className="flex-1">{s?.[`opsi_${opt}`]}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-10">
            <button disabled={indexSekarang === 0} onClick={() => setIndexSekarang(i => i - 1)} className="text-[10px] font-black text-[#A67C52] uppercase tracking-[0.2em] disabled:opacity-0 hover:text-[#5D4037]">← Kembali</button>
            {indexSekarang === soal.length - 1 ? (
              <button onClick={() => { if(confirm("Yakin ingin mengakhiri ujian?")) hitungSkor() }} className="px-10 py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-red-700 transition-transform active:scale-95">Selesai Ujian</button>
            ) : (
              <button onClick={() => setIndexSekarang(i => i + 1)} className="px-10 py-3 bg-[#5D4037] text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-[#42271E] transition-transform active:scale-95">Lanjut →</button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[2.5rem] border border-[#E6CEA0]/20 shadow-sm sticky top-24">
            <p className="text-[9px] font-black text-[#A67C52] uppercase mb-4 text-center tracking-[0.3em]">Navigasi Soal</p>
            <div className="grid grid-cols-5 gap-2 mb-6 max-h-[40vh] overflow-y-auto pr-1">
              {soal.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setIndexSekarang(i)}
                  className={`h-8 rounded-lg flex items-center justify-center text-[9px] font-black transition-all ${
                    indexSekarang === i ? 'bg-[#5D4037] text-white ring-4 ring-[#5D4037]/10' : jawabanUser[item.id] ? 'bg-[#E6CEA0] text-[#5D4037]' : 'bg-[#FDFBF9] border border-[#E6CEA0]/30 text-[#A67C52]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => { if(confirm("Sudah selesai mengerjakan semua?")) hitungSkor() }} 
              className="w-full py-4 bg-[#A67C52] text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-[#5D4037] transition shadow-lg shadow-[#A67C52]/20"
            >
              Kumpulkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UjianPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-black uppercase text-[10px] tracking-widest text-[#5D4037]">Mempersiapkan Ujian...</div>}>
      <UjianContent />
    </Suspense>
  );
}