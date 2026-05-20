import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const stats = [
  { value: '10M+', label: 'Informal traders in SADC' },
  { value: '30%', label: 'Of SADC GDP is informal' },
  { value: '1 in 3', label: 'Traders have been scammed' },
  { value: 'R8.5B+', label: 'Lost to scams annually (est.)' },
]

const pillars = [
  {
    title: 'Accessible Intelligence',
    desc: 'We democratise access to AI-powered fraud detection — no bank account, no formal registration, no app download. Open a browser and check.',
  },
  {
    title: 'Contextually Grounded',
    desc: "Our AI is prompted with Southern African trading realities — WhatsApp deals, kasi markets, cross-border SADC trade — not generic Western e-commerce patterns.",
  },
  {
    title: 'Empowering, Not Paternalistic',
    desc: "We give traders the information to make better decisions. We never block transactions or override human judgement. The trader is always in control.",
  },
  {
    title: 'Privacy First',
    desc: 'We do not store, log, or share your transaction data. Each analysis is ephemeral — your information disappears the moment the response is returned.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-[#00FF88]/20 text-[#00FF88] text-[11px] font-semibold tracking-widest uppercase mb-5">
            About TrustTrade
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight tracking-tight">
            Protecting the heartbeat of{' '}
            <span className="text-[#00FF88]">Southern Africa's economy</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Informal trade represents over 30% of GDP across many SADC countries. But without formal protections,
            millions of traders are exposed daily to sophisticated scams that can wipe out livelihoods overnight.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-4 text-center border border-white/[0.05]"
            >
              <div className="text-[#00FF88] font-black text-2xl mb-1 tracking-tight">{s.value}</div>
              <div className="text-gray-500 text-xs leading-snug">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Problem */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-4">The Problem</h2>
          <div className="space-y-4 text-gray-400 text-[15px] leading-relaxed">
            <p>
              Across Southern Africa — from Johannesburg's informal markets to Harare's roadside vendors
              and Lusaka's boda-boda traders — millions of people engage in peer-to-peer trade every day.
              These transactions happen on WhatsApp, over SMS, and face-to-face, often with strangers.
            </p>
            <p>
              Without formal verification systems, scammers exploit the trust and urgency that characterise
              informal markets. Common tactics include fake prepayment scams, advance fee fraud, identity
              impersonation, ghost goods schemes, and high-pressure "today only" tactics.
            </p>
            <p>
              Formal financial institutions and law enforcement are often inaccessible or unresponsive to
              these losses — leaving traders to bear the full cost, alone.
            </p>
          </div>
        </motion.section>

        {/* Solution pillars */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-5">How TrustTrade Helps</h2>
          <div className="space-y-3">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-5 border border-white/[0.05]"
              >
                <h3 className="text-white font-semibold mb-1.5">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tech stack note */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-4">Built With</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'React', role: 'Frontend UI' },
              { name: 'Tailwind CSS', role: 'Styling' },
              { name: 'Framer Motion', role: 'Animations' },
              { name: 'Node.js + Express', role: 'Backend API' },
              { name: 'Claude Sonnet', role: 'AI Engine' },
              { name: 'Anthropic SDK', role: 'AI Integration' },
            ].map((t, i) => (
              <div key={i} className="glass rounded-xl p-3.5 border border-white/[0.05]">
                <div className="text-white text-sm font-semibold">{t.name}</div>
                <div className="text-gray-500 text-xs mt-0.5">{t.role}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Responsible AI disclaimer */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="glass rounded-2xl p-6 border border-[#00FF88]/12">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#00FF88]/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <circle cx="8.5" cy="8.5" r="7" stroke="#00FF88" strokeWidth="1.3" />
                  <path d="M8.5 5.5v4" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8.5" cy="11.5" r="0.7" fill="#00FF88" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold mb-2">Responsible AI Disclaimer</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  TrustTrade uses AI to <em className="text-gray-400">assist</em> decision-making — not replace it.
                  Our assessments are probabilistic and identify patterns associated with fraud risk, but cannot
                  guarantee accuracy in every situation.{' '}
                  <strong className="text-gray-300">We do not store your transaction data.</strong>{' '}
                  Always apply your own judgement and consult trusted community members when in doubt.
                  TrustTrade is not liable for any financial decisions made based on AI assessments.
                  When facing significant transactions, consider consulting local consumer protection bodies or
                  a trusted financial advisor.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-500 mb-5">Ready to protect your next trade?</p>
          <Link to="/check">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn-primary glow-green-sm"
            >
              Try TrustTrade Now
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
