"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        alert("Akses Ditolak!");
        router.push('/dashboard');
      } else {
        setIsAdmin(true);
        fetchUsers();
      }
    };
    checkAdmin();
  }, [router]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setUsers(data);
    setLoading(false);
  };

  const togglePremium = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: !currentStatus })
      .eq('id', userId);

    if (error) {
      alert("Gagal update status: " + error.message);
    } else {
      fetchUsers(); // Refresh data
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="p-8 min-h-screen bg-[#FDFBF9] text-[#42271E] font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-[#5D4037]">Manajemen User</h1>
            <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">Aktivasi Akun Premium Pejuang NIP</p>
          </div>
          <button 
            onClick={() => router.push('/admin')} 
            className="text-[10px] font-black uppercase bg-[#E6CEA0]/20 px-6 py-2 rounded-xl hover:bg-[#E6CEA0]/40 transition-all"
          >
            ← Kembali ke Menu Admin
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 font-black text-[#A67C52] animate-pulse">MEMUAT DATA PEJUANG...</div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-[#E6CEA0]/20 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#5D4037] text-[#E6CEA0]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Nama / Email</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Kategori</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6CEA0]/10">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                    <td className="p-6">
                      <p className="font-black text-sm uppercase text-[#5D4037]">{u.nama || 'No Name'}</p>
                      <p className="text-[10px] text-[#A67C52] font-bold italic">{u.email}</p>
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-3 py-1 bg-[#FDFBF9] border border-[#E6CEA0]/30 rounded-lg text-[9px] font-black uppercase text-[#A67C52]">
                        {u.paket || 'Belum Pilih'}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      {u.is_premium ? (
                        <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[9px] font-black uppercase">🌟 Premium</span>
                      ) : (
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-400 rounded-full text-[9px] font-black uppercase">☁️ Free</span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => togglePremium(u.id, u.is_premium)}
                        className={`px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-md ${
                          u.is_premium 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-[#5D4037] text-white hover:bg-[#A67C52]'
                        }`}
                      >
                        {u.is_premium ? 'Cabut Akses' : 'Aktivasi Premium'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}