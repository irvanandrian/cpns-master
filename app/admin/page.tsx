"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase'; 

export default function AdminPage() {
  const [status, setStatus] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("Sedang membaca file...");

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

        // MAPPING DATA SESUAI STRUKTUR DATABASE BARU
        const formatSoal = rawData.map((s: any) => ({
          pertanyaan: s.pertanyaan,
          opsi_a: s.opsi_a,
          opsi_b: s.opsi_b,
          opsi_c: s.opsi_c,
          opsi_d: s.opsi_d,
          opsi_e: s.opsi_e,
          kunci: s.kunci ? s.kunci.toString().toUpperCase() : null, // Memastikan huruf besar (A, B, C)
          kategori: s.kategori, // TWK, TIU, atau TKP
          paket_id: s.paket_id || 1, // Diambil dari Excel, default 1
          poin_a: parseInt(s.poin_a) || 0,
          poin_b: parseInt(s.poin_b) || 0,
          poin_c: parseInt(s.poin_c) || 0,
          poin_d: parseInt(s.poin_d) || 0,
          poin_e: parseInt(s.poin_e) || 0,
        }));

        const { error } = await supabase.from('soal').insert(formatSoal);

        if (error) {
          console.error("Supabase Error:", error);
          alert("Gagal ke Supabase: " + error.message);
          setStatus("❌ Gagal Simpan: " + error.message);
        } else {
          alert("Berhasil! " + formatSoal.length + " soal masuk database.");
          setStatus(`✅ Mantap! ${formatSoal.length} soal berhasil diupload.`);
        }
      } catch (err) {
        console.error("Code Error:", err);
        setStatus("❌ Error pembacaan file. Pastikan header Excel benar.");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-10 flex flex-col items-center min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 w-full max-w-md">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 mx-auto shadow-lg shadow-blue-100">
          🚀
        </div>
        <h1 className="text-2xl font-black mb-2 text-slate-800 text-center">Admin Panel</h1>
        <p className="text-slate-400 text-sm text-center mb-10">Upload 27 Soal (3 Paket) sekaligus via Excel (.xlsx)</p>
        
        <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:border-blue-400 transition-colors group bg-slate-50">
          <input 
            type="file" 
            accept=".xlsx" 
            onChange={handleFileUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-600 group-hover:text-blue-600">Klik atau seret file ke sini</p>
            <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">Format: .XLSX ONLY</p>
          </div>
        </div>
        
        {status && (
          <div className={`mt-8 p-4 rounded-2xl text-center text-sm font-bold ${
            status.includes("✅") ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
          }`}>
            {status}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-100">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Panduan Header Excel:</h4>
           <div className="grid grid-cols-2 gap-2">
              <div className="text-[10px] bg-slate-100 p-2 rounded-lg text-slate-500 font-mono">pertanyaan</div>
              <div className="text-[10px] bg-slate-100 p-2 rounded-lg text-slate-500 font-mono">opsi_a s/d e</div>
              <div className="text-[10px] bg-slate-100 p-2 rounded-lg text-slate-500 font-mono">kunci</div>
              <div className="text-[10px] bg-slate-100 p-2 rounded-lg text-slate-500 font-mono">kategori</div>
              <div className="text-[10px] bg-slate-100 p-2 rounded-lg text-slate-500 font-mono">paket_id</div>
              <div className="text-[10px] bg-slate-100 p-2 rounded-lg text-slate-500 font-mono">poin_a s/d e</div>
           </div>
        </div>
      </div>
    </div>
  );
}