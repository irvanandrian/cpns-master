"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Konfigurasi Pool Karakter
const POOLS = {
  HURUF: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  ANGKA: "0123456789",
  // Mengganti simbol umum dengan karakter alfabet Yunani
  SIMBOL: "ΩΓβθΔΣΦΨπλΞ" 
};

type TestType = 'HURUF' | 'ANGKA' | 'SIMBOL' | null;

export default function TesKecermatanPage() {
  const router = useRouter();
  
  // --- STATES ---
  const [testType, setTestType] = useState<TestType>(null);
  const [currentColumn, setCurrentColumn] = useState(1);
  const [masterKeys, setMasterKeys] = useState<{ id: string, chars: string[] }[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { isCorrect: boolean }>>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // --- LOGIKA GENERATE KUNCI & SOAL ---
  const generateNewColumnData = (selectedType: TestType) => {
    if (!selectedType) return;
    
    const pool = POOLS[selectedType].split('');
    
    const newKeys = ['A', 'B', 'C', 'D', 'E'].map((id) => {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      return {
        id,
        chars: shuffled.slice(0, 5)
      };
    });

    const newQuestions = Array.from({ length: 100 }, () => {
      const randomKey = newKeys[Math.floor(Math.random() * newKeys.length)];
      return [...randomKey.chars].sort(() => Math.random() - 0.5).join('');
    });

    setMasterKeys(newKeys);
    setQuestions(newQuestions);
    setCurrentIdx(0);
    setTimeLeft(60);
  };

  // --- EFFECT: TIMER ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished) {
      if (timeLeft <= 0) {
        if (currentColumn < 10) {
          setCurrentColumn(prev => prev + 1);
          generateNewColumnData(testType);
        } else {
          setIsFinished(true);
        }
      } else {
        timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft, currentColumn, isFinished, testType]);

  // --- LOGIKA JAWAB ---
  const handleAnswer = (choiceId: string) => {
    if (isFinished || !isStarted) return;

    const currentChars = questions[currentIdx].split('').sort().join('');
    const selectedKeyChars = masterKeys.find(k => k.id === choiceId)?.chars.sort().join('');
    const isCorrect = currentChars === selectedKeyChars;

    setAnswers(prev => ({
      ...prev,
      [`${currentColumn}_${currentIdx}`]: { isCorrect }
    }));

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D', 'E'].includes(key)) handleAnswer(key);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIdx, masterKeys, isStarted]);

  // --- 1. TAMPILAN PEMILIHAN MENU ---
  if (!testType) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 text-[#5D4037]">
        <h1 className="text-4xl font-black uppercase mb-2 tracking-tighter">Mode Kecermatan</h1>
        <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.3em] mb-12">Pilih kategori latihan kamu</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {[
            { id: 'HURUF', icon: 'Az', desc: 'Latihan Huruf Hilang' },
            { id: 'ANGKA', icon: '12', desc: 'Latihan Angka Hilang' },
            { id: 'SIMBOL', icon: 'Ωθ', desc: 'Latihan Simbol Hilang' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTestType(item.id as TestType)}
              className="bg-white border-2 border-[#5D4037]/5 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:border-[#E6CEA0] transition-all group"
            >
              <div className="text-4xl font-black mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className="font-black text-sm uppercase mb-2">{item.id}</div>
              <div className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- 2. TAMPILAN START (INSTRUKSI) ---
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 text-[#5D4037]">
        <div className="bg-white p-12 rounded-[3.5rem] border-2 border-[#5D4037]/5 shadow-xl text-center max-w-md w-full">
          <div className="bg-[#E6CEA0] w-16 h-16 rounded-3xl flex items-center justify-center text-2xl mb-8 mx-auto shadow-inner">
             {testType === 'HURUF' ? 'A' : testType === 'ANGKA' ? '1' : 'Ω'}
          </div>
          <h2 className="text-2xl font-black uppercase mb-2 tracking-tight">Siap Mulai?</h2>
          <p className="text-[10px] font-black text-[#A67C52] uppercase tracking-widest mb-6">Mode: {testType}</p>
          <p className="text-xs font-bold leading-relaxed opacity-60 mb-8 uppercase">10 Kolom x 60 Detik<br/>Fokus pada kecermatan visual anda.</p>
          <button 
            onClick={() => { setIsStarted(true); generateNewColumnData(testType); }}
            className="w-full bg-[#5D4037] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    );
  }

  // --- 3. TAMPILAN FINISH ---
  if (isFinished) {
    const totalCorrect = Object.values(answers).filter(a => a.isCorrect).length;
    return (
      <div className="h-screen bg-[#FDFBF9] flex items-center justify-center p-6 text-[#5D4037]">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#E6CEA0]/20 max-w-sm w-full text-center">
          <h2 className="font-black mb-2 uppercase text-[10px] tracking-[0.3em]">Hasil Latihan {testType}</h2>
          <div className="text-6xl font-black text-[#A67C52] mb-2">{totalCorrect}</div>
          <p className="text-[10px] font-bold uppercase mb-8 opacity-50">Total Jawaban Benar</p>
          <button onClick={() => window.location.reload()} className="w-full bg-[#5D4037] text-white py-4 rounded-2xl font-black text-[10px] mb-3 uppercase shadow-lg">Ganti Menu</button>
          <button onClick={() => router.push('/')} className="w-full border-2 border-[#5D4037]/10 py-4 rounded-2xl font-black text-[10px] uppercase">Menu Utama</button>
        </div>
      </div>
    );
  }

  // --- 4. TAMPILAN UTAMA TES ---
  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#5D4037] flex flex-col items-center p-4 select-none animate-in fade-in duration-500 relative">
      
      {/* Tombol Selesai (Pojok Kanan Atas) */}
      <button 
        onClick={() => {
          if(confirm("Apakah Anda yakin ingin mengakhiri sesi latihan ini lebih awal?")) {
            setIsFinished(true);
          }
        }}
        className="absolute top-6 right-6 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm z-50"
      >
        Selesai
      </button>

      {/* Header & Status */}
      <div className="w-full max-w-xl flex justify-between items-center mt-12 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-[#E6CEA0]/30">
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase opacity-40 tracking-widest">Kolom</span>
          <span className="font-black text-sm uppercase text-[#A67C52]">{currentColumn} / 10</span>
        </div>
        
        <div className={`px-6 py-2 rounded-xl font-mono font-black text-xl shadow-inner ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-[#FDFBF9] border border-[#5D4037]/10'}`}>
          00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </div>

        <div className="flex flex-col items-end text-right">
          <span className="text-[8px] font-black uppercase opacity-40 tracking-widest">Mode</span>
          <span className="font-black text-sm uppercase text-[#5D4037]">{testType}</span>
        </div>
      </div>

      {/* Tabel Kunci */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-xl mb-8">
        {masterKeys.map((item) => (
          <div key={item.id} className="bg-white border-2 border-[#5D4037]/10 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#5D4037] text-white text-center py-1 font-black text-sm">{item.id}</div>
            <div className="flex flex-col items-center py-3 gap-1">
              {item.chars.map((char, i) => (
                <span key={i} className="font-bold text-sm tracking-tighter">{char}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Kotak Soal */}
      <div className="w-full max-w-md bg-white border-4 border-[#5D4037] rounded-[2.5rem] p-12 mb-8 text-center shadow-xl relative">
        <span className="text-4xl md:text-5xl font-black tracking-[0.3em] pl-[0.3em]">
          {questions[currentIdx]}
        </span>
      </div>

      {/* Input Jawaban */}
      <div className="grid grid-cols-5 gap-4 w-full max-w-xl">
        {['A', 'B', 'C', 'D', 'E'].map((letter) => (
          <button
            key={letter}
            onClick={() => handleAnswer(letter)}
            className="aspect-square bg-white border-2 border-[#5D4037]/20 rounded-2xl flex items-center justify-center text-2xl font-black hover:bg-[#5D4037] hover:text-white transition-all active:scale-90 shadow-sm"
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="mt-8 flex gap-4 opacity-20 italic font-bold text-[9px] uppercase tracking-widest">
        <span>Gunakan Keyboard A-E untuk kecepatan</span>
      </div>
    </div>
  );
}