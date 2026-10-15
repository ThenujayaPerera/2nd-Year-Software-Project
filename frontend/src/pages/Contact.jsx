import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle, Smartphone } from 'lucide-react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const showroomPhotos = [
  {
    image: '/store/nvshop-store.jpg',
    title: 'NVSHOP.LK Reception',
    description: 'Visit us for genuine tech and in-store support.',
  },
  {
    image: '/store/nvshop-vr-demo.webp',
    title: 'Interactive Demo Zone',
    description: 'Explore products and experience the latest tech.',
  },
  {
    image: '/store/nvshop-store-overview.jpg',
    title: 'Inside the Showroom',
    description: 'Browse our Ambalangoda store in person.',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'nvshopamba@gmail.com',
      description: 'Response within 2 hours',
      link: 'mailto:nvshopamba@gmail.com',
    },
    {
      icon: Phone,
      title: 'Phone & WhatsApp',
      value: '+94 76 989 0079',
      description: 'Hotline: +94 77 747 0186 (Open 7 Days)',
      link: 'tel:+94769890079',
    },
    {
      icon: MapPin,
      title: 'Showroom Address',
      value: '185/1/2B New Road, Ambalangoda, Sri Lanka',
      description: 'Visit our showroom (10 AM - 8 PM)',
      link: 'https://maps.google.com/?q=185/1/2B+New+Road,+Ambalangoda+80300,+Sri+Lanka',
    },
    {
      icon: Clock,
      title: 'Operating Hours',
      value: 'Monday – Sunday: 10 AM - 8 PM',
      description: 'Open 7 days a week',
    },
  ];

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer hassle-free returns within 30 days of purchase. Items must be unused and in original packaging.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we deliver across Sri Lanka. We are expanding to regional countries soon.',
    },
    {
      question: 'Are your products original?',
      answer: 'Yes! All products are 100% original from authorized distributors. We guarantee authenticity.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Bank Transfer, Credit/Debit Cards, and Koko installments.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 2-3 business days across the island.',
    },
    {
      question: 'Do you offer warranty?',
      answer: 'Yes! All products come with original manufacturer warranties.',
    },
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-6 sm:py-12 px-3 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-2 sm:mb-4">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-xl text-slate-600 max-w-2xl mx-auto px-2">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-16">
            {/* Contact Form - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg p-4 sm:p-8 border border-slate-100">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 sm:mb-6">Send us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Thank you for your message!</p>
                      <p className="text-sm text-green-800">We'll get back to you within 2 hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-3.5 sm:px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          errors.name
                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                            : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full px-3.5 sm:px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          errors.email
                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                            : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+94 76 989 0079"
                        className={`w-full px-3.5 sm:px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          errors.phone
                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                            : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Warranty / Order Inquiry"
                        className={`w-full px-3.5 sm:px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          errors.subject
                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                            : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows="4"
                      className={`w-full px-3.5 sm:px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none resize-none ${
                        errors.message
                          ? 'border-red-300 bg-red-50 focus:border-red-500'
                          : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                      }`}
                    />
                    {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                {contactMethods.map((method, idx) => {
                  const Icon = method.icon;
                  const CardContent = (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{method.title}</h4>
                        <p className="font-semibold text-primary text-sm mb-1">{method.value}</p>
                        <p className="text-xs text-slate-500">{method.description}</p>
                      </div>
                    </div>
                  );

                  return method.link ? (
                    <a
                      key={idx}
                      href={method.link}
                      target={method.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-primary/40 hover:shadow-lg transition-all group block"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all group">
                      {CardContent}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Showroom Image Panel - 1 column */}
            <div className="lg:col-span-1">
              <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">
                <div className="p-5 pb-4">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">Visit us in person</p>
                  <h3 className="text-xl font-black text-slate-900">Step inside our showroom</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Explore the NVSHOP.LK store and experience our products in Ambalangoda.
                  </p>
                </div>

                <Link
                  to="/#showroom"
                  className="group relative mx-5 block aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="Explore the NVSHOP.LK showroom gallery"
                >
                  <img
                    src={showroomPhotos[0].image}
                    alt={showroomPhotos[0].title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h4 className="font-bold">{showroomPhotos[0].title}</h4>
                    <p className="mt-1 text-xs text-white/80">{showroomPhotos[0].description}</p>
                  </div>
                </Link>

                <div className="grid grid-cols-2 gap-3 p-5">
                  {showroomPhotos.slice(1).map((photo) => (
                    <Link
                      key={photo.title}
                      to="/#showroom"
                      className="group min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={photo.image}
                          alt={photo.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="truncate text-xs font-bold text-slate-900">{photo.title}</h4>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">{photo.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-slate-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-start gap-3">
                    <span className="text-primary font-black">Q.</span>
                    {faq.question}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed flex items-start gap-3">
                    <span className="text-primary/60 font-black">A.</span>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 sm:mt-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-600 via-blue-700 to-fuchsia-600 p-6 sm:p-12 text-center text-white shadow-xl">
            <h3 className="mb-2 text-xl font-black sm:mb-3 sm:text-3xl">
              Still have questions?
            </h3>
            <p className="mx-auto mb-5 max-w-md text-xs text-blue-100 sm:mb-8 sm:text-sm">
              Our support team is ready to help with your questions, product advice, and orders.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-support-bot'))}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-blue-700 transition-colors duration-200 hover:bg-blue-100 hover:text-indigo-800 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                Quick Help Chat
              </button>
              <a
                href="https://wa.me/94769890079?text=Hello%20NVSHOP.LK%20Support"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-blue-700/60 px-6 py-3 text-xs font-bold text-white transition-colors duration-200 hover:border-white/40 hover:bg-indigo-800 hover:text-white sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
              >
                <Smartphone className="h-4 w-4 text-emerald-300 sm:h-5 sm:w-5" aria-hidden="true" />
                WhatsApp Live Agent
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
