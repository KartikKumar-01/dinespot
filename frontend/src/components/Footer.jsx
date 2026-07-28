import { Link } from 'react-router-dom';
import { UtensilsCrossed, Globe, Share2, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-gray-100">
      {/* Newsletter */}
      <div className="bg-[#111] py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-white mb-3">Join the Culinary Inner Circle</h2>
          <p className="text-gray-400 text-sm mb-8">
            Subscribe to receive first access to new openings and seasonal tasting menus.
          </p>
          <form
            className="flex gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 px-5 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-[#C9A96E] hover:text-white transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#C9A96E] rounded-full flex items-center justify-center">
                <UtensilsCrossed size={16} className="text-white" />
              </div>
              <span className="font-serif text-xl font-semibold text-gray-900">DineSpot</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Connecting discerning palates with the world's most exceptional culinary experiences.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Partner with Us', 'Careers'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-600 hover:text-[#C9A96E] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">Legal</h4>
            <ul className="space-y-3">
              {['Terms of Service', 'Privacy Policy', 'Cookies'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-600 hover:text-[#C9A96E] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">Contact</h4>
            <p className="text-sm text-gray-600 mb-5">support@dinespot.com</p>
            <div className="flex gap-4">
              {[Globe, Share2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-10 border-gray-100" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} DineSpot. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#C9A96E] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#C9A96E] transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
