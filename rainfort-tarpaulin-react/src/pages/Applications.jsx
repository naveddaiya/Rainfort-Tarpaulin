import { Building, Wheat, Truck, Factory, Warehouse, Ship } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Applications = () => {
  const applications = [
    {
      icon: Building,
      title: "Construction",
      description: "Heavy-duty protection for construction sites and equipment",
      uses: [
        "Scaffold sheeting and weather protection",
        "Equipment and machinery covers",
        "Site fencing and debris containment",
        "Concrete curing blankets",
        "Temporary roofing solutions",
      ],
      badge: "Industrial"
    },
    {
      icon: Wheat,
      title: "Agriculture",
      description: "Versatile solutions for farming and agricultural operations",
      uses: [
        "Crop and hay covers",
        "Greenhouse covers and shade nets",
        "Grain storage protection",
        "Livestock shelter and wind breaks",
        "Pond liners and water storage",
      ],
      badge: "Farm-Ready"
    },
    {
      icon: Truck,
      title: "Transportation",
      description: "Durable covers for cargo protection during transit",
      uses: [
        "Truck and trailer covers",
        "Cargo protection systems",
        "Load securing tarpaulins",
        "Railway wagon covers",
        "Shipping container liners",
      ],
      badge: "Logistics"
    },
    {
      icon: Factory,
      title: "Industrial",
      description: "Heavy-duty solutions for manufacturing and industry",
      uses: [
        "Machine and equipment covers",
        "Warehouse floor protection",
        "Temporary walls and partitions",
        "Dust and contamination control",
        "Chemical and oil containment",
      ],
      badge: "Heavy-Duty"
    },
    {
      icon: Warehouse,
      title: "Storage & Warehousing",
      description: "Protection for stored goods and materials",
      uses: [
        "Pallet covers and wraps",
        "Inventory protection",
        "Outdoor storage solutions",
        "Bulk material covers",
        "Equipment storage covers",
      ],
      badge: "Commercial"
    },
    {
      icon: Ship,
      title: "Marine & Outdoor",
      description: "Weather-resistant solutions for marine applications",
      uses: [
        "Boat and yacht covers",
        "Dock and pier protection",
        "Beach and outdoor event covers",
        "Swimming pool covers",
        "Outdoor furniture protection",
      ],
      badge: "Weatherproof"
    },
  ];

  const industries = [
    "Mining & Excavation",
    "Oil & Gas",
    "Forestry",
    "Event Management",
    "Military & Defense",
    "Disaster Relief",
  ];

  return (
    <div id="applications" className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-background via-muted/30 to-background industrial-texture py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <Badge variant="default" className="mb-4">
              INDUSTRIES WE SERVE
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">
              Applications Across <span className="text-navy-500">All Industries</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From construction sites to agricultural fields, our industrial-grade tarpaulins
              provide reliable protection where it matters most.
            </p>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app, index) => (
              <Card
                key={index}
                className="hover:translate-y-[-4px] transition-transform duration-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-navy-500 border-2 border-navy-600 flex items-center justify-center heavy-shadow">
                      <app.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="accent">{app.badge}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{app.title}</CardTitle>
                  <CardDescription className="text-base">
                    {app.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <h4 className="font-bold uppercase text-sm mb-3 text-foreground">
                    Common Uses
                  </h4>
                  <ul className="space-y-2">
                    {app.uses.map((use, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground pl-4 border-l-2 border-safety-500 py-1"
                      >
                        {use}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Industries */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Also Serving Additional <span className="text-navy-500">Sectors</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our versatile tarpaulin solutions are trusted across diverse industries
              for their durability and reliability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-card border-2 border-border p-6 text-center heavy-shadow hover:border-navy-500 transition-colors duration-200"
              >
                <div className="font-bold uppercase tracking-wider text-foreground">
                  {industry}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-navy-500 to-navy-700 p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 industrial-texture opacity-10"></div>
            <div className="relative z-10 max-w-3xl">
              <Badge variant="accent" className="mb-6">
                SUCCESS STORY
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Protecting Assets in Extreme Conditions
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Our tarpaulins have been deployed across construction sites in challenging
                weather conditions, providing reliable protection for equipment worth millions.
                With UV resistance and tear-proof construction, they deliver peace of mind
                in the most demanding environments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="accent" size="lg">
                  View Case Studies
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-navy-500 border-white hover:bg-white/90"
                >
                  Request Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
            Find the Right Solution for Your Industry
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our team of experts can help you select the perfect tarpaulin solution
            tailored to your specific industry requirements.
          </p>
          <Button variant="accent" size="lg">
            Contact Our Industry Specialists
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Applications;
