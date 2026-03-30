"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function TesKoranPage() {
  const [columns, setColumns] = useState<number[][]>([]);
  const [currentCol, setCurrentCol] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [customTime, setCustomTime] = useState(15); // Default 15 detik
  const [timeLeft, setTimeLeft] = useState(15);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [mode, setMode] = useState<'kraepelin' | 'pauli' | null>(null);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Generate Angka Acak
  useEffect(() => {
    const data = Array.from({ length: 15 }, () =>
      Array.from({ length: 30 }, () => Math.floor(Math.random() * 10))
    );
    setColumns(data);
  }, []);

  // 2. Proteksi Anti-Screenshot & Copy
  useEffect(() => {
    const handleViolation = (e: any) => e.preventDefault();
    document.addEventListener('contextmenu', handleViolation);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        alert("Screenshot dilarang!");
      }
      if (e.ctrlKey && (e.key === 'p' || e.key === 'c' || e.key === 's')) e.preventDefault();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleViolation);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 3. Logika Timer Dinamis
  useEffect(() => {
    if (isStarted && !isFinished) {
      if (timeLeft <= 0) {
        if (currentCol < columns.length - 1) {
          setCurrentCol(prev => prev + 1);
          setCurrentRow(0);
          setTimeLeft(customTime); // Pakai waktu custom
        } else {
          setIsFinished(true);
        }
      }
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isStarted, isFinished, currentCol, columns.length, customTime]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || isFinished) return;

    let num1, num2;
    if (mode === 'kraepelin') {
      num1 = columns[currentCol][currentRow];
      num2 = columns[currentCol][currentRow + 1];
    } else {
      const lastIdx = columns[currentCol].length - 1;
      num1 = columns[currentCol][lastIdx - currentRow];
      num2 = columns[currentCol][lastIdx - currentRow - 1];
    }

    const correctSum = (num1 + num2) % 10;

    setAnswers((prev: any) => ({
      ...prev,
      [`${currentCol}-${currentRow}`]: {
        user: parseInt(val),
        isCorrect: parseInt(val) === correctSum
      }
    }));

    if (currentRow < columns[currentCol].length - 2) {
      setCurrentRow(prev => prev + 1);
    } else {
      setTimeLeft(0);
    }
    e.target.value = "";
  };

  if (isFinished) {
    const totalBenar = Object.values(answers).filter((a: any) => a.isCorrect).length;
    return (
      <div className="h-screen bg-[#FDFBF9] flex items-center justify-center p-6 text-[#5D4037]">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#E6CEA0]/20 max-w-sm w-full relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#5D4037]"></div>
          <h2 className="font-black mb-4 uppercase text-[10px] tracking-[0.3em]">Hasil {mode}</h2>
          <div className="text-6xl font-black text-[#A67C52] mb-2">{totalBenar}</div>
          <p className="text-[10px] font-bold uppercase mb-8">Poin Terkumpul</p>
          <button onClick={() => window.location.reload()} className="w-full bg-[#5D4037] text-white py-4 rounded-2xl font-black text-[10px] mb-3 uppercase tracking-widest transition-transform hover:scale-105">Ulangi Tes</button>
          <button onClick={() => router.push('/')} className="w-full border-2 border-[#5D4037]/10 py-4 rounded-2xl font-black text-[10px] uppercase">Menu Utama</button>
        </div>
      </div>
    );
  }

  // LAYAR PEMILIHAN MODE & CUSTOM TIMER
  if (!mode) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 text-[#5D4037] relative">
        
        {/* TOMBOL KEMBALI KE BERANDA */}
        <button 
          onClick={() => router.push('/')}
          className="fixed top-8 left-8 flex items-center gap-2 group transition-all"
        >
          <div className="w-10 h-10 rounded-full border-2 border-[#5D4037]/10 flex items-center justify-center group-hover:bg-[#5D4037] group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <span className="font-black uppercase text-[10px] tracking-widest opacity-60 group-hover:opacity-100">Kembali</span>
        </button>

        <h1 className="text-4xl font-black uppercase mb-2 tracking-tighter text-center">Pengaturan Tes Koran</h1>
        <p className="text-[10px] font-bold text-[#A67C52] uppercase mb-12 tracking-widest">GaskeunNIP Simulation System</p>
        
        {/* CUSTOM TIMER SLIDER */}
        <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] border-2 border-[#5D4037]/5 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-black uppercase text-[10px]">Durasi Per Kolom</span>
            <span className="bg-[#5D4037] text-white px-3 py-1 rounded-lg font-mono font-bold text-sm">{customTime} Detik</span>
          </div>
          <input 
            type="range" min="5" max="60" step="5"
            value={customTime}
            onChange={(e) => setCustomTime(parseInt(e.target.value))}
            className="w-full h-2 bg-[#E6CEA0] rounded-lg appearance-none cursor-pointer accent-[#5D4037]"
          />
          <div className="flex justify-between text-[8px] font-bold mt-2 uppercase text-[#A67C52]">
            <span>5s (Kilat)</span>
            <span>60s (Santai)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <button 
            onClick={() => { setMode('kraepelin'); setTimeLeft(customTime); }}
            className="group bg-[#5D4037] p-8 rounded-[2.5rem] border-4 border-transparent hover:border-[#E6CEA0] transition-all text-center text-white"
          >
            <div className="text-3xl mb-4 group-hover:-translate-y-2 transition-transform">⬆️</div>
            <h2 className="font-black uppercase text-xl">Kraepelin</h2>
            <p className="text-[9px] font-bold text-white/50 mt-2 uppercase">Menjumlah Bawah ke Atas</p>
          </button>
          
          <button 
            onClick={() => { setMode('pauli'); setTimeLeft(customTime); }}
            className="group bg-white p-8 rounded-[2.5rem] border-4 border-[#5D4037]/10 hover:border-[#5D4037] transition-all text-center"
          >
            <div className="text-3xl mb-4 group-hover:translate-y-2 transition-transform">⬇️</div>
            <h2 className="font-black uppercase text-xl">Pauli</h2>
            <p className="text-[9px] font-bold text-[#A67C52] mt-2 uppercase">Menjumlah Atas ke Bawah</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] flex flex-col items-center p-4 select-none">
      <style jsx global>{` @media print { body { display: none !important; } } `}</style>

      <input
        ref={inputRef}
        type="number"
        className="fixed opacity-0 pointer-events-none"
        onChange={handleInput}
        autoFocus
        onBlur={() => !isFinished && inputRef.current?.focus()}
      />

      {/* HEADER STATUS */}
      <div className="w-full max-w-4xl bg-white border border-[#E6CEA0]/30 rounded-[2rem] p-6 mb-8 flex justify-between items-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-[#5D4037] transition-all duration-1000" style={{ width: `${(timeLeft/customTime)*100}%` }}></div>
        <div>
          <span className="text-[9px] font-black text-[#A67C52] uppercase tracking-widest">Mode: {mode} ({customTime}s)</span>
          <p className="text-xl font-black text-[#5D4037]">{currentCol + 1} / {columns.length}</p>
        </div>
        
        <div className="flex-1 flex justify-center">
          {!isStarted ? (
            <button onClick={() => setIsStarted(true)} className="bg-[#5D4037] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg animate-bounce">Mulai Tes</button>
          ) : (
            <div className={`px-6 py-2 rounded-xl font-mono font-black text-xl transition-colors ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-[#FDFBF9] text-[#5D4037]'}`}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          )}
        </div>

        <div className="text-right">
          <span className="text-[9px] font-black text-[#A67C52] uppercase tracking-widest">Benar</span>
          <p className="text-xl font-black text-[#5D4037]">{Object.values(answers).filter((a: any) => a.isCorrect).length}</p>
        </div>
      </div>

      {/* AREA TES */}
      {isStarted && (
        <div className="flex gap-6 md:gap-10 overflow-x-auto w-full justify-center pb-12 pt-4 px-10">
          {columns.map((col, cIdx) => (
            <div 
              key={cIdx} 
              className={`flex ${mode === 'kraepelin' ? 'flex-col-reverse' : 'flex-col'} items-center transition-all duration-500 shrink-0 ${cIdx === currentCol ? 'scale-110 opacity-100' : 'scale-90 opacity-10 blur-[1px]'}`}
            >
              <div className={`bg-white p-4 rounded-[2rem] border-2 ${cIdx === currentCol ? 'border-[#5D4037] shadow-[0_20px_50px_rgba(93,64,55,0.15)]' : 'border-transparent'} flex ${mode === 'kraepelin' ? 'flex-col-reverse' : 'flex-col'}`}>
                {col.map((num, rIdx) => (
                  <div key={rIdx} className="flex flex-col items-center">
                    <span className="text-2xl md:text-4xl font-black text-[#5D4037] h-12 flex items-center">{num}</span>
                    {rIdx < col.length - 1 && (
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg font-black transition-all ${cIdx === currentCol && rIdx === currentRow ? 'bg-[#E6CEA0] text-[#5D4037] scale-110' : 'text-[#A67C52]/40'}`}>
                        {answers[`${cIdx}-${rIdx}`]?.user ?? ""}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span className="mt-6 font-black text-[10px] text-[#A67C52] uppercase tracking-[0.2em]">Kolom {cIdx + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}