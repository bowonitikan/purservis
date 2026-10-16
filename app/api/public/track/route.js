// File: app/api/public/track/route.js
import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID Servis diperlukan" }, { status: 400 });
    }

    // Menggunakan SELECT * agar kebal error meskipun ada kolom yang kurang di database lama
    const result = await turso.execute({
      sql: "SELECT * FROM services WHERE id = ?",
      args: [id.toUpperCase().trim()]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Tiket servis tidak ditemukan. Periksa kembali ID Anda." }, { status: 404 });
    }

    // Mengambil baris data pertama
    const rawData = result.rows[0];

    // Filter manual agar No HP dan Rincian detail TIDAK bocor ke halaman publik
    const publicData = {
      id: rawData.id,
      name: rawData.name || "Pelanggan",
      device: rawData.device || "-",
      issue: rawData.issue || "-",
      status: rawData.status || "Antrean",
      total_cost: rawData.total_cost || 0,
      // Jika kolom created_at belum ada di DB, kita gunakan waktu saat ini sebagai fallback
      created_at: rawData.created_at || new Date().toISOString() 
    };

    return NextResponse.json({ service: publicData }, { status: 200 });
  } catch (error) {
    // Menampilkan error secara spesifik di terminal jika masih gagal
    console.error(">>> ERROR API TRACKING:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}