import { ShieldCheck, Lock } from 'lucide-react';
import Layout from '../components/Layout';

export default function Privacy() {
  return (
    <Layout>
      <div className="bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-darkText min-h-screen py-16 px-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-darkText mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-600 dark:text-darkMuted text-lg max-w-xl mx-auto">
              Your privacy and data protection are fundamental to our customer trust.
            </p>
          </div>

          <div className="bg-white dark:bg-darkCard rounded-3xl p-8 border border-slate-100 dark:border-darkBorder shadow-sm space-y-6 text-slate-600 dark:text-darkMuted leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-darkText">1. Information Collection</h2>
            <p>
              We collect personal information such as your name, email address, contact phone number, and delivery address strictly for order processing and delivery fulfillment.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-darkText">2. Payment Security</h2>
            <p>
              Your card transactions are securely processed via encrypted payment gateways. NVSHOP.LK does not store your credit/debit card numbers on our servers.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
