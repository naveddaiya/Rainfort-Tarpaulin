/**
 * Generate structured data (JSON-LD) for products
 * Helps search engines understand product information better
 */

export const generateProductStructuredData = (products) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "category": product.category,
        "image": product.image,
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "RainFort Tarpaulin"
          }
        },
        "additionalProperty": product.specifications ? [
          {
            "@type": "PropertyValue",
            "name": "Material",
            "value": product.specifications.material
          },
          {
            "@type": "PropertyValue",
            "name": "Thickness",
            "value": product.specifications.thickness
          },
          {
            "@type": "PropertyValue",
            "name": "Warranty",
            "value": product.specifications.warranty
          }
        ] : []
      }
    }))
  };
};

export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

export const generateFAQStructuredData = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateManufacturerStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Manufacturer",
    "name": "RainFort Tarpaulin",
    "description": "Leading manufacturer of tarpaulin, PVC coated tirpal, tent fabric & pond liners in India",
    "url": "https://rainfort-tarpaulin.pages.dev/",
    "logo": "/rainfort-logo.png",
    "sameAs": [
      // Add your social media links here
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8385011488",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    },
    "makesOffer": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "Tarpaulin Products",
        "description": "PVC coated tarpaulin, tent fabric, pond liners, and waterproof covers"
      }
    }
  };
};

// FAQ data for structured data
export const productFAQs = [
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
];
