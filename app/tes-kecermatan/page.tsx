"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const POOLS = {
  HURUF: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  ANGKA: "0123456789",
  // Update: Menambahkan simbol catur dan kartu tanpa menghapus simbol lama
  SIMBOL: "ΩΓβθΔΣΦΨπλΞ$€£¥฿₩∞≠≈√±@#&♔♕♖♗♘♙♠♥♦♣",
};

type TestType = 'HURUF' | 'ANGKA' | 'SIMBOL' | null;

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
  
  const [columnStats, setColumnStats] = useState<number[]>(new Array(10).fill(0));

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
    if (currentColumn < 10) {
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
    
    setColumnStats(prev => {
      const newStats = [...prev];
      newStats[currentColumn - 1] += 1;
      return newStats;
    });

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

  // SCREEN 1: PILIHAN MENU
  if (!testType) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 text-[#5D4037]">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tighter mb-2 italic uppercase">Tes Kecermatan</h1>
          <div className="h-1 w-20 bg-[#A67C52] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {[
            { id: 'ANGKA', icon: '12', label: 'Angka Hilang' },
            { id: 'HURUF', icon: 'Az', label: 'Huruf Hilang' },
            { id: 'SIMBOL', icon: '♔♠', label: 'Simbol & Catur' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTestType(item.id as TestType)}
              className="bg-white border-2 border-[#5D4037]/5 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-[#A67C52] transition-all group flex flex-col items-center gap-4 text-center"
            >
              <div className="text-4xl bg-[#FDFBF9] p-6 rounded-3xl group-hover:bg-[#A67C52] group-hover:text-white transition-colors shadow-inner">{item.icon}</div>
              <div>
                <div className="font-black text-xl uppercase tracking-tight">{item.label}</div>
                <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">10 Kolom x 60 Detik</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // SCREEN 2: INSTRUKSI
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
            className="w-full bg-[#5D4037] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#A67C52] transition-all shadow-lg"
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 3: EVALUASI + GRAFIK
  if (isFinished) {
    const totalInput = score.correct + score.wrong;
    const accuracy = totalInput > 0 ? Math.round((score.correct / totalInput) * 100) : 0;
    const maxVal = Math.max(...columnStats, 5); 
    const chartHeight = 128; 
    const chartWidth = 400; 

    const points = columnStats.map((val, i) => {
      const x = (i * (chartWidth / 9));
      const y = chartHeight - (val / maxVal * chartHeight);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-6">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center border-2 border-[#5D4037]/5 overflow-hidden">
          <h2 className="font-black text-[#5D4037] text-2xl uppercase mb-8 tracking-tight">Evaluasi Tes</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#FDFBF9] p-6 rounded-3xl border border-[#5D4037]/5">
              <div className="text-3xl font-black text-[#A67C52]">{score.correct}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Benar</div>
            </div>
            <div className="bg-[#FDFBF9] p-6 rounded-3xl border border-[#5D4037]/5">
              <div className="text-3xl font-black text-red-400">{score.wrong}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Salah</div>
            </div>
          </div>

          {/* KEMBALIKAN GRAFIK KECEPATAN */}
          <div className="mb-8 p-6 bg-[#FDFBF9] rounded-3xl border border-[#5D4037]/5">
            <p className="text-[10px] font-black text-[#A67C52] uppercase tracking-[0.2em] mb-10 text-left">Kecepatan Input Per Kolom</p>
            <div className="relative w-full h-32 px-2">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="absolute inset-0 w-full h-32 z-10 overflow-visible" preserveAspectRatio="none">
                <polyline fill="none" stroke="#A67C52" strokeWidth="3" points={points} className="drop-shadow-sm" />
                {columnStats.map((val, i) => (
                   <circle key={i} cx={i * (chartWidth / 9)} cy={chartHeight - (val / maxVal * chartHeight)} r="4" fill="#A67C52" />
                ))}
              </svg>
              <div className="flex items-end justify-between h-full w-full relative z-0 gap-1">
                {columnStats.map((val, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 h-full relative">
                    <div className="absolute transition-all duration-700 font-bold text-[#5D4037]" style={{ bottom: `${(val / maxVal) * 100}%`, marginBottom: '10px', fontSize: '11px' }}>{val}</div>
                    <div className="w-full bg-[#5D4037]/10 rounded-t-lg transition-all duration-700 ease-out" style={{ height: `${(val / maxVal) * 100}%`, minHeight: '4px' }}></div>
                    <span className="absolute -bottom-7 text-[9px] font-black text-gray-400 uppercase">K{i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#5D4037] text-white p-5 rounded-3xl mb-8 mt-6">
            <div className="text-xs font-bold opacity-60 uppercase tracking-[0.2em] mb-1">Akurasi Rata-rata</div>
            <div className="text-3xl font-black">{accuracy}%</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => window.location.reload()} className="flex-1 bg-[#5D4037] text-white py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-[#A67C52] transition-colors">Ulangi Tes</button>
            <button onClick={() => router.push('/dashboard')} className="flex-1 py-4 rounded-2xl font-black uppercase text-[#5D4037] border-2 border-[#5D4037]/5">Keluar</button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 4: GAMEPLAY
  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#5D4037] flex flex-col items-center p-6 select-none relative">
      <button onClick={handleManualFinish} className="absolute top-8 right-8 px-6 py-2 bg-white border-2 border-red-100 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
        Selesai Manual
      </button>

      <div className="w-full max-w-2xl flex justify-between items-end mt-12 mb-10 px-4">
        <div>
          <p className="text-[10px] font-black text-[#A67C52] uppercase tracking-[0.3em] mb-1">Kemajuan</p>
          <p className="text-2xl font-black">Kolom {currentColumn}<span className="text-gray-200">/10</span></p>
        </div>
        <div className={`px-10 py-4 rounded-[2rem] font-mono font-black text-3xl shadow-xl border-4 ${timeLeft <= 10 ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-white text-[#5D4037] border-[#FDFBF9]'}`}>
          {timeLeft}s
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-[#A67C52] uppercase tracking-[0.3em] mb-1">Poin</p>
          <p className="text-2xl font-black">{score.correct}</p>
        </div>
      </div>

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

      <div className="w-full max-w-md bg-white border-8 border-[#FDFBF9] rounded-[3.5rem] p-12 mb-12 text-center shadow-2xl relative group">
        <div className="flex justify-center gap-6">
          {currentQuestion.map((char, idx) => (
            <span key={idx} className="text-4xl md:text-5xl font-black tracking-tighter text-[#5D4037]">
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 w-full max-w-2xl">
        {['A', 'B', 'C', 'D', 'E'].map((letter) => (
          <button
            key={letter}
            onClick={() => handleAnswer(letter)}
            className="aspect-square bg-white border-2 border-[#5D4037]/5 rounded-[2rem] flex items-center justify-center text-2xl font-black hover:bg-[#5D4037] hover:text-white hover:scale-105 transition-all shadow-md group"
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