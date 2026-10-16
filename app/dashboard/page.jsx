"use client";

import React, { useState, useEffect } from "react";
import AdminView from "../components/AdminView"; // Pastikan path ini sesuai dengan struktur folder Anda

export default function Dashboard() {
  // === STATE KEAMANAN (LOGIN) ===
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // === STATE SETUP STRUK ===
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    store_name: "", header_sub: "", store_address: "", store_phone: "", receipt_footer: ""
  });
  const [isSavingSetup, setIsSavingSetup] = useState(false);

  // Cek apakah Admin sudah login sebelumnya
  useEffect(() => {
    const session = localStorage.getItem("adminAuth");
    if (session === "valid") {
      setIsLoggedIn(true);
    }
    setIsLoadingAuth(false);
  }, []);

  // Fungsi Proses Login
  const handleLogin = (e) => {
    e.preventDefault();
    // Default Password: admin123 (Anda bisa mengubah teks ini nanti di kode)
    if (password === "qaera2026") {
      localStorage.setItem("adminAuth", "valid");
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Kata sandi salah! Silakan coba lagi.");
    }
  };

  // Fungsi Logout
  const handleLogout = () => {
    if(confirm("Yakin ingin keluar dari Admin Panel?")) {
      localStorage.removeItem("adminAuth");
      setIsLoggedIn(false);
      setPassword("");
    }
  };

  // Fungsi Ambil Pengaturan Struk
  const fetchSettings = async () => {
    const cached = window.localStorage.getItem("storeSettingsCache");
    if (cached) setStoreSettings(JSON.parse(cached));

    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setStoreSettings(data.settings);
          window.localStorage.setItem("storeSettingsCache", JSON.stringify(data.settings));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn && isSetupOpen) fetchSettings();
  }, [isLoggedIn, isSetupOpen]);

  // Fungsi Simpan Pengaturan Struk
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSetup(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeSettings),
      });
      if (!res.ok) throw new Error("Gagal menyimpan pengaturan");

      window.localStorage.setItem("storeSettingsCache", JSON.stringify(storeSettings));
      alert("Pengaturan Nota berhasil disimpan!");
      setIsSetupOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSavingSetup(false);
    }
  };

  if (isLoadingAuth) return <div className="min-h-screen bg-[#F5EEFB]"></div>;

  // === TAMPILAN HALAMAN LOGIN ADMIN ===
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F5EEFB] flex items-center justify-center p-4">
        <div className="bg-[#EAE0F5] p-8 rounded-[32px] shadow-[12px_12px_24px_#D4C5E6,-12px_-12px_24px_#ffffff] max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-[#F5EEFB] rounded-full mx-auto mb-6 flex items-center justify-center shadow-[inset_6px_6px_12px_#D4C5E6,inset_-6px_-6px_12px_#ffffff] text-4xl">
            🔐
          </div>
          <h2 className="text-2xl font-extrabold text-[#4C3D5A] mb-1">Admin Panel</h2>
          <p className="text-sm text-gray-500 font-medium mb-8">Masukkan kata sandi untuk mengakses sistem kasir.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <input 
                type="password" 
                placeholder="Kata Sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F5EEFB] text-[#4C3D5A] text-center font-bold tracking-widest rounded-2xl px-4 py-4 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_2px_2px_4px_#D4C5E6,inset_-2px_-2px_4px_#ffffff] transition-all"
              />
              {loginError && <p className="text-red-500 text-[11px] font-bold mt-2">{loginError}</p>}
            </div>
            
            <button type="submit" className="w-full bg-[#8B5CF6] text-white font-bold rounded-2xl py-4 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all text-sm uppercase tracking-wider">
              Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // === TAMPILAN DASHBOARD UTAMA (JIKA SUDAH LOGIN) ===
  return (
    <div className="min-h-screen bg-[#F5EEFB] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto flex justify-between items-center bg-[#EAE0F5] p-4 rounded-[28px] shadow-[6px_6px_12px_#D4C5E6,-6px_-6px_12px_#ffffff] mb-8">
        <div className="flex items-center gap-3 pl-2">
          <div className="w-11 h-11 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center font-extrabold shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] text-lg">
            P
          </div>
          <div>
            <h1 className="font-extrabold text-[#4C3D5A] text-sm md:text-base">Hai, Poerwanto</h1>
            <p className="text-[#8B5CF6] text-[10px] font-bold tracking-widest uppercase mt-0.5">Admin Panel</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pr-1">
		   {/* Tombol Panduan / Help */}
<div className="relative group">
  <a 
    href="/User Guide.html" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 bg-white/80 rounded-xl shadow-[4px_4px_10px_rgba(209,217,230,0.5),-4px_-4px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_4px_4px_10px_rgba(209,217,230,0.5),inset_-4px_-4px_10px_rgba(255,255,255,0.8)] transition-all duration-300 text-purple-600 cursor-pointer"
  >
    {/* Ikon Tanda Tanya (?) */}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
    </svg>
  </a>

  {/* Balon Petunjuk (Tooltip) yang muncul saat di-hover */}
  <div className="absolute right-0 top-12 hidden group-hover:block w-max bg-[#4C3D5A] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg z-50 animate-fade-in">
    Buka Buku Panduan
    {/* Segitiga kecil panah ke atas pada balon */}
    <div className="absolute -top-1 right-3.5 w-2.5 h-2.5 bg-[#4C3D5A] rotate-45"></div>
  </div>
</div>
		
          {/* Tombol Setup */}
          <button 
            onClick={() => setIsSetupOpen(true)}
            className="w-11 h-11 bg-[#F5EEFB] text-gray-500 rounded-2xl flex items-center justify-center text-lg shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#D4C5E6,inset_-2px_-2px_4px_#ffffff] transition-all"
            title="Setup Struk Nota"
          >
            ⚙️
          </button>
          {/* Tombol Logout */}
          <button 
            onClick={handleLogout}
            className="w-11 h-11 bg-[#F5EEFB] text-gray-500 rounded-2xl flex items-center justify-center text-lg shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#D4C5E6,inset_-2px_-2px_4px_#ffffff] transition-all text-red-400"
            title="Keluar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AdminView />
      </div>

      {/* MODAL SETUP STRUK */}
      {isSetupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4C3D5A]/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#F5EEFB] w-full max-w-3xl rounded-[32px] p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_#ffffff] animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row gap-8">
            
            {/* Bagian Kiri: Form Pengisian */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">⚙️</span>
                <h3 className="text-xl font-extrabold text-[#8B5CF6]">Setup Struk Nota</h3>
              </div>
              
              <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-1">Nama Toko</label>
                  <input 
                    type="text" value={storeSettings.store_name || ""} 
                    onChange={(e) => setStoreSettings({...storeSettings, store_name: e.target.value})}
                    placeholder="Misal: ERANITIKAN SERVIS"
                    className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl px-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-1">Sub Header / Slogan</label>
                  <input 
                    type="text" value={storeSettings.header_sub || ""} 
                    onChange={(e) => setStoreSettings({...storeSettings, header_sub: e.target.value})}
                    placeholder="Misal: Spesialis Laptop & HP"
                    className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl px-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-1">Alamat Lengkap</label>
                  <textarea 
                    value={storeSettings.store_address || ""} 
                    onChange={(e) => setStoreSettings({...storeSettings, store_address: e.target.value})}
                    placeholder="Jl. Merdeka No. 123, Purwokerto"
                    className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl px-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-1">No. Telp / WA Toko</label>
                  <input 
                    type="text" value={storeSettings.store_phone || ""} 
                    onChange={(e) => setStoreSettings({...storeSettings, store_phone: e.target.value})}
                    placeholder="0812xxxxxx"
                    className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl px-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-1">Pesan Footer / Garansi</label>
                  <textarea 
                    value={storeSettings.receipt_footer || ""} 
                    onChange={(e) => setStoreSettings({...storeSettings, receipt_footer: e.target.value})}
                    placeholder="Barang yang tidak diambil lebih dari 1 bulan bukan tanggung jawab kami."
                    className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl px-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] h-20 resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setIsSetupOpen(false)} className="flex-1 bg-[#EAE0F5] text-gray-500 font-bold rounded-2xl py-3 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all">Batal</button>
                  <button type="submit" disabled={isSavingSetup} className="flex-1 bg-[#8B5CF6] text-white font-bold rounded-2xl py-3 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all disabled:opacity-70">
                    {isSavingSetup ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>

            {/* Bagian Kanan: Preview Struk */}
            <div className="flex-[0.8] bg-white p-6 rounded-2xl shadow-inner border-t-[10px] border-[#EAE0F5] font-mono text-sm text-gray-800 flex flex-col justify-between h-auto min-h-[400px]">
               <div>
                  <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
                     <h2 className="font-bold text-lg leading-tight uppercase">{storeSettings.store_name || "NAMA TOKO"}</h2>
                     {storeSettings.header_sub && <p className="text-xs font-bold mt-1">{storeSettings.header_sub}</p>}
                     <p className="text-xs mt-1">{storeSettings.store_address || "Alamat Toko Anda"}</p>
                     <p className="text-xs">Telp: {storeSettings.store_phone || "-"}</p>
                  </div>
                  <div className="flex justify-between text-xs mb-1"><span>Tgl: 12/10/2026</span><span>ID: SRV-1234</span></div>
                  <div className="flex justify-between text-xs border-b border-dashed border-gray-400 pb-3 mb-3"><span>Plg: Budi</span><span>Ks: Admin</span></div>
                  <div className="text-xs mb-3">
                    <p className="font-bold">Device: iPhone 13</p>
                    <p>Keluhan: Ganti LCD</p>
                  </div>
                  <div className="text-xs border-b border-dashed border-gray-400 pb-3 mb-3">
                    <p className="font-bold mb-1">Rincian Biaya:</p>
                    <div className="flex justify-between mb-1"><span>- LCD Ori</span><span>Rp 1.500.000</span></div>
                    <div className="flex justify-between mb-1"><span>- Jasa Pasang</span><span>Rp 150.000</span></div>
                  </div>
                  <div className="flex justify-between font-bold text-sm"><span>TOTAL</span><span>Rp 1.650.000</span></div>
               </div>
               <div className="text-center text-xs mt-6 pt-3 border-t border-dashed border-gray-400">
                  <p>{storeSettings.receipt_footer || "Terima kasih atas kunjungan Anda."}</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}