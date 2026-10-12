import { Truck, Clock, ShieldCheck, MapPin, PackageCheck } from 'lucide-react';
import Layout from '../components/Layout';

export default function ShippingInfo() {
  return (
    <Layout>
      <div className="bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-darkText min-h-screen py-16 px-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
              <Truck className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-darkText mb-4">
              Shipping & Islandwide Delivery
            </h1>
            <p className="text-slate-600 dark:text-darkMuted text-lg max-w-xl mx-auto">
              Fast, reliable delivery across Sri Lanka with real-time tracking and Cash on Delivery options.
            </p>
          </div>

          <div className="bg-white dark:bg-darkCard rounded-3xl p-8 border border-slate-100 dark:border-darkBorder shadow-sm space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-center">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-darkText mb-1">1-3 Working Days</h3>
                <p className="text-xs text-slate-500 dark:text-darkMuted">Express delivery across Sri Lanka</p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-center">
                <PackageCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-darkText mb-1">Free Delivery</h3>
                <p className="text-xs text-slate-500 dark:text-darkMuted">On orders over LKR 10,000</p>
              </div>

              <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-center">
                <ShieldCheck className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-darkText mb-1">Safe Packaging</h3>
                <p className="text-xs text-slate-500 dark:text-darkMuted">Sealed tamper-proof box</p>
              </div>
            </div>

            <div className="space-y-4 text-slate-600 dark:text-darkMuted leading-relaxed pt-4 border-t border-slate-100 dark:border-darkBorder">
              <h2 className="text-xl font-bold text-slate-900 dark:text-darkText">Delivery Options & Rates</h2>
              <p>
                NVSHOP.LK partners with top courier services to ensure your mobile accessories arrive safely and quickly. Orders placed before 2:00 PM are dispatched on the same business day.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-darkText">
                <li><strong>Western & Southern Province:</strong> 1 - 2 business days.</li>
                <li><strong>All Other Provinces:</strong> 2 - 3 business days.</li>
                <li><strong>Standard Shipping Fee:</strong> LKR 350 flat rate (FREE for orders over LKR 10,000).</li>
                <li><strong>Cash on Delivery (COD):</strong> Available island-wide.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
