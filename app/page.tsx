"use client";
import { useEffect } from "react";
import Link from 'next/link';
export default function LandingPage() {
  useEffect(() => {
    const handleContextMenu = (e: any) => {
      e.preventDefault();
      alert("Klik kanan dilarang!");
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans select-none">
      {/* Header / Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">Tipe-X<span className="text-orange-500">Taruna</span></h1>
        <div className="space-x-6">
          <a href="#" className="hover:text-blue-600">Paket Soal</a>
          <a href="#" className="hover:text-blue-600">Testimoni</a>
          <Link href="/login">
  <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
    Login
  </button>
</Link>
          
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-10 py-20 text-center">
        <h2 className="text-5xl font-extrabold leading-tight">
          Lolos Ujian Impian dengan <br /> 
          <span className="text-blue-600">Simulasi Try Out Terakurat</span>
        </h2>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          Dapatkan pengalaman ujian seperti aslinya dengan sistem timer, 
          pembahasan mendalam, dan analisis skor otomatis.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/login">
  <button className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg hover:bg-orange-600">
    Coba Gratis
  </button>
</Link>
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-50">
            Lihat Paket Berbayar
          </button>
        </div>
      </main>

      {/* Keunggulan Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 bg-blue-50 rounded-xl">
            <h3 className="text-xl font-bold mb-2">⏱️ Timer Real-time</h3>
            <p className="text-gray-600">Simulasi waktu sesuai standar ujian nasional.</p>
          </div>
          <div className="p-6 bg-green-50 rounded-xl">
            <h3 className="text-xl font-bold mb-2">📊 Skor Otomatis</h3>
            <p className="text-gray-600">Nilai langsung keluar begitu kamu selesai mengerjakan.</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-xl">
            <h3 className="text-xl font-bold mb-2">🚫 Anti-Screenshot</h3>
            <p className="text-gray-600">Keamanan konten soal terjaga dengan proteksi sistem.</p>
          </div>
        </div>
      </section>
      {/* Section Testimoni */}
<section className="py-20 bg-gray-50">
  <div className="max-w-6xl mx-auto px-10">
    <h2 className="text-3xl font-bold text-center mb-12">Apa Kata Mereka?</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Kartu Testimoni 1 */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-600 italic mb-6">"Soal-soalnya mirip banget sama ujian aslinya! Berkat simulasi di sini, aku jadi nggak grogi pas hari H."</p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
          <div>
            <h4 className="font-bold">Andi Pratama</h4>
            <p className="text-xs text-gray-500">Lolos CPNS 2025</p>
          </div>
        </div>
      </div>

      {/* Kartu Testimoni 2 */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-600 italic mb-6">"Fitur anti-screenshot nya keren banget, berasa ujian beneran. Pembahasan soalnya juga gampang dimengerti."</p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
          <div>
            <h4 className="font-bold">Siti Aminah</h4>
            <p className="text-xs text-gray-500">Mahasiswa Kedokteran</p>
          </div>
        </div>
      </div>

      {/* Kartu Testimoni 3 */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-600 italic mb-6">"Sistem pembayarannya otomatis, langsung bisa akses soal setelah bayar. Sangat membantu buat persiapan UTBK!"</p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
          <div>
            <h4 className="font-bold">Budi Santoso</h4>
            <p className="text-xs text-gray-500">Siswa SMA Jakarta</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/* Section Daftar Harga */}
<section className="py-20 bg-white">
  <div className="max-w-6xl mx-auto px-10 text-center">
    <h2 className="text-3xl font-bold mb-4">Pilih Paket Belajarmu</h2>
    <p className="text-gray-600 mb-12">Investasi terbaik adalah untuk masa depanmu.</p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Paket Gratis */}
      <div className="border border-gray-200 p-8 rounded-2xl flex flex-col hover:border-blue-500 transition">
        <h3 className="text-xl font-bold mb-2">Paket Coba-Coba</h3>
        <div className="text-3xl font-black mb-6">Gratis</div>
        <ul className="text-left space-y-4 mb-8 text-gray-600 flex-grow">
          <li>✅ 1x Try Out Simulasi</li>
          <li>✅ Pembahasan Dasar</li>
          <li>❌ Analisis Skor Detail</li>
        </ul>
        <Link href="/login" className="block bg-gray-100 py-3 rounded-lg font-bold hover:bg-gray-200">
          Coba Sekarang
        </Link>
      </div>

      {/* Paket Populer (Premium) */}
      <div className="border-2 border-blue-600 p-8 rounded-2xl flex flex-col relative shadow-xl transform scale-105 bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
          TERPOPULER
        </div>
        <h3 className="text-xl font-bold mb-2">Paket Pejuang</h3>
        <div className="text-3xl font-black mb-6 text-blue-600">Rp 99.000</div>
        <ul className="text-left space-y-4 mb-8 text-gray-600 flex-grow">
          <li>✅ 10x Try Out Full</li>
          <li>✅ Pembahasan Video & Teks</li>
          <li>✅ Ranking Nasional</li>
          <li>✅ Grup Diskusi Premium</li>
        </ul>
        <Link href="/login" className="block bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
          Beli Sekarang
        </Link>
      </div>

      {/* Paket Sultan */}
      <div className="border border-gray-200 p-8 rounded-2xl flex flex-col hover:border-blue-500 transition">
        <h3 className="text-xl font-bold mb-2">Paket Intensif</h3>
        <div className="text-3xl font-black mb-6 text-orange-500">Rp 199.000</div>
        <ul className="text-left space-y-4 mb-8 text-gray-600 flex-grow">
          <li>✅ Unlimited Try Out</li>
          <li>✅ Mentor Pribadi (Chat)</li>
          <li>✅ Prediksi Soal Akurat</li>
          <li>✅ Garansi Uang Kembali</li>
        </ul>
        <Link href="/login" className="block border-2 border-orange-500 text-orange-500 py-3 rounded-lg font-bold hover:bg-orange-50">
          Ambil Paket Ini
        </Link>
      </div>

    </div>
  </div>
</section>
    </div>
  );
}