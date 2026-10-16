// File: app/api/customer/services/route.js
import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET(req) {
  try {
    // Mengambil parameter nomor HP dari URL, contoh: /api/customer/services?phone=08123456789
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    // Validasi: Jika tidak ada nomor HP yang dikirimkan, tolak permintaan
    if (!phone) {
      return NextResponse.json(
        { message: "Nomor HP tidak valid atau tidak disertakan." },
        { status: 400 }
      );
    }

    // Mengambil data servis hanya untuk nomor HP tersebut
    const result = await turso.execute({
      sql: `
        SELECT 
          id, 
          device, 
          issue, 
          status, 
          total_cost, 
          created_at 
        FROM services 
        WHERE phone = ? 
        ORDER BY created_at DESC
      `,
      args: [phone]
    });

    // Mengembalikan data ke frontend
    return NextResponse.json(
      { message: "Berhasil mengambil riwayat", services: result.rows }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Gagal mengambil riwayat servis (Customer):", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat mencari data." },
      { status: 500 }
    );
  }
}