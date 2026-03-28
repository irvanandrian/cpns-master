"use client";

import React, { useEffect } from "react";
import Link from 'next/link';

export default function Home() {
  // 1. FITUR KEAMANAN: ANTI KLIK KANAN
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert("Fitur Keamanan Aktif: Klik kanan dilarang!");
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Pastikan file ini ada di folder /public/poster.jpg
  const photoUrl = "/poster.jpg"; 

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans select-none scroll-smooth">
      
      {/* 2. NAVBAR MODERN */}
      <nav className="fixed top-0 left-0 right-0 bg-[#5D4037]/95 backdrop-blur-md z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#E6CEA0] tracking-tighter uppercase">
              GASKEUN<span className="text-white">NIP</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-white/90 font-black text-[10px] uppercase tracking-widest">
            {/* Terhubung ke ID #paket */}
            <a href="#paket" className="hover:text-[#E6CEA0] transition">Paket Soal</a>
            <a href="#testimoni" className="hover:text-[#E6CEA0] transition">Testimoni</a>
            <a href="#keunggulan" className="hover:text-[#E6CEA0] transition">Keunggulan</a>
          </div>

          <div className="flex gap-3">
            <Link href="/login">
              <button className="bg-[#E6CEA0] text-[#5D4037] px-6 py-2 rounded-full font-black text-[10px] uppercase hover:bg-white transition shadow-md">
                Masuk Akun
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative pt-40 pb-32 bg-[#5D4037] overflow-hidden text-center px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* FOTO OWNER */}
          <div className="relative inline-block mb-12 group">
            <div className="absolute -inset-4 bg-[#E6CEA0] rounded-[2.5rem] blur-xl opacity-20"></div>
            <img 
              src={photoUrl} 
              alt="Owner GaskeunNIP" 
              className="relative w-full max-w-sm md:max-w-md h-auto rounded-3xl border-4 border-[#E6CEA0]/30 shadow-2xl transition-transform duration-700 hover:scale-[1.03]"
              onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=Owner&background=E6CEA0&color=5D4037&size=400" }}
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter mb-6">
            Sekali <span className="text-[#E6CEA0]">Tampil</span><br />
            Harus <span className="text-[#E6CEA0]">Berhasil</span>
          </h1>
          
          <p className="text-white/70 text-lg md:text-xl font-medium italic mb-12">
            "Gaskeun belajarnya, amankan NIP nya"
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
            <Link href="/login" className="flex-1">
              <button className="w-full bg-[#E6CEA0] text-[#5D4037] px-10 py-5 rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-white transition-all tracking-widest">
                Coba Gratis Sekarang
              </button>
            </Link>
            
            {/* Tombol Terhubung ke ID #paket */}
            <a href="#paket" className="flex-1">
              <button className="w-full border-2 border-[#E6CEA0] text-[#E6CEA0] px-10 py-5 rounded-2xl font-black text-xs uppercase hover:bg-[#E6CEA0]/10 transition-all tracking-widest">
                Lihat Paket Berbayar
              </button>
            </a>
          </div>
        </div>

        {/* Efek Gelombang Bawah */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#FDFBF9]" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }}></div>
      </section>

      {/* 4. KEUNGGULAN SECTION */}
      <section id="keunggulan" className="py-32 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          { icon: "⏱️", title: "Timer Real-time", desc: "Simulasi waktu ujian sesuai standar BKN agar mentalmu terasah.", border: "border-[#E6CEA0]" },
          { icon: "📊", title: "Skor Otomatis", desc: "Nilai langsung keluar beserta analisis mendalam di setiap materi soal.", border: "border-[#A67C52]" },
          { icon: "🚫", title: "Anti-Screenshot", desc: "Keamanan konten soal terjaga eksklusif dengan sistem proteksi terbaru.", border: "border-[#3E2723]" }
        ].map((item, idx) => (
          <div key={idx} className={`bg-white p-10 rounded-[3rem] shadow-xl border-b-8 ${item.border} hover:-translate-y-3 transition-all duration-500`}>
            <div className="text-6xl mb-8">{item.icon}</div>
            <h3 className="text-xl font-black text-[#5D4037] mb-4 uppercase tracking-tight">{item.title}</h3>
            <p className="text-[#795548] text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* 5. TESTIMONI SECTION */}
      <section id="testimoni" className="py-32 bg-[#E6CEA0]/10 border-y border-[#E6CEA0]/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black text-[#A67C52] uppercase tracking-[0.4em] mb-4">Success Story</h2>
            <h3 className="text-4xl font-black text-[#3E2723] uppercase">Apa Kata Alumni?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#E6CEA0]/30 relative">
              <span className="text-6xl absolute top-6 right-8 text-[#E6CEA0]/20 font-black">“</span>
              <p className="text-[#5D4037] italic text-sm leading-relaxed mb-8 relative z-10">
                "Soal-soalnya mirip banget sama ujian aslinya! Berkat simulasi di sini, aku jadi nggak grogi pas hari H."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#5D4037] rounded-2xl flex items-center justify-center text-[#E6CEA0] font-black">A</div>
                <div>
                  <h4 className="font-black text-[#3E2723] text-sm uppercase">Andi Pratama</h4>
                  <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">Lolos CPNS 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DAFTAR HARGA SECTION */}
      <section id="paket" className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-sm font-black text-[#A67C52] uppercase tracking-[0.4em] mb-4">Pilih Investasi Terbaik</h2>
          <h3 className="text-4xl font-black text-[#3E2723] mb-20 uppercase">Paket Belajar Pejuang</h3>
          
          <div className="flex justify-center">
            {/* Paket Utama */}
            <div className="bg-[#5D4037] p-12 rounded-[4rem] shadow-2xl relative max-w-md w-full border-4 border-[#E6CEA0] transform hover:scale-[1.02] transition-all">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E6CEA0] text-[#5D4037] px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">REKOMENDASI</div>
              
              <h3 className="text-lg font-bold mb-2 text-white/60 uppercase">Paket Pejuang NIP</h3>
              <div className="text-6xl font-black mb-10 text-[#E6CEA0] tracking-tighter">Rp 30k</div>
              
              <ul className="text-left space-y-5 mb-12 text-white/90 text-[11px] font-bold uppercase tracking-wide">
                <li className="flex items-center gap-3">
                  <span className="text-[#E6CEA0]">✔</span> 10x Try Out Full (TWK, TIU, TKP)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#E6CEA0]">✔</span> Pembahasan Teks Lengkap
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#E6CEA0]">✔</span> Grafik Statistik Kelulusan
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#E6CEA0]">✔</span> Akses Selamanya
                </li>
              </ul>
              
              <Link href="/login">
                <button className="w-full bg-[#E6CEA0] text-[#5D4037] py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                  Amankan Kuota Sekarang
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#3E2723] py-20 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-black text-[#E6CEA0] mb-6 text-3xl uppercase tracking-[0.5em]">GaskeunNIP</p>
          <div className="flex justify-center gap-8 mb-10 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact Us</a>
          </div>
          <p className="text-[9px] text-white/20 uppercase font-black tracking-widest leading-loose">
            &copy; 2026 GaskeunNIP Indonesia. Dibuat dengan semangat membara untuk seluruh pejuang NIP di Indonesia.
          </p>
        </div>
      </footer>

    </div>
  );
}