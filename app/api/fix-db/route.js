// File: app/api/fix-db/route.js
import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET() {
  // Daftar kolom yang wajib ada di tabel services beserta tipe datanya
  const columnsToAdd = [
    { name: "name", type: "TEXT" },
    { name: "phone", type: "TEXT" },
    { name: "device", type: "TEXT" },
    { name: "issue", type: "TEXT" },
    { name: "status", type: "TEXT" },
    { name: "total_cost", type: "INTEGER" },
    { name: "details", type: "TEXT" }
  ];

  let logs = [];

  for (const col of columnsToAdd) {
    try {
      await turso.execute(`ALTER TABLE services ADD COLUMN ${col.name} ${col.type}`);
      logs.push(`✅ Kolom '${col.name}' berhasil ditambahkan.`);
    } catch (error) {
      logs.push(`ℹ️ Kolom '${col.name}' sudah ada (Aman).`);
    }
  }

  return NextResponse.json({ 
    message: "Struktur database berhasil diperbarui!", 
    logs 
  }, { status: 200 });
}