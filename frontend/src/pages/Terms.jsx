import { FileText, Shield } from 'lucide-react';
import Layout from '../components/Layout';

export default function Terms() {
  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen py-8 sm:py-16 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-14">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-600/10 text-blue-600 mb-3 sm:mb-6">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2 sm:mb-4">
              Terms & Conditions
            </h1>
            <p className="text-slate-600 text-xs sm:text-lg max-w-xl mx-auto px-2">
              Please read these terms and conditions carefully before using NVSHOP.LK.
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-sm space-y-4 sm:space-y-6 text-slate-600 text-xs sm:text-base leading-relaxed">
            <h2 className="text-base sm:text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using NVSHOP.LK, you agree to comply with and be bound by these Terms and Conditions. All products sold are 100% authentic and original under authorized distribution.
            </p>

            <h2 className="text-base sm:text-xl font-bold text-slate-900">2. Product Pricing & Availability</h2>
            <p>
              All prices listed on NVSHOP.LK are in Sri Lankan Rupees (LKR) and inclusive of applicable taxes. We reserve the right to modify prices or update stock availability without prior notice.
            </p>

            <h2 className="text-base sm:text-xl font-bold text-slate-900">3. Warranty Policy</h2>
            <p>
              Warranties apply only to manufacturing defects. Physical damage, water exposure, or unauthorized repairs void the warranty contract.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
