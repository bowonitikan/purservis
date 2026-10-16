// File: app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function POST(req) {
  try {
    const { username, password, role } = await req.json();
    console.log("Mencoba login untuk:", username, "dengan role:", role);

    // Mencari user di database Turso
    const result = await turso.execute({
      sql: "SELECT * FROM users WHERE phone = ? AND role = ?",
      args: [username, role],
    });

    console.log("Hasil Query Turso:", JSON.stringify(result)); // <- Log yang SANGAT PENTING untuk debug

    // CARA AMAN MEMBACA ROWS DARI LIBSQL
    if (!result || !result.rows || result.rows.length === 0) {
      console.log("User tidak ditemukan di DB");
      return NextResponse.json(
        { message: "Username atau Role tidak ditemukan." },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    // Pengecekan password 
    if (user.password !== password) {
      console.log("Password salah. DB:", user.password, "Input:", password);
      return NextResponse.json(
        { message: "Password salah." },
        { status: 401 }
      );
    }

    // Jika berhasil login
    console.log("Login Berhasil!");
    return NextResponse.json({
      message: "Login berhasil",
      role: user.role,
      full_name: user.name,
      phone: user.phone,
    }, { status: 200 });

  } catch (error) {
    console.error("Kesalahan API Login:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}