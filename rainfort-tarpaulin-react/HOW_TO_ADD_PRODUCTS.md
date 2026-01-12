# How to Add/Manage Products

This guide will show you how to easily add, edit, or remove products from your website.

## 📁 File Structure

```
rainfort-tarpaulin-react/
├── public/
│   └── images/
│       └── products/           # Put your product images here
│           ├── hdpe-black.jpg
│           ├── american-waterproof.jpg
│           └── ... (your images)
├── src/
│   └── data/
│       └── products.js         # Edit this file to manage products
```

## 🖼️ Step 1: Add Product Images

1. **Prepare your images:**
   - Recommended size: 800x600 pixels or similar aspect ratio
   - Format: JPG or PNG
   - File size: Keep under 500KB for fast loading
   - Name format: Use descriptive names like `hdpe-black-tarpaulin.jpg`

2. **Add images to the project:**
   - Place your product images in: `/public/images/products/`
   - Create the folder if it doesn't exist:
     ```
     public/
       └── images/
           └── products/
     ```

3. **Example image names:**
   ```
   hdpe-black.jpg
   american-waterproof.jpg
   pond-liner.jpg
   biofloc-tank.jpg
   truck-cover.jpg
   canvas-tarp.jpg
   ```

## ➕ Step 2: Add a New Product

1. **Open the products file:**
   - Navigate to: `src/data/products.js`

2. **Copy this template and add to the products array:**

```javascript
{
  id: 7, // Use next available number
  name: "Your Product Name",
  category: "Category Name", // e.g., "Premium", "Industrial", etc.
  image: "/images/products/your-image.jpg", // Path to your image
  price: "₹200/sq.m", // Optional: Remove if you don't want to show price
  description: "Brief description of your product in 1-2 sentences",
  features: [
    "Key Feature 1",
    "Key Feature 2",
    "Key Feature 3",
    "Key Feature 4"
  ],
  applications: [
    "Use Case 1",
    "Use Case 2",
    "Use Case 3"
  ],
  badge: "New", // Options: "Popular", "Premium", "New", "Featured", etc.
  specifications: {
    material: "Material name (e.g., HDPE, PVC)",
    thickness: "XXX GSM",
    color: "Available colors",
    warranty: "1 Year"
  }
},
```

3. **Example of adding a new product:**

```javascript
export const products = [
  // ... existing products ...

  // Add your new product here:
  {
    id: 7,
    name: "Heavy Duty PVC Covers",
    category: "Industrial",
    image: "/images/products/heavy-duty-pvc.jpg",
    price: "₹280/sq.m",
    description: "Extra heavy-duty PVC covers designed for extreme industrial applications.",
    features: [
      "Extra Thick 600 GSM",
      "Fire Resistant",
      "Chemical Proof",
      "UV Protected"
    ],
    applications: [
      "Industrial Sites",
      "Chemical Plants",
      "Mining"
    ],
    badge: "Premium",
    specifications: {
      material: "Heavy Duty PVC",
      thickness: "600 GSM",
      color: "Green/Black",
      warranty: "3 Years"
    }
  },
];
```

## ✏️ Step 3: Edit an Existing Product

1. Find the product by ID in `src/data/products.js`
2. Modify any field you want:
   - Change the name
   - Update price
   - Add/remove features
   - Change the image path
   - Update description

**Example:**
```javascript
{
  id: 1,
  name: "HDPE Black Tarpaulin - Updated!", // Changed
  price: "₹160/sq.m", // Updated price
  // ... rest of the fields
}
```

## 🗑️ Step 4: Remove a Product

Simply delete or comment out the entire product object from the array:

```javascript
// Remove this product by commenting it out:
/*
{
  id: 6,
  name: "Product to Remove",
  ...
},
*/
```

## 🎨 Customization Options

### Change Featured Products on Home Page

By default, the home page shows the first 3 products. To customize this:

**Option 1: Show specific products by ID**
```javascript
export const getFeaturedProducts = () => {
  // Show products with ID 1, 3, and 5
  return products.filter(p => [1, 3, 5].includes(p.id));
};
```

**Option 2: Show products with specific badge**
```javascript
export const getFeaturedProducts = () => {
  // Show all products marked as "Popular"
  return products.filter(p => p.badge === "Popular");
};
```

**Option 3: Show more products**
```javascript
export const getFeaturedProducts = () => {
  // Show first 6 products instead of 3
  return products.slice(0, 6);
};
```

### Create Custom Categories

Categories are automatically generated from your products. To organize better:

1. Use consistent category names across products
2. Common categories:
   - "General Purpose"
   - "Premium"
   - "Industrial"
   - "Specialized"
   - "Transportation"
   - "Agriculture"

### Badge Options

Use these badge values for different product types:
- `"Popular"` - Best selling items
- `"Premium"` - High-end products
- `"New"` - Newly added items
- `"Featured"` - Highlighted products
- `"Sale"` - Discounted items
- `"Advanced"` - Technical/specialized products

## 🔄 See Your Changes

1. Save the `products.js` file
2. The website will automatically reload (if dev server is running)
3. Check the Home page and Products page to see your changes

## 💡 Tips & Best Practices

### Images
- ✅ Use high-quality, well-lit product photos
- ✅ Keep consistent aspect ratio across all products
- ✅ Compress images before uploading (use tools like TinyPNG)
- ✅ Use descriptive file names
- ❌ Don't use spaces in image filenames
- ❌ Don't use very large images (>1MB)

### Product Information
- ✅ Keep descriptions concise (1-2 sentences)
- ✅ List 3-4 key features maximum
- ✅ Use clear, benefit-focused feature descriptions
- ✅ Be consistent with units (GSM, sq.m, etc.)
- ❌ Don't write long paragraphs in features
- ❌ Don't use technical jargon customers won't understand

### Pricing
- ✅ Format: `₹XXX/sq.m` or `₹XXX/piece`
- ✅ You can omit the price field if you prefer "Request Quote"
- ✅ Update prices regularly

## 🐛 Troubleshooting

### Image Not Showing?
1. Check the file path is correct: `/images/products/your-image.jpg`
2. Verify the image exists in `public/images/products/`
3. Check the filename matches exactly (case-sensitive)
4. Make sure the image format is supported (JPG, PNG, WebP)
5. Clear browser cache and refresh

### Product Not Appearing?
1. Check you saved the `products.js` file
2. Verify there are no syntax errors (commas, brackets)
3. Make sure each product has a unique `id`
4. Check the browser console for errors (F12)

### Category Filter Not Working?
1. Ensure category names are spelled consistently
2. Category names are case-sensitive
3. Check for extra spaces in category names

## 📝 Quick Reference

### Minimum Required Fields
```javascript
{
  id: 1,                    // Required: Unique number
  name: "Product Name",     // Required: Product title
  category: "Category",     // Required: Product category
  image: "/images/...",     // Required: Image path
  description: "...",       // Required: Short description
  features: ["..."],        // Required: Array of features
  applications: ["..."],    // Required: Array of use cases
  badge: "Popular"         // Optional: Badge text
}
```

### Full Example Product
```javascript
{
  id: 8,
  name: "Waterproof Canvas Sheet",
  category: "Premium",
  image: "/images/products/waterproof-canvas.jpg",
  price: "₹190/sq.m",
  description: "Premium waterproof canvas combining natural material with modern coating technology.",
  features: [
    "Water Resistant Coating",
    "Breathable Fabric",
    "Tear Resistant",
    "UV Protected"
  ],
  applications: [
    "Outdoor Events",
    "Camping",
    "Storage Covers"
  ],
  badge: "Premium",
  specifications: {
    material: "Coated Canvas",
    thickness: "400 GSM",
    color: "Beige/Brown",
    warranty: "2 Years"
  }
}
```

## 🚀 Need Help?

If you encounter any issues:
1. Check the browser console for errors (Press F12)
2. Verify your JSON syntax is correct
3. Make sure all quotes and commas are in place
4. Test with a simple product first

---

**Remember:** After making changes, always:
1. ✅ Save the file
2. ✅ Check the website reloads
3. ✅ Test on both Home and Products pages
4. ✅ Verify images load correctly
5. ✅ Check mobile responsiveness
