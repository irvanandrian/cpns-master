"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';

export default function Home() {
  // State untuk FAQ (Akordeon)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 1. FITUR KEAMANAN: ANTI KLIK KANAN
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert("Fitur Keamanan Aktif: Klik kanan dilarang!");
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const photoUrl = "/poster.jpg"; 

  const faqs = [
    {
      q: "Apakah paket ini bisa diakses selamanya?",
      a: "Ya! Cukup sekali bayar Rp 30rb, kamu bisa akses semua soal dan pembahasan selamanya tanpa biaya bulanan atau tahunan."
    },
    {
      q: "Bagaimana cara sistem penilaiannya?",
      a: "Sistem kami menggunakan skor otomatis sesuai standar BKN terbaru (TWK 5, TIU 5, TKP 1-5). Hasil langsung keluar setelah kamu selesai ujian."
    },
    {
      q: "Apakah bisa dikerjakan lewat HP?",
      a: "Sangat bisa! Website GaskeunNIP didesain responsif untuk laptop maupun smartphone agar kamu bisa latihan soal di mana saja."
    },
    {
      q: "Ada grup belajarnya juga?",
      a: "Ada! Setelah aktivasi paket, kamu akan mendapatkan link khusus untuk bergabung di grup sharing bersama pejuang NIP lainnya."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans select-none scroll-smooth relative">
      
      {/* 2. NAVBAR MODERN */}
      <nav className="fixed top-0 left-0 right-0 bg-[#5D4037]/95 backdrop-blur-md z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#E6CEA0] tracking-tighter uppercase">
              GASKEUN<span className="text-white">NIP</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-white/90 font-black text-[10px] uppercase tracking-widest">
            <a href="#paket" className="hover:text-[#E6CEA0] transition">Paket Soal</a>
            <a href="#testimoni" className="hover:text-[#E6CEA0] transition">Testimoni</a>
            <a href="#faq" className="hover:text-[#E6CEA0] transition">FAQ</a>
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
            <a href="#paket" className="flex-1">
              <button className="w-full border-2 border-[#E6CEA0] text-[#E6CEA0] px-10 py-5 rounded-2xl font-black text-xs uppercase hover:bg-[#E6CEA0]/10 transition-all tracking-widest">
                Lihat Paket Berbayar
              </button>
            </a>
          </div>
        </div>
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
          
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { nama: "Surya Adi Pratama", quote: "Paket include ini mah sama yang ngajarnya juga seru, sharing obrolan di grup", avatar: "S" },
              { nama: "Fahri Arvin", quote: "Soalnya mirip asli, harga sangat terjangkau, ramah dikantong. Sangat bermanfaat!", avatar: "F" },
              { nama: "Fitra Maulana", quote: "Soal-soalnya mirip banget sama ujian aslinya! Berkat simulasi di sini, aku jadi nggak grogi pas hari H.", avatar: "F" }
            ].map((testi, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-[#E6CEA0]/30 relative flex-1 min-w-[300px] max-w-[380px] transition-transform hover:scale-[1.02] flex flex-col">
                <span className="text-6xl absolute top-6 right-8 text-[#E6CEA0]/20 font-black">“</span>
                <p className="text-[#5D4037] italic text-sm leading-relaxed mb-8 relative z-10 min-h-[80px]">"{testi.quote}"</p>
                <div className="flex items-center gap-4 border-t border-[#E6CEA0]/20 pt-6 mt-auto">
                  <div className="w-12 h-12 bg-[#5D4037] rounded-2xl flex items-center justify-center text-[#E6CEA0] font-black shadow-inner">{testi.avatar}</div>
                  <div>
                    <h4 className="font-black text-[#3E2723] text-sm uppercase">{testi.nama}</h4>
                    <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">Lolos CPNS 2025</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: FAQ SECTION (AKORDEON) */}
      <section id="faq" className="py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black text-[#A67C52] uppercase tracking-[0.4em] mb-4">Tanya Jawab</h2>
            <h3 className="text-4xl font-black text-[#3E2723] uppercase">FAQ</h3>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-2 border-[#E6CEA0]/30 rounded-3xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center bg-white hover:bg-[#FDFBF9] transition-colors"
                >
                  <span className="font-black text-[#5D4037] text-sm uppercase tracking-wide">{faq.q}</span>
                  <span className={`text-2xl transition-transform duration-300 ${openFaq === idx ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-40 p-6 pt-0' : 'max-h-0'}`}>
                  <p className="text-[#795548] text-sm leading-relaxed border-t border-[#E6CEA0]/20 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DAFTAR HARGA SECTION */}
      <section id="paket" className="py-32 px-6 bg-[#FDFBF9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-sm font-black text-[#A67C52] uppercase tracking-[0.4em] mb-4">Pilih Investasi Terbaik</h2>
          <h3 className="text-4xl font-black text-[#3E2723] mb-20 uppercase">Paket Belajar Pejuang</h3>
          
          <div className="flex justify-center">
            <div className="bg-[#5D4037] p-12 rounded-[4rem] shadow-2xl relative max-w-md w-full border-4 border-[#E6CEA0] transform hover:scale-[1.02] transition-all">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E6CEA0] text-[#5D4037] px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">REKOMENDASI</div>
              
              <h3 className="text-lg font-bold mb-2 text-white/60 uppercase">Paket Pejuang NIP</h3>
              <div className="text-6xl font-black mb-10 text-[#E6CEA0] tracking-tighter">Rp 30k</div>
              
              <ul className="text-left space-y-5 mb-12 text-white/90 text-[11px] font-bold uppercase tracking-wide">
                <li className="flex items-center gap-3"><span className="text-[#E6CEA0]">✔</span> 10x Try Out Full (TWK, TIU, TKP)</li>
                <li className="flex items-center gap-3"><span className="text-[#E6CEA0]">✔</span> Pembahasan Teks Lengkap</li>
                <li className="flex items-center gap-3"><span className="text-[#E6CEA0]">✔</span> Grup Belajar dan Sharing</li>
                <li className="flex items-center gap-3"><span className="text-[#E6CEA0]">✔</span> Akses Selamanya</li>
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

      {/* 8. FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/628978720373?text=Halo%20Admin%20GaskeunNIP,%20saya%20ingin%20tanya%20tentang%20Paket%20Pejuang%20NIP" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] group flex items-center gap-3"
      >
        <span className="bg-white text-[#5D4037] px-4 py-2 rounded-xl shadow-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 border border-[#E6CEA0]/50 whitespace-nowrap">
          Tanya Admin
        </span>
        <div className="w-14 h-14 bg-[#25D366] rounded-2xl shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center text-white transition-transform duration-300 hover:scale-110 hover:rotate-6 active:scale-95 border-2 border-white/20">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.554 4.197 1.608 6.022L0 24l6.135-1.61a11.771 11.771 0 005.911 1.586h.005c6.632 0 12.045-5.413 12.048-12.051a11.782 11.782 0 00-3.39-8.527z"/>
          </svg>
        </div>
      </a>

    </div>
  );
}