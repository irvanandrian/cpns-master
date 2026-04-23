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
    const preventRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', preventRightClick);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12") e.preventDefault();
      
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        alert("Screenshot dilarang untuk melindungi hak cipta soal!");
        e.preventDefault();
      }

      if (e.ctrlKey && (e.key === 'c' || e.key === 's' || e.key === 'p' || (e.shiftKey && (e.key === 'I' || e.key === 'S')))) {
        e.preventDefault();
        return false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

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
                 {/* JAWABAN USER */}
                 <span className={`text-[9px] font-black px-3 py-1 rounded-full ${!item.jawabanUser ? 'bg-gray-100' : item.jawabanUser.toLowerCase().trim() === item.kunci.toLowerCase().trim() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   ANDA: {item.jawabanUser?.toUpperCase() || "KOSONG"}
                 </span>
                 
                 {/* KUNCI JAWABAN */}
                 <span className="text-[9px] font-black px-3 py-1 rounded-full bg-green-500 text-white uppercase shadow-sm">
                   KUNCI: {item.kunci?.toUpperCase()}
                 </span>

                 <span className="text-[9px] font-black px-3 py-1 rounded-full bg-[#5D4037] text-white">
                   POIN: {item.poinDidapat}
                 </span>
               </div>
            </div>

            <div className="font-bold text-sm mb-4 leading-relaxed text-[#5D4037] flex gap-2">
              <span className="opacity-40 text-xs shrink-0">#{idx + 1}</span> 
              <div className="flex-1">
                <RenderSoal content={item.pertanyaan} />
              </div>
            </div>

            {item.image_url && (
              <div className="mb-6 rounded-xl overflow-hidden border border-[#E6CEA0]/20 bg-[#FDFBF9] flex justify-center">
                <img 
                  src={item.image_url} 
                  alt={`Gambar Soal ${idx + 1}`} 
                  className="max-h-[300px] object-contain p-2"
                />
              </div>
            )}
            
            {/* --- LOGIKA PERBANDINGAN JAWABAN --- */}
            <div className="grid grid-cols-1 gap-2 mb-6">
               {['a','b','c','d','e'].map((opt) => {
                 // Normalisasi pengecekan (huruf kecil & hapus spasi)
                 const currentOpt = opt.toLowerCase().trim();
                 const userAns = item.jawabanUser?.toLowerCase().trim();
                 const correctAns = item.kunci?.toLowerCase().trim();

                 const isUserChoice = userAns === currentOpt;
                 const isCorrectKey = correctAns === currentOpt;
                 
                 let statusClasses = "border-gray-100 bg-gray-50/20 opacity-60"; 
                 if (isCorrectKey) statusClasses = "border-green-500 bg-green-50/50 ring-1 ring-green-500 opacity-100"; 
                 else if (isUserChoice && !isCorrectKey) statusClasses = "border-red-500 bg-red-50/50 opacity-100"; 

                 return (
                   <div 
                     key={opt} 
                     className={`p-4 rounded-xl text-[11px] font-bold border transition-all ${statusClasses}`}
                   >
                     <div className="flex justify-between items-center gap-4">
                       <div className="flex items-start gap-2">
                          <span className={`uppercase shrink-0 ${isUserChoice || isCorrectKey ? 'opacity-100' : 'opacity-30'}`}>{opt}.</span> 
                          <RenderSoal content={item[`opsi_${opt}`]} />
                       </div>
                       
                       <div className="flex flex-col gap-1 items-end shrink-0">
                         {isCorrectKey && (
                           <span className="text-[7px] bg-green-600 text-white px-2 py-1 rounded font-black uppercase shadow-sm">
                             ✓ Kunci Jawaban
                           </span>
                         )}
                         {isUserChoice && (
                           <span className={`text-[7px] px-2 py-1 rounded font-black uppercase shadow-sm ${isCorrectKey ? 'bg-[#5D4037] text-white' : 'bg-red-600 text-white'}`}>
                             {isCorrectKey ? "Jawaban Anda (Benar)" : "Jawaban Anda (Salah)"}
                           </span>
                         )}
                       </div>
                     </div>
                   </div>
                 );
               })}
            </div>

            <div className="p-5 bg-[#FDFBF9] rounded-2xl border border-[#E6CEA0]/20">
              <p className="text-[10px] font-black text-[#A67C52] uppercase mb-2">Penjelasan Pembahasan:</p>
              <div className="text-xs text-[#5D4037] italic leading-relaxed">
                <RenderSoal content={item.pembahasan || "Tidak ada pembahasan spesifik untuk soal ini."} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}