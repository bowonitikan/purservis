// File: app/api/admin/services/route.js
import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET() {
  try {
    try {
      await turso.execute("ALTER TABLE services ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP");
    } catch (err) {}

    const result = await turso.execute("SELECT * FROM services ORDER BY created_at DESC LIMIT 100");
    
    // === PERBAIKAN: SAFE JSON PARSE ===
    const services = result.rows.map(row => {
      let safeDetails = [];
      if (row.details) {
        try {
          // Coba jadikan JSON. Jika error, lari ke catch.
          safeDetails = typeof row.details === "string" ? JSON.parse(row.details) : row.details;
        } catch (err) {
          // Jika datanya cacat/bukan JSON (data lama), kosongkan saja agar tidak crash
          safeDetails = [];
        }
      }
      
      return {
        ...row,
        details: Array.isArray(safeDetails) ? safeDetails : []
      };
    });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error(">>> ERROR GET DATA SERVIS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, device, issue } = body;

    if (!phone) {
      return NextResponse.json({ error: "Nomor WA wajib diisi" }, { status: 400 });
    }

    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    }
    if (!cleanPhone) cleanPhone = "-";

    const id = `SRV-${Math.floor(100000 + Math.random() * 900000)}`;
    const status = "Antrean";
    const total_cost = 0;
    const details = "[]";

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS services (
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

    const columns = ["name", "phone", "device", "issue", "status", "total_cost", "details", "created_at"];
    for (const col of columns) {
      try { await turso.execute(`ALTER TABLE services ADD COLUMN ${col} TEXT`); } catch (err) {}
    }

    await turso.execute({
      sql: `INSERT INTO services (id, name, phone, device, issue, status, total_cost, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, name || "Pelanggan Walk-in", cleanPhone, device || "-", issue || "-", status, total_cost, details]
    });

    return NextResponse.json({ message: "Servis baru berhasil ditambahkan", id }, { status: 201 });
  } catch (error) {
    console.error(">>> ERROR SAAT POST SERVIS BARU:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status, total_cost, details } = body;

    try { await turso.execute("ALTER TABLE services ADD COLUMN details TEXT"); } catch (err) {}

    await turso.execute({
      sql: `UPDATE services SET status = ?, total_cost = ?, details = ? WHERE id = ?`,
      args: [status, Number(total_cost), JSON.stringify(details || []), id]
    });

    return NextResponse.json({ message: "Servis berhasil diupdate" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID tiket diperlukan" }, { status: 400 });
    }

    await turso.execute({
      sql: `DELETE FROM services WHERE id = ?`,
      args: [id]
    });

    return NextResponse.json({ message: "Tiket berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}