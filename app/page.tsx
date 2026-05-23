'use client'

import { useState } from 'react'

// ─── Data ───────────────────────────────────────────────────────────────────

const PLATFORMS = ['Dine in/take away', 'Grab Food', 'Go Food', 'Shopee Food', 'Whatsapp']
const PAYMENT_METHODS = ['Cash', 'BNI', 'BCA', 'Biaya Beban']

const MENU_ITEMS = [
  // ─── SMALL ───
  { id: 'americano_small', name: 'Americano Small', price: 6000 },
  { id: 'espresso', name: 'Espresso', price: 6000 },
  { id: 'macchiato', name: 'Macchiato', price: 6000 },
  { id: 'palm_sugar_small', name: 'Palm Sugar Small', price: 15000 },
  { id: 'cafe_latte_small', name: 'Cafe Latte Small', price: 6000 },
  { id: 'cappucino_small', name: 'Cappucino Small', price: 15000 },
  { id: 'caramel_latte_small', name: 'Caramel Latte Small', price: 18000 },
  { id: 'bts_latte_small', name: 'BTS Latte Small', price: 18000 },
  { id: 'velvet_shot_small', name: 'Velvet Shot Small', price: 25000 },
  { id: 'double_crown', name: 'Double Crown', price: 25000 },
  { id: 'long_ice', name: 'Long Ice', price: 20000 },
  { id: 'oreo_milkshake_small', name: 'Oreo Milkshake Small', price: 15000 },
  { id: 'bts_milk_small', name: 'BTS Milk Small', price: 15000 },
  { id: 'caramel_regal_small', name: 'Caramel Regal Small', price: 18000 },
  { id: 'matcha_latte_small', name: 'Matcha Latte Small', price: 22000 },
  { id: 'pure_matcha_small', name: 'Pure Matcha Small', price: 20000 },
  { id: 'iced_honey_latte_small', name: 'Iced Honey Latte Small', price: 18000 },

  // ─── MEDIUM ───
  { id: 'americano_medium', name: 'Americano Medium', price: 17000 },
  { id: 'palm_sugar_medium', name: 'Palm Sugar Medium', price: 20000 },
  { id: 'cafe_latte_medium', name: 'Cafe Latte Medium', price: 20000 },
  { id: 'cappucino_medium', name: 'Cappucino Medium', price: 20000 },
  { id: 'bts_latte_medium', name: 'BTS Latte Medium', price: 23000 },
  { id: 'caramel_latte_medium', name: 'Caramel Latte Medium', price: 23000 },
  { id: 'iced_honey_latte_medium', name: 'Iced Honey Latte Medium', price: 23000 },
  { id: 'oreo_milkshake_medium', name: 'Oreo MilkShake Medium', price: 20000 },
  { id: 'bts_milk_medium', name: 'BTS Milk Medium', price: 20000 },
  { id: 'caramel_regal_medium', name: 'Caramel Regal Medium', price: 23000 },
  { id: 'pure_matcha_medium', name: 'Pure Matcha Medium', price: 25000 },
  { id: 'matcha_latte_medium', name: 'Matcha Latte Medium', price: 28000 },

  // ─── LARGE ───
  { id: 'americano_large', name: 'Americano Large', price: 20000 },
  { id: 'palm_sugar_large', name: 'Palm Sugar Large', price: 23000 },
  { id: 'cafe_latte_large', name: 'Cafe Latte Large', price: 23000 },
  { id: 'cappucino_large', name: 'Cappucino Large', price: 23000 },
  { id: 'bts_latte_large', name: 'BTS Latte Large', price: 27000 },
  { id: 'caramel_latte_large', name: 'Caramel Latte Large', price: 27000 },
  { id: 'iced_honey_latte_large', name: 'Iced Honey Latte Large', price: 27000 },

  // ─── EXTRAS ───
  { id: 'extra_shoot', name: 'Extra Shoot', price: 6000 },
  { id: 'extra_crumble', name: 'Extra Crumble', price: 3000 },
  { id: 'beans', name: 'Beans', price: 16000 }
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface ItemQty {
  [id: string]: number
}

interface FormData {
  date: string
  platform: string
  paymentMethod: string
  items: ItemQty
  revenueReceived: string
  note: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRupiah(num: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}

function todayDate() {
  return new Date().toISOString().split('T')[0]
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SalesForm() {
  const [form, setForm] = useState<FormData>({
    date: todayDate(),
    platform: '',
    paymentMethod: '',
    items: {},
    revenueReceived: '',
    note: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<FormData | null>(null)

  // ── Derived ────────────────────────────────────────────────────────────────

  const totalPrice = MENU_ITEMS.reduce((sum, item) => {
    return sum + (form.items[item.id] ?? 0) * item.price
  }, 0)

  const revenueNum = parseFloat(form.revenueReceived.replace(/\D/g, '')) || 0
  const diff = revenueNum - totalPrice

  const soldItems = MENU_ITEMS.filter(i => (form.items[i.id] ?? 0) > 0)

  // ── Handlers ───────────────────────────────────────────────────────────────

  function setQty(id: string, delta: number) {
    setForm(f => {
      const cur = f.items[id] ?? 0
      const next = Math.max(0, cur + delta)
      const items = { ...f.items, [id]: next }
      if (next === 0) delete items[id]
      return { ...f, items }
    })
  }

  function handleRevenue(val: string) {
    const cleaned = val.replace(/\D/g, '')
    setForm(f => ({ ...f, revenueReceived: cleaned }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // 1. Ambil item yang dibeli
    const purchasedItems = MENU_ITEMS.filter(i => (form.items[i.id] ?? 0) > 0)
    if (purchasedItems.length === 0) {
      alert("Please select at least one item.")
      return
    }
    if (!form.platform || !form.paymentMethod) {
      alert("Please select Platform and Payment Method.")
      return
    }

    // 2. Format pesanan menjadi array object
    // 2. Format pesanan (HANYA Nama & Qty)
    const orderDetailsArray = purchasedItems.map(i => ({
      name: i.name,
      qty: form.items[i.id]
      // price dihapus dari sini!
    }))

    // 3. Payload
    const payload = {
      date: form.date,
      note: form.note,
      platform: form.platform,
      paymentMethod: form.paymentMethod,
      total: totalPrice,
      revenue: revenueNum,
      diff: diff,
      items: orderDetailsArray // Sekarang array ini cuma bawa nama & qty
    }

    try {
      const scriptUrl = "https://script.google.com/macros/s/AKfycbxwHVUOsuzEhOsuFmSkkl-w0AtsQQokhAL2ZZFuwNC7IbtXJnab_Kq2l2vOefEjmz1_/exec"; 
      
      await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      })

      setSubmittedData({ ...form })
      setSubmitted(true)

    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan saat menyimpan data.")
    }
  }

  function handleReset() {
    setForm({ date: todayDate(), platform: '', paymentMethod: '', items: {}, revenueReceived: '', note: '' })
    setSubmitted(false)
    setSubmittedData(null)
  }

  // ── Success screen ─────────────────────────────────────────────────────────

  if (submitted && submittedData) {
    const rev = parseFloat(submittedData.revenueReceived) || 0
    const tot = MENU_ITEMS.reduce((s, i) => s + (submittedData.items[i.id] ?? 0) * i.price, 0)
    const d = rev - tot
    return (
      <main style={{ minHeight: '100vh', background: 'var(--form-bg)', padding: '32px 16px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div className="form-card" style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div className="success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#6B4FBB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, marginBottom: 8, color: 'var(--text-dark)' }}>
              Entry Submitted!
            </h2>
            <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 32 }}>
              Your sales data has been recorded successfully.
            </p>

            {/* Summary table */}
            <div style={{ background: '#FAFAFA', borderRadius: 8, padding: '20px 24px', textAlign: 'left', marginBottom: 24 }}>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  ['Date', submittedData.date],
                  ['Platform', submittedData.platform],
                  ['Payment', submittedData.paymentMethod],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-mid)' }}>{k}</span>
                    <span style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 8 }}>Items Sold</div>
                  {MENU_ITEMS.filter(i => (submittedData.items[i.id] ?? 0) > 0).map(i => (
                    <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                      <span>{i.name} ×{submittedData.items[i.id]}</span>
                      <span style={{ fontWeight: 500 }}>{formatRupiah(i.price * (submittedData.items[i.id] ?? 0))}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600 }}>
                    <span>Total Price</span><span>{formatRupiah(tot)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 4 }}>
                    <span style={{ color: 'var(--text-mid)' }}>Revenue Received</span>
                    <span>{formatRupiah(rev)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, marginTop: 4 }}>
                    <span style={{ color: 'var(--text-mid)' }}>Diff</span>
                    <span className={`diff-badge ${d > 0 ? 'diff-positive' : d < 0 ? 'diff-negative' : 'diff-zero'}`}>
                      {d > 0 ? '+' : ''}{formatRupiah(d)}
                    </span>
                  </div>
                </div>
                {submittedData.note && (
                  <div style={{ fontSize: 13, color: 'var(--text-mid)', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <span style={{ fontWeight: 500 }}>Note: </span>{submittedData.note}
                  </div>
                )}
              </div>
            </div>

            <button className="submit-btn" onClick={handleReset}>
              + Add New Entry
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ── Main form ──────────────────────────────────────────────────────────────

  return (
    <main style={{ minHeight: '100vh', background: 'var(--form-bg)', padding: '32px 16px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>

        {/* Header card */}
        <div className="form-card" style={{ marginBottom: 12 }}>
          <div className="form-header-bar" />
          <div style={{ padding: '24px 28px 20px' }}>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, margin: 0, color: 'var(--text-dark)' }}>
              Sales Entry
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-mid)' }}>
              Daily transaction record — fill in the details below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Date ── */}
          <div className="form-card" style={{ padding: '20px 28px', marginBottom: 12 }}>
            <label className="field-label">
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              className="form-input"
              required
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>

          {/* ── Platform ── */}
          <div className="form-card" style={{ padding: '20px 28px', marginBottom: 12 }}>
            <label className="field-label">
              Platform <span className="required">*</span>
            </label>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 12, marginTop: -4 }}>
              How was this order placed?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {PLATFORMS.map(p => (
                <label key={p} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', border: '1px solid',
                  borderColor: form.platform === p ? 'var(--form-purple)' : 'var(--border)',
                  borderRadius: 8, cursor: 'pointer', fontSize: 13,
                  background: form.platform === p ? 'var(--form-purple-bg)' : 'white',
                  transition: 'all 0.15s',
                }}>
                  <input
                    type="radio"
                    name="platform"
                    value={p}
                    checked={form.platform === p}
                    onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                    style={{ accentColor: 'var(--form-purple)' }}
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>

          {/* ── Payment Method ── */}
          <div className="form-card" style={{ padding: '20px 28px', marginBottom: 12 }}>
            <label className="field-label">
              Payment Method <span className="required">*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {PAYMENT_METHODS.map(pm => (
                <label key={pm} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', border: '1px solid',
                  borderColor: form.paymentMethod === pm ? 'var(--form-purple)' : 'var(--border)',
                  borderRadius: 8, cursor: 'pointer', fontSize: 13,
                  background: form.paymentMethod === pm ? 'var(--form-purple-bg)' : 'white',
                  transition: 'all 0.15s',
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm}
                    checked={form.paymentMethod === pm}
                    onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                    style={{ accentColor: 'var(--form-purple)' }}
                  />
                  {pm}
                </label>
              ))}
            </div>
          </div>

          {/* ── Items Sold ── */}
          <div className="form-card" style={{ padding: '20px 28px', marginBottom: 12 }}>
            <label className="field-label">Items Sold <span className="required">*</span></label>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 14, marginTop: -4 }}>
              Select items and set quantities.
            </p>
            <div className="qty-grid">
              {MENU_ITEMS.map(item => {
                const qty = form.items[item.id] ?? 0
                return (
                  <div key={item.id} className={`item-row ${qty > 0 ? 'selected' : ''}`}>
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{formatRupiah(item.price)}</div>
                    </div>
                    <div className="qty-control">
                      <button type="button" className="qty-btn" disabled={qty === 0} onClick={() => setQty(item.id, -1)}>−</button>
                      <span className="qty-value" style={{ color: qty > 0 ? 'var(--form-purple)' : 'var(--text-light)' }}>{qty}</span>
                      <button type="button" className="qty-btn" onClick={() => setQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Live subtotal */}
            {soldItems.length > 0 && (
              <div className="summary-box">
                {soldItems.map(i => (
                  <div key={i.id} className="summary-row">
                    <span>{i.name} ×{form.items[i.id]}</span>
                    <span>{formatRupiah(i.price * (form.items[i.id] ?? 0))}</span>
                  </div>
                ))}
                <div className="summary-row total">
                  <span>Total Price</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Total Price (display) ── */}
          <div className="form-card" style={{ padding: '20px 28px', marginBottom: 12 }}>
            <label className="field-label">Total Price</label>
            <div style={{
              padding: '10px 0', borderBottom: '1px solid var(--border)',
              fontSize: 18, fontWeight: 600, color: 'var(--form-purple)'
            }}>
              {formatRupiah(totalPrice)}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 6 }}>
              Auto-calculated from items sold.
            </p>
          </div>

          {/* ── Revenue Received ── */}
          <div className="form-card" style={{ padding: '20px 28px', marginBottom: 12 }}>
            <label className="field-label">
              Revenue Received <span className="required">*</span>
            </label>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 8, marginTop: -4 }}>
              Actual amount received (to track tips or differences).
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
              <span style={{ color: 'var(--text-mid)', fontSize: 14, fontWeight: 500 }}>Rp</span>
              <input
                type="text"
                inputMode="numeric"
                className="form-input"
                style={{ borderBottom: 'none', paddingBottom: 0 }}
                placeholder="0"
                value={form.revenueReceived ? parseInt(form.revenueReceived).toLocaleString('id-ID') : ''}
                onChange={e => handleRevenue(e.target.value)}
                required
              />
            </div>

            {/* Diff indicator */}
            {form.revenueReceived && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 13 }}>
                <span style={{ color: 'var(--text-mid)' }}>Diff:</span>
                <span className={`diff-badge ${diff > 0 ? 'diff-positive' : diff < 0 ? 'diff-negative' : 'diff-zero'}`}>
                  {diff > 0 ? '▲ +' : diff < 0 ? '▼ ' : '= '}{formatRupiah(Math.abs(diff))}
                </span>
                {diff > 0 && <span style={{ color: '#137333', fontSize: 12 }}>Tip / overpayment</span>}
                {diff < 0 && <span style={{ color: '#D93025', fontSize: 12 }}>Underpayment</span>}
                {diff === 0 && <span style={{ color: 'var(--text-mid)', fontSize: 12 }}>Exact</span>}
              </div>
            )}
          </div>

          {/* ── Note ── */}
          <div className="form-card" style={{ padding: '20px 28px', marginBottom: 24 }}>
            <label className="field-label">Note</label>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 8, marginTop: -4 }}>
              For returns, special requests, or details (e.g., "basi", "return").
            </p>
            <textarea
              className="form-input"
              style={{ resize: 'vertical', minHeight: 72, borderBottom: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 10px' }}
              placeholder='e.g. "1 croissant basi – replaced" or "customer asked for less sweet"'
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              rows={3}
            />
          </div>

          {/* ── Submit ── */}
          <div style={{ padding: '0 0 40px', display: 'flex', gap: 12 }}>
            <button type="submit" className="submit-btn">
              Submit Entry
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: 'none', border: 'none', color: 'var(--form-purple)',
                fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                padding: '12px 0', textDecoration: 'underline'
              }}
            >
              Clear form
            </button>
          </div>

        </form>
      </div>
    </main>
  )
}
