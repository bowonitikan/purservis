// File: app/api/admin/settings/route.js
import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET() {
  try {
    // Abaikan error jika tabel belum ada saat pertama kali dimuat
    try {
      const result = await turso.execute("SELECT * FROM settings WHERE id = 1");
      if (result.rows.length > 0) {
        return NextResponse.json({ settings: result.rows[0] }, { status: 200 });
      }
    } catch (err) {
      // Jika tabel tidak ada, kembalikan null agar tidak error di frontend
    }
    return NextResponse.json({ settings: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { store_name, header_sub, store_address, store_phone, receipt_footer } = body;

    // 1. HAPUS TABEL LAMA YANG STRUKTURNYA SALAH (RESET TOTAL)
    await turso.execute("DROP TABLE IF EXISTS settings");

    // 2. BUAT ULANG TABEL DENGAN STRUKTUR KOLOM YANG BENAR & KOMPLIT
    await turso.execute(`
      CREATE TABLE settings (
        id INTEGER PRIMARY KEY,
        store_name TEXT,
        header_sub TEXT,
        store_address TEXT,
        store_phone TEXT,
        receipt_footer TEXT
      )
    `);

    // 3. MASUKKAN DATA PENGATURAN BARU
    await turso.execute({
      sql: `
        INSERT INTO settings (id, store_name, header_sub, store_address, store_phone, receipt_footer) 
        VALUES (1, ?, ?, ?, ?, ?)
      `,
      args: [
        store_name || "", 
        header_sub || "", 
        store_address || "", 
        store_phone || "", 
        receipt_footer || ""
      ]
    });

    return NextResponse.json({ message: "Pengaturan berhasil di-reset dan disimpan!" }, { status: 200 });
    
  } catch (error) {
    console.error(">>> ERROR SAAT MERESET/MENYIMPAN SETTINGS:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan", error: String(error) }, 
      { status: 500 }
    );
  }
}