// File: app/api/fix-fk/route.js
import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET() {
  try {
    // 1. Hapus tabel backup jika sebelumnya pernah ada
    await turso.execute("DROP TABLE IF EXISTS services_backup");

    // 2. Ubah nama tabel lama yang bermasalah menjadi tabel backup
    await turso.execute("ALTER TABLE services RENAME TO services_backup");

    // 3. Buat tabel services yang BARU dan BERSIH (Tanpa Foreign Key)
    await turso.execute(`
      CREATE TABLE services (
        id TEXT PRIMARY KEY,
        name TEXT,
        phone TEXT,
        device TEXT,
        issue TEXT,
        status TEXT,
        total_cost INTEGER,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Pindahkan semua data dari tabel lama ke tabel baru
    await turso.execute(`
      INSERT INTO services (id, name, phone, device, issue, status, total_cost, details, created_at)
      SELECT id, name, phone, device, issue, status, total_cost, details, created_at
      FROM services_backup
    `);

    return NextResponse.json({ 
      message: "Sukses! Tabel berhasil dibersihkan dari Foreign Key. Data lama aman.",
      status: "READY"
    }, { status: 200 });

  } catch (error) {
    console.error(">>> ERROR MIGRATION:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}