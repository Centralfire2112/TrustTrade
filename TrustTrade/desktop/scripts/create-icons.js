/**
 * TrustTrade Icon Generator — pure Node.js, zero dependencies
 * Outputs desktop/build/icon.ico (256px PNG-in-ICO) and icon.png (512px)
 * If pre-generated icons already exist in build/, this script is a no-op.
 */
'use strict'
const zlib = require('zlib')
const fs   = require('fs')
const path = require('path')

// ── CRC32 ──────────────────────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8)
  return (c ^ 0xFFFFFFFF) >>> 0
}

// ── PNG encoder ─────────────────────────────────────────────────────────────────
function encodePNG(width, height, buf) {
  const stride = 1 + width * 4
  const raw = Buffer.alloc(height * stride)
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0
    buf.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4)
  }
  const idat = zlib.deflateSync(raw, { level: 9 })

  function chunk(type, data) {
    const L = Buffer.alloc(4); L.writeUInt32BE(data.length)
    const T = Buffer.from(type, 'ascii')
    const C = Buffer.alloc(4); C.writeUInt32BE(crc32(Buffer.concat([T, data])))
    return Buffer.concat([L, T, data, C])
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 6  // 8-bit RGBA

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── ICO wrapper (PNG-in-ICO, Vista+) ───────────────────────────────────────────
function wrapICO(png) {
  const hdr = Buffer.from([0,0, 1,0, 1,0])   // reserved, type=1, count=1
  const dir = Buffer.alloc(16)
  dir[0] = 0; dir[1] = 0                     // width=256, height=256 (0 means 256)
  dir.writeUInt16LE(1,  4)                   // planes
  dir.writeUInt16LE(32, 6)                   // bit count
  dir.writeUInt32LE(png.length, 8)           // data size
  dir.writeUInt32LE(6 + 16,    12)           // data offset
  return Buffer.concat([hdr, dir, png])
}

// ── Drawing helpers ─────────────────────────────────────────────────────────────
function px(buf, W, H, x, y, r, g, b, a) {
  if (x < 0 || x >= W || y < 0 || y >= H) return
  const i = (y * W + x) * 4
  buf[i]=r; buf[i+1]=g; buf[i+2]=b; buf[i+3]=a
}

function fillPoly(buf, W, H, poly, r, g, b, a) {
  const minY = Math.max(0, Math.floor(Math.min(...poly.map(p => p[1]))))
  const maxY = Math.min(H - 1, Math.ceil(Math.max(...poly.map(p => p[1]))))
  for (let y = minY; y <= maxY; y++) {
    const xs = []
    for (let i = 0; i < poly.length; i++) {
      const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length]
      if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y))
        xs.push(x1 + (y - y1) * (x2 - x1) / (y2 - y1))
    }
    xs.sort((a, b) => a - b)
    for (let j = 0; j + 1 < xs.length; j += 2) {
      for (let x = Math.max(0, Math.ceil(xs[j])); x <= Math.min(W-1, Math.floor(xs[j+1])); x++)
        px(buf, W, H, x, y, r, g, b, a)
    }
  }
}

function line(buf, W, H, x1, y1, x2, y2, thick, r, g, b) {
  const dx = x2-x1, dy = y2-y1
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy)) * 2)
  const t2 = thick * thick
  for (let s = 0; s <= steps; s++) {
    const t = s / steps
    const cx = x1 + dx*t, cy = y1 + dy*t
    for (let qy = Math.floor(cy-thick-1); qy <= Math.ceil(cy+thick+1); qy++)
      for (let qx = Math.floor(cx-thick-1); qx <= Math.ceil(cx+thick+1); qx++)
        if ((qx-cx)**2 + (qy-cy)**2 <= t2) px(buf, W, H, qx, qy, r, g, b, 255)
  }
}

function cubic(p0, p1, p2, p3, n) {
  return Array.from({ length: n+1 }, (_, i) => {
    const t = i/n, m = 1-t
    return [
      m**3*p0[0] + 3*m**2*t*p1[0] + 3*m*t**2*p2[0] + t**3*p3[0],
      m**3*p0[1] + 3*m**2*t*p1[1] + 3*m*t**2*p2[1] + t**3*p3[1],
    ]
  })
}

// ── Shield polygon (SVG path: M12 2 L4 5.5 v6 C4 16.02 7.58 20.54 12 22 ...) ──
function shieldPoly(sz) {
  const s = sz / 24
  const lM = [4*s, 11.5*s], bot = [12*s, 22*s], rM = [20*s, 11.5*s]
  const lCurve = cubic(lM, [4*s,16.02*s], [7.58*s,20.54*s], bot, 32)
  const rCurve = cubic(bot, [16.42*s,20.54*s], [20*s,16.02*s], rM, 32)
  return [[12*s,2*s], [4*s,5.5*s], lM, ...lCurve, ...rCurve, rM, [20*s,5.5*s]]
}

// ── Compose one icon at a given size ───────────────────────────────────────────
function makeIcon(sz) {
  const buf = Buffer.alloc(sz * sz * 4, 0)  // start fully transparent
  const cx = sz / 2, cy = sz / 2

  // 1. Green circle background
  const R2 = (sz * 0.47) ** 2
  for (let y = 0; y < sz; y++)
    for (let x = 0; x < sz; x++)
      if ((x-cx)**2 + (y-cy)**2 <= R2) {
        const i = (y*sz+x)*4
        buf[i]=0; buf[i+1]=255; buf[i+2]=136; buf[i+3]=255
      }

  // 2. Dark shield on top of green circle
  fillPoly(buf, sz, sz, shieldPoly(sz), 10, 10, 10, 255)

  // 3. Green checkmark (M9 12 l2 2 4-4 in 24x24 space)
  const s = sz / 24, th = sz * 0.048
  line(buf, sz, sz,  9*s, 12*s, 11*s, 14*s, th, 0, 255, 136)
  line(buf, sz, sz, 11*s, 14*s, 15*s, 10*s, th, 0, 255, 136)

  return buf
}

// ── Write ────────────────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, '..', 'build')
fs.mkdirSync(outDir, { recursive: true })

const icoPath = path.join(outDir, 'icon.ico')
const pngPath = path.join(outDir, 'icon.png')

if (fs.existsSync(icoPath) && fs.existsSync(pngPath)) {
  console.log('✓ Icons already exist — skipping generation (using Logo New.jpeg build)')
  process.exit(0)
}

const png256 = encodePNG(256, 256, makeIcon(256))
const png512 = encodePNG(512, 512, makeIcon(512))

fs.writeFileSync(icoPath, wrapICO(png256))
fs.writeFileSync(pngPath, png512)

console.log('✓ desktop/build/icon.ico  (256×256 PNG-in-ICO)')
console.log('✓ desktop/build/icon.png  (512×512 PNG)')
