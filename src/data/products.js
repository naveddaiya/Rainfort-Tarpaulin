/**
 * Products Data Configuration
 *
 * To add a new product:
 * 1. Add product images to /public/images/products/ folder
 * 2. Add product object to the array below
 * 3. Save this file - changes will reflect automatically
 */

export const products = [
  {
    id: 1,
    name: "PVC Truck Covers",
    category: "General Purpose",
    image: "/images/products/truck.webp",
    description: "Heavy-duty waterproof covers for commercial vehicles",
    features: ["UV Protected", "Tear Resistant", "Lightweight", "100% Waterproof"],
    applications: ["Construction", "Agriculture", "Storage"],
    badge: "Popular",
    priceRange: "₹850 – ₹3,200",
    variants: {
      sizes: ["6×4 ft", "8×6 ft", "10×8 ft", "12×10 ft", "14×12 ft", "Custom Size"],
      gsm: ["90 GSM", "120 GSM", "150 GSM", "200 GSM"],
    },
    specifications: {
      material: "HDPE (High-Density Polyethylene)",
      color: "ALL",
      warranty: "1 Year"
    }
  },
  {
    id: 2,
    name: "Pvc Coated Tarpaulin",
    category: "Premium",
    image: "/images/products/coated.webp",
    description: "Nylon Double Side Pvc Coated material solutions",
    features: ["100% Waterproof", "Heavy Duty", "All Weather", "Long-lasting"],
    applications: ["Outdoor Storage", "Vehicle Cover", "Industrial"],
    badge: "Premium",
    priceRange: "₹1,200 – ₹5,500",
    variants: {
      sizes: ["6×4 ft", "8×6 ft", "10×8 ft", "12×10 ft", "16×12 ft", "Custom Size"],
      gsm: ["150 GSM", "200 GSM", "250 GSM", "300 GSM"],
    },
    specifications: {
      material: "PVC Coated Fabric",
      color: "ALL",
      warranty: "2 Years"
    }
  },
  {
    id: 3,
    name: "Tent Pagoda",
    category: "Specialized",
    image: "/images/products/tent-pagoda.webp",
    description: "Stylish and protective Tent solutions",
    features: ["Leak Proof", "Fish Safe", "UV Stabilized", "Flexible"],
    applications: ["Aquaculture", "Water Storage", "Farming"],
    badge: "Specialized",
    priceRange: "₹4,500 – ₹18,000",
    variants: {
      sizes: ["10×10 ft", "12×12 ft", "15×15 ft", "20×20 ft", "Custom Size"],
      gsm: ["200 GSM", "250 GSM", "300 GSM"],
    },
    specifications: {
      material: "HDPE",
      color: "ALL",
      warranty: "2 Years"
    }
  },
  {
    id: 4,
    name: "PVC Coated Biofloc Tanks",
    category: "Aquaculture",
    image: "/images/products/bioflock.webp",
    description: "Advanced PVC coated tanks designed for biofloc fish farming systems.",
    features: ["Durable", "Easy Setup", "Chemical Resistant", "Eco-friendly"],
    applications: ["Fish Farming", "Shrimp Farming", "Commercial"],
    badge: "Advanced",
    priceRange: "₹3,800 – ₹22,000",
    variants: {
      sizes: ["8 ft dia", "10 ft dia", "12 ft dia", "15 ft dia", "Custom Size"],
      gsm: ["200 GSM", "250 GSM", "300 GSM"],
    },
    specifications: {
      material: "PVC Coated Fabric",
      color: "ALL",
      warranty: "2 Years"
    }
  },
  {
    id: 5,
    name: "White Tent Fabric Rolls (Blackout)",
    category: "Specialized",
    image: "/images/products/white.webp",
    description: "High-stretch PVC fabric rolls and mechanical Tent materials.",
    features: ["Weatherproof", "Reinforced Edges", "Custom Sizes", "Heavy Duty"],
    applications: ["Tent Making", "Covers", "General Use"],
    badge: "Industrial",
    priceRange: "₹950 – ₹4,200 / roll",
    variants: {
      sizes: ["50 m roll", "100 m roll", "Custom Length"],
      gsm: ["150 GSM", "200 GSM", "250 GSM", "300 GSM"],
    },
    specifications: {
      material: "PVC Laminated Fabric",
      color: "White",
      warranty: "2 Years"
    }
  },
  {
    id: 6,
    name: "Pond Liner",
    category: "Agriculture",
    image: "/images/products/pond.jpg",
    description: "Waterproof and UV resistant pond liners for various applications.",
    features: ["Breathable", "Strong", "Natural Material", "Eco-friendly"],
    applications: ["Agriculture", "Water Harvesting", "General Use"],
    badge: "Classic",
    priceRange: "₹1,100 – ₹8,500",
    variants: {
      sizes: ["10×10 ft", "15×15 ft", "20×20 ft", "25×25 ft", "Custom Size"],
      gsm: ["200 GSM", "300 GSM", "400 GSM", "500 GSM"],
    },
    specifications: {
      material: "Cotton Canvas",
      color: "ALL",
      warranty: "4 Year"
    }
  },

  // ADD MORE PRODUCTS BELOW - Copy and modify the template:
  /*
  {
    id: 7,
    name: "Product Name Here",
    category: "Category Name",
    image: "/images/products/your-image.jpg",
    description: "Product description here",
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    applications: ["Use Case 1", "Use Case 2", "Use Case 3"],
    badge: "New", // or "Popular", "Premium", etc.
    priceRange: "₹XXX – ₹XXX",
    variants: {
      sizes: ["Size 1", "Size 2", "Custom Size"],
      gsm: ["120 GSM", "150 GSM", "200 GSM"],
    },
    specifications: {
      material: "Material name",
      color: "Color options",
      warranty: "X Years"
    }
  },
  */
];

/**
 * Get featured products for home page
 */
export const getFeaturedProducts = () => {
  return products.slice(0, 3);
};

export const getProductById = (id) => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

export const getCategories = () => {
  return [...new Set(products.map(product => product.category))];
};
