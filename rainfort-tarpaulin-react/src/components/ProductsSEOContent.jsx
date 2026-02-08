import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';

/**
 * SEO-optimized content sections for the Products page
 * Contains structured content targeting Indian B2B tarpaulin market
 */
const ProductsSEOContent = () => {
  const handleContactAction = (method) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-16">
      {/* Product Categories Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-foreground">
            Product Categories
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Comprehensive range of tarpaulin products designed for Indian industrial and agricultural applications
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tarpaulin Sheets */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">Tarpaulin Sheets</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  General-purpose waterproof sheets suitable for covering goods, construction materials, and temporary shelters. Available in various GSM ratings and sizes to match your specific coverage needs, from small household use to large industrial applications.
                </p>
              </CardContent>
            </Card>

            {/* PVC / Coated Tarpaulin */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">PVC / Coated Tarpaulin</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Heavy-duty PVC coated tirpal with superior waterproofing and tear resistance. Ideal for long-term outdoor use, transportation covers, and areas exposed to harsh sunlight and heavy rainfall. Our coated tarpaulins maintain flexibility even in extreme temperatures.
                </p>
              </CardContent>
            </Card>

            {/* Tent Fabric */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">Tent Fabric</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Specialized fabric for pandal, shamiyana, and event tents. Designed to handle monsoon conditions while providing adequate ventilation and light diffusion. Available in various colors and finishes to suit wedding events, exhibitions, and outdoor functions.
                </p>
              </CardContent>
            </Card>

            {/* Pond Liners & Fish Tanks */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">Pond Liners & Fish Tanks</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Food-grade, UV-stabilized liners specifically manufactured for aquaculture and water storage. Our pond liners prevent water seepage, resist algae growth, and maintain water quality for fish farming, biofloc systems, and agricultural water storage.
                </p>
              </CardContent>
            </Card>

            {/* Coated Rolls */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">Coated Rolls</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Industrial-grade coated fabric supplied in rolls for manufacturers, fabricators, and large-scale projects. Perfect for businesses requiring consistent quality material for producing custom covers, bags, or protective equipment in bulk quantities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Applications in India Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-foreground">
            Applications in India
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Trusted across diverse industries for reliable protection in Indian weather conditions
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-l-4 border-navy-500 pl-6 py-4">
                <h3 className="text-xl font-bold mb-2 text-foreground">Monsoon Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Our tarpaulins provide reliable waterproofing during India's heavy monsoon season. Protect construction materials, agricultural produce, vehicles, and machinery from water damage with our high-GSM waterproof sheets that can withstand continuous rainfall.
                </p>
              </div>

              <div className="border-l-4 border-navy-500 pl-6 py-4">
                <h3 className="text-xl font-bold mb-2 text-foreground">Construction Sites</h3>
                <p className="text-sm text-muted-foreground">
                  Cover cement bags, sand, bricks, and equipment at construction sites. Our tear-resistant tarpaulins handle rough use, sharp edges, and frequent movement while keeping materials dry and protected from weather and dust.
                </p>
              </div>

              <div className="border-l-4 border-navy-500 pl-6 py-4">
                <h3 className="text-xl font-bold mb-2 text-foreground">Agriculture & Farming</h3>
                <p className="text-sm text-muted-foreground">
                  Farmers use our tirpal for grain storage coverage, crop protection during drying, greenhouse covers, and silage protection. The UV-resistant coating ensures longevity even when exposed to direct sunlight throughout the year.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-navy-500 pl-6 py-4">
                <h3 className="text-xl font-bold mb-2 text-foreground">Warehouse & Transport</h3>
                <p className="text-sm text-muted-foreground">
                  Secure goods during transportation with our durable truck covers. Warehouse owners rely on our tarpaulins for outdoor inventory protection, creating temporary storage areas, and covering loading dock openings during off-hours.
                </p>
              </div>

              <div className="border-l-4 border-navy-500 pl-6 py-4">
                <h3 className="text-xl font-bold mb-2 text-foreground">Fish Farming & Water Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Our specialized pond liners are extensively used across India for fish farming, prawn cultivation, biofloc tanks, and rainwater harvesting systems. The material is non-toxic, flexible, and designed to last multiple farming cycles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-foreground">
            Key Features & Specifications
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Engineered for durability and performance in demanding conditions
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Waterproofing",
                description: "100% waterproof coating that prevents moisture penetration even during heavy downpours and extended exposure."
              },
              {
                title: "GSM Range",
                description: "Available from 90 GSM for light-duty use to 300+ GSM for heavy industrial applications. Higher GSM provides better durability and puncture resistance."
              },
              {
                title: "UV Resistance",
                description: "UV-stabilized coating protects against sun damage and prevents material degradation, extending product life by 2-3 years compared to non-treated alternatives."
              },
              {
                title: "Tear Strength",
                description: "Reinforced weaving with high tensile strength ensures the tarpaulin resists tearing from sharp objects, strong winds, and rough handling during installation and use."
              },
              {
                title: "Custom Sizes & Colors",
                description: "We manufacture tarpaulins in any required dimension, from standard 6x4 feet to custom sizes exceeding 100 feet. Available in blue, green, white, silver, and custom colors."
              },
              {
                title: "Temperature Tolerance",
                description: "Remains flexible in temperatures ranging from -10°C to 70°C, suitable for use across all Indian climatic zones from Ladakh to Tamil Nadu."
              }
            ].map((feature, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold mb-2 text-navy-500">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-foreground">
            Why Choose Our Tarpaulin Products
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Quality manufacturing meets customer-focused service
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Badge variant="default" className="w-8 h-8 flex items-center justify-center rounded-full">1</Badge>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Manufacturing Quality</h3>
                    <p className="text-sm text-muted-foreground">
                      We operate our own manufacturing facility with quality control at every production stage. Each tarpaulin undergoes waterproofing tests, tear resistance checks, and coating thickness verification before dispatch, ensuring you receive products that perform as specified.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Badge variant="default" className="w-8 h-8 flex items-center justify-center rounded-full">2</Badge>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Customization Capabilities</h3>
                    <p className="text-sm text-muted-foreground">
                      Understanding that different industries have unique requirements, we offer complete customization in size, thickness, color, and finishing. Whether you need pond liners for specific tank dimensions or branded tarpaulins with printed logos for your tent business, we accommodate your specifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Badge variant="default" className="w-8 h-8 flex items-center justify-center rounded-full">3</Badge>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Bulk Supply & Timely Delivery</h3>
                    <p className="text-sm text-muted-foreground">
                      As manufacturers, we maintain inventory for immediate dispatch of standard sizes while efficiently managing bulk orders for contractors and dealers. Our distribution network covers major Indian cities with reliable logistics partners ensuring timely delivery.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Badge variant="default" className="w-8 h-8 flex items-center justify-center rounded-full">4</Badge>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Designed for Indian Conditions</h3>
                    <p className="text-sm text-muted-foreground">
                      Unlike imported alternatives, our tarpaulins are specifically engineered for Indian weather patterns. From Kerala's monsoon intensity to Rajasthan's harsh summer heat, our products are tested and proven in actual Indian field conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Guide Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-foreground">
            How to Choose the Right Tarpaulin / Tirpal
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Select the perfect product based on your specific application
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                use: "For Construction Sites",
                recommendation: "Choose 150-200 GSM PVC coated tarpaulin with reinforced edges. This provides adequate tear resistance for rough handling while remaining cost-effective for temporary coverage needs."
              },
              {
                use: "For Agricultural Use",
                recommendation: "Opt for 120-150 GSM with UV coating for grain coverage and crop protection. If using for greenhouse or long-term outdoor coverage, select 180+ GSM with enhanced UV stabilization."
              },
              {
                use: "For Transportation & Trucks",
                recommendation: "Select minimum 200 GSM with strong eyelets and reinforced corners. The material should resist wind flapping at highway speeds and handle frequent tying and untying without edge damage."
              },
              {
                use: "For Fish Tanks & Pond Liners",
                recommendation: "Use specialized 250-300 GSM food-grade liners with UV and algae resistance. Ensure the material is free from harmful chemicals and has welded seams for larger pond installations."
              },
              {
                use: "For Tent & Event Use",
                recommendation: "Choose fabric-finish tarpaulins in 160-180 GSM that balance durability with aesthetic appearance. Consider color options and light transmission properties based on event type."
              },
              {
                use: "For Warehouse Storage",
                recommendation: "Use 180-200 GSM heavy-duty tarpaulins with reinforced edges for stacking materials. Ensure proper eyelet spacing for secure anchoring in outdoor storage areas."
              }
            ].map((guide, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <Badge variant="outline" className="mb-3">{guide.use}</Badge>
                  <p className="text-sm text-muted-foreground">{guide.recommendation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Common questions about tarpaulin and tirpal products
          </p>

          <div className="space-y-6">
            {[
              {
                question: "What is the difference between tarpaulin and PVC coated tarpaulin?",
                answer: "Regular tarpaulin typically refers to polyethylene sheets with basic water resistance, suitable for light-duty temporary coverage. PVC coated tarpaulin has a polyester base fabric with polyvinyl chloride coating on both sides, making it significantly more durable, tear-resistant, and waterproof. PVC coated variants last 3-5 years with proper use, while basic tarpaulins may last only a few months under similar conditions."
              },
              {
                question: "Is tarpaulin waterproof during heavy rain?",
                answer: "Yes, quality tarpaulins with proper PVC coating are completely waterproof and can withstand heavy Indian monsoon rainfall. The waterproofing effectiveness depends on GSM rating, coating quality, and edge finishing. For continuous rain exposure, we recommend minimum 150 GSM with heat-sealed edges and ensuring proper installation without water pooling on the surface."
              },
              {
                question: "Which tarpaulin is best for fish tanks or pond liners?",
                answer: "For aquaculture, use specialized pond liners made from virgin material with 250-300 GSM thickness. These liners are UV-stabilized, non-toxic to aquatic life, and resistant to algae buildup. Avoid using general-purpose construction tarpaulins for fish farming as they may contain chemicals harmful to fish and lack the flexibility needed for proper pond installation."
              },
              {
                question: "What GSM tarpaulin is best for outdoor use in India?",
                answer: "For outdoor use in Indian conditions, 150-200 GSM provides the best balance of durability and cost-effectiveness. If the tarpaulin will be exposed to direct sunlight, sharp objects, or high wind areas, opt for 200-250 GSM with UV coating. Coastal areas with high humidity and salt exposure require minimum 180 GSM with enhanced corrosion-resistant eyelets."
              },
              {
                question: "How long does coated tarpaulin last?",
                answer: "With proper use and storage, quality PVC coated tarpaulin lasts 3-5 years for outdoor applications and 5-8 years for covered or semi-outdoor use. Lifespan depends on UV exposure, handling frequency, and storage practices. Regular cleaning, avoiding prolonged folding in the same creases, and storing away from direct sunlight when not in use significantly extends product life."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold mb-3 text-foreground">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-navy-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Need a Quote or Have Specific Requirements?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            We understand every project has unique coverage needs. Whether you require standard sizes for immediate dispatch or custom manufacturing for specialized applications, our team is ready to assist you.
          </p>

          <div className="space-y-4 mb-8">
            <p className="text-white/90">
              Our technical team can help you select the right GSM, size, and coating type based on your specific use case. For orders above 1000 square meters, we offer competitive bulk pricing and flexible payment terms.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="gap-2"
              onClick={() => handleContactAction('call')}
            >
              <Phone className="w-5 h-5" />
              Call Us Directly
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 bg-white text-navy-500 hover:bg-white/90"
              onClick={() => handleContactAction('whatsapp')}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Your Requirements
            </Button>
          </div>

          <p className="text-sm text-white/80 mt-6">
            Ready to place your order or need technical guidance? Contact us today.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProductsSEOContent;
