"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { supabase } from './lib/supabase'; 

// --- KOMPONEN FAQ (ACCORDION) ---
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#5D4037]/10 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <span className="text-[11px] font-black uppercase tracking-wider text-[#5D4037] group-hover:text-[#A67C52] transition-colors">
          {question}
        </span>
        <span className="text-[#A67C52] font-black text-xl">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="mt-4 text-[10px] text-[#5D4037]/70 font-bold uppercase leading-relaxed animate-in fade-in slide-in-from-top-1">
          {answer}
        </div>
      )}
    </div>
  );
}

// --- KOMPONEN DASHBOARD PSIKOTES (MODAL/OVERLAY) ---
function PsikotesDashboard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#5D4037]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#FDFBF9] w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-[#5D4037] font-black text-2xl hover:scale-125 transition-transform">✕</button>
        
        <div className="p-10 md:p-16">
          <h2 className="text-[10px] font-black text-[#A67C52] uppercase tracking-[0.5em] mb-4">Pusat Latihan</h2>
          <h3 className="text-4xl font-black text-[#5D4037] uppercase tracking-tighter mb-10">Pilih Mode Psikotes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD TES KORAN */}
            <Link href="/tes-koran" className="group">
              <div className="bg-white border-2 border-[#5D4037]/5 p-8 rounded-[2.5rem] hover:border-[#E6CEA0] hover:shadow-xl transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-4">✍️</div>
                  <h4 className="font-black text-xl uppercase text-[#5D4037] mb-2">Tes Koran</h4>
                  <p className="text-[10px] font-bold text-[#5D4037]/60 uppercase leading-relaxed">
                    Uji ketahanan, stabilitas, dan kecepatan berhitung dengan mode Pauli & Kraepelin.
                  </p>
                </div>
                <div className="mt-6 text-[10px] font-black text-[#A67C52] uppercase group-hover:translate-x-2 transition-transform">Mulai Latihan →</div>
              </div>
            </Link>

            {/* CARD TES KECERMATAN */}
            <Link href="/tes-kecermatan" className="group">
              <div className="bg-white border-2 border-[#5D4037]/5 p-8 rounded-[2.5rem] hover:border-[#E6CEA0] hover:shadow-xl transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-4">🔍</div>
                  <h4 className="font-black text-xl uppercase text-[#5D4037] mb-2">Tes Kecermatan</h4>
                  <p className="text-[10px] font-bold text-[#5D4037]/60 uppercase leading-relaxed">
                    Latih ketelitian visual untuk mencari angka, huruf, atau simbol yang hilang secara cepat.
                  </p>
                </div>
                <div className="mt-6 text-[10px] font-black text-[#A67C52] uppercase group-hover:translate-x-2 transition-transform">Mulai Latihan →</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [statusSoal, setStatusSoal] = useState({
    cpns: false,
    bumn: false,
    snbt: false,
    kedinasan: false
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPsikotes, setShowPsikotes] = useState(false); // State baru untuk dashboard
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- FITUR AUTO-PLAY PADA KLIK PERTAMA ---
  useEffect(() => {
    const handleFirstClick = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            document.removeEventListener("click", handleFirstClick);
          })
          .catch((err) => console.log("Menunggu interaksi user...", err));
      }
    };

    document.addEventListener("click", handleFirstClick);
    return () => document.removeEventListener("click", handleFirstClick);
  }, [isPlaying]);

  useEffect(() => {
    const fetchStatusSoal = async () => {
      try {
        const kategori = ['cpns', 'bumn', 'snbt', 'kedinasan'];
        let updateStatus = { ...statusSoal };
        for (const kat of kategori) {
          const { count, error } = await supabase
            .from('soal') 
            .select('*', { count: 'exact', head: true })
            .eq('jenis_ujian', kat); 
          if (!error && count !== null) {
            updateStatus = { ...updateStatus, [kat]: count > 0 };
          }
        }
        setStatusSoal(updateStatus);
      } catch (err) {
        console.error("Gagal ambil status:", err);
      }
    };
    fetchStatusSoal();
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const paketHarga = [
    { id: 'cpns', title: "Paket CPNS", harga: "40k", fitur: ["10x Try Out Full", "Pembahasan Teks", "Grup Belajar", "Akses Selamanya"] },
    { id: 'bumn', title: "Paket BUMN ", harga: "45k", fitur: ["Materi AKHLAK", "TKD Standard FHCI", "Grup Sharing", "Update Soal Berkala"] },
    { id: 'kedinasan', title: "Paket Sekolah Kedinasan", harga: "40k", fitur: ["Simulasi SKD Lengkap", "Bank Soal 5 Tahun", "Konsultasi Jurusan"] },
    { id: 'snbt', title: "Paket SNBT", harga: "20k", fitur: ["Trik Cepat PK", "Penalaran Umum"] }
  ];

  const testimoniData = [
    { text: "Soal TKP-nya sangat mirip asli!", user: "Andini, Lolos NIP" },
    { text: "Materi AKHLAK-nya daging banget!", user: "Rian, Staff BUMN" },
    { text: "Persiapan mantap buat masuk IPDN!", user: "Bagus, Maba IPDN" },
    { text: "Trik PK-nya sangat membantu!", user: "Siska, Maba UI" }
  ];

  const faqData = [
    { q: "Apakah soal selalu update?", a: "Ya! Kami memperbarui bank soal setiap bulan sesuai kisi-kisi terbaru 2026." },
    { q: "Berapa lama masa aktif paket?", a: "Sekali bayar, akses selamanya! Tidak ada biaya langganan bulanan." },
    { q: "Bisa akses lewat HP/Tablet?", a: "Sangat bisa. Desain kami responsif untuk belajar di mana saja." },
    { q: "Ada grup diskusi?", a: "Tersedia grup Telegram eksklusif untuk diskusi bareng mentor dan sesama pejuang." }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans select-none scroll-smooth relative">
      
      <audio ref={audioRef} src="/Pompeii.mp3" loop />

      {/* DASHBOARD PSIKOTES MODAL */}
      <PsikotesDashboard isOpen={showPsikotes} onClose={() => setShowPsikotes(false)} />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-[#5D4037]/95 backdrop-blur-md z-50 shadow-lg px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-black text-[#E6CEA0] tracking-tighter uppercase">
            GASKEUN<span className="text-white">NIP</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black text-white/70 uppercase tracking-widest">
            <a href="#paket" className="hover:text-[#E6CEA0]">Pilihan Paket</a>
            
            {/* TAMBAHAN NAVIGASI PSIKOTES */}
            <button 
              onClick={() => setShowPsikotes(true)}
              className="text-[#E6CEA0] hover:text-white flex items-center gap-1 transition-all"
            >
              <span className="animate-pulse">●</span> Psikotes
            </button>

            <a href="#testimoni" className="hover:text-[#E6CEA0]">Testimoni</a>
            <a href="#faq" className="hover:text-[#E6CEA0]">FAQ</a>
          </div>
          
          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-3">
            <Link href="/register">
              <button className="hidden sm:block border-2 border-[#E6CEA0] text-[#E6CEA0] px-6 py-2 rounded-full font-black text-[10px] uppercase hover:bg-[#E6CEA0] hover:text-[#5D4037] transition-all">
                Daftar Akun
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-[#E6CEA0] text-[#5D4037] px-6 py-2 rounded-full font-black text-[10px] uppercase hover:bg-white transition shadow-md">
                Masuk Akun
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-40 pb-32 bg-[#5D4037] text-center px-6">
        <div className="max-w-7xl mx-auto z-10 relative">
          <img src="/poster1.png" className="mx-auto w-full max-w-sm rounded-[3rem] border-4 border-[#E6CEA0]/30 shadow-2xl mb-12 object-cover" alt="Owner" />
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase mb-6 tracking-tighter">
            Sekali <span className="text-[#E6CEA0]">Tampil</span><br /> Harus <span className="text-[#E6CEA0]">Berhasil</span>
          </h1>
        </div>
      </section>

      {/* PAKET SECTION */}
      <section id="paket" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black text-[#A67C52] uppercase tracking-[0.4em] mb-4">Investasi Masa Depan</h2>
          <h3 className="text-4xl font-black text-[#3E2723] uppercase tracking-tighter">Pilihan Paket Belajar</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {paketHarga.map((item) => {
            const isReady = statusSoal[item.id as keyof typeof statusSoal];
            return (
              <div key={item.id} className="bg-[#5D4037] rounded-[3rem] p-8 shadow-2xl border-4 border-[#E6CEA0]/20 flex flex-col relative overflow-hidden transition-all hover:scale-[1.03]">
                <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isReady ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
                  {isReady ? '● Soal Tersedia' : '○ Belum Tersedia'}
                </div>
                <div className="mt-8 text-center flex-grow">
                  <h4 className="text-[#E6CEA0] text-[10px] font-black uppercase mb-2 tracking-[0.2em]">{item.title}</h4>
                  <div className="text-5xl font-black text-white mb-6 tracking-tighter">Rp {item.harga}</div>
                  <ul className="text-left space-y-4 mb-8">
                    {item.fitur.map((f, i) => (
                      <li key={i} className="text-[10px] text-white/80 font-bold uppercase flex items-center gap-2"><span className="text-[#E6CEA0]">✔</span> {f}</li>
                    ))}
                  </ul>
                </div>
                <Link href={isReady ? "/login" : "#"}>
                  <button disabled={!isReady} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isReady ? 'bg-[#E6CEA0] text-[#5D4037] hover:bg-white shadow-xl' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
                    {isReady ? 'Amankan Paket →' : 'Wait For It...'}
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONI SECTION */}
      <section id="testimoni" className="py-24 bg-[#E6CEA0]/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-black text-[#3E2723] uppercase mb-12 tracking-tighter">Kata Mereka Yang Berhasil</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {testimoniData.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-lg border border-[#E6CEA0]/30 italic transition-transform hover:-translate-y-2">
                <p className="text-[11px] text-[#5D4037] font-bold mb-4 leading-relaxed">"{t.text}"</p>
                <p className="text-[#A67C52] text-[9px] font-black uppercase tracking-widest">— {t.user}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-[#A67C52] uppercase tracking-[0.4em] mb-4">Butuh Informasi?</h2>
            <h3 className="text-4xl font-black text-[#3E2723] uppercase tracking-tighter">F.A.Q</h3>
          </div>
          <div className="bg-[#FDFBF9] p-8 rounded-[3rem] border border-[#E6CEA0]/30 shadow-inner">
            {faqData.map((faq, index) => (
              <FAQItem key={index} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FLOATING BUTTONS */}
      <div className="fixed bottom-8 left-8 flex flex-col gap-3 z-[100]">
        {/* BUTTON DASHBOARD PSIKOTES (Pengganti tombol koran lama) */}
        <button 
          onClick={() => setShowPsikotes(true)}
          className="w-14 h-14 bg-[#E6CEA0] text-[#5D4037] rounded-full shadow-2xl border-4 border-white flex items-center justify-center hover:scale-110 transition-transform group relative"
        >
          <span className="text-xl">📊</span>
          <span className="absolute left-16 bg-[#5D4037] text-[#E6CEA0] px-3 py-1 rounded text-[8px] font-black uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">Menu Psikotes</span>
        </button>
        
        <button 
          onClick={toggleMusic}
          className="w-14 h-14 bg-[#5D4037] text-[#E6CEA0] rounded-full shadow-2xl border-4 border-white flex items-center justify-center animate-bounce hover:scale-110 transition-transform"
        >
          <span className="text-xl">{isPlaying ? "⏸️" : "▶️"}</span>
        </button>
      </div>

      <a 
        href="https://wa.me/628978720373" 
        target="_blank" 
        className="fixed bottom-8 right-8 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-[100] hover:scale-110 transition-transform border-4 border-white"
      >
        <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.2-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.4-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
      </a>

      <footer className="bg-[#3E2723] py-20 text-center border-t border-white/5">
        <p className="font-black text-[#E6CEA0] mb-4 text-3xl uppercase tracking-[0.5em]">GASKEUNNIP</p>
        <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">&copy; 2026 GaskeunNIP Indonesia.</p>
      </footer>
    </div>
  );
}