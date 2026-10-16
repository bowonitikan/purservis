// File: app/daftar/page.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function DaftarService() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", device: "", issue: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone) {
       setError("Nomor HP/WhatsApp wajib diisi!");
       return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pendaftaran");

      // Berhasil! Simpan ID Servis untuk ditampilkan ke pelanggan
      setSuccessId(data.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // TAMPILAN JIKA BERHASIL MENDAFTAR
  if (successId) {
    return (
      <div className="min-h-screen bg-[#F5EEFB] flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-[#F5EEFB] w-full max-w-md rounded-[32px] p-8 text-center shadow-[12px_12px_24px_#D4C5E6,-12px_-12px_24px_#ffffff] animate-in zoom-in fade-in duration-300">
          <div className="w-20 h-20 bg-[#D1FAE5] text-[#059669] rounded-full mx-auto mb-6 flex items-center justify-center shadow-inner text-4xl">
            🎉
          </div>
          <h2 className="text-2xl font-extrabold text-[#4C3D5A] mb-2">Pendaftaran Sukses!</h2>
          <p className="text-sm text-gray-500 font-medium mb-6">Data Anda telah masuk ke sistem kami. Berikut adalah ID Tiket Anda:</p>
          
          <div className="bg-[#EAE0F5] p-5 rounded-2xl shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] mb-8">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ID Servis</p>
             <p className="text-3xl font-extrabold text-[#8B5CF6] tracking-widest">{successId}</p>
          </div>

          <p className="text-xs text-gray-500 mb-6 px-4">
             Simpan ID ini baik-baik. Anda bisa menggunakannya untuk melacak status pengerjaan perangkat Anda di menu <b>Lacak Servis</b>.
          </p>

          <div className="flex flex-col gap-3">
             <button onClick={() => router.push('/cek')} className="w-full bg-[#8B5CF6] text-white font-bold rounded-2xl py-4 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all text-sm uppercase tracking-wider">
               Lacak Status Sekarang
             </button>
             <button onClick={() => router.push('/')} className="w-full bg-[#EAE0F5] text-gray-500 font-bold rounded-2xl py-4 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all text-sm uppercase tracking-wider">
               Kembali ke Beranda
             </button>
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN FORM PENDAFTARAN
  return (
    <div className="min-h-screen bg-[#F5EEFB] flex flex-col items-center py-10 px-4 font-sans">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/')} className="w-12 h-12 bg-[#EAE0F5] text-[#8B5CF6] rounded-2xl flex items-center justify-center text-xl shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#D4C5E6,inset_-2px_-2px_4px_#ffffff] transition-all font-bold">
            &lt;
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#4C3D5A]">Daftar Service</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">Daftar mandiri tanpa antre di kasir</p>
          </div>
        </div>

        <div className="bg-[#EAE0F5] p-6 rounded-[32px] shadow-[12px_12px_24px_#D4C5E6,-12px_-12px_24px_#ffffff]">
          {error && (
            <div className="bg-red-50 p-4 rounded-2xl mb-6 shadow-inner border border-red-200">
               <p className="text-red-500 font-bold text-xs text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-2">Nama Lengkap</label>
              <input 
                type="text" required placeholder="Nama Anda"
                value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full bg-[#F5EEFB] text-[#4C3D5A] font-bold rounded-2xl px-4 py-4 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_2px_2px_4px_#D4C5E6,inset_-2px_-2px_4px_#ffffff] transition-all"
              />
            </div>
            
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-2">No. WhatsApp aktif</label>
              <input 
                type="tel" required placeholder="0812345xxxxx"
                value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                className="w-full bg-[#F5EEFB] text-[#4C3D5A] font-bold rounded-2xl px-4 py-4 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_2px_2px_4px_#D4C5E6,inset_-2px_-2px_4px_#ffffff] transition-all"
              />
            </div>
            
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-2">Merek & Tipe Perangkat</label>
              <input 
                type="text" required placeholder="Misal: iPhone 13 Pro"
                value={form.device} onChange={(e) => setForm({...form, device: e.target.value})}
                className="w-full bg-[#F5EEFB] text-[#4C3D5A] font-bold rounded-2xl px-4 py-4 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_2px_2px_4px_#D4C5E6,inset_-2px_-2px_4px_#ffffff] transition-all"
              />
            </div>
            
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-2">Keluhan / Kerusakan</label>
              <textarea 
                required placeholder="Jelaskan kendala perangkat Anda..."
                value={form.issue} onChange={(e) => setForm({...form, issue: e.target.value})}
                className="w-full bg-[#F5EEFB] text-[#4C3D5A] font-bold rounded-2xl px-4 py-4 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_2px_2px_4px_#D4C5E6,inset_-2px_-2px_4px_#ffffff] transition-all h-28 resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#8B5CF6] text-white font-bold rounded-2xl py-4 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all text-sm uppercase tracking-wider disabled:opacity-70"
            >
              {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}