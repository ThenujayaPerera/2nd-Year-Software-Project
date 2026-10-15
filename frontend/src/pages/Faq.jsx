import { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Truck, CreditCard, RefreshCw, MessageSquare } from 'lucide-react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    category: 'Products & Authenticity',
    icon: ShieldCheck,
    questions: [
      {
        q: 'Are all products on NVSHOP.LK 100% original and genuine?',
        a: 'Yes, absolutely! We guarantee 100% authentic, original products sourced directly from authorized brand distributors (Anker, UGREEN, Baseus, Sony, Aspor, Spigen). Every product comes with manufacturer warranty and original seal packaging.',
      },
      {
        q: 'How does warranty coverage work?',
        a: 'All our products carry standard brand warranties ranging from 6 to 18 months depending on the manufacturer. If you experience any technical defect, simply bring the item to our Ambalangoda showroom or contact our WhatsApp support team for hassle-free replacement.',
      },
    ],
  },
  {
    category: 'Shipping & Islandwide Delivery',
    icon: Truck,
    questions: [
      {
        q: 'How fast is island-wide delivery in Sri Lanka?',
        a: 'Orders within Colombo & Galle areas are typically delivered within 1-2 business days. For outstation areas across Sri Lanka, delivery takes 2-3 business days. Free shipping applies to orders over LKR 10,000.',
      },
      {
        q: 'Can I choose Cash on Delivery (COD)?',
        a: 'Yes! Cash on Delivery is available for all addresses across Sri Lanka. You can pay the courier in cash when your package arrives at your doorstep.',
      },
    ],
  },
  {
    category: 'Payment Methods & Koko Installments',
    icon: CreditCard,
    questions: [
      {
        q: 'What payment options do you accept?',
        a: 'We accept Visa, MasterCard, Bank Direct Transfers, Cash on Delivery (COD), and KOKO (buy now, pay in 3 interest-free monthly installments).',
      },
      {
        q: 'How do I pay using KOKO installments?',
        a: 'Select KOKO at checkout. You only pay 1/3 of the total amount today using your debit/credit card, and the remaining 2 installments will be automatically deducted over the next 2 months with 0% interest.',
      },
    ],
  },
  {
    category: 'Returns & Exchange Policy',
    icon: RefreshCw,
    questions: [
      {
        q: 'What is your return & replacement policy?',
        a: 'We offer an easy 7-day return policy for unopened items or manufacturing defects. Items must be returned in original packaging with all accessories included.',
      },
    ],
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState('0-0');

  const toggleAccordion = (idxStr) => {
    setOpenIdx(openIdx === idxStr ? null : idxStr);
  };

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen py-8 sm:py-16 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-14">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-600/10 text-blue-600 mb-3 sm:mb-6">
              <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2 sm:mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-600 text-xs sm:text-lg max-w-xl mx-auto px-2">
              Everything you need to know about shopping, shipping, original warranties, and payments at NVSHOP.LK.
            </p>
          </div>

          {/* FAQ Categories & Questions */}
          <div className="space-y-6 sm:space-y-10">
            {FAQS.map((cat, catIdx) => (
              <div key={catIdx} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 border-b border-slate-100 pb-3 sm:pb-4">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <cat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-slate-900">{cat.category}</h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {cat.questions.map((faq, qIdx) => {
                    const uniqueId = `${catIdx}-${qIdx}`;
                    const isOpen = openIdx === uniqueId;

                    return (
                      <div 
                        key={qIdx}
                        className="border border-slate-100 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleAccordion(uniqueId)}
                          className="w-full p-3.5 sm:p-5 text-left font-bold text-slate-800 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-xs sm:text-base md:text-lg pr-3">{faq.q}</span>
                          <ChevronDown 
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180 text-blue-600' : ''
                            }`} 
                          />
                        </button>

                        {isOpen && (
                          <div className="p-3.5 sm:p-5 pt-2 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed bg-white border-t border-slate-100">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Need More Help Box */}
          <div className="mt-8 sm:mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-white text-center shadow-xl">
            <h3 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3">Still have questions?</h3>
            <p className="text-blue-100 text-xs sm:text-sm mb-5 sm:mb-8 max-w-md mx-auto">
              Our customer support team is available on WhatsApp to assist you with order inquiries and tech recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="https://wa.me/94769890079"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-xs sm:text-base"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" /> WhatsApp Support
              </a>
              <Link
                to="/contact"
                className="bg-blue-700/60 hover:bg-blue-700 text-white border border-white/20 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-colors text-xs sm:text-base"
              >
                Contact Us Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
