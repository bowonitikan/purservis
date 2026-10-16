"use client";

import React, { useState, useEffect } from "react";

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
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${colors}`}>
      {status}
    </span>
  );
};

export default function AdminView() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  // STATE BARU: Filter Status & Pagination
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", phone: "", device: "", issue: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newStatus, setNewStatus] = useState("Antrean");
  const [serviceDetails, setServiceDetails] = useState([]);
  const [newCost, setNewCost] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isReportOpen, setIsReportOpen] = useState(false);

  const countAntrean = services.filter(s => s.status === "Antrean").length;
  const countDikerjakan = services.filter(s => s.status === "Dikerjakan").length;
  const countSelesai = services.filter(s => s.status === "Selesai").length;

  useEffect(() => {
    const total = serviceDetails.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    setNewCost(total);
  }, [serviceDetails]);

  // Reset ke halaman 1 jika user melakukan pencarian atau mengubah filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handlePrintNota = (item) => {
     const cachedSettings = window.localStorage.getItem("storeSettingsCache");
     const settings = cachedSettings ? JSON.parse(cachedSettings) : {};

     const storeName = settings.store_name || "Toko Servis";
     const headerSub = settings.header_sub || "";
     const storeAddress = settings.store_address || "Alamat belum diatur";
     const storePhone = settings.store_phone || "-";
     const receiptFooter = settings.receipt_footer || "Terima kasih atas kunjungan Anda.";

     const cost = item.total_cost || 0;
     const dateStr = new Date(item.created_at || Date.now()).toLocaleDateString('id-ID');
     const details = item.details || [];

     const printWindow = window.open('', '_blank', 'width=400,height=600');
     
     let detailsHtml = "";
     if (details.length > 0) {
        details.forEach(d => {
           detailsHtml += `
             <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
               <span>- ${d.name}</span>
               <span>Rp ${Number(d.price).toLocaleString('id-ID')}</span>
             </div>
           `;
        });
     } else {
        detailsHtml = `<p style="font-size: 12px; margin: 0;">Biaya Perbaikan / Jasa (Tanpa Rincian)</p>`;
     }

     const content = `
        <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
           <h2 style="margin: 0; font-size: 18px;">${storeName}</h2>
           ${headerSub ? `<p style="margin: 2px 0; font-size: 12px; font-weight: bold;">${headerSub}</p>` : ''}
           <p style="margin: 2px 0; font-size: 12px;">${storeAddress}</p>
           <p style="margin: 2px 0; font-size: 12px;">Telp: ${storePhone}</p>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
          <span>Tgl: ${dateStr}</span>
          <span>ID: ${item.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
          <span>Plg: ${item.name || "Pelanggan"}</span>
          <span>Kasir: Admin</span>
        </div>
        <div style="margin-bottom: 10px; font-size: 12px;">
          <p style="font-weight: bold; margin: 0 0 5px 0;">Device: ${item.device}</p>
          <p style="margin: 0 0 5px 0;">Keluhan: ${item.issue}</p>
        </div>
        <div style="border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
          <p style="font-size: 12px; font-weight: bold; margin: 0 0 5px 0;">Rincian Biaya:</p>
          ${detailsHtml}
        </div>
        <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin-bottom: 10px; display: flex; justify-content: space-between; font-size: 14px; font-weight: bold;">
          <span>TOTAL</span>
          <span>Rp ${cost.toLocaleString('id-ID')}</span>
        </div>
        <div style="text-align: center; font-size: 12px; margin-top: 20px;">
           <p>${receiptFooter}</p>
        </div>
     `;

     printWindow.document.write(`
         <html><head><title>Nota_${item.id}</title>
         <style>
            @page { margin: 0; }
            body { font-family: 'Courier New', Courier, monospace; width: 300px; margin: 20px auto; color: #000; }
         </style>
         </head><body onload="window.print(); window.close();">${content}</body></html>
     `);
     printWindow.document.close();
  };

  const handleSendWA = (item) => {
     const cachedSettings = window.localStorage.getItem("storeSettingsCache");
     const settings = cachedSettings ? JSON.parse(cachedSettings) : {};
     const storeName = settings.store_name || "Toko Servis";
     const receiptFooter = settings.receipt_footer || "Terima kasih.";

     const cost = item.total_cost || 0;
     const details = item.details || [];
     
     let detailsText = "";
     if (details.length > 0) {
       detailsText = "\n\n*Rincian Biaya:*";
       details.forEach(d => {
         detailsText += `\n- ${d.name} : Rp ${Number(d.price).toLocaleString('id-ID')}`;
       });
     }

     const text = `Halo Kak ${item.name || "Pelanggan"},\n\nKami dari *${storeName}* menginformasikan bahwa perangkat *${item.device}* (ID: ${item.id}) Anda telah SELESAI diperbaiki.${detailsText}\n\n*TOTAL BIAYA: Rp ${cost.toLocaleString('id-ID')}*\n\nSilakan datang ke toko untuk pengambilan. ${receiptFooter}`;
     
     let phoneStr = item.phone.replace(/[^0-9]/g, '');
     if(phoneStr.startsWith('0')) {
        phoneStr = '62' + phoneStr.substring(1);
     } else if(phoneStr.startsWith('8')) {
        phoneStr = '62' + phoneStr;
     }

     window.open(`https://wa.me/${phoneStr}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!addForm.phone) {
       alert("Nomor HP/WA wajib diisi!");
       return;
    }
    setIsAdding(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });

      if (!res.ok) throw new Error("Gagal menambah servis baru");

      setIsAddModalOpen(false);
      setAddForm({ name: "", phone: "", device: "", issue: "" });
      fetchServices();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setNewStatus(service.status);
    setServiceDetails(service.details?.length > 0 ? service.details : [{ name: "", price: 0 }]);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedService.id,
          status: newStatus,
          total_cost: newCost,
          details: serviceDetails.filter(d => d.name.trim() !== "")
        }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate data");

      setIsModalOpen(false);
      fetchServices(); 
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const isConfirm = window.confirm("⚠️ YAKIN INGIN MENGHAPUS TIKET INI?\nData yang sudah dihapus tidak bisa dikembalikan!");
    if (!isConfirm) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/services?id=${selectedService.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus data");

      setIsModalOpen(false);
      fetchServices(); 
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // LOGIKA PENCARIAN & FILTER STATUS
  const filteredServices = services.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchSearch = item.id.toLowerCase().includes(query) ||
                        (item.name && item.name.toLowerCase().includes(query)) ||
                        (item.phone && item.phone.toLowerCase().includes(query));
    
    const matchStatus = statusFilter === "Semua" || item.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // LOGIKA PAGINATION
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // KOMPONEN PAGINATION
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    // Logika Jendela Maksimal 10 Halaman
    let startPage = Math.max(1, currentPage - 4);
    let endPage = Math.min(totalPages, startPage + 9);

    if (endPage - startPage < 9) {
      startPage = Math.max(1, endPage - 9);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 my-6 px-1">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center bg-[#EAE0F5] text-[#8B5CF6] font-extrabold rounded-2xl shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] disabled:opacity-40 active:translate-y-0.5 transition-all"
        >
          &lt;
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 flex items-center justify-center font-extrabold rounded-2xl transition-all ${
              currentPage === page
                ? "bg-[#8B5CF6] text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]"
                : "bg-[#EAE0F5] text-gray-500 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] hover:text-[#8B5CF6] active:translate-y-0.5"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center bg-[#EAE0F5] text-[#8B5CF6] font-extrabold rounded-2xl shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] disabled:opacity-40 active:translate-y-0.5 transition-all"
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="w-full pb-24 relative">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl font-extrabold text-[#4C3D5A]">Daftar Antrean</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">Pantau semua tiket servis</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="bg-[#8B5CF6] text-white font-bold text-sm px-3 py-2 rounded-2xl shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all flex items-center gap-1"
          >
            <span>➕</span> Baru
          </button>
          <button onClick={() => setIsReportOpen(true)} className="bg-[#EAE0F5] text-[#8B5CF6] font-bold text-sm px-3 py-2 rounded-2xl shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] active:translate-y-0.5 transition-all flex items-center gap-1">
            <span>📊</span> Laporan
          </button>
        </div>
      </div>

      <div className="mb-4 px-1">
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Cari ID Servis, Nama, atau No WA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl pl-12 pr-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] placeholder:text-gray-400 placeholder:font-normal focus:shadow-[inset_2px_2px_4px_#D4C5E6,inset_-2px_-2px_4px_#ffffff] transition-all"
          />
        </div>
      </div>

      {/* ICON FILTER STATUS */}
      <div className="flex gap-3 overflow-x-auto pb-4 px-1 mb-2 hide-scrollbar">
        <button 
          onClick={() => setStatusFilter("Semua")}
          className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${statusFilter === "Semua" ? "bg-[#8B5CF6] text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]" : "bg-[#EAE0F5] text-gray-500 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5"}`}
        >
          <span>📦</span> Semua
        </button>
        <button 
          onClick={() => setStatusFilter("Antrean")}
          className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${statusFilter === "Antrean" ? "bg-[#FEF3C7] text-[#D97706] shadow-[inset_2px_2px_4px_rgba(252,211,77,0.5)] border border-yellow-300" : "bg-[#EAE0F5] text-gray-500 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5"}`}
        >
          <span>⏳</span> Antrean
        </button>
        <button 
          onClick={() => setStatusFilter("Dikerjakan")}
          className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${statusFilter === "Dikerjakan" ? "bg-[#DBEAFE] text-[#2563EB] shadow-[inset_2px_2px_4px_rgba(147,197,253,0.5)] border border-blue-300" : "bg-[#EAE0F5] text-gray-500 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5"}`}
        >
          <span>🛠️</span> Dikerjakan
        </button>
        <button 
          onClick={() => setStatusFilter("Selesai")}
          className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${statusFilter === "Selesai" ? "bg-[#D1FAE5] text-[#059669] shadow-[inset_2px_2px_4px_rgba(110,231,183,0.5)] border border-green-300" : "bg-[#EAE0F5] text-gray-500 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5"}`}
        >
          <span>✅</span> Selesai
        </button>
      </div>

      {/* PAGINATION ATAS */}
      <PaginationControls />

      {loading ? (
        <div className="flex flex-col gap-4 mt-2">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="bg-[#F5EEFB] p-6 rounded-[28px] h-32 animate-pulse shadow-[6px_6px_12px_#D4C5E6,-6px_-6px_12px_#ffffff]" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-[28px] text-center shadow-inner mt-2">
           <span className="text-3xl mb-2 block">😥</span>
           <p className="text-red-600 font-bold text-sm">{error}</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-[#F5EEFB] p-10 rounded-[32px] text-center shadow-[inset_6px_6px_12px_#D4C5E6,inset_-6px_-6px_12px_#ffffff] mt-2 border border-white/50">
           <span className="text-5xl mb-4 block grayscale opacity-50">📭</span>
           <h3 className="text-[#4C3D5A] font-extrabold text-lg">Belum Ada Antrean</h3>
        </div>
      ) : paginatedServices.length === 0 ? (
        <div className="bg-[#F5EEFB] p-10 rounded-[32px] text-center shadow-[inset_6px_6px_12px_#D4C5E6,inset_-6px_-6px_12px_#ffffff] mt-2 border border-white/50">
           <span className="text-5xl mb-4 block grayscale opacity-50">🕵️‍♂️</span>
           <h3 className="text-[#4C3D5A] font-extrabold text-lg">Tidak Ditemukan</h3>
           <p className="text-gray-500 text-sm mt-2">Data dengan filter ini kosong.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {paginatedServices.map((item) => (
            <div key={item.id} className="group bg-[#F5EEFB] p-5 rounded-[28px] shadow-[8px_8px_16px_#D4C5E6,-8px_-8px_16px_#ffffff] flex flex-col gap-4 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${item.status === 'Selesai' ? 'bg-[#34D399]' : item.status === 'Dikerjakan' ? 'bg-[#60A5FA]' : 'bg-[#FBBF24]'}`}></div>
              
              <div className="flex justify-between items-center pl-2">
                <span className="font-mono text-[10px] font-bold text-gray-400 tracking-widest bg-white/50 px-2 py-1 rounded-lg">
                  {item.id}
                </span>
                <div className="flex items-center gap-2">
                  {item.status === 'Selesai' && (
                    <div className="flex gap-1.5">
                      <button onClick={() => handlePrintNota(item)} className="bg-[#D1FAE5] text-[#059669] px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all border border-green-200">
                        🖨️ Cetak
                      </button>
                      <button onClick={() => handleSendWA(item)} className="bg-[#DCFCE7] text-[#16A34A] px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all border border-green-300">
                        💬 WA
                      </button>
                    </div>
                  )}
                  <StatusBadge status={item.status} />
                </div>
              </div>
              
              <div className="pl-2">
                <h3 className="font-extrabold text-[#4C3D5A] text-lg mb-1">{item.device}</h3>
                <div className="bg-[#EAE0F5] p-3 rounded-2xl shadow-[inset_3px_3px_6px_#D4C5E6,inset_-3px_-3px_6px_#ffffff]">
                   <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">"{item.issue}"</p>
                </div>
              </div>
              
              <div className="flex items-end justify-between mt-2 pl-2">
                 <div className="flex flex-col">
                    <p className="font-bold text-[#8B5CF6] text-sm flex items-center gap-1.5"><span className="text-lg">👤</span> {item.name || "Pelanggan"}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1.5"><span className="text-base">📱</span> {item.phone}</p>
                 </div>
                 
                 <button 
                    title="Update Status & Biaya"
                    onClick={() => openEditModal(item)}
                    className="bg-[#8B5CF6] text-white p-3 rounded-2xl shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all flex items-center justify-center"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.158 3.71 3.71 1.159-1.159a2.625 2.625 0 000-3.709zM7.22 7.966l-2.585 2.585a4.5 4.5 0 01-1.144 2.825l-.26.346a.75.75 0 01-1.077 0l-1.22-1.22a.75.75 0 010-1.077l.346-.26a4.5 4.5 0 012.824-1.144l2.585-2.585a4.5 4.5 0 016.364 0l2.585 2.586a4.5 4.5 0 010 6.364l-2.586 2.585a4.5 4.5 0 01-6.364 0l-2.585-2.585" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.12l-2.812.937a.75.75 0 01-.947-.947l.938-2.812a4.5 4.5 0 011.12-1.89l13.621-13.621zm-10.45 6.945L4.17 13.67a2.25 2.25 0 00-.512 1.053l-.612 2.45c-.15.602.398 1.15.1 1.15l2.45-.612a2.25 2.25 0 001.053-.512l2.238-2.238" />
                    </svg>
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION BAWAH */}
      <PaginationControls />

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4C3D5A]/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#F5EEFB] w-full max-w-md rounded-[32px] p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_#ffffff] animate-in fade-in zoom-in duration-200 mt-20 mb-10">
            <h3 className="text-xl font-extrabold text-[#8B5CF6] mb-5">Tambah Antrean Servis</h3>

            <form onSubmit={handleAddService} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-1">Nama Pelanggan</label>
                <input 
                  type="text" required placeholder="Misal: Budi Santoso"
                  value={addForm.name} onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                  className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl px-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-1">No. WA (Mandatory) <span className="text-red-500">*</span></label>
                <input 
                  type="text" required placeholder="081234xxxxx"
                  value={addForm.phone} onChange={(e) => setAddForm({...addForm, phone: e.target.value})}
                  className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl px-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-1">Nama Perangkat</label>
                <input 
                  type="text" required placeholder="Misal: iPhone 13 Pro"
                  value={addForm.device} onChange={(e) => setAddForm({...addForm, device: e.target.value})}
                  className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl px-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-1">Keluhan Kerusakan</label>
                <textarea 
                  required placeholder="Misal: Layar pecah, baterai drop"
                  value={addForm.issue} onChange={(e) => setAddForm({...addForm, issue: e.target.value})}
                  className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl px-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] h-24 resize-none"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 bg-[#EAE0F5] text-gray-500 font-bold rounded-2xl py-3 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all">Batal</button>
                <button type="submit" disabled={isAdding} className="flex-1 bg-[#8B5CF6] text-white font-bold rounded-2xl py-3 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all disabled:opacity-70">
                  {isAdding ? "Menyimpan..." : "Simpan Tiket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4C3D5A]/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#F5EEFB] w-full max-w-md rounded-[32px] p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_#ffffff] animate-in fade-in zoom-in duration-200 mt-20 mb-10">
            <h3 className="text-xl font-extrabold text-[#8B5CF6] mb-1">Update Status & Biaya</h3>
            <p className="text-sm font-mono text-gray-500 mb-6">{selectedService.id}</p>

            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-2 block mb-1">Status Pengerjaan</label>
                <select 
                  value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#EAE0F5] text-[#4C3D5A] font-bold rounded-2xl px-4 py-3 outline-none shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] appearance-none"
                >
                  <option value="Antrean">Antrean</option>
                  <option value="Dikerjakan">Sedang Dikerjakan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div className="bg-[#EAE0F5] p-4 rounded-[24px] shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]">
                <div className="flex justify-between items-center mb-3 px-1">
                   <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider">Rincian Jasa & Sparepart</label>
                   <button type="button" onClick={() => setServiceDetails([...serviceDetails, { name: "", price: 0 }])} className="text-[#8B5CF6] text-xs font-extrabold">+ Tambah</button>
                </div>
                <div className="flex flex-col gap-3">
                   {serviceDetails.map((detail, index) => (
                      <div key={index} className="flex gap-2 items-center">
                         <input 
                           type="text" placeholder="Nama Part/Jasa" value={detail.name}
                           onChange={(e) => {
                             const newArr = [...serviceDetails];
                             newArr[index].name = e.target.value;
                             setServiceDetails(newArr);
                           }}
                           className="flex-1 bg-white/50 text-[#4C3D5A] text-sm font-bold rounded-xl px-3 py-2 outline-none shadow-sm"
                         />
                         <input 
                           type="number" placeholder="Harga" value={detail.price === 0 ? "" : detail.price}
                           onChange={(e) => {
                             const newArr = [...serviceDetails];
                             newArr[index].price = e.target.value;
                             setServiceDetails(newArr);
                           }}
                           className="w-24 bg-white/50 text-[#4C3D5A] text-sm font-bold rounded-xl px-3 py-2 outline-none shadow-sm"
                         />
                         <button type="button" onClick={() => setServiceDetails(serviceDetails.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-600 px-1 font-bold">×</button>
                      </div>
                   ))}
                   {serviceDetails.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Belum ada rincian ditambahkan.</p>}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#8B5CF6] tracking-wider ml-2 block mb-1">Total Biaya Otomatis (Rp)</label>
                <div className="w-full bg-[#8B5CF6]/10 text-[#8B5CF6] font-extrabold text-xl rounded-2xl px-4 py-3 shadow-inner flex items-center justify-between border border-[#8B5CF6]/20">
                   <span>Rp</span><span>{newCost.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button type="button" onClick={handleDelete} disabled={isDeleting} className="bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-2xl px-4 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all text-xl" title="Hapus Tiket">🗑️</button>
                
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-[#EAE0F5] text-gray-500 font-bold rounded-2xl py-3 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all">Batal</button>
                <button type="submit" disabled={isUpdating} className="flex-1 bg-[#8B5CF6] text-white font-bold rounded-2xl py-3 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all disabled:opacity-70">
                  {isUpdating ? "Loading..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4C3D5A]/40 backdrop-blur-sm p-4">
          <div className="bg-[#F5EEFB] w-full max-w-sm rounded-[32px] p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_#ffffff] animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-extrabold text-[#8B5CF6] mb-5 flex items-center gap-2"><span>📊</span> Laporan Antrean</h3>
            <div className="flex flex-col gap-3">
              <div className="bg-[#EAE0F5] p-4 rounded-2xl flex justify-between items-center shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]">
                 <span className="text-sm font-bold text-gray-600">Total Antrean</span>
                 <span className="bg-[#FEF3C7] text-[#D97706] px-3 py-1 rounded-xl text-sm font-extrabold shadow-sm border border-yellow-200">{countAntrean}</span>
              </div>
              <div className="bg-[#EAE0F5] p-4 rounded-2xl flex justify-between items-center shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]">
                 <span className="text-sm font-bold text-gray-600">Sedang Dikerjakan</span>
                 <span className="bg-[#DBEAFE] text-[#2563EB] px-3 py-1 rounded-xl text-sm font-extrabold shadow-sm border border-blue-200">{countDikerjakan}</span>
              </div>
              <div className="bg-[#EAE0F5] p-4 rounded-2xl flex justify-between items-center shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff]">
                 <span className="text-sm font-bold text-gray-600">Selesai (Siap Ambil)</span>
                 <span className="bg-[#D1FAE5] text-[#059669] px-3 py-1 rounded-xl text-sm font-extrabold shadow-sm border border-green-200">{countSelesai}</span>
              </div>
            </div>
            <button onClick={() => setIsReportOpen(false)} className="w-full mt-6 bg-[#8B5CF6] text-white font-bold rounded-2xl py-3 shadow-[4px_4px_8px_#D4C5E6,-4px_-4px_8px_#ffffff] active:translate-y-0.5 transition-all">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}