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
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-br from-background via-muted/30 to-background industrial-texture">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge variant="accent" className="w-fit">
                INDUSTRIAL STRENGTH SOLUTIONS
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="text-foreground">Weather-Resistant</span>
                <br />
                <span className="text-navy-500">Tarpaulin Solutions</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Heavy-duty, waterproof tarpaulins engineered for construction, agriculture,
                and transportation. Built to last in the toughest conditions.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button variant="default" size="lg" onClick={scrollToProducts}>
                  View Products
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsQuoteModalOpen(true)}>
                  Get Custom Quote
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t-2 border-border">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-navy-500">{stat.value}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-[500px] lg:h-[600px]">
                {/* Placeholder for tarpaulin image */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-500 to-charcoal-600 rounded-sm border-4 border-border heavy-shadow flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <Shield className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-bold uppercase tracking-wider">
                      Professional Grade<br />Tarpaulin Products
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-safety-500 border-2 border-safety-600 heavy-shadow"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 border-4 border-navy-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4">
              WHY CHOOSE US
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Built for <span className="text-navy-500">Extreme Conditions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our tarpaulins are engineered with industrial-grade materials to provide
              unmatched protection and durability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:translate-y-[-4px] transition-transform duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-navy-500 border-2 border-navy-600 flex items-center justify-center heavy-shadow">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="outline">{feature.badge}</Badge>
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
      <section className="py-20 bg-navy-500 relative overflow-hidden">
        <div className="absolute inset-0 industrial-texture opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Protect Your Assets?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Get a custom quote for your project. Our team is ready to help you find
              the perfect tarpaulin solution.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button variant="accent" size="lg" onClick={() => setIsQuoteModalOpen(true)}>
                Request Quote
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-navy-500 border-white hover:bg-white/90"
                onClick={() => window.location.href = 'tel:+918385011488'}
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
