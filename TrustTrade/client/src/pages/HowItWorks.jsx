import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const steps = [
  {
    num: '01',
    title: 'Input Transaction Details',
    desc: "Fill in 5 quick fields: who you're dealing with, how much money is involved, what prepayment is requested, which channel you're communicating on, and how much pressure you're feeling.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="4" width="22" height="20" rx="3" stroke="#00FF88" strokeWidth="1.5" fill="#00FF88" fillOpacity="0.08" />
        <path d="M8 11h12M8 15h8M8 19h5" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Instant On-Device Analysis',
    desc: 'Everything runs directly in your browser — no data is sent to any server. The scoring engine checks your inputs against proven fraud patterns common in Southern African informal trade.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="22" height="16" rx="2.5" stroke="#00FF88" strokeWidth="1.5" fill="#00FF88" fillOpacity="0.08" />
        <path d="M10 24h8M14 21v3" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 13h2.5l2-4 2 8 2-4H19" stroke="#00FF88" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Risk Scoring',
    desc: 'Each factor — contact trust, prepayment ratio, communication channel, urgency pressure, and transaction size — is weighted and combined into a score from 0 to 100 based on real scam patterns.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#00FF88" strokeWidth="1.5" fill="#00FF88" fillOpacity="0.08" />
        <path d="M9 18l3-5 3 3 3-6" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Your Clear Recommendation',
    desc: 'You receive a risk score (0–100), a colour-coded level (Low / Medium / High), specific reasons grounded in your inputs, and a plain-English recommendation — empowering, not alarmist.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L3 8.5v5.5C3 19.25 7.5 24.25 14 25.5c6.5-1.25 11-6.25 11-11.5V8.5L14 3z"
          stroke="#00FF88" strokeWidth="1.5" fill="#00FF88" fillOpacity="0.08" />
        <path d="M10 14.5l2.5 2.5L18.5 11" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const underHood = [
  { label: 'Runs in', value: 'Your browser', icon: '🌐' },
  { label: 'Response time', value: 'Under 1 second', icon: '⚡' },
  { label: 'Data sent', value: 'Zero — fully private', icon: '🔒' },
  { label: 'Cost to you', value: 'Completely free', icon: '🎁' },
]

const factors = [
  { label: 'Contact trust', desc: 'New vs known vs repeat relationship' },
  { label: 'Prepayment ratio', desc: 'How much you pay before receiving goods' },
  { label: 'Channel safety', desc: 'In person, WhatsApp, SMS, or unknown' },
  { label: 'Urgency pressure', desc: 'Relaxed, moderate, or high pressure' },
  { label: 'Transaction size', desc: 'Amount relative to contact trust level' },
  { label: 'Notes keywords', desc: 'Scam language flagged in your description' },
]

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            How <span className="text-[#00FF88]">TrustTrade</span> Works
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            A 4-step process that takes under 30 seconds and could save you thousands.
          </p>
        </motion.div>

        {/* Flow */}
        <div className="relative">
          <div className="absolute left-[27px] top-14 bottom-14 w-px bg-gradient-to-b from-[#00FF88]/40 via-[#00FF88]/15 to-transparent hidden sm:block pointer-events-none" />

          <div className="space-y-5">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex gap-4 sm:gap-6 group"
              >
                <div className="flex-shrink-0 w-14 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl glass border border-[#00FF88]/15 flex items-center justify-center transition-all duration-200 group-hover:border-[#00FF88]/35 group-hover:bg-[#00FF88]/[0.05]">
                    {step.icon}
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 flex-1 transition-all duration-200 group-hover:border-white/[0.1]">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#00FF88] text-[11px] font-bold tracking-widest opacity-55">{step.num}</span>
                    <h3 className="text-white font-semibold text-[1.05rem]">{step.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Factors grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 glass rounded-2xl p-7 border border-[#00FF88]/10"
        >
          <h2 className="text-white font-semibold text-lg mb-1">What gets analysed</h2>
          <p className="text-gray-500 text-sm mb-5">Six factors are scored and combined into your result.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {factors.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1.5 flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-medium">{f.label}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Output examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-5 glass rounded-2xl p-7"
        >
          <h2 className="text-white font-semibold text-lg mb-5">What the output looks like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { color: '#00FF88', label: 'LOW RISK', score: '18', example: 'Repeat contact, in-person, no prepayment required.' },
              { color: '#F59E0B', label: 'MEDIUM RISK', score: '54', example: 'New contact on WhatsApp with 30% prepayment requested.' },
              { color: '#EF4444', label: 'HIGH RISK', score: '87', example: 'Unknown platform, high pressure, 80% prepayment, new contact.' },
            ].map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl p-4 border"
                style={{ borderColor: `${ex.color}25`, background: `${ex.color}06` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-black" style={{ color: ex.color }}>{ex.score}</span>
                  <span className="text-[10px] font-bold tracking-widest" style={{ color: ex.color }}>{ex.label}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{ex.example}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Under the hood */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-5 glass rounded-2xl p-7"
        >
          <h2 className="text-white font-semibold text-lg mb-5">Under the Hood</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {underHood.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-gray-500 text-[11px] uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-white text-sm font-medium leading-snug">{item.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link to="/check">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn-primary glow-green-sm"
            >
              Try It Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
