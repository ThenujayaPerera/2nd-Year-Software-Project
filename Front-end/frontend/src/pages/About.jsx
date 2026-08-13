import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Zap, Award, Users, Heart, Smartphone, 
  MapPin, Clock, Phone, Mail, MessageSquare, CheckCircle, 
  Star, Truck, Sparkles, ArrowRight, ShieldAlert, Store
} from 'lucide-react';
import Layout from '../components/Layout';

const SHOWROOM_PHOTOS = [
  {
    title: 'NVSHOP.LK Store Front & Reception',
    desc: 'Official reception & customer service counter with illuminated branding at 185/1/2B New Road, Ambalangoda.',
    image: '/store/nvshop-store.jpg',
  },
  {
    title: 'Showroom Seating & Lounge',
    desc: 'Modern customer consultation area equipped with green accent seating under honeycomb LED lighting.',
    image: '/store/nvshop-showroom-seating.webp',
  },
  {
    title: 'Live VR & Gaming Experience Zone',
    desc: 'Customer testing station with PS5 VR headsets, dualsense controllers, and Soundcore pure bass audio.',
    image: '/store/nvshop-vr-demo.webp',
  },
  {
    title: 'Branded Audio & Gaming Lineup',
    desc: 'Wall-to-wall Anker Soundcore, Sony wireless headphones, and high-power party speakers on live display.',
    image: '/store/nvshop-audio-gaming-shelf.jpg',
  },
  {
    title: 'UGREEN Fast Charging & Cables Aisle',
    desc: 'Original GaN fast chargers, 240W braided cables, and USB-C multiport hubs.',
    image: '/store/nvshop-aisle-ugreen.jpg',
  },
  {
    title: 'Full Retail Showroom Overview',
    desc: 'High-angle perspective of our modern retail space, accessories racks, and customer service counters.',
    image: '/store/nvshop-store-overview.jpg',
  },
];

const STATS = [
  { number: '50,000+', label: 'Satisfied Customers', sub: 'Across Sri Lanka' },
  { number: '100%', label: 'Genuine Products', sub: 'Authorized Distributors' },
  { number: '1 - 3 Days', label: 'Island-wide Delivery', sub: 'Cash on Delivery Available' },
  { number: '10 AM - 8 PM', label: 'Open 7 Days a Week', sub: 'Showroom in Ambalangoda' },
];

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: '100% Genuine Branded Tech',
    desc: 'We source only original products from Anker, UGREEN, Baseus, Apple, Spigen, and JBL. No clones, no refurbished fakes.',
    badge: 'Authentic Warranty',
  },
  {
    icon: Truck,
    title: 'Island-Wide Express Delivery',
    desc: 'Enjoy speedy delivery right to your doorstep across Colombo, Kandy, Galle, Matara, Jaffna and every district with live tracking.',
    badge: 'Cash on Delivery',
  },
  {
    icon: Award,
    title: 'Official Warranty & Hassle-Free Claims',
    desc: 'Every charger, power bank, and smart gadget comes backed with 6-month to 2-year replacement warranties and direct store support.',
    badge: 'Up to 2 Years',
  },
  {
    icon: Store,
    title: 'Physical Showroom & Live Demos',
    desc: 'Visit our flagship store at 185/1/2B New Road, Ambalangoda to test headsets, verify specs, and consult our friendly staff.',
    badge: 'Visit in Person',
  },
];

const BRANDS = [
  { name: 'Apple', tag: 'iPhone & MagSafe' },
  { name: 'Anker', tag: 'PowerCore & GaN' },
  { name: 'Soundcore', tag: 'Hi-Res Audio & ANC' },
  { name: 'UGREEN', tag: 'Nexode & Cables' },
  { name: 'Baseus', tag: 'Fast Chargers' },
  { name: 'Spigen', tag: 'Air Cushion Cases' },
  { name: 'JBL', tag: 'PartyBox & Bass' },
  { name: 'Black Shark', tag: 'AMOLED Watches' },
  { name: 'Green Lion', tag: 'Smart Tech Gear' },
  { name: 'Sony', tag: 'PS5 & Gaming VR' },
  { name: 'SanDisk', tag: '4K Extreme Pro' },
  { name: 'Aspor', tag: 'TWS Audio Lineup' },
];

export default function About() {
  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen">
        {/* 1. Hero Section */}
        <section className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Find Your Perfect Match
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
              About <span className="text-blue-400">NVSHOP.LK</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              The premier destination for 100% original mobile accessories, fast chargers, power banks, and gaming gear in Ambalangoda and throughout Sri Lanka.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                Shop All Products <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/94769890079"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* 2. Key Stats Strip */}
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((st, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-center space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-blue-600">{st.number}</p>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">{st.label}</h4>
                <p className="text-[11px] text-slate-500">{st.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Our Story & Purpose */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <span className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-1 block">OUR HERITAGE & MISSION</span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                  Empowering Sri Lanka With Authentic Tech Since 2020
                </h2>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Founded in <strong>Ambalangoda</strong>, <strong>NVSHOP.LK</strong> began with a clear purpose: to bridge the gap in the Sri Lankan market by providing <strong>100% genuine, certified mobile accessories and consumer electronics</strong> at honest, transparent prices.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                In an industry plagued by substandard counterfeit chargers and battery hazards, we handpick authorized distributor shipments from global giants like <strong>Anker, UGREEN, Baseus, Apple, Spigen, and JBL</strong>. Every item sold in our store comes backed by authentic manufacturer warranties and customer-first aftersales service.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 text-slate-800">
                  <h4 className="font-black text-base text-blue-950 mb-1">Our Mission</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    To make certified fast charging, studio audio, and military-grade phone protection accessible across Sri Lanka with next-day dispatch and zero counterfeit compromise.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-slate-800">
                  <h4 className="font-black text-base text-emerald-950 mb-1">Our Vision</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    To remain Sri Lanka's most trustworthy tech hub, combining an immersive physical showroom experience with an effortless, secure digital storefront.
                  </p>
                </div>
              </div>
            </div>

            {/* Store Image Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] group">
              <img
                src="/store/nvshop-store.jpg"
                alt="NVSHOP.LK Ambalangoda Showroom Counter"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                <span className="text-xs font-black text-blue-400 tracking-widest uppercase">OFFICIAL SHOWROOM</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">NVSHOP.LK Store, Ambalangoda</h3>
                <p className="text-xs text-slate-300 mt-1">185/1/2B New Road, Ambalangoda 80300, Southern Province</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Why Choose NVSHOP.LK (4 Pillars) */}
        <section className="bg-white py-20 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">THE NVSHOP ADVANTAGE</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why Customers Trust NVSHOP.LK</h2>
              <p className="text-slate-500 text-sm">We provide an unmatched combination of authenticity, warranty support, and technical expertise.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {GUARANTEES.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="font-black text-base text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Showroom Photo Gallery Mosaic (Step Inside NVSHOP.LK) */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">VISIT OUR SHOWROOM</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Experience Our Retail Space</h2>
            <p className="text-slate-500 text-sm">
              Located on New Road in Ambalangoda, our modern showroom invites you to test premium audio, explore live VR headsets, and consult with our friendly gadget experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHOWROOM_PHOTOS.map((photo, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 space-y-1.5">
                  <h4 className="font-black text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{photo.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{photo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Authorized Brand Portfolio */}
        <section className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10 space-y-2">
              <span className="text-blue-400 font-bold text-xs tracking-widest uppercase">AUTHORIZED BRANDS</span>
              <h2 className="text-2xl sm:text-3xl font-black">Official Brand Portfolio</h2>
              <p className="text-slate-400 text-xs">We partner directly with leading tech manufacturers worldwide</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {BRANDS.map((brand, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center hover:border-blue-500 transition-all group">
                  <h4 className="font-black text-base text-white group-hover:text-blue-400 transition-colors">{brand.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{brand.tag}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Showroom Location, Contact & Opening Hours */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div>
                  <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">VISIT OR CONTACT US</span>
                  <h2 className="text-3xl font-black text-slate-900 mt-1">Showroom Details & Hours</h2>
                  <p className="text-slate-500 text-sm">We are open 7 days a week to assist your purchases, warranty claims, and device testing.</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Showroom Address</h4>
                      <p className="text-slate-600 text-xs mt-0.5">185/1/2B New Road, Ambalangoda 80300, Southern Province, Sri Lanka</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Opening Hours</h4>
                      <p className="text-slate-600 text-xs mt-0.5">Monday – Sunday: <strong>10:00 AM – 8:00 PM</strong> (Open 7 Days)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Telephone Hotlines</h4>
                      <p className="text-slate-600 text-xs mt-0.5">
                        <a href="tel:+94769890079" className="hover:text-blue-600 font-bold">+94 76 989 0079</a> &nbsp;|&nbsp; 
                        <a href="tel:+94777470186" className="hover:text-blue-600 font-bold">+94 77 747 0186</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Official Email</h4>
                      <p className="text-slate-600 text-xs mt-0.5">
                        <a href="mailto:nvshopamba@gmail.com" className="hover:text-blue-600 font-semibold">nvshopamba@gmail.com</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href="https://maps.google.com/?q=6.2368,80.0543"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20"
                  >
                    Open in Google Maps
                  </a>
                  <Link
                    to="/contact"
                    className="px-6 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Contact Us Page
                  </Link>
                </div>
              </div>

              {/* Showroom Map Card Preview */}
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 aspect-[4/3] relative">
                <iframe
                  title="NVSHOP.LK Location Map"
                  src="https://maps.google.com/maps?q=Ambalangoda,%20Sri%20Lanka&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 8. Call to Action Banner */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black">Ready to Upgrade Your Tech Setup?</h2>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">
              Explore thousands of genuine chargers, power banks, earphones, and cases backed by official warranties and island-wide delivery.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-black text-sm rounded-xl transition-all shadow-xl"
              >
                Browse Catalog
              </Link>
              <Link
                to="/faq"
                className="px-7 py-3.5 bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all border border-blue-400/30"
              >
                Read FAQs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
