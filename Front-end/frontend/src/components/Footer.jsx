import { Link } from 'react-router-dom';
import { Smartphone, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

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

  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                NV<span className="text-primary">SHOP</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Elevating your mobile experience with curated, high-performance accessories designed to protect and power your devices.
            </p>
            <div className="flex gap-3 mt-2">
              {socialLinks.map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 hover:border-slate-700 transition-all">
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-6">Explore</h4>
            <ul className="space-y-3">
              {['Products', 'About Us', 'Contact', 'FAQ'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-6">Support</h4>
            <ul className="space-y-3">
              {['Shipping Info', 'Returns', 'Privacy Policy', 'Terms & Conditions'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' & ', '-').replace(' ', '-')}`} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <span>nvshopamba@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+94 76 989 0079</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-primary mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>185/1/2B New Road, Ambalangoda, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-500 font-medium">
            © {currentYear} NV-SHOP. All rights reserved. Sri Lanka's Premium Mobile Accessories Hub.
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Designed with excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}

