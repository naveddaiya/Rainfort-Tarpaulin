import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';

/**
 * SEO-optimized content sections for the Products page
 * Contains structured content targeting Indian B2B tarpaulin market
 */
const ProductsSEOContent = () => {
  const handleContactAction = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-0">
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
                recommendation: "Choose 400-1500 GSM PVC coated tarpaulin with reinforced edges. This provides adequate tear resistance for rough handling while remaining cost-effective for temporary coverage needs."
              },
              {
                use: "For Agricultural Use",
                recommendation: "Opt for 500-750 GSM with UV coating for grain coverage and crop protection. This range ensures durability for greenhouse or long-term outdoor coverage with enhanced UV stabilization."
              },
              {
                use: "For Transportation & Trucks",
                recommendation: "Select 500-750 GSM with strong eyelets and reinforced corners. The material should resist wind flapping at highway speeds and handle frequent tying and untying without edge damage."
              },
              {
                use: "For Fish Tanks & Pond Liners",
                recommendation: "Use specialized 600-650 GSM food-grade liners with UV and algae resistance. Ensure the material is free from harmful chemicals and has welded seams for larger pond installations."
              },
              {
                use: "For Tent & Event Use",
                recommendation: "Choose fabric-finish tarpaulins in 650-1000 GSM that balance durability with aesthetic appearance. Consider color options and light transmission properties based on event type."
              },
              {
                use: "For Warehouse Storage",
                recommendation: "Use 500-750 GSM heavy-duty tarpaulins with reinforced edges for stacking materials. Ensure proper eyelet spacing for secure anchoring in outdoor storage areas."
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
                answer: "Yes, quality tarpaulins with proper PVC coating are completely waterproof and can withstand heavy Indian monsoon rainfall. The waterproofing effectiveness depends on GSM rating, coating quality, and edge finishing. For continuous rain exposure, we recommend minimum 500 GSM with heat-sealed edges and ensuring proper installation without water pooling on the surface."
              },
              {
                question: "Which tarpaulin is best for fish tanks or pond liners?",
                answer: "For aquaculture, use specialized pond liners made from virgin material with 600-650 GSM thickness. These liners are UV-stabilized, non-toxic to aquatic life, and resistant to algae buildup. Avoid using general-purpose construction tarpaulins for fish farming as they may contain chemicals harmful to fish and lack the flexibility needed for proper pond installation."
              },
              {
                question: "What GSM tarpaulin is best for outdoor use in India?",
                answer: "For outdoor use in Indian conditions, 500-750 GSM provides the best balance of durability and cost-effectiveness. If the tarpaulin will be exposed to direct sunlight, sharp objects, or high wind areas, opt for 750-1000 GSM with UV coating. Coastal areas with high humidity and salt exposure require minimum 650 GSM with enhanced corrosion-resistant eyelets."
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
            Our technical team can help you select the right GSM, size, and coating type based on your specific use case. For orders above 1000 square meters, we offer competitive bulk pricing and flexible payment terms.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="gap-2"
              onClick={handleContactAction}
            >
              <Phone className="w-5 h-5" />
              Call Us Directly
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 bg-white text-navy-500 hover:bg-white/90"
              onClick={handleContactAction}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Your Requirements
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsSEOContent;
