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
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-br from-blue-50 via-orange-50/30 to-slate-50 dark:from-background dark:via-background dark:to-background overflow-hidden">
        {/* Static Background Elements - removed animations for performance */}
        <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-orange-400/20 dark:bg-orange-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-navy-400/20 dark:bg-navy-400/10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge variant="accent" className="w-fit">
                INDUSTRIAL STRENGTH SOLUTIONS
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 via-navy-600 to-slate-900 dark:from-slate-100 dark:via-navy-300 dark:to-slate-100 bg-clip-text text-transparent">
                  RainFort
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Tarpaulin Solutions
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Heavy-duty, waterproof tarpaulins engineered for construction, agriculture,
                and transportation. Built to last in the toughest conditions.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button variant="default" size="lg" onClick={scrollToProducts} className="group">
                  <span>View Products</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
                <Button variant="accent" size="lg" onClick={() => setIsQuoteModalOpen(true)}>
                  Get Custom Quote
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t-2 border-orange-200 dark:border-orange-800/40">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group cursor-pointer">
                    <div className="text-3xl font-bold bg-gradient-to-r from-navy-600 to-orange-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold group-hover:text-navy-600 dark:group-hover:text-navy-300 transition-colors">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-[500px] lg:h-[600px]">
                {/* PVC Coated Tarpaulin Hero Image */}
                <img
                  src="/images/products/coated.webp"
                  alt="PVC Coated Tarpaulin - Industrial Grade Waterproof Cover by RainFort"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl border-4 border-white/20 dark:border-white/10 shadow-xl"
                  fetchPriority="high"
                  decoding="async"
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20 dark:from-background dark:via-muted/30 dark:to-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <Badge variant="default" className="mb-4">
              WHY CHOOSE US
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Built for <span className="bg-gradient-to-r from-navy-600 to-orange-600 bg-clip-text text-transparent">Extreme Conditions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our tarpaulins are engineered with industrial-grade materials to provide
              unmatched protection and durability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:translate-y-[-4px] transition-transform duration-200 bg-card">
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
      <section className="py-14 bg-gradient-to-br from-navy-600 via-navy-500 to-navy-700 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white">
              Ready to <span className="text-orange-400">Protect</span> Your Assets?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Get a custom quote for your project. Our team is ready to help you find
              the perfect tarpaulin solution.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button variant="accent" size="lg" onClick={() => setIsQuoteModalOpen(true)}>
                <span>Request Quote</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-navy-600 border-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:bg-white dark:text-navy-600 dark:hover:from-gray-100 dark:hover:to-gray-200"
                onClick={() => globalThis.location.href = 'tel:+918385011488'}
              >
                Call: +91 83850 11488
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
