import { Link } from 'react-router-dom'

const ShieldCheck = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
    <path d="M9 1.5L2.25 4.5v4.5C2.25 12.938 5.175 16.763 9 17.625c3.825-.862 6.75-4.688 6.75-8.625V4.5L9 1.5z" fill="#000" />
    <path d="M6 9.375l2 2 4-4" stroke="#00FF88" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#00FF88] flex items-center justify-center">
                <ShieldCheck />
              </div>
              <span className="text-white font-bold">
                Trust<span className="text-[#00FF88]">Trade</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              AI-powered fraud detection built for the informal traders of Southern Africa.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Navigate</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/check', label: 'Check a Trade' },
                { href: '/how-it-works', label: 'How It Works' },
                { href: '/about', label: 'About' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsible AI */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Responsible AI</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              TrustTrade uses AI to assist decision-making and does not guarantee accuracy.
              Assessments are advisory only — always apply your own judgement. We do not store
              your transaction data. This tool is not a substitute for professional legal or
              financial advice.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} TrustTrade. Built for the people of Southern Africa.
          </p>
          <p className="text-gray-600 text-xs">
            Powered by <span className="text-[#00FF88]/70">TrustTrade</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
