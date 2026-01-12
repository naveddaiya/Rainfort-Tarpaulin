import { Package, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuoteModal } from '@/components/ui/quote-modal';
import { products, getCategories } from '@/data/products';
import { useState } from 'react';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const categories = ['All', ...getCategories()];

  const handleGetQuote = (productName) => {
    setSelectedProduct(productName);
    setIsQuoteModalOpen(true);
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const specifications = [
    { label: "Material Quality", value: "ISO Certified" },
    { label: "Weather Resistance", value: "All Seasons" },
    { label: "Customization", value: "Available" },
    { label: "Warranty", value: "1-2 Years" },
  ];

  return (
    <div id="products" className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-background via-muted/30 to-background industrial-texture py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <Badge variant="default" className="mb-4">
              OUR PRODUCT RANGE
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">
              Industrial-Grade <span className="text-navy-500">Tarpaulins</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive selection of waterproof tarpaulins engineered for demanding applications.
              From construction sites to agricultural operations.
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className="bg-card border-2 border-border p-6 text-center heavy-shadow"
              >
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {spec.label}
                </div>
                <div className="text-2xl font-bold text-navy-500">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="flex flex-col hover:translate-y-[-4px] transition-transform duration-200">
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-charcoal-500 to-charcoal-700 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.querySelector('.fallback-icon')?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className="fallback-icon absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-charcoal-500 to-charcoal-700 flex">
                    <Package className="w-20 h-20 text-white/30" />
                  </div>
                  {product.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="accent">{product.badge}</Badge>
                    </div>
                  )}
                  {product.price && (
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-background/95 backdrop-blur-sm border-2 border-border px-4 py-2">
                        <span className="text-2xl font-bold text-navy-500">{product.price}</span>
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <CardDescription className="text-sm uppercase tracking-wider font-bold">
                    {product.category}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-6">
                  <p className="text-sm text-muted-foreground">{product.description}</p>

                  <div>
                    <h4 className="font-bold uppercase text-sm mb-3 text-foreground">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, i) => (
                        <li key={`${product.id}-feature-${i}`} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-safety-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold uppercase text-sm mb-3 text-foreground">
                      Applications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.applications.map((app, i) => (
                        <Badge key={`${product.id}-app-${i}`} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-3">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => handleGetQuote(product.name)}
                  >
                    Get Quote
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleGetQuote(product.name)}
                  >
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No Products Found</h3>
              <p className="text-muted-foreground">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Order Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
            Need a Custom Solution?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We offer custom sizes, colors, and specifications to meet your exact requirements.
            Our team can work with you to create the perfect tarpaulin solution.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              onClick={() => handleGetQuote('Custom Solution')}
            >
              Request Custom Quote
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setSelectedProduct(null);
        }}
        productName={selectedProduct}
      />
    </div>
  );
};

export default Products;
