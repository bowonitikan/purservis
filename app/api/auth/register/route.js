// File: app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function POST(req) {
  try {
    const { phone, name, address, device, issue, password } = await req.json();

    // 1. Cek apakah nomor HP sudah terdaftar sebelumnya
    const checkUser = await turso.execute({
      sql: "SELECT phone FROM users WHERE phone = ?",
      args: [phone],
    });

    // Jika belum terdaftar, masukkan ke tabel users
    if (checkUser.rows.length === 0) {
      await turso.execute({
        sql: "INSERT INTO users (phone, name, address, password, role) VALUES (?, ?, ?, ?, 'customer')",
        args: [phone, name, address, password],
      });
    }

    // 2. Buat ID Servis (Contoh: SRV-1704981234)
    const serviceId = `SRV-${Date.now().toString().slice(-6)}`;

    // 3. Masukkan data perbaikan ke tabel services
    await turso.execute({
      sql: "INSERT INTO services (id, phone, device, issue, status) VALUES (?, ?, ?, ?, 'Antrean')",
      args: [serviceId, phone, device, issue],
    });

    return NextResponse.json({
      message: "Pendaftaran dan pembuatan tiket servis berhasil!",
      serviceId: serviceId
    }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan data ke database." },
      { status: 500 }
    );
  }
}