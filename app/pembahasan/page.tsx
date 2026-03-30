"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RenderSoal from '../components/RenderSoal'; // Pastikan path import benar

export default function PembahasanPage() {
  const [data, setData] = useState<any>(null);
  const [view, setView] = useState<'skor' | 'review'>('skor');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- FITUR ANTI SCREENSHOT & ANTI COPY ---
  useEffect(() => {
    // 1. Cegah Klik Kanan
    const preventRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', preventRightClick);

    // 2. Cegah Shortcut Keyboard (Print, Copy, DevTools, Save)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cegah F12
      if (e.key === "F12") e.preventDefault();
      
      // Cegah PrintScreen
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        alert("Screenshot dilarang untuk melindungi hak cipta soal!");
        e.preventDefault();
      }

      // Cegah Ctrl+C, Ctrl+S, Ctrl+P, Ctrl+Shift+I, Ctrl+Shift+S
      if (e.ctrlKey && (e.key === 'c' || e.key === 's' || e.key === 'p' || (e.shiftKey && (e.key === 'I' || e.key === 'S')))) {
        e.preventDefault();
        return false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 3. Bersihkan Clipboard secara berkala
    const clearClipboard = setInterval(() => {
      navigator.clipboard.writeText("Konten Dilindungi GaskeunNIP").catch(() => {});
    }, 2000);

    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(clearClipboard);
    };
  }, []);

  useEffect(() => {
    const bungkusanData = localStorage.getItem('terakhir_ujian');
    
    if (!bungkusanData) {
      console.error("Tidak ada data ujian ditemukan!");
      router.push('/dashboard');
      return;
    }

    try {
      const parsed = JSON.parse(bungkusanData);
      
      if (parsed && parsed.dataReview && Array.isArray(parsed.dataReview)) {
        setData(parsed);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error("Gagal membaca data storage", err);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#5D4037] bg-[#FDFBF9]">MENYIAPKAN PEMBAHASAN...</div>;
  if (!data) return null;

  // --- TAMPILAN SKOR ---
  if (view === 'skor') {
    return (
      <div className="h-screen bg-[#FDFBF9] flex items-center justify-center p-6 text-center select-none">
        {/* CSS PROTEKSI */}
        <style jsx global>{`
          @media print { body { display: none !important; } }
          body { -webkit-user-select: none; user-select: none; }
        `}</style>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#E6CEA0]/20 max-w-sm w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#5D4037]"></div>
          <h2 className="font-black text-[#5D4037] mb-4 uppercase text-[10px] tracking-[0.3em]">Hasil Skor</h2>
          <div className="text-6xl font-black text-[#A67C52] mb-8 tracking-tighter">{data.totalSkor}</div>
          
          <div className="grid grid-cols-2 gap-2 mb-8 text-[8px] font-black uppercase text-left">
             {data.skorKategori && Object.keys(data.skorKategori).map((kat) => (
               <div key={kat} className="bg-[#FDFBF9] p-2 rounded-lg border border-[#E6CEA0]/20">
                 <div className="text-[#A67C52]">{kat}</div>
                 <div className="text-sm font-black text-[#5D4037]">{data.skorKategori[kat]}</div>
               </div>
             ))}
          </div>

          <button 
            onClick={() => setView('review')} 
            className="w-full bg-[#5D4037] text-white py-4 rounded-2xl font-black text-[10px] mb-3 uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
          >
            Lihat Pembahasan ({data.dataReview.length} Soal)
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('terakhir_ujian');
              router.push('/dashboard');
            }} 
            className="w-full border-2 border-[#5D4037]/10 py-4 rounded-2xl font-black text-[10px] uppercase text-[#5D4037] hover:bg-[#5D4037]/5"
          >
            Selesai & Keluar
          </button>
        </div>
      </div>
    );
  }

  // --- TAMPILAN REVIEW PEMBAHASAN ---
  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] pb-10 select-none">
      {/* CSS PROTEKSI */}
      <style jsx global>{`
        @media print { body { display: none !important; } }
        body { -webkit-user-select: none; user-select: none; }
      `}</style>

      <div className="sticky top-0 bg-white border-b border-[#E6CEA0]/30 p-4 flex justify-between items-center z-50 shadow-sm">
        <button onClick={() => setView('skor')} className="text-[10px] font-black uppercase text-[#A67C52] hover:underline">← Kembali</button>
        <h2 className="font-black uppercase text-xs tracking-tighter text-[#5D4037]">Review: {data.dataReview.length} Soal</h2>
        <div className="w-10"></div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6 mt-4">
        {data.dataReview.map((item: any, idx: number) => (
          <div key={item.id || idx} className="bg-white p-6 rounded-[2rem] border border-[#E6CEA0]/30 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${item.poinDidapat >= 5 ? 'bg-green-500' : item.poinDidapat > 0 ? 'bg-orange-400' : 'bg-red-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
               <span className="bg-[#FDFBF9] text-[#A67C52] px-3 py-1 rounded-full text-[9px] font-black uppercase border border-[#E6CEA0]/30">
                 {item.kategori}
               </span>
               <div className="flex gap-2">
                 <span className="text-[9px] font-black px-3 py-1 rounded-full bg-gray-100">
                   ANDA: {item.jawabanUser?.toUpperCase() || "-"}
                 </span>
                 <span className="text-[9px] font-black px-3 py-1 rounded-full bg-[#5D4037] text-white">
                   POIN: {item.poinDidapat}
                 </span>
               </div>
            </div>

            {/* RENDER PERTANYAAN (LATEX) */}
            <div className="font-bold text-sm mb-4 leading-relaxed text-[#5D4037] flex gap-2">
              <span className="opacity-40 text-xs shrink-0">#{idx + 1}</span> 
              <div className="flex-1">
                <RenderSoal content={item.pertanyaan} />
              </div>
            </div>

            {/* TAMBAHAN: RENDER IMAGE_URL JIKA ADA */}
            {item.image_url && (
              <div className="mb-6 rounded-xl overflow-hidden border border-[#E6CEA0]/20 bg-[#FDFBF9] flex justify-center">
                <img 
                  src={item.image_url} 
                  alt={`Gambar Soal ${idx + 1}`} 
                  className="max-h-[300px] object-contain p-2"
                />
              </div>
            )}
            
            {/* RENDER OPSI (LATEX) */}
            <div className="grid grid-cols-1 gap-2 mb-6">
               {['a','b','c','d','e'].map((opt) => (
                 <div 
                   key={opt} 
                   className={`p-4 rounded-xl text-[11px] font-bold border ${
                     item.jawabanUser === opt ? 'border-[#5D4037] bg-[#5D4037]/5' : 'border-gray-50 bg-gray-50/30'
                   }`}
                 >
                   <div className="flex justify-between items-center gap-4">
                     <div className="flex items-start gap-2">
                        <span className="uppercase opacity-30 shrink-0">{opt}.</span> 
                        <RenderSoal content={item[`opsi_${opt}`]} />
                     </div>
                     {item.kunci === opt && (
                       <span className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded font-black uppercase shrink-0">Kunci</span>
                     )}
                   </div>
                 </div>
               ))}
            </div>

            {/* RENDER PEMBAHASAN (LATEX) */}
            <div className="p-5 bg-[#FDFBF9] rounded-2xl border border-[#E6CEA0]/20">
              <p className="text-[10px] font-black text-[#A67C52] uppercase mb-2">Pembahasan:</p>
              <div className="text-xs text-[#5D4037] italic leading-relaxed">
                <RenderSoal content={item.pembahasan || "Tidak ada pembahasan."} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}