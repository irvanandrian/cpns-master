"use client";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase'; 
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [status, setStatus] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // PROTEKSI: Cek Admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        alert("Hanya Admin yang boleh masuk!");
        router.push('/dashboard');
      } else {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("⏳ Sedang memproses file...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(ws);
        
        if (rawData.length === 0) {
          setStatus("❌ File kosong atau format salah.");
          return;
        }

        const formatSoal = rawData.map((s: any) => ({
          pertanyaan: s.pertanyaan,
          opsi_a: s.opsi_a,
          opsi_b: s.opsi_b,
          opsi_c: s.opsi_c,
          opsi_d: s.opsi_d,
          opsi_e: s.opsi_e,
          kunci: s.kunci ? s.kunci.toString().toUpperCase() : null,
          kategori: s.kategori, 
          paket_id: s.paket_id || 1, 
          pembahasan: s.pembahasan || `Jawaban yang benar adalah ${s.kunci?.toUpperCase()}.`, 
          poin_a: parseInt(s.poin_a) || 0,
          poin_b: parseInt(s.poin_b) || 0,
          poin_c: parseInt(s.poin_c) || 0,
          poin_d: parseInt(s.poin_d) || 0,
          poin_e: parseInt(s.poin_e) || 0,
          // UPDATE: Tambahkan kolom image_url agar bisa dibaca dari Excel
          image_url: s.image_url || null, 
        }));

        const { error } = await supabase.from('soal').insert(formatSoal);

        if (error) {
          console.error("Supabase Error:", error);
          setStatus("❌ Gagal Simpan: " + error.message);
        } else {
          setStatus(`✅ Berhasil! ${formatSoal.length} soal terupload.`);
        }
      } catch (err) {
        console.error("Code Error:", err);
        setStatus("❌ Error pembacaan file. Cek format header.");
      }
    };
    reader.readAsBinaryString(file);
  };

  if (!isAdmin) return null;

  return (
    <div className="p-10 flex flex-col items-center min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#E6CEA0]/20 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#5D4037]"></div>
        
        <div className="w-16 h-16 bg-[#5D4037] rounded-2xl flex items-center justify-center text-[#E6CEA0] text-3xl mb-6 mx-auto shadow-xl">
          🚀
        </div>
        
        <h1 className="text-2xl font-black mb-2 text-center uppercase tracking-tighter">Gaskeun <span className="text-[#A67C52]">Admin</span></h1>
        <p className="text-slate-400 text-[10px] text-center mb-8 font-bold uppercase tracking-widest">Upload Master Soal & Gambar (.xlsx)</p>
        
        <div className="relative border-4 border-dashed border-[#FDFBF9] rounded-[2rem] p-8 hover:border-[#E6CEA0] transition-all group bg-[#FDFBF9]/50 shadow-inner">
          <input 
            type="file" 
            accept=".xlsx" 
            onChange={handleFileUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          <div className="text-center">
            <p className="text-xs font-black text-[#5D4037] group-hover:scale-105 transition-transform uppercase">Pilih File Excel</p>
            <p className="text-[9px] text-[#A67C52] mt-2 font-bold italic">Seret file ke sini untuk upload cepat</p>
          </div>
        </div>
        
        {status && (
          <div className={`mt-6 p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest animate-bounce ${
            status.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {status}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-[#E6CEA0]/30">
            <h4 className="text-[9px] font-black text-[#A67C52] uppercase tracking-[0.2em] mb-4 text-center italic">Wajib ada di Header Excel:</h4>
            <div className="grid grid-cols-2 gap-2">
              {['pertanyaan', 'opsi_a s/d e', 'kunci', 'kategori', 'paket_id', 'pembahasan', 'poin_a s/d e', 'image_url'].map((item) => (
                <div key={item} className={`text-[8px] p-2 rounded-lg font-black text-center uppercase tracking-tighter ${item === 'image_url' ? 'bg-[#A67C52] text-white' : 'bg-[#5D4037] text-[#E6CEA0]'}`}>
                  {item}
                </div>
              ))}
            </div>
            <p className="text-[7px] text-[#A67C52] mt-4 text-center font-bold">* image_url diisi dengan link gambar (jika ada)</p>
        </div>
      </div>

      <button 
        onClick={() => router.push('/dashboard')} 
        className="mt-6 text-[10px] font-black text-[#A67C52] uppercase tracking-widest hover:text-[#5D4037]"
      >
        ← Kembali ke Dashboard
      </button>
    </div>
  );
}