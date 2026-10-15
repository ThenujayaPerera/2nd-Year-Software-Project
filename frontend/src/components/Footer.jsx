import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Mail, Phone, MapPin, ArrowRight, ChevronDown } from 'lucide-react';

const socialLinks = [
  {
    href: 'https://www.facebook.com/nvshopamba',
    name: 'Facebook',
    svg: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: '#',
    name: 'Twitter',
    svg: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/nvshop.lk',
    name: 'Instagram',
    svg: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        
        {/* DESKTOP & TABLET: 4-Column Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="NVSHOP.LK" 
                className="h-10 w-auto object-contain" 
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Elevating your mobile experience with curated, high-performance accessories designed to protect and power your devices.
            </p>
            <div className="flex gap-2.5 mt-1">
              {socialLinks.map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 hover:border-slate-700 transition-all">
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { name: 'Products', path: '/products' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'FAQ', path: '/faq' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-5">Support</h4>
            <ul className="space-y-3">
              {[
                { name: 'Shipping Info', path: '/shipping-info' },
                { name: 'Returns', path: '/returns' },
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms & Conditions', path: '/terms-conditions' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-5">Get in Touch</h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="mailto:nvshopamba@gmail.com"
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white group transition-colors"
                >
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-blue-500 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="group-hover:underline">nvshopamba@gmail.com</span>
                </a>
              </li>

              <li>
                <a
                  href="tel:+94769890079"
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white group transition-colors"
                >
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-500 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="group-hover:underline">+94 76 989 0079</span>
                </a>
              </li>

              <li>
                <a
                  href="https://maps.google.com/?q=185/1/2B+New+Road,+Ambalangoda+80300,+Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-slate-400 hover:text-white group transition-colors"
                >
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-purple-500 mt-0.5 group-hover:border-purple-500/40 group-hover:bg-purple-500/10 transition-all">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="group-hover:underline leading-relaxed">
                    185/1/2B New Road, Ambalangoda
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* MOBILE COMPACT VIEW (< 640px) */}
        <div className="sm:hidden space-y-4 mb-6">
          {/* Brand & Socials Compact */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-900">
            <Link to="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="NVSHOP.LK" 
                className="h-8 w-auto object-contain" 
              />
            </Link>
            <div className="flex gap-2">
              {socialLinks.map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <a href="tel:+94769890079" className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2 font-medium">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">+94 76 989 0079</span>
            </a>
            <a href="mailto:nvshopamba@gmail.com" className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2 font-medium">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">Email Us</span>
            </a>
          </div>

          {/* Collapsible Accordions for Links */}
          <div className="divide-y divide-slate-900 border-t border-b border-slate-900">
            {/* Explore Accordion */}
            <div>
              <button 
                onClick={() => toggleSection('explore')}
                className="w-full py-3 flex items-center justify-between text-xs font-bold text-slate-300"
              >
                <span>EXPLORE</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSection === 'explore' ? 'rotate-180 text-blue-400' : 'text-slate-500'}`} />
              </button>
              {openSection === 'explore' && (
                <div className="grid grid-cols-2 gap-2.5 pb-3 text-xs text-slate-400 animate-in fade-in">
                  <Link to="/products" className="hover:text-white py-1">Products</Link>
                  <Link to="/about" className="hover:text-white py-1">About Us</Link>
                  <Link to="/contact" className="hover:text-white py-1">Contact</Link>
                  <Link to="/faq" className="hover:text-white py-1">FAQ</Link>
                </div>
              )}
            </div>

            {/* Support Accordion */}
            <div>
              <button 
                onClick={() => toggleSection('support')}
                className="w-full py-3 flex items-center justify-between text-xs font-bold text-slate-300"
              >
                <span>SUPPORT & POLICIES</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSection === 'support' ? 'rotate-180 text-blue-400' : 'text-slate-500'}`} />
              </button>
              {openSection === 'support' && (
                <div className="grid grid-cols-2 gap-2.5 pb-3 text-xs text-slate-400 animate-in fade-in">
                  <Link to="/shipping-info" className="hover:text-white py-1">Shipping Info</Link>
                  <Link to="/returns" className="hover:text-white py-1">Returns</Link>
                  <Link to="/privacy-policy" className="hover:text-white py-1">Privacy Policy</Link>
                  <Link to="/terms-conditions" className="hover:text-white py-1">Terms</Link>
                </div>
              )}
            </div>
          </div>

          {/* Showroom Location Summary */}
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
            <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Showroom: 185/1/2B New Road, Ambalangoda (10AM–8PM)</span>
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-900 pt-5 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            © {currentYear} NV-SHOP.LK. All rights reserved. Sri Lanka.
          </p>
          <p className="text-[10px] sm:text-xs text-slate-600">
            Authentic Tech Accessories Hub
          </p>
        </div>
      </div>
    </footer>
  );
}


