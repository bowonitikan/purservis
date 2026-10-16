// File: app/cek/page.jsx
"use client";

import React, { useState } from "react";

const StatusBadge = ({ status }) => {
  let colors = "bg-[#F3F4F6] text-gray-500 shadow-[inset_2px_2px_5px_rgba(209,213,219,0.5),inset_-2px_-2px_5px_#ffffff]";
  
  if (status === "Antrean") {
    colors = "bg-[#FEF3C7] text-[#D97706] shadow-[inset_2px_2px_4px_rgba(252,211,77,0.5),inset_-2px_-2px_4px_#ffffff]";
  } else if (status === "Dikerjakan") {
    colors = "bg-[#DBEAFE] text-[#2563EB] shadow-[inset_2px_2px_4px_rgba(147,197,253,0.5),inset_-2px_-2px_4px_#ffffff]";
  } else if (status === "Selesai") {
    colors = "bg-[#D1FAE5] text-[#059669] shadow-[inset_2px_2px_4px_rgba(110,231,183,0.5),inset_-2px_-2px_4px_#ffffff]";
  }

  return (
    <span className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider ${colors}`}>
      {status}
    </span>
  );
};

export default function CekStatus() {
  const [ticketId, setTicketId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketId) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/public/track?id=${ticketId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");
      setResult(data.service);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EEFB] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#EAE0F5] rounded-full mx-auto mb-4 flex items-center justify-center shadow-[6px_6px_12px_#D4C5E6,-6px_-6px_12px_#ffffff] text-4xl">
            📱
          </div>
          <h1 className="text-2xl font-extrabold text-[#4C3D5A]">Cek Status Servis</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Pantau progres perbaikan perangkat Anda</p>
        </div>

        {/* Search Card */}
        <div className="bg-[#EAE0F5] p-6 rounded-[32px] shadow-[12px_12px_24px_#D4C5E6,-12px_-12px_24px_#ffffff] mb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-2 text-center">
                Masukkan ID Servis (Contoh: SRV-123456)
              </label>
              <input 
                type="text" 
                placeholder="SRV-XXXXXX"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                className="w-full bg-[#F5EEFB] text-[#4C3D5A] text-center font-bold tracking-widest uppercase rounded-2xl px-4 py-4 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_2px_2px_4px_#D4C5E6,inset_-2px_-2px_4px_#ffffff] transition-all"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#8B5CF6] text-white font-bold rounded-2xl py-4 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all text-sm uppercase tracking-wider disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? "Mencari..." : "🔍 Lacak Perangkat"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 p-5 rounded-[24px] text-center shadow-inner animate-in fade-in zoom-in duration-300">
            <span className="text-2xl block mb-1">😥</span>
            <p className="text-red-600 font-bold text-sm">{error}</p>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="bg-[#F5EEFB] p-6 rounded-[32px] shadow-[8px_8px_16px_#D4C5E6,-8px_-8px_16px_#ffffff] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-6">
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-3">Status Saat Ini</p>
              <StatusBadge status={result.status} />
            </div>

            <div className="bg-[#EAE0F5] p-5 rounded-[24px] shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Pelanggan</p>
                <p className="font-extrabold text-[#4C3D5A]">{result.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Perangkat</p>
                <p className="font-extrabold text-[#4C3D5A]">{result.device}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Keluhan</p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">{result.issue}</p>
              </div>
              
              {result.status === "Selesai" && (
                <div className="mt-2 pt-4 border-t border-dashed border-gray-400/50">
                  <p className="text-[10px] font-bold uppercase text-[#8B5CF6] tracking-wider mb-1">Total Biaya Perbaikan</p>
                  <p className="text-xl font-extrabold text-[#8B5CF6]">
                    Rp {Number(result.total_cost || 0).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-2">
                    Perangkat sudah bisa diambil di toko. Terima kasih!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}