import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential Villa',
    message: '',
  });

  const [status, setStatus] = useState({ submitted: false, loading: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ submitted: false, loading: true });

    setTimeout(() => {
      setStatus({ submitted: true, loading: false });
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: 'Residential Villa',
        message: '',
      });
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-36 px-6 md:px-12 bg-[#08090A] border-b border-[#22252A]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Coastline Photo + Headline + Info */}
        <div className="lg:col-span-6 space-y-10">
          <div>
            <div className="section-label">
              <span>07</span>
              <div className="w-8 h-[1px] bg-[#D4C5B0]" />
              <span>CONTACT US</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#F8FAFC] leading-[1.05]">
              LET'S BUILD <br />
              <span className="italic text-[#D4C5B0]">SOMETHING GREAT.</span>
            </h2>
          </div>

          {/* Coastal Architectural Image Overlay Frame */}
          <div className="relative overflow-hidden border border-[#22252A] h-64 sm:h-72">
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=85&w=1200"
              alt="Vertex Construction Headquarters Sri Lanka"
              className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090A] via-[#08090A]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.25em] text-[#D4C5B0]">
              COLOMBO STUDIO & HEADQUARTERS
            </div>
          </div>

          {/* Contact Details List */}
          <div className="space-y-6 pt-4 border-t border-[#22252A]">
            <a
              href="mailto:hello@vertexconstruction.com"
              className="flex items-center gap-4 text-sm md:text-base text-[#94A3B8] hover:text-[#F8FAFC] transition-colors group"
            >
              <div className="p-3 bg-[#0D0E10] border border-[#22252A] text-[#D4C5B0] group-hover:border-[#D4C5B0]">
                <Mail size={18} />
              </div>
              <span className="font-mono">hello@vertexconstruction.com</span>
            </a>

            <a
              href="tel:+94112345678"
              className="flex items-center gap-4 text-sm md:text-base text-[#94A3B8] hover:text-[#F8FAFC] transition-colors group"
            >
              <div className="p-3 bg-[#0D0E10] border border-[#22252A] text-[#D4C5B0] group-hover:border-[#D4C5B0]">
                <Phone size={18} />
              </div>
              <span className="font-mono">+94 11 234 5678</span>
            </a>

            <div className="flex items-center gap-4 text-sm md:text-base text-[#94A3B8]">
              <div className="p-3 bg-[#0D0E10] border border-[#22252A] text-[#D4C5B0]">
                <MapPin size={18} />
              </div>
              <span>No. 45, Galle Road, Colombo 03, Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-End Contact Form */}
        <div className="lg:col-span-6 bg-[#0D0E10] border border-[#22252A] p-8 sm:p-12">
          {status.submitted ? (
            <div className="py-16 text-center space-y-6 animate-fade-in">
              <div className="inline-flex p-4 rounded-full bg-[#D4C5B0]/10 text-[#D4C5B0] mb-2">
                <CheckCircle size={48} />
              </div>
              <h3 className="font-serif text-3xl text-[#F8FAFC]">
                INQUIRY RECEIVED
              </h3>
              <p className="text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                Thank you for contacting Vertex Construction. Our architectural project team will review your requirements and reach out within 24 hours.
              </p>
              <button
                onClick={() => setStatus({ submitted: false, loading: false })}
                className="btn-outline text-xs mt-6"
              >
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-[#22252A] pb-4 mb-6">
                <h3 className="font-serif text-2xl text-[#F8FAFC]">
                  START A PROJECT INQUIRY
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Fill out your details below to schedule an initial architectural consultation.
                </p>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#94A3B8] block font-mono">
                    NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    className="w-full bg-[#08090A] border border-[#22252A] px-4 py-3.5 text-sm text-[#F8FAFC] focus:border-[#D4C5B0] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#94A3B8] block font-mono">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full bg-[#08090A] border border-[#22252A] px-4 py-3.5 text-sm text-[#F8FAFC] focus:border-[#D4C5B0] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#94A3B8] block font-mono">
                    PHONE *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 7X XXX XXXX"
                    className="w-full bg-[#08090A] border border-[#22252A] px-4 py-3.5 text-sm text-[#F8FAFC] focus:border-[#D4C5B0] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#94A3B8] block font-mono">
                    PROJECT TYPE *
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full bg-[#08090A] border border-[#22252A] px-4 py-3.5 text-sm text-[#F8FAFC] focus:border-[#D4C5B0] outline-none transition-colors cursor-pointer"
                  >
                    <option value="Residential Villa">Luxury Residential Villa</option>
                    <option value="Commercial Development">Commercial Development</option>
                    <option value="Architectural Build">Architectural Build</option>
                    <option value="Renovation & Restoration">Renovation & Restoration</option>
                    <option value="Other">Other Civil Engineering</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#94A3B8] block font-mono">
                  MESSAGE *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your site location, timeline, and architectural requirements..."
                  className="w-full bg-[#08090A] border border-[#22252A] px-4 py-3.5 text-sm text-[#F8FAFC] focus:border-[#D4C5B0] outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status.loading}
                className="w-full py-4 bg-[#D4C5B0] text-[#08090A] font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#E5D9C5] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg"
              >
                {status.loading ? (
                  <span>SUBMITTING INQUIRY...</span>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
