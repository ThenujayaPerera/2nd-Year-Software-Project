import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import SupportBot from '../components/SupportBot';

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
      value: 'support@nvshop.com',
      description: 'Response within 2 hours',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+94 71 123 4567',
      description: '24/7 Support Available',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Colombo, Sri Lanka',
      description: 'Visit our showroom',
    },
    {
      icon: Clock,
      title: 'Operating Hours',
      value: 'Mon - Sat: 9 AM - 10 PM',
      description: 'Sunday: 10 AM - 8 PM',
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
      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-12 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Form - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Send us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Thank you for your message!</p>
                      <p className="text-sm text-green-800">We'll get back to you within 2 hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name & Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
                          errors.name
                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                            : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
                          errors.email
                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                            : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+94 71 234 5678"
                        className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
                          errors.phone
                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                            : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
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
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows="6"
                      className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none resize-none ${
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
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Methods */}
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                {contactMethods.map((method, idx) => {
                  const Icon = method.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">{method.title}</h4>
                          <p className="font-semibold text-primary text-sm mb-1">{method.value}</p>
                          <p className="text-xs text-slate-500">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support Bot - 1 column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 h-full">
                <h3 className="text-lg font-black text-slate-900 mb-4">Need Quick Help?</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Our AI-powered support bot is available 24/7 to answer your questions instantly.
                </p>
                <div className="flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🤖</div>
                    <p className="text-sm text-slate-600">Click the chat button in the bottom right →</p>
                  </div>
                </div>
              </div>
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
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20 text-center">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our expert support team is available 24/7. Don't hesitate to reach out—we're always happy to help!
            </p>
            <button className="bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-block">
              Start a Live Chat
            </button>
          </div>
        </div>

        {/* Support Bot Widget */}
        <SupportBot isProducts={false} />
      </div>
    </Layout>
  );
}
