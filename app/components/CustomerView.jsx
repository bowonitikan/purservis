"use client";

import React, { useState, useEffect } from "react";

// Komponen Badge Status bergaya Clay
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
    <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${colors}`}>
      {status}
    </span>
  );
};

export default function CustomerView({ phone }) {
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!phone) {
       setLoading(false);
       return;
    }

    const fetchMyServices = async () => {
      try {
        const res = await fetch(`/api/customer/services?phone=${phone}`);
        if (!res.ok) throw new Error("Gagal mengambil riwayat servis");
        const data = await res.json();
        setMyServices(data.services || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyServices();
  }, [phone]);

  return (
    <div className="w-full pb-24 relative min-h-[70vh]">
      {/* Header Bagian Customer */}
      <div className="mb-6 px-1">
        <h2 className="text-2xl font-extrabold text-[#4C3D5A]">
          Riwayat Servis
        </h2>
        <p className="text-sm text-gray-500 font-medium mt-1">Pantau status perbaikan perangkat Anda</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 mt-8">
          {[1, 2].map((skeleton) => (
            <div key={skeleton} className="bg-[#F5EEFB] p-6 rounded-[32px] h-40 animate-pulse shadow-[6px_6px_12px_#D4C5E6,-6px_-6px_12px_#ffffff]" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-[28px] text-center shadow-inner mt-8">
           <span className="text-3xl mb-2 block">😥</span>
           <p className="text-red-600 font-bold text-sm">{error}</p>
        </div>
      ) : myServices.length === 0 ? (
        <div className="bg-[#F5EEFB] p-10 rounded-[32px] text-center shadow-[inset_6px_6px_12px_#D4C5E6,inset_-6px_-6px_12px_#ffffff] mt-8 border border-white/50">
           <span className="text-6xl mb-4 block opacity-60">📱</span>
           <h3 className="text-[#4C3D5A] font-extrabold text-lg">Belum Ada Servis</h3>
           <p className="text-gray-500 text-sm mt-2 leading-relaxed">Anda belum pernah mengajukan perbaikan. Tekan tombol + di bawah untuk mulai.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {myServices.map((item) => (
            /* --- KARTU CLAYMORPHISM BESAR --- */
            <div 
              key={item.id} 
              className="bg-[#F5EEFB] p-6 rounded-[32px] shadow-[8px_8px_16px_#D4C5E6,-8px_-8px_16px_#ffffff] flex flex-col gap-5 border border-white/40"
            >
              {/* Bagian Atas: Alat & Status */}
              <div className="flex justify-between items-start">
                 <div>
                   <h3 className="font-extrabold text-[#4C3D5A] text-xl">{item.device}</h3>
                   <p className="font-mono text-xs font-bold text-gray-400 mt-1">ID: {item.id}</p>
                 </div>
                 <StatusBadge status={item.status} />
              </div>

              {/* Kotak Keluhan (Inset) */}
              <div className="bg-[#EAE0F5] p-4 rounded-2xl shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]">
                 <p className="text-[10px] uppercase font-bold text-[#A78BFA] mb-1.5 tracking-widest">Keluhan Kerusakan</p>
                 <p className="text-sm text-[#4C3D5A] font-medium leading-relaxed">
                   "{item.issue}"
                 </p>
              </div>

              {/* Bagian Bawah: Tanggal & Biaya */}
              <div className="flex justify-between items-end mt-1 px-1">
                 <div>
                   <p className="text-[10px] uppercase font-bold text-gray-400">Tanggal Masuk</p>
                   <p className="text-sm font-bold text-gray-600">
                     {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] uppercase font-bold text-gray-400">Estimasi Biaya</p>
                   <p className={`text-lg font-extrabold ${item.total_cost > 0 ? 'text-[#8B5CF6]' : 'text-gray-400'}`}>
                      {item.total_cost > 0 ? `Rp ${item.total_cost.toLocaleString('id-ID')}` : 'Menunggu...'}
                   </p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FLOATING ACTION BUTTON (FAB) CLAYMORPHISM */}
      <button 
        className="fixed bottom-8 right-6 w-16 h-16 bg-[#8B5CF6] text-white rounded-[24px] shadow-[6px_6px_12px_#D4C5E6,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)] active:scale-95 transition-all flex items-center justify-center z-50 group border-2 border-[#A78BFA]"
        title="Ajukan Servis Baru"
      >
        <span className="text-3xl font-light group-hover:rotate-90 transition-transform duration-300">+</span>
      </button>

    </div>
  );
}
