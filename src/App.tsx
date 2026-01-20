import React, { useMemo, useState } from "react";
import rawProducts from "./data/products.json";
import type { Product } from "./types";
import { COMPANY_NAME, WHATSAPP_NUMBER } from "./config";
import { categoryPlaceholder, formatARS, productImageUrl } from "./utils";

type ViewMode = "tabla" | "cards";

function whatsappLink(p: Product) {
  const text = `Hola! Consulto por: ${p.code} - ${p.name} (${formatARS(p.price_ars)})`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  return url;
}

function uniqueCategories(products: Product[]) {
  const s = new Set(products.map((p) => p.category || "Otros"));
  return ["Todas", ...Array.from(s).sort((a, b) => a.localeCompare(b))];
}

export default function App() {
  const products = rawProducts as Product[];

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [view, setView] = useState<ViewMode>("tabla");
  const [selected, setSelected] = useState<Product | null>(null);

  const categories = useMemo(() => uniqueCategories(products), [products]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = cat === "Todas" ? true : (p.category || "Otros") === cat;
      if (!matchCat) return false;
      if (!query) return true;
      return (
        p.code.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        (p.category || "").toLowerCase().includes(query)
      );
    });
  }, [products, q, cat]);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>{COMPANY_NAME}</h1>
          <span style={{ color: "#666" }}>Catálogo / Lista de precios</span>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por código, producto o categoría…"
            style={{
              flex: "1 1 260px",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 10,
            }}
          />

          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10 }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setView("tabla")}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: view === "tabla" ? "#111" : "#fff",
                color: view === "tabla" ? "#fff" : "#111",
                cursor: "pointer",
              }}
            >
              Tabla
            </button>
            <button
              onClick={() => setView("cards")}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: view === "cards" ? "#111" : "#fff",
                color: view === "cards" ? "#fff" : "#111",
                cursor: "pointer",
              }}
            >
              Cards
            </button>
          </div>
        </div>

        <div style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
          Mostrando <b>{filtered.length}</b> de <b>{products.length}</b> productos
        </div>
      </header>

      <main style={{ padding: 16 }}>
        {view === "tabla" ? (
          <TableView items={filtered} onOpen={setSelected} />
        ) : (
          <CardView items={filtered} onOpen={setSelected} />
        )}
      </main>

      {selected ? (
        <Drawer onClose={() => setSelected(null)}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <img
              src={productImageUrl(selected)}
              alt={selected.name}
              style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 12, border: "1px solid #eee" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = categoryPlaceholder(selected.category);
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ color: "#666", fontSize: 13 }}>{selected.category}</div>
              <h2 style={{ margin: "6px 0 6px", fontSize: 18 }}>{selected.name}</h2>
              <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                <div style={{ fontWeight: 700 }}>{formatARS(selected.price_ars)}</div>
                <div style={{ color: "#666" }}>Código: <b>{selected.code}</b></div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <a
                  href={whatsappLink(selected)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "#111",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  Consultar por WhatsApp
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(selected.code)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Copiar código
                </button>
              </div>
            </div>
          </div>
        </Drawer>
      ) : null}
    </div>
  );
}

function TableView({ items, onOpen }: { items: Product[]; onOpen: (p: Product) => void }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 12 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
        <thead>
          <tr style={{ background: "#fafafa" }}>
            <Th>Código</Th>
            <Th>Producto</Th>
            <Th>Categoría</Th>
            <Th style={{ textAlign: "right" }}>Precio</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.code} style={{ borderTop: "1px solid #eee" }}>
              <Td><b>{p.code}</b></Td>
              <Td>{p.name}</Td>
              <Td style={{ color: "#666" }}>{p.category}</Td>
              <Td style={{ textAlign: "right", fontWeight: 600 }}>{formatARS(p.price_ars)}</Td>
              <Td style={{ textAlign: "right" }}>
                <button
                  onClick={() => onOpen(p)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Ver
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardView({ items, onOpen }: { items: Product[]; onOpen: (p: Product) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
      {items.map((p) => (
        <button
          key={p.code}
          onClick={() => onOpen(p)}
          style={{
            textAlign: "left",
            padding: 12,
            borderRadius: 14,
            border: "1px solid #eee",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <img
            src={productImageUrl(p)}
            alt={p.name}
            style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 12, border: "1px solid #eee" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = categoryPlaceholder(p.category);
            }}
          />
          <div style={{ marginTop: 10, color: "#666", fontSize: 12 }}>{p.category} · <b>{p.code}</b></div>
          <div style={{ marginTop: 6, fontWeight: 650 }}>{p.name}</div>
          <div style={{ marginTop: 8, fontWeight: 800 }}>{formatARS(p.price_ars)}</div>
        </button>
      ))}
    </div>
  );
}

function Drawer({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "flex-end",
        padding: 12,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 100%)",
          background: "#fff",
          borderRadius: 16,
          padding: 14,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Th({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "12px 10px",
        fontSize: 13,
        color: "#666",
        fontWeight: 650,
        ...style,
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: "12px 10px", fontSize: 14, ...style }}>
      {children}
    </td>
  );
}
