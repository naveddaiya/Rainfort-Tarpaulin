import { useState } from 'react';
import { Shield, Droplets, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuoteModal } from '@/components/ui/quote-modal';

const Home = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const features = [
    {
      icon: Shield,
      title: "Heavy-Duty Protection",
      description: "Industrial-grade materials built to withstand the harshest conditions",
      badge: "Premium"
    },
    {
      icon: Droplets,
      title: "100% Waterproof",
      description: "Complete water resistance for all weather protection",
      badge: "Guaranteed"
    },
    {
      icon: TrendingUp,
      title: "Long-Lasting",
      description: "Durable construction that stands the test of time",
      badge: "Proven"
    },
    {
      icon: Award,
      title: "ISO Certified",
      description: "Meets international quality and safety standards",
      badge: "Certified"
    },
  ];

  const stats = [
    { value: "8+", label: "Years Experience" },
    { value: "5000+", label: "Projects Completed" },
    { value: "100%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <div id="home" className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-br from-blue-50 via-orange-50/30 to-slate-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-navy-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl float-animation"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-in slide-in-from-left duration-700">
              <Badge variant="accent" className="w-fit animate-in fade-in slide-in-from-top duration-500">
                🔥 INDUSTRIAL STRENGTH SOLUTIONS
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                <span className="bg-gradient-to-r from-slate-900 via-navy-600 to-slate-900 bg-clip-text text-transparent animate-gradient">
                  Weather-Resistant
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-gradient">
                  Tarpaulin Solutions
                </span>
              </h1>

              <p className="text-xl text-slate-700 leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                Heavy-duty, waterproof tarpaulins engineered for construction, agriculture,
                and transportation. Built to last in the toughest conditions.
              </p>

              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                <Button variant="default" size="lg" onClick={scrollToProducts} className="group">
                  <span>View Products</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
                <Button variant="accent" size="lg" onClick={() => setIsQuoteModalOpen(true)} className="glow-effect">
                  Get Custom Quote
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t-2 border-orange-200 animate-in fade-in slide-in-from-bottom duration-700 delay-700">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group cursor-pointer">
                    <div className="text-3xl font-bold bg-gradient-to-r from-navy-600 to-orange-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-600 uppercase tracking-wider font-semibold group-hover:text-navy-600 transition-colors">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-in slide-in-from-right duration-700 delay-300">
              <div className="relative h-[500px] lg:h-[600px]">
                {/* Placeholder for tarpaulin image */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-600 via-navy-500 to-orange-600 rounded-2xl border-4 border-white/20 heavy-shadow flex items-center justify-center overflow-hidden group hover:scale-105 transition-transform duration-500">
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className="text-center text-white p-8 relative z-10">
                    <Shield className="w-24 h-24 mx-auto mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 float-animation" />
                    <p className="text-xl font-bold uppercase tracking-wider">
                      Professional Grade<br />Tarpaulin Products
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl border-2 border-orange-400 heavy-shadow glow-effect animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 border-4 border-navy-500 rounded-2xl rotate-6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-300/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4 animate-in fade-in zoom-in-50 duration-500">
              ⚡ WHY CHOOSE US
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-bottom duration-700">
              Built for <span className="bg-gradient-to-r from-navy-600 to-orange-600 bg-clip-text text-transparent">Extreme Conditions</span>
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              Our tarpaulins are engineered with industrial-grade materials to provide
              unmatched protection and durability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:translate-y-[-8px] hover:rotate-1 transition-all duration-300 backdrop-blur-sm bg-white/80 animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-navy-500 to-navy-600 rounded-xl border-2 border-navy-400 flex items-center justify-center heavy-shadow group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="outline" className="group-hover:bg-orange-100 transition-colors">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-navy-600 via-navy-500 to-navy-700 relative overflow-hidden">
        <div className="absolute inset-0 industrial-texture opacity-10"></div>
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white animate-in fade-in zoom-in-95 duration-700">
              Ready to <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Protect</span> Your Assets?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              Get a custom quote for your project. Our team is ready to help you find
              the perfect tarpaulin solution.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              <Button variant="accent" size="lg" onClick={() => setIsQuoteModalOpen(true)} className="glow-effect hover:scale-110">
                <span>Request Quote</span>
                <span className="ml-2">✨</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-navy-600 border-white hover:bg-gradient-to-r hover:from-white hover:to-orange-50 hover:scale-105"
                onClick={() => globalThis.location.href = 'tel:+918385011488'}
              >
                📞 Call: +91 83850 11488
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
};

export default Home;
