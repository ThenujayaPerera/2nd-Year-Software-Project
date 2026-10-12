import { FileText, Shield } from 'lucide-react';
import Layout from '../components/Layout';

export default function Terms() {
  return (
    <Layout>
      <div className="bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-darkText min-h-screen py-16 px-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-darkText mb-4">
              Terms & Conditions
            </h1>
            <p className="text-slate-600 dark:text-darkMuted text-lg max-w-xl mx-auto">
              Please read these terms and conditions carefully before using NVSHOP.LK.
            </p>
          </div>

          <div className="bg-white dark:bg-darkCard rounded-3xl p-8 border border-slate-100 dark:border-darkBorder shadow-sm space-y-6 text-slate-600 dark:text-darkMuted leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-darkText">1. Acceptance of Terms</h2>
            <p>
              By accessing and using NVSHOP.LK, you agree to comply with and be bound by these Terms and Conditions. All products sold are 100% authentic and original under authorized distribution.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-darkText">2. Product Pricing & Availability</h2>
            <p>
              All prices listed on NVSHOP.LK are in Sri Lankan Rupees (LKR) and inclusive of applicable taxes. We reserve the right to modify prices or update stock availability without prior notice.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-darkText">3. Warranty Policy</h2>
            <p>
              Warranties apply only to manufacturing defects. Physical damage, water exposure, or unauthorized repairs void the warranty contract.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
