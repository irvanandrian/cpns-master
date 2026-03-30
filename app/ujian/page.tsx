"use client";
import React, { useEffect, useState, Suspense, useRef } from 'react';
import RenderSoal from '../components/RenderSoal'; // Sesuaikan foldernya
import { supabase } from '../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

function UjianContent() {
  const [soal, setSoal] = useState<any[]>([]);
  const [indexSekarang, setIndexSekarang] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(100 * 60);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [dataReview, setDataReview] = useState<any[]>([]);

  const [skorKategori, setSkorKategori] = useState<any>({});
  const [totalSkor, setTotalSkor] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const paketDipilih = searchParams.get('paket') || "1";
  const jenisUjian = (searchParams.get('jenis') || "cpns").toLowerCase();

  const hitungSkorRef = useRef<() => void>(undefined);
  const isFinishedRef = useRef(false);

  useEffect(() => {
    isFinishedRef.current = isFinished;
  }, [isFinished]);

  // --- FITUR ANTI CURANG & ANTI SCREENSHOT ---
  useEffect(() => {
    const handleViolation = () => {
      if (!isFinishedRef.current && !loading && soal.length > 0) {
        alert("Peringatan: Anda meninggalkan halaman ujian. Ujian otomatis dihentikan.");
        if (hitungSkorRef.current) hitungSkorRef.current();
      }
    };

    window.addEventListener('blur', handleViolation);
    const handleVisibilityChange = () => { if (document.visibilityState === 'hidden') handleViolation(); };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const preventRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', preventRightClick);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12") e.preventDefault();
      
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText(""); 
        alert("Screenshot dilarang!");
        e.preventDefault();
      }

      if (e.ctrlKey && (e.key === 'c' || e.key === 's' || e.key === 'p' || (e.shiftKey && (e.key === 'I' || e.key === 'S')))) {
        e.preventDefault();
        return false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const clearClipboard = setInterval(() => {
      if (!isFinishedRef.current) {
        navigator.clipboard.writeText("Konten Dilindungi GaskeunNIP").catch(() => {});
      }
    }, 2000);

    return () => {
      window.removeEventListener('blur', handleViolation);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', preventRightClick);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(clearClipboard);
    };
  }, [loading, soal.length]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchSoal = async () => {
      setLoading(true);
      localStorage.removeItem('terakhir_ujian');

      setSoal([]);
      setDataReview([]);
      setJawabanUser({});
      setIndexSekarang(0);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data, error } = await supabase
        .from('soal')
        .select('*')
        .eq('paket_id', paketDipilih)
        .eq('jenis_ujian', jenisUjian);

      if (!error && data) {
        const urutan = {
          "TWK": 1, "TIU": 2, "TKP": 3,
          "TPA": 1, "TBI": 2,
          "PU": 1, "PBM": 2, "PPU": 3, "PK": 4, "LBIND": 5, "LBING": 6, "PM": 7
        };
        const sortedData = data.sort((a: any, b: any) =>
          (urutan[a.kategori as keyof typeof urutan] || 99) - (urutan[b.kategori as keyof typeof urutan] || 99)
        );
        setSoal(sortedData);
      }
      setLoading(false);
    };
    fetchSoal();
  }, [paketDipilih, jenisUjian, router]);

  // --- LOGIKA HITUNG SKOR ---
  const hitungSkor = () => {
    if (isFinishedRef.current || soal.length === 0) return;

    let totalSemua = 0;
    const recapKategori: any = {};
    const reviewTemp: any[] = [];

    const poinStandarBenar = (jenisUjian === 'cpns' || jenisUjian === 'kedinasan') ? 5 : 1;

    soal.forEach((item) => {
      const pilihanUser = jawabanUser[item.id] || null;
      const kat = item.kategori || "UMUM";
      let poin = 0;

      if (!recapKategori[kat]) recapKategori[kat] = 0;

      const hasPointSystem = item.poin_a !== undefined && item.poin_a !== null && item.poin_a !== 0;

      if (hasPointSystem) {
        const fieldPoin = `poin_${pilihanUser?.toLowerCase()}`;
        poin = parseInt(item[fieldPoin]) || 0;
      } else {
        if (pilihanUser?.toLowerCase() === item.kunci?.toLowerCase()) {
          poin = poinStandarBenar;
        }
      }

      recapKategori[kat] += poin;
      totalSemua += poin;

      reviewTemp.push({
        ...item,
        jawabanUser: pilihanUser,
        poinDidapat: poin
      });
    });

    setSkorKategori(recapKategori);
    setTotalSkor(totalSemua);
    setDataReview(reviewTemp);
    setIsFinished(true);

    const hasilUjian = {
      totalSkor: totalSemua,
      skorKategori: recapKategori,
      dataReview: reviewTemp,
      jenisUjian: jenisUjian
    };
    localStorage.setItem('terakhir_ujian', JSON.stringify(hasilUjian));
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

  if (!loading && soal.length === 0) {
    return (
      <div className="h-screen bg-[#FDFBF9] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#E6CEA0]/20 max-w-sm w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
          <div className="text-5xl mb-6">📭</div>
          <h2 className="font-black text-[#5D4037] mb-4 uppercase text-[12px] tracking-[0.3em]">Mohon Maaf</h2>
          <p className="text-[#A67C52] font-bold text-[10px] uppercase leading-relaxed mb-8">
            Soal untuk paket ini belum tersedia atau masih dalam proses upload oleh admin.
          </p>
          <button onClick={() => router.push('/dashboard')} className="w-full bg-[#5D4037] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Kembali ke Dashboard</button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="h-screen bg-[#FDFBF9] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#E6CEA0]/20 max-w-sm w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#5D4037]"></div>
          <h2 className="font-black text-[#5D4037] mb-4 uppercase text-[10px] tracking-[0.3em]">Hasil Skor {jenisUjian}</h2>
          <div className="text-6xl font-black text-[#A67C52] mb-8 tracking-tighter">{totalSkor}</div>

          <div className="grid grid-cols-2 gap-2 mb-8 text-[8px] font-black uppercase">
            {Object.keys(skorKategori).map((kat) => (
              <div key={kat} className="bg-[#FDFBF9] p-2 rounded-lg border border-[#E6CEA0]/20">
                <div className="text-[#A67C52]">{kat}</div>
                <div className="text-sm">{skorKategori[kat]}</div>
              </div>
            ))}
          </div>

          <button onClick={() => router.push('/pembahasan')} className="w-full bg-[#5D4037] text-white py-4 rounded-2xl font-black text-[10px] mb-3 uppercase tracking-widest shadow-lg">Lihat Pembahasan</button>
          <button onClick={() => router.push('/dashboard')} className="w-full border-2 border-[#5D4037]/10 py-4 rounded-2xl font-black text-[10px] uppercase text-[#5D4037] hover:bg-[#5D4037]/5">Dashboard</button>
        </div>
      </div>
    );
  }

  const s = soal[indexSekarang];

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans pb-20 select-none">
      <style jsx global>{`
        @media print { body { display: none !important; } }
        body { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
      `}</style>

      <div className="bg-white border-b border-[#E6CEA0]/30 px-6 py-4 sticky top-0 z-30 flex justify-between items-center shadow-sm">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A67C52]">SOAL {indexSekarang + 1} / {soal.length}</div>
        <div className="bg-[#5D4037] text-[#E6CEA0] px-4 py-1.5 rounded-xl font-mono font-black text-sm shadow-inner">{formatTime(timeLeft)}</div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#E6CEA0]/20 shadow-sm mb-6 flex flex-col items-center gap-4">
            {s?.image_url && <img src={s.image_url} alt="soal" className="max-h-60 object-contain rounded-xl border-2 border-[#FDFBF9] shadow-sm pointer-events-none" />}
            <div className="text-sm md:text-base font-bold leading-relaxed text-left w-full">
              <RenderSoal content={s?.pertanyaan || ""} />
            </div>
          </div>

          <div className="space-y-3">
            {['a', 'b', 'c', 'd', 'e'].map((opt) => (
              <button
                key={opt}
                onClick={() => setJawabanUser({ ...jawabanUser, [s.id]: opt })}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left text-xs font-bold ${jawabanUser[s.id] === opt ? 'border-[#5D4037] bg-[#5D4037]/5 shadow-md' : 'border-white bg-white hover:border-[#E6CEA0]'}`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${jawabanUser[s.id] === opt ? 'bg-[#5D4037] text-white' : 'bg-[#FDFBF9] text-[#A67C52]'}`}>{opt.toUpperCase()}</span>
                <div className="flex-1 text-left">
                  <RenderSoal content={s?.[`opsi_${opt}`] || ""} />
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-10">
            <button disabled={indexSekarang === 0} onClick={() => setIndexSekarang(i => i - 1)} className="text-[10px] font-black text-[#A67C52] uppercase tracking-[0.2em] disabled:opacity-0">← Kembali</button>
            {indexSekarang === soal.length - 1 ? (
              <button onClick={() => { if (confirm("Yakin ingin mengakhiri ujian?")) hitungSkor() }} className="px-10 py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Selesai Ujian</button>
            ) : (
              <button onClick={() => setIndexSekarang(i => i + 1)} className="px-10 py-3 bg-[#5D4037] text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Lanjut →</button>
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
                  className={`h-8 rounded-lg flex items-center justify-center text-[9px] font-black transition-all ${indexSekarang === i ? 'bg-[#5D4037] text-white ring-4 ring-[#5D4037]/10' : jawabanUser[item.id] ? 'bg-[#E6CEA0] text-[#5D4037]' : 'bg-[#FDFBF9] border border-[#E6CEA0]/30 text-[#A67C52]'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            {/* --- BAGIAN TOMBOL LANJUT & KUMPULKAN BERDAMPINGAN --- */}
            <div className="flex gap-2">
              {indexSekarang < soal.length - 1 && (
                <button 
                  onClick={() => setIndexSekarang(i => i + 1)} 
                  className="flex-1 py-4 bg-[#FDFBF9] border border-[#A67C52]/30 text-[#A67C52] rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-sm hover:bg-[#A67C52]/5 transition-all"
                >
                  Lanjut
                </button>
              )}
              <button 
                onClick={() => { if (confirm("Sudah selesai mengerjakan semua?")) hitungSkor() }} 
                className={`py-4 bg-[#A67C52] text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-[#A67C52]/20 ${indexSekarang < soal.length - 1 ? 'flex-[1.5]' : 'w-full'}`}
              >
                Kumpulkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UjianPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UjianContent />
    </Suspense>
  );
}