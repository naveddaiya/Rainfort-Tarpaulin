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
    image: "/images/products/truck.png", // Add your image here
    description: "Heavy-duty waterproof covers for commercial vehicles",
    features: ["UV Protected", "Tear Resistant", "Lightweight", "100% Waterproof"],
    applications: ["Construction", "Agriculture", "Storage"],
    badge: "Popular",
    specifications: {
      material: "HDPE (High-Density Polyethylene)",
      thickness: "200 GSM",
      color: "ALL",
      warranty: "1 Year"
    }
  },
  {
    id: 2,
    name: "Pvc Coated Tarpaulin",
    category: "Premium",
    image: "/images/products/coated.jpg",
    description: "Nylon Double Side Pvc Coated material solutions",
    features: ["100% Waterproof", "Heavy Duty", "All Weather", "Long-lasting"],
    applications: ["Outdoor Storage", "Vehicle Cover", "Industrial"],
    badge: "Premium",
    specifications: {
      material: "PVC Coated Fabric",
      thickness: "300 GSM",
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
    specifications: {
      material: "HDPE",
      thickness: "250 GSM",
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
    specifications: {
      material: "PVC Coated Fabric",
      thickness: "500 GSM",
      color: "ALL",
      warranty: "2 Years"
    }
  },
  {
    id: 5,
    name: "White Tent Fabric Rolls (Blackout)",
    category: "Specialized",
    image: "/images/products/white.png",
    description: "High-stretch PVC fabric rolls and mechanical Tent materials.",
    features: ["Weatherproof", "Reinforced Edges", "Custom Sizes", "Heavy Duty"],
    applications: ["Tent Making", "Covers", "General Use"],
    badge: "Industrial",
    specifications: {
      material: "PVC Laminated Fabric",
      thickness: "400 GSM",
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
    specifications: {
      material: "Cotton Canvas",
      thickness: "350 GSM",
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
    specifications: {
      material: "Material name",
      thickness: "XXX GSM",
      color: "Color options",
      warranty: "X Years"
    }
  },
  */
];

/**
 * Get featured products for home page
 * You can customize which products appear on home page
 */
export const getFeaturedProducts = () => {
  // Returns first 3 products by default
  // Modify this logic to show specific products
  return products.slice(0, 3);
};

/**
 * Get product by ID
 */
export const getProductById = (id) => {
  return products.find(product => product.id === id);
};

/**
 * Get products by category
 */
export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

/**
 * Get all unique categories
 */
export const getCategories = () => {
  return [...new Set(products.map(product => product.category))];
};
