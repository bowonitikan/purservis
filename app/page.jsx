"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const storeWhatsApp = "6287881545501"; // Ganti dengan nomor WA Anda
  const waMessage = encodeURIComponent("Halo Eranitikan Servis, saya ingin konsultasi mengenai perbaikan perangkat saya.");

  return (
    <div className="min-h-screen bg-[#F5EEFB] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#EAE0F5] rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#EAE0F5] rounded-full blur-3xl opacity-60"></div>

      <div className="w-full max-w-md z-10">
        
        <div className="text-center mb-8">
          {/* Header Logo & Judul */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#EAE0F5] rounded-[32px] mx-auto mb-6 flex items-center justify-center shadow-[12px_12px_24px_#D4C5E6,-12px_-12px_24px_#ffffff] rotate-3 overflow-hidden">
            {/* FOTO PROFIL MENGGANTIKAN EMOJI */}
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEihP2EbYNmNB1vmNlvLysEXdLM7VrHkxWCEGmFl5XQGuoRcIq1p2uvtXnAJzzoosXfw3vH48JExdbGlQIdyjPT7HZcLw0TTkn3xT0Q1YKiT1QNbahFgRFkaCtGSB5IVr3niUa-ivOvEW4x82lVGJcw8uzRHMkWQDkE8_NTL_aRnTu9LtCkwHGH9Rr2-6fka/s225/purwanto.jpg" 
              alt="Logo Poer Electro" 
              className="w-full h-full object-cover -rotate-3"
            />
          </div>
          
        </div>
          <h1 className="text-3xl font-extrabold text-[#4C3D5A] tracking-tight">Poer Electro Servis</h1>
          <p className="text-sm text-gray-500 font-medium mt-2 px-4">Solusi perbaikan gadget terpercaya, cepat, dan transparan.</p>
        </div>

        <div className="flex flex-col gap-4 mb-10">
          
          {/* Menu 1: Daftar Service (BARU) */}
          <button 
            onClick={() => router.push('/daftar')}
            className="group bg-[#8B5CF6] p-5 rounded-[32px] shadow-[8px_8px_16px_#D4C5E6,-8px_-8px_16px_#ffffff] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)] active:translate-y-1 transition-all flex items-center text-left gap-4"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform text-white">
              📝
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Daftar Service</h2>
              <p className="text-[11px] text-white/80 font-medium mt-1">Daftarkan perangkat Anda untuk mendapatkan Nomor Antrean.</p>
            </div>
          </button>

          {/* Menu 2: Lacak Servis */}
          <button 
            onClick={() => router.push('/cek')}
            className="group bg-[#EAE0F5] p-5 rounded-[32px] shadow-[8px_8px_16px_#D4C5E6,-8px_-8px_16px_#ffffff] active:shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] active:translate-y-1 transition-all flex items-center text-left gap-4"
          >
            <div className="w-14 h-14 bg-[#F5EEFB] rounded-2xl flex items-center justify-center text-2xl shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] group-hover:scale-105 transition-transform">
              🔍
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#8B5CF6]">Lacak Servis</h2>
              <p className="text-[11px] text-gray-500 font-medium mt-1">Cek status perbaikan perangkat Anda menggunakan ID Tiket.</p>
            </div>
          </button>

          {/* Menu 3: Konsultasi WA */}
          <button 
            onClick={() => window.open(`https://wa.me/${storeWhatsApp}?text=${waMessage}`, '_blank')}
            className="group bg-[#EAE0F5] p-5 rounded-[32px] shadow-[8px_8px_16px_#D4C5E6,-8px_-8px_16px_#ffffff] active:shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] active:translate-y-1 transition-all flex items-center text-left gap-4"
          >
            <div className="w-14 h-14 bg-[#F5EEFB] rounded-2xl flex items-center justify-center text-2xl shadow-[inset_4px_4px_8px_#D4C5E6,inset_-4px_-4px_8px_#ffffff] group-hover:scale-105 transition-transform text-green-500">
              💬
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#4C3D5A]">Konsultasi Langsung</h2>
              <p className="text-[11px] text-gray-500 font-medium mt-1">Hubungi teknisi kami untuk bertanya via WhatsApp.</p>
            </div>
          </button>

        </div>

        {/* Pintu Masuk Admin & Credit qaSoft */}
        <div className="flex items-center justify-center gap-3">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-[10px] font-bold uppercase text-gray-400 tracking-widest hover:text-[#8B5CF6] transition-colors flex items-center gap-1"
            title="Masuk sebagai Admin"
          >
            <span>🔐</span> Admin Portal
          </button>

          {/* Titik Pemisah */}
          <span className="text-gray-300 text-[10px]">|</span>

          {/* Link qaSoft */}
          <a 
            href="mailto:aqiladewiri@gmail.com"
            className="text-[10px] font-bold uppercase text-gray-400 tracking-widest hover:text-[#8B5CF6] transition-colors flex items-center gap-1"
            title="Hubungi Developer"
          >
            © qaSoft
          </a>
        </div>

      </div>
    </div>
  );
}
