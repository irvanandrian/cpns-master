"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const POOLS = {
  HURUF: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  ANGKA: "0123456789",
  SIMBOL: "ΩΓβθΔΣΦΨπλΞ",
  ROMAWI: "IVXLCDM"
};

type TestType = 'HURUF' | 'ANGKA' | 'SIMBOL' | 'ROMAWI' | null;

interface Score {
  correct: number;
  wrong: number;
}

export default function TesKecermatanPage() {
  const router = useRouter();
  
  const [testType, setTestType] = useState<TestType>(null);
  const [currentColumn, setCurrentColumn] = useState(1);
  const [masterKey, setMasterKey] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState<Score>({ correct: 0, wrong: 0 });
  const [timeLeft, setTimeLeft] = useState(60);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const generateQuestion = useCallback((selectedType: TestType) => {
    if (!selectedType) return;
    const pool = POOLS[selectedType].split('');
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const selectedMaster = shuffledPool.slice(0, 5);
    setMasterKey(selectedMaster);

    const randomIndex = Math.floor(Math.random() * 5);
    const missingChar = selectedMaster[randomIndex];
    setCorrectAnswer(['A', 'B', 'C', 'D', 'E'][randomIndex]);

    const questionChars = selectedMaster.filter(char => char !== missingChar);
    setCurrentQuestion([...questionChars].sort(() => Math.random() - 0.5));
  }, []);

  const handleNextColumn = useCallback(() => {
    if (currentColumn < 20) { // Berubah jadi 20 kolom
      setCurrentColumn(prev => prev + 1);
      generateQuestion(testType);
      setTimeLeft(60);
    } else {
      setIsFinished(true);
    }
  }, [currentColumn, testType, generateQuestion]);

  const handleManualFinish = () => {
    if (confirm("Apakah Anda yakin ingin mengakhiri tes sekarang? Skor Anda akan langsung disimpan.")) {
      setIsFinished(true);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished) {
      if (timeLeft <= 0) {
        handleNextColumn();
      } else {
        timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft, isFinished, handleNextColumn]);

  const handleAnswer = (choiceId: string) => {
    if (isFinished || !isStarted) return;
    if (choiceId === correctAnswer) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }
    generateQuestion(testType);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D', 'E'].includes(key)) handleAnswer(key);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [correctAnswer, isStarted]);

  // --- UI: PEMILIHAN MENU ---
  if (!testType) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 text-[#5D4037]">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tighter mb-2 italic uppercase">Kecermatan Polri</h1>
          <div className="h-1 w-20 bg-[#A67C52] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {[
            { id: 'ANGKA', icon: '12', label: 'Angka Hilang' },
            { id: 'HURUF', icon: 'Az', label: 'Huruf Hilang' },
            { id: 'SIMBOL', icon: 'Ωθ', label: 'Simbol/Alpha' },
            { id: 'ROMAWI', icon: 'VI', label: 'Angka Romawi' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTestType(item.id as TestType)}
              className="bg-white border-2 border-[#5D4037]/5 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-[#A67C52] transition-all group flex items-center gap-6"
            >
              <div className="text-4xl bg-[#FDFBF9] p-4 rounded-3xl group-hover:bg-[#A67C52] group-hover:text-white transition-colors">{item.icon}</div>
              <div className="text-left">
                <div className="font-black text-xl uppercase tracking-tight">{item.label}</div>
                <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">20 Kolom x 60 Detik</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- UI: START (INSTRUKSI) ---
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3.5rem] text-center max-w-md w-full shadow-2xl border border-[#5D4037]/5">
          <div className="w-20 h-20 bg-[#FDFBF9] rounded-full flex items-center justify-center text-4xl mb-8 mx-auto shadow-inner">🎯</div>
          <h2 className="text-2xl font-black text-[#5D4037] uppercase mb-4 tracking-tight">Aturan Main</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10">
            Temukan karakter yang ada di <span className="text-[#A67C52] font-bold">Baris Atas</span> tetapi menghilang di <span className="text-[#A67C52] font-bold">Kotak Tengah</span>.
          </p>
          <button 
            onClick={() => { setIsStarted(true); generateQuestion(testType); }}
            className="w-full bg-[#5D4037] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#A67C52] transition-all shadow-lg shadow-[#5D4037]/20"
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    );
  }

  // --- UI: HASIL AKHIR ---
  if (isFinished) {
    const totalInput = score.correct + score.wrong;
    const accuracy = totalInput > 0 ? Math.round((score.correct / totalInput) * 100) : 0;
    
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl max-w-md w-full text-center border-2 border-[#5D4037]/5">
          <h2 className="font-black text-[#5D4037] text-2xl uppercase mb-10 tracking-tight">Evaluasi Tes</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#FDFBF9] p-8 rounded-3xl border border-[#5D4037]/5">
              <div className="text-4xl font-black text-[#A67C52]">{score.correct}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Benar</div>
            </div>
            <div className="bg-[#FDFBF9] p-8 rounded-3xl border border-[#5D4037]/5">
              <div className="text-4xl font-black text-red-400">{score.wrong}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Salah</div>
            </div>
          </div>

          <div className="bg-[#5D4037] text-white p-6 rounded-3xl mb-10">
            <div className="text-sm font-bold opacity-60 uppercase tracking-[0.2em] mb-1">Akurasi</div>
            <div className="text-3xl font-black">{accuracy}%</div>
          </div>

          <button onClick={() => window.location.reload()} className="w-full bg-[#5D4037] text-white py-5 rounded-2xl font-black uppercase mb-3 shadow-lg">Ulangi Tes</button>
          <button onClick={() => router.push('/')} className="w-full py-5 rounded-2xl font-black uppercase text-gray-300 hover:text-[#5D4037] transition-colors">Keluar</button>
        </div>
      </div>
    );
  }

  // --- UI: UTAMA TES ---
  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#5D4037] flex flex-col items-center p-6 select-none relative">
      
      {/* Tombol Selesai */}
      <button 
        onClick={handleManualFinish}
        className="absolute top-8 right-8 px-6 py-2 bg-white border-2 border-red-100 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
      >
        Selesai Manual
      </button>

      {/* Header Statis */}
      <div className="w-full max-w-2xl flex justify-between items-end mt-12 mb-10 px-4">
        <div>
          <p className="text-[10px] font-black text-[#A67C52] uppercase tracking-[0.3em] mb-1">Kemajuan</p>
          <p className="text-2xl font-black">Kolom {currentColumn}<span className="text-gray-200">/20</span></p>
        </div>

        <div className={`px-10 py-4 rounded-[2rem] font-mono font-black text-3xl shadow-xl border-4 ${timeLeft <= 10 ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-white text-[#5D4037] border-[#FDFBF9]'}`}>
          {timeLeft}s
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black text-[#A67C52] uppercase tracking-[0.3em] mb-1">Poin</p>
          <p className="text-2xl font-black">{score.correct}</p>
        </div>
      </div>

      {/* Master Key Cards */}
      <div className="grid grid-cols-5 gap-3 w-full max-w-2xl mb-12">
        {masterKey.map((char, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <div className="bg-white aspect-[3/4] rounded-3xl flex items-center justify-center text-4xl md:text-5xl font-black shadow-lg border border-[#5D4037]/5">
              {char}
            </div>
            <div className="bg-[#A67C52] text-white text-center rounded-full py-1 text-[12px] font-black shadow-sm mx-4">
              {['A', 'B', 'C', 'D', 'E'][idx]}
            </div>
          </div>
        ))}
      </div>

      {/* Box Soal Tengah */}
      <div className="w-full max-w-md bg-white border-8 border-[#FDFBF9] rounded-[3.5rem] p-12 mb-12 text-center shadow-2xl relative group">
        <div className="absolute inset-0 bg-[#A67C52]/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-center gap-6">
          {currentQuestion.map((char, idx) => (
            <span key={idx} className="text-4xl md:text-5xl font-black tracking-tighter text-[#5D4037]">
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Answer Grid */}
      <div className="grid grid-cols-5 gap-4 w-full max-w-2xl">
        {['A', 'B', 'C', 'D', 'E'].map((letter) => (
          <button
            key={letter}
            onClick={() => handleAnswer(letter)}
            className="aspect-square bg-white border-2 border-[#5D4037]/5 rounded-[2rem] flex items-center justify-center text-2xl font-black hover:bg-[#5D4037] hover:text-white hover:scale-105 transition-all active:scale-95 shadow-md group"
          >
            <span className="group-hover:animate-bounce">{letter}</span>
          </button>
        ))}
      </div>

      <div className="mt-12 flex gap-4 opacity-30 italic font-bold text-[9px] uppercase tracking-[0.4em]">
        Gunakan Shortcut Keyboard A-E
      </div>
    </div>
  );
}