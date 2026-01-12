import { Award, Users, Target, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Quality First",
      description: "ISO certified materials and rigorous testing ensure premium products"
    },
    {
      icon: Users,
      title: "Customer Focused",
      description: "Dedicated support and custom solutions for every client"
    },
    {
      icon: Target,
      title: "Precision Engineering",
      description: "Exact specifications and attention to detail in every product"
    },
    {
      icon: TrendingUp,
      title: "Continuous Innovation",
      description: "Constantly improving our products with latest technologies"
    },
  ];

  const milestones = [
    { year: "2016", event: "Company Founded" },
    { year: "2018", event: "ISO Certification Achieved" },
    { year: "2020", event: "Expanded Product Line" },
    { year: "2023", event: "5000+ Projects Completed" },
  ];

  return (
    <div id="about" className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-background via-muted/30 to-background industrial-texture py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <Badge variant="default" className="mb-4">
              ABOUT RAINFORT TARPAULIN
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">
              Building <span className="text-navy-500">Trust</span> Since 2016
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A leading manufacturer and exporter of high-quality tarpaulin products,
              delivering durable, weather-resistant solutions across industries.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">
                Our <span className="text-navy-500">Story</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Established in 2016, <strong>RainFort Tarpaulin</strong> has grown to become
                a reputed manufacturer and exporter of premium tarpaulin products. Our commitment
                to quality and innovation has made us a trusted partner across construction,
                agriculture, and transportation industries.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With a focus on delivering durable, weather-resistant solutions, our product
                range includes HDPE Black Tarpaulin, American Waterproof Tarpaulin Sheets,
                HDPE Pond Liners, PVC Coated Biofloc Fish Farming Tanks, PVC Truck Covers,
                and Canvas Tarpaulins.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Led by <strong>Mr. Sarfaraz Daiya</strong>, our Marketing Executive, we ensure
                that each product undergoes stringent quality checks before dispatch. Our success
                is driven by a highly skilled team and strong infrastructure.
              </p>
            </div>

            <div className="relative h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-navy-500 to-charcoal-600 border-4 border-border heavy-shadow flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-7xl font-bold mb-4">8+</div>
                  <div className="text-2xl font-bold uppercase tracking-wider">
                    Years of Excellence
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Our <span className="text-navy-500">Core Values</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that drive everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:translate-y-[-4px] transition-transform duration-200">
                <CardHeader>
                  <div className="w-16 h-16 bg-navy-500 border-2 border-navy-600 flex items-center justify-center mx-auto mb-4 heavy-shadow">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Our <span className="text-navy-500">Journey</span>
            </h2>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-center gap-6 p-6 bg-card border-2 border-border heavy-shadow"
              >
                <div className="flex-shrink-0 w-24 h-24 bg-navy-500 border-2 border-navy-600 flex items-center justify-center heavy-shadow">
                  <div className="text-2xl font-bold text-white">{milestone.year}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground">{milestone.event}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
