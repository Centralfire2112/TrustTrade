import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.1 } } }

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4.5 13.5H11.5L11 22L19.5 10.5H12.5L13 2z" fill="#00FF88" fillOpacity="0.15" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Instant AI Analysis',
    desc: 'Claude AI analyses your trade in under 5 seconds, cross-referencing 15+ fraud indicators from real Southern African scam patterns.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="10" r="4" stroke="#00FF88" strokeWidth="1.5" />
        <path d="M12 2C7.58 2 4 5.58 4 10c0 6 8 13 8 13s8-7 8-13c0-4.42-3.58-8-8-8z" stroke="#00FF88" strokeWidth="1.5" fill="#00FF88" fillOpacity="0.1" />
      </svg>
    ),
    title: 'Local Context',
    desc: 'Built for kasi markets, WhatsApp deals, and cross-border SADC trade — not Western e-commerce patterns. Context that actually matters.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="2" width="14" height="20" rx="2.5" stroke="#00FF88" strokeWidth="1.5" fill="#00FF88" fillOpacity="0.1" />
        <path d="M9 18h6" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="7" r="1.5" stroke="#00FF88" strokeWidth="1.2" />
      </svg>
    ),
    title: 'Mobile First',
    desc: 'Works on any phone or device — no app download, no account needed. Just open, fill in, and check your trade on the go.',
  },
]

const stats = [
  { value: '10M+', label: 'Informal traders in SADC' },
  { value: '1 in 3', label: 'Have experienced a scam' },
  { value: '<30s', label: 'Average analysis time' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center grid-pattern overflow-hidden">
        {/* ambient orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#00FF88]/[0.04] blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[320px] h-[320px] rounded-full bg-[#00FF88]/[0.03] blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
          <motion.div initial="initial" animate="animate" variants={stagger} className="flex flex-col items-center">

            {/* Badge */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#00FF88]/20 text-[#00FF88] text-xs font-semibold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] pulse-dot" />
                AI-Powered Fraud Detection
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black leading-[1.07] tracking-tight mb-6"
            >
              <span className="text-white">Trade Smart.</span>
              <br />
              <span className="text-gradient">Stay Safe.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-gray-400 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10"
            >
              TrustTrade uses advanced AI to analyse peer-to-peer transactions and flag fraud
              patterns before they cost you. Built for informal traders across Southern Africa.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              <Link to="/check">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn-primary glow-green">
                  Check a Trade Now <ArrowRight />
                </motion.button>
              </Link>
              <Link to="/how-it-works">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-7 py-3 rounded-xl text-gray-400 text-sm font-semibold border border-white/[0.1] hover:border-white/20 hover:text-white transition-all"
                >
                  How It Works
                </motion.button>
              </Link>
            </motion.div>

            {/* Preview card */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative glass rounded-2xl p-5 w-full max-w-sm text-left border border-white/[0.06]"
            >
              <span className="absolute -top-3 left-5 text-[11px] font-bold px-3 py-1 rounded-full bg-[#00FF88] text-black tracking-wide">
                SAMPLE REPORT
              </span>
              <div className="flex items-center gap-4 mt-1">
                <div className="relative flex-shrink-0">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                    <circle cx="30" cy="30" r="26" fill="none" stroke="#00FF88" strokeWidth="5"
                      strokeDasharray="163.4" strokeDashoffset="117.6"
                      strokeLinecap="round" transform="rotate(-90 30 30)" />
                    <text x="30" y="30" textAnchor="middle" dominantBaseline="middle" fill="#00FF88" fontSize="13" fontWeight="800" fontFamily="Inter,sans-serif">28</text>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#00FF88] text-sm font-bold">LOW RISK</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">Known contact · In-person · No urgency. Standard prepayment for bulk goods.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────── */}
      <section className="border-y border-white/[0.05] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-black text-[#00FF88] mb-1.5 tracking-tight">{s.value}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Built for the way you trade
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Informal trade is the backbone of Southern Africa's economy. TrustTrade is built to protect it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.18 } }}
              className="glass glass-hover rounded-2xl p-7 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00FF88]/10 flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-[1.05rem] mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS TEASER ─────────────── */}
      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass rounded-3xl p-8 sm:p-12 border border-white/[0.06]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                From input to decision in seconds
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Fill in 5 quick fields about your trade. Our AI engine analyses context, flags risk factors, and gives you a clear recommendation — no jargon, no confusion.
              </p>
              <Link to="/how-it-works">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 text-[#00FF88] text-sm font-semibold hover:gap-3 transition-all">
                  See the full process <ArrowRight />
                </motion.button>
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3 w-full max-w-xs lg:max-w-none">
              {['Input Details', 'AI Analysis', 'Risk Score', 'Your Action'].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-center"
                >
                  <div className="text-[#00FF88] text-xs font-bold mb-1">0{i + 1}</div>
                  <div className="text-white text-sm font-medium">{step}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight">
              Ready to trade with confidence?
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
              It takes under 30 seconds. Fill in your transaction details and let AI be your fraud detective.
            </p>
            <Link to="/check">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn-primary glow-green">
                Start Free Check <ArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
