/**
 * TrustTrade Android Icon Generator — pure Node.js, zero dependencies
 * Writes ic_launcher, ic_launcher_round, and ic_launcher_foreground PNGs
 * into every mipmap-* directory of the Android project.
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
  ihdr[8] = 8; ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Drawing ─────────────────────────────────────────────────────────────────────
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
    for (let j = 0; j + 1 < xs.length; j += 2)
      for (let x = Math.max(0, Math.ceil(xs[j])); x <= Math.min(W-1, Math.floor(xs[j+1])); x++)
        px(buf, W, H, x, y, r, g, b, a)
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
      m**3*p0[0]+3*m**2*t*p1[0]+3*m*t**2*p2[0]+t**3*p3[0],
      m**3*p0[1]+3*m**2*t*p1[1]+3*m*t**2*p2[1]+t**3*p3[1],
    ]
  })
}
function shieldPoly(sz) {
  const s = sz / 24
  const lM = [4*s,11.5*s], bot = [12*s,22*s], rM = [20*s,11.5*s]
  return [
    [12*s,2*s], [4*s,5.5*s], lM,
    ...cubic(lM, [4*s,16.02*s], [7.58*s,20.54*s], bot, 32),
    ...cubic(bot, [16.42*s,20.54*s], [20*s,16.02*s], rM, 32),
    rM, [20*s,5.5*s],
  ]
}

// ── Draw one icon (green circle + dark shield + green checkmark) ────────────────
function makeIcon(sz) {
  const buf = Buffer.alloc(sz * sz * 4, 0)
  const cx = sz / 2, cy = sz / 2
  const R2 = (sz * 0.47) ** 2
  for (let y = 0; y < sz; y++)
    for (let x = 0; x < sz; x++)
      if ((x-cx)**2 + (y-cy)**2 <= R2) {
        const i = (y*sz+x)*4; buf[i]=0; buf[i+1]=255; buf[i+2]=136; buf[i+3]=255
      }
  fillPoly(buf, sz, sz, shieldPoly(sz), 10, 10, 10, 255)
  const s = sz / 24, th = sz * 0.048
  line(buf, sz, sz,  9*s, 12*s, 11*s, 14*s, th, 0, 255, 136)
  line(buf, sz, sz, 11*s, 14*s, 15*s, 10*s, th, 0, 255, 136)
  return buf
}

// ── Draw foreground icon: icon centered with padding (for adaptive icons) ───────
// Android safe zone = inner 66dp of 108dp = ~61%. We pad to 70% to be safe.
function makeForeground(totalSz) {
  const buf = Buffer.alloc(totalSz * totalSz * 4, 0)  // transparent background
  const iconSz = Math.round(totalSz * 0.62)
  const icon = makeIcon(iconSz)
  const off = Math.round((totalSz - iconSz) / 2)
  for (let y = 0; y < iconSz; y++)
    for (let x = 0; x < iconSz; x++) {
      const si = (y * iconSz + x) * 4
      const di = ((y + off) * totalSz + (x + off)) * 4
      buf[di]=icon[si]; buf[di+1]=icon[si+1]; buf[di+2]=icon[si+2]; buf[di+3]=icon[si+3]
    }
  return buf
}

// ── Icon sizes per density ──────────────────────────────────────────────────────
const DENSITIES = {
  'mipmap-mdpi':    { launcher: 48,  foreground: 108 },
  'mipmap-hdpi':    { launcher: 72,  foreground: 162 },
  'mipmap-xhdpi':   { launcher: 96,  foreground: 216 },
  'mipmap-xxhdpi':  { launcher: 144, foreground: 324 },
  'mipmap-xxxhdpi': { launcher: 192, foreground: 432 },
}

const RES = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res')

// Write icons
for (const [density, sizes] of Object.entries(DENSITIES)) {
  const dir = path.join(RES, density)
  fs.mkdirSync(dir, { recursive: true })

  const iconPng = encodePNG(sizes.launcher, sizes.launcher, makeIcon(sizes.launcher))
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), iconPng)
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), iconPng)

  const fgPng = encodePNG(sizes.foreground, sizes.foreground, makeForeground(sizes.foreground))
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), fgPng)

  console.log(`✓ ${density}  launcher=${sizes.launcher}px  foreground=${sizes.foreground}px`)
}

// Fix adaptive icon background color to match app theme
const bgXml = path.join(RES, 'values', 'ic_launcher_background.xml')
fs.writeFileSync(bgXml, `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0A0A0A</color>
</resources>
`)
console.log('✓ values/ic_launcher_background.xml  (#0A0A0A)')
console.log('\nDone — rebuild the APK to apply the new icons.')
