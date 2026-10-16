import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET(req) {
  try {
    // Mengambil parameter nomor HP dari URL
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    // Validasi parameter
    if (!phone) {
      return NextResponse.json(
        { message: "Nomor HP tidak valid." },
        { status: 400 }
      );
    }

    // Mencari data servis khusus untuk nomor HP ini
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

    return NextResponse.json(
      { message: "Berhasil mengambil riwayat", services: result.rows }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Gagal mengambil riwayat servis (Customer):", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}