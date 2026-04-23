"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function TesKoranPage() {
  const [columns, setColumns] = useState<number[][]>([]);
  const [currentCol, setCurrentCol] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [customTime, setCustomTime] = useState(15); 
  const [timeLeft, setTimeLeft] = useState(15);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [mode, setMode] = useState<'kraepelin' | 'pauli' | null>(null);
  
  // State baru untuk menyimpan jumlah jawaban tiap kolom untuk grafik
  const [columnStats, setColumnStats] = useState<number[]>([]);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const generateData = (numColumns: number) => {
    const data = Array.from({ length: numColumns }, () =>
      Array.from({ length: 30 }, () => Math.floor(Math.random() * 10))
    );
    setColumns(data);
    setColumnStats(new Array(numColumns).fill(0)); // Inisialisasi statistik 0
    setCurrentCol(0);
    setCurrentRow(0);
    setAnswers({});
  };

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

  useEffect(() => {
    if (isStarted && !isFinished) {
      if (timeLeft <= 0) {
        if (currentCol < columns.length - 1) {
          setCurrentCol(prev => prev + 1);
          setCurrentRow(0);
          setTimeLeft(customTime);
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
    if (val === "" || isFinished || !isStarted) return;

    const inputChar = val.slice(-1);
    const inputNum = parseInt(inputChar);

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

    // Tambahkan jumlah jawaban ke statistik kolom yang sedang dikerjakan
    setColumnStats(prev => {
      const newStats = [...prev];
      newStats[currentCol] += 1;
      return newStats;
    });

    setAnswers((prev: any) => ({
      ...prev,
      [`${currentCol}-${currentRow}`]: {
        user: inputNum,
        isCorrect: inputNum === correctSum
      }
    }));

    if (currentRow < 28) {
      setCurrentRow(prev => prev + 1);
    } else {
      if (currentCol < columns.length - 1) {
        setCurrentCol(prev => prev + 1);
        setCurrentRow(0);
        setTimeLeft(customTime);
      } else {
        setIsFinished(true);
      }
    }
    e.target.value = "";
  };

  if (isFinished) {
    const totalBenar = Object.values(answers).filter((a: any) => a.isCorrect).length;
    
    // --- LOGIKA GRAFIK ---
    const maxVal = Math.max(...columnStats, 5);
    const chartHeight = 150;
    // Lebar grafik dinamis: makin banyak kolom (Pauli), area scroll makin panjang
    const chartWidth = columnStats.length * 30; 

    const points = columnStats.map((val, i) => {
      const x = i * 30 + 15;
      const y = chartHeight - (val / maxVal * chartHeight);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4 md:p-6 text-[#5D4037]">
        <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border border-[#E6CEA0]/20 max-w-4xl w-full relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#5D4037]"></div>
          
          <h2 className="font-black mb-2 uppercase text-[10px] tracking-[0.3em]">Hasil Evaluasi {mode}</h2>
          <div className="text-6xl font-black text-[#A67C52] mb-1">{totalBenar}</div>
          <p className="text-[10px] font-bold uppercase mb-8">Poin Benar</p>

          {/* Grafik Batang & Garis */}
          <div className="mb-10 p-4 md:p-6 bg-[#FDFBF9] rounded-3xl border border-[#5D4037]/5">
            <p className="text-[9px] font-black text-[#A67C52] uppercase tracking-[0.2em] mb-10 text-left">Produktivitas Per Kolom</p>
            
            <div className="overflow-x-auto pb-6">
              <div className="relative" style={{ width: chartWidth, height: chartHeight }}>
                
                {/* SVG Garis */}
                <svg width={chartWidth} height={chartHeight} className="absolute inset-0 z-10 overflow-visible">
                  <polyline
                    fill="none"
                    stroke="#A67C52"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                  {columnStats.map((val, i) => (
                    <circle key={i} cx={i * 30 + 15} cy={chartHeight - (val / maxVal * chartHeight)} r="3" fill="#A67C52" />
                  ))}
                </svg>

                {/* Batang & Angka */}
                <div className="flex items-end justify-start h-full w-full relative z-0">
                  {columnStats.map((val, i) => (
                    <div key={i} className="flex flex-col items-center justify-end h-full" style={{ width: 30 }}>
                      <span className="text-[9px] font-bold mb-1">{val}</span>
                      <div 
                        className="w-4 bg-[#5D4037]/10 rounded-t-sm transition-all duration-1000"
                        style={{ height: `${(val / maxVal) * 100}%`, minHeight: '2px' }}
                      ></div>
                      <span className="text-[7px] mt-2 font-black text-gray-300 uppercase">K{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <button onClick={() => window.location.reload()} className="flex-1 bg-[#5D4037] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-transform hover:scale-105">Ulangi Tes</button>
            {/* Tombol keluar diarahkan ke dashboard dengan parameter auto-modal */}
            <button onClick={() => router.push('/dashboard?showPsikotes=true')} className="flex-1 border-2 border-[#5D4037]/10 py-4 rounded-2xl font-black text-[#5D4037] text-[10px] uppercase">Menu Utama</button>
          </div>
        </div>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 text-[#5D4037] relative">
        <button onClick={() => router.push('/dashboard?showPsikotes=true')} className="fixed top-8 left-8 flex items-center gap-2 group transition-all">
          <div className="w-10 h-10 rounded-full border-2 border-[#5D4037]/10 flex items-center justify-center group-hover:bg-[#5D4037] group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <span className="font-black uppercase text-[10px] tracking-widest opacity-60 group-hover:opacity-100">Kembali</span>
        </button>
        <h1 className="text-4xl font-black uppercase mb-2 tracking-tighter text-center">Pengaturan Tes Koran</h1>
        <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] border-2 border-[#5D4037]/5 mb-8 shadow-sm text-center">
          <span className="font-black uppercase text-[10px]">Durasi Per Kolom</span>
          <p className="text-2xl font-black mb-4">{customTime} Detik</p>
          <input type="range" min="5" max="60" step="5" value={customTime} onChange={(e) => setCustomTime(parseInt(e.target.value))} className="w-full h-2 bg-[#E6CEA0] rounded-lg appearance-none cursor-pointer accent-[#5D4037]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <button onClick={() => { setMode('kraepelin'); setTimeLeft(customTime); generateData(40); }} className="group bg-[#5D4037] p-8 rounded-[2.5rem] text-white transition-transform hover:scale-105">
            <h2 className="font-black uppercase text-xl">Kraepelin</h2>
            <p className="text-[9px] opacity-50 uppercase">40 Kolom</p>
          </button>
          <button onClick={() => { setMode('pauli'); setTimeLeft(customTime); generateData(80); }} className="group bg-white p-8 rounded-[2.5rem] border-2 border-[#5D4037]/10 transition-transform hover:scale-105">
            <h2 className="font-black uppercase text-xl text-[#5D4037]">Pauli</h2>
            <p className="text-[9px] text-[#A67C52] uppercase">80 Kolom</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] flex flex-col items-center p-4 select-none overflow-y-auto relative">
      <style jsx global>{` @media print { body { display: none !important; } } `}</style>

      {isStarted && (
        <button 
          onClick={() => setIsFinished(true)} 
          className="fixed top-4 right-4 z-[100] bg-white/80 backdrop-blur-sm text-red-600 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase border border-red-200 shadow-sm hover:bg-red-600 hover:text-white transition-all"
        >
          Selesai
        </button>
      )}

      <input ref={inputRef} type="number" className="fixed opacity-0 pointer-events-none" onChange={handleInput} autoFocus onBlur={() => !isFinished && inputRef.current?.focus()} />

      <div className="w-full max-w-2xl bg-white border border-[#E6CEA0]/30 rounded-2xl p-4 mb-4 flex justify-between items-center shadow-sm relative shrink-0 z-[60]">
        <div className="absolute top-0 left-0 h-1 bg-[#5D4037] transition-all duration-1000" style={{ width: `${(timeLeft/customTime)*100}%` }}></div>
        <div>
          <span className="text-[7px] font-black text-[#A67C52] uppercase">Kolom</span>
          <p className="text-md font-black">{currentCol + 1} / {columns.length}</p>
        </div>
        <div className="flex-1 flex justify-center">
          {!isStarted ? (
            <button onClick={() => setIsStarted(true)} className="bg-[#5D4037] text-white px-6 py-2 rounded-xl font-black text-[9px] uppercase">Mulai Tes</button>
          ) : (
            <div className={`px-4 py-1 rounded-lg font-mono font-black ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-[#FDFBF9]'}`}>{timeLeft}s</div>
          )}
        </div>
        <div className="text-right">
          <span className="text-[7px] font-black text-[#A67C52] uppercase">Skor</span>
          <p className="text-md font-black">{Object.values(answers).filter((a: any) => a.isCorrect).length}</p>
        </div>
      </div>

      {isStarted && (
        <div className="flex gap-10 w-full justify-center pb-20 pt-10 overflow-x-auto">
          {columns.map((col, cIdx) => {
            if (Math.abs(cIdx - currentCol) > 1) return null;

            return (
              <div key={cIdx} className={`flex ${mode === 'kraepelin' ? 'flex-col-reverse' : 'flex-col'} items-center transition-all duration-300 shrink-0 ${cIdx === currentCol ? 'opacity-100 scale-110' : 'opacity-10 scale-90'}`}>
                <div className={`bg-white px-6 py-4 rounded-2xl border-2 ${cIdx === currentCol ? 'border-[#5D4037]' : 'border-transparent'} flex ${mode === 'kraepelin' ? 'flex-col-reverse' : 'flex-col'}`}>
                  {col.map((num, rIdx) => (
                    <div key={rIdx} className="flex flex-col items-center relative">
                      <span className="text-xl md:text-2xl font-bold text-[#5D4037] h-8 md:h-10 flex items-center z-10">{num}</span>
                      {rIdx < col.length - 1 && (
                        <div className={`
                          absolute left-full ml-3 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-md text-[10px] font-black transition-all z-0
                          ${mode === 'kraepelin' ? 'bottom-full translate-y-1/2' : 'top-full -translate-y-1/2'}
                          ${cIdx === currentCol && rIdx === currentRow ? 'bg-[#E6CEA0] text-[#5D4037] border border-[#5D4037]/20 shadow-sm ring-2 ring-[#5D4037]/10' : ''}
                          ${answers[`${cIdx}-${rIdx}`] ? 'text-[#5D4037]' : 'text-transparent'}
                        `}>
                          {answers[`${cIdx}-${rIdx}`]?.user ?? ""}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <span className="mt-4 font-black text-[8px] text-[#A67C52] uppercase tracking-widest">Kolom {cIdx + 1}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}