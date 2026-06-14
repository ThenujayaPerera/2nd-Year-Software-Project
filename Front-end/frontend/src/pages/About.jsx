import { Award, Users, Zap, Shield, Globe, TrendingUp, Heart, Smartphone } from 'lucide-react';
import Layout from '../components/Layout';

export default function About() {
  const features = [
    {
      icon: Shield,
      title: 'Authentic Products',
      description: 'Every product is verified and genuine, directly from authorized distributors.',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Island-wide delivery within 2-3 business days with real-time tracking.',
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Competitive pricing with regular deals and exclusive member discounts.',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Dedicated customer support team available 24/7 to assist you.',
    },
    {
      icon: Heart,
      title: 'Warranty Protection',
      description: 'Extended warranty options and hassle-free claims process.',
    },
    {
      icon: Globe,
      title: 'Global Brands',
      description: 'Premium brands like Anker, UGREEN, Baseus, and more.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '10K+', label: 'Products' },
    { number: '24/7', label: 'Customer Support' },
    { number: '99%', label: 'Satisfaction Rate' },
  ];

  const team = [
    {
      name: 'Thenujaya Perera',
      role: 'Founder & CEO',
      image: '👨‍💼',
      bio: 'Visionary leader with 10+ years in tech retail',
    },
    {
      name: 'Product Team',
      role: 'Category Experts',
      image: '👥',
      bio: 'Handpicked quality assurance specialists',
    },
    {
      name: 'Support Team',
      role: 'Customer Champions',
      image: '🎯',
      bio: 'Dedicated to solving customer issues instantly',
    },
    {
      name: 'Tech Team',
      role: 'Innovation Drivers',
      image: '⚙️',
      bio: 'Building the future of e-commerce',
    },
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              Welcome to <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">NV-SHOP</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Your trusted destination for premium mobile accessories and tech gadgets. Delivering quality, authenticity, and excellence since day one.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </p>
                  <p className="text-slate-600 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-4 mb-8">
                  <h2 className="text-4xl font-black text-slate-900">Our Story</h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/30" />
                </div>
                <div className="space-y-6 text-slate-600 leading-relaxed">
                  <p>
                    NV-SHOP was founded with a simple mission: to make premium mobile accessories accessible to everyone in Sri Lanka. We started as a small team passionate about technology and customer satisfaction.
                  </p>
                  <p>
                    Today, we've grown into a trusted platform serving over 50,000 happy customers across the island, offering genuine products from world-renowned brands.
                  </p>
                  <p>
                    We believe that quality shouldn't come at an unreasonable price. Every product on NV-SHOP is carefully selected, verified, and backed by authentic warranties.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-12 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <Smartphone className="w-24 h-24 text-primary/30 mx-auto mb-6" />
                  <p className="text-slate-500 font-semibold">Building trust through excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Why Choose NV-SHOP?</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We're committed to delivering exceptional value and service in every interaction
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/20">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 border border-primary/20">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Our Mission</h3>
                <p className="text-slate-700 leading-relaxed">
                  To revolutionize the mobile accessories retail experience in Sri Lanka by providing authentic products at competitive prices with world-class customer service and support.
                </p>
              </div>
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl p-8 border border-accent/20">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Our Vision</h3>
                <p className="text-slate-700 leading-relaxed">
                  To become the most trusted and preferred online mobile accessories retailer in Sri Lanka, known for integrity, quality, innovation, and exceptional customer care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Meet Our Team</h2>
              <p className="text-lg text-slate-600">
                Passionate professionals dedicated to your satisfaction
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all border border-slate-100">
                  <div className="text-5xl mb-4">{member.image}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-primary font-semibold text-sm mb-4">{member.role}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Our Core Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 border border-blue-200">
                <h4 className="text-xl font-bold text-blue-900 mb-3">🎯 Integrity</h4>
                <p className="text-blue-800">
                  We operate with complete transparency and honesty in every transaction and interaction.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-8 border border-purple-200">
                <h4 className="text-xl font-bold text-purple-900 mb-3">✨ Excellence</h4>
                <p className="text-purple-800">
                  We consistently deliver superior quality products and unmatched customer service.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-8 border border-green-200">
                <h4 className="text-xl font-bold text-green-900 mb-3">💚 Customer Care</h4>
                <p className="text-green-800">
                  Your satisfaction is our priority, and we go above and beyond to support you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-primary/5 border-y border-primary/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
              Ready to Experience NV-SHOP?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of satisfied customers enjoying authentic products and exceptional service.
            </p>
            <button className="bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-block">
              Shop Now
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
