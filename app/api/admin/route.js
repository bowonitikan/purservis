// File: app/api/admin/services/route.js
import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET() {
  try {
    // Kita melakukan JOIN antara tabel services dan users
    // agar kita bisa mendapatkan nama pelanggan berdasarkan nomor HP-nya
    const result = await turso.execute(`
      SELECT 
        s.id, 
        s.phone, 
        u.name, 
        s.device, 
        s.issue, 
        s.status, 
        s.created_at 
      FROM services s
      LEFT JOIN users u ON s.phone = u.phone
      ORDER BY s.created_at DESC
    `);

    // result.rows berisi array data dari database
    const services = result.rows;

    return NextResponse.json(
      { message: "Berhasil mengambil data", services: services }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Gagal mengambil data servis (Admin):", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat mengambil data." },
      { status: 500 }
    );
  }
}