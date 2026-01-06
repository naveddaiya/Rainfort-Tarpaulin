# RainFort Tarpaulin - Configuration Guide

## Overview
Your website now uses a centralized JSON configuration file (`config.json`) that allows you to easily update all content without touching the HTML code.

## Quick Start

### 1. Updating Content
Simply edit the `config.json` file to update any content on your website. The changes will automatically reflect when you reload the page.

### 2. File Structure
```
your-project/
├── index.html
├── styles.css
├── script.js
├── config.json          ← Edit this file to update content
├── config-loader.js     ← Don't modify (loads the config)
├── new.png             ← Your logo
└── other assets...
```

## Configuration Sections

### 1. Site Information
```json
"site": {
  "name": "RainFort Tarpaulin",
  "tagline": "Premium Tarpaulin",
  "title": "Page title for browser tab",
  "description": "SEO description",
  "keywords": "SEO keywords",
  "themeColor": "#2c9c93",
  "foundedYear": "2016"
}
```

### 2. Logo Paths
```json
"logo": {
  "main": "./new.png",              ← Main logo (navbar)
  "light": "./rainfort-light-logo.png",
  "dark": "./rainfort-dark-logo.png",
  "favicon": "./favicon.ico"
}
```

**Important for Cloudflare Pages:**
- Use relative paths starting with `./` for local files
- Example: `"./images/logo.png"` or `"./new.png"`

### 3. Contact Information
```json
"contact": {
  "phone": "+918385011488",
  "phoneDisplay": "+91 83850 11488",
  "email": "Sdtraders@gmail.com",
  "location": "Sujangarh, Rajasthan",
  "workingHours": "Mon - Sat: 8:00 AM - 8:00 PM"
}
```

### 4. Social Media Links
```json
"social": {
  "whatsapp": "https://wa.me/918385011488",
  "facebook": "https://facebook.com/yourpage",
  "instagram": "https://instagram.com/yourpage",
  "linkedin": "https://linkedin.com/company/yourpage"
}
```

### 5. Products
Each product has:
- `id`: Unique identifier
- `name`: Product name
- `description`: Short description
- `image`: Image URL or relative path

```json
{
  "id": "pvc-truck-covers",
  "name": "PVC Truck Covers",
  "description": "Heavy-duty waterproof covers",
  "image": "./images/product1.jpg"  ← Use relative path
}
```

### 6. Team Members
```json
"team": {
  "marketingExecutive": {
    "name": "Mr Sarfaraz Daiya",
    "title": "Marketing Executive"
  }
}
```

### 7. Testimonials
```json
{
  "id": 1,
  "name": "Customer Name",
  "role": "Customer",
  "text": "Testimonial text here",
  "rating": 5
}
```

## Image Management for Cloudflare Pages

### Option 1: Using Relative Paths (Recommended)
Upload images to your project and use relative paths:

```json
"logo": {
  "main": "./assets/logo.png"
}
```

**Folder Structure:**
```
your-project/
├── assets/
│   ├── logo.png
│   ├── products/
│   │   ├── product1.jpg
│   │   └── product2.jpg
│   └── about/
│       └── team.jpg
├── index.html
└── config.json
```

### Option 2: Using Cloudflare Images
If you want to use Cloudflare Images CDN:

1. Upload images to Cloudflare Images
2. Get the delivery URL (e.g., `https://imagedelivery.net/your-account-hash/image-id/public`)
3. Update `config.json`:

```json
"logo": {
  "main": "https://imagedelivery.net/your-hash/logo-id/public"
}
```

### Option 3: External URLs
You can also use external image hosting:

```json
"image": "https://your-cdn.com/image.jpg"
```

## Common Updates

### Changing Logo
1. Upload your new logo to the project folder
2. Update `config.json`:
```json
"logo": {
  "main": "./my-new-logo.png"
}
```

### Adding a New Product
Add to the `products.items` array:
```json
{
  "id": "new-product",
  "name": "New Product Name",
  "description": "Product description",
  "image": "./images/new-product.jpg"
}
```

### Updating Contact Info
```json
"contact": {
  "phone": "+91XXXXXXXXXX",
  "email": "newemail@example.com"
}
```

### Adding/Editing Testimonials
```json
{
  "id": 3,
  "name": "New Customer",
  "role": "Business Owner",
  "text": "Great service and products!",
  "rating": 5
}
```

## Deployment to Cloudflare Pages

### Step 1: Prepare Your Files
1. Make sure all image paths in `config.json` are correct
2. Test locally by opening `index.html` in a browser

### Step 2: Upload to Cloudflare Pages
1. Go to Cloudflare Dashboard
2. Select "Pages"
3. Click "Create a project"
4. Upload your entire project folder OR connect your Git repository
5. Deploy!

### Step 3: After Deployment
Your site will be live at: `https://your-project.pages.dev`

To update content:
1. Edit `config.json`
2. Commit and push (if using Git) OR re-upload via dashboard
3. Cloudflare will automatically rebuild

## Tips & Best Practices

### 1. Image Optimization
- Compress images before uploading (use tools like TinyPNG)
- Use WebP format when possible
- Keep images under 500KB for faster loading

### 2. Relative Paths
Always use relative paths for local files:
- ✅ Good: `"./images/logo.png"`
- ✅ Good: `"./logo.png"`
- ❌ Bad: `"/images/logo.png"` (might not work)
- ❌ Bad: `"C:/Users/...logo.png"` (will NOT work)

### 3. Testing Locally
Before deploying:
1. Open `index.html` in your browser
2. Open browser console (F12)
3. Check for any errors
4. Verify all images load correctly

### 4. JSON Validation
Make sure your JSON is valid:
- Use a JSON validator: https://jsonlint.com/
- Common mistakes:
  - Missing commas
  - Extra commas at the end
  - Unescaped quotes in text

### 5. Caching
If changes don't appear immediately:
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Wait a few minutes for Cloudflare to update

## Troubleshooting

### Images Not Loading
1. Check the path in `config.json` is correct
2. Ensure the image file exists in that location
3. Check file name case (Windows is case-insensitive, but servers are case-sensitive)
   - ✅ `logo.png` matches `logo.png`
   - ❌ `Logo.PNG` doesn't match `logo.png` on server

### Content Not Updating
1. Check browser console for JavaScript errors
2. Validate your JSON at jsonlint.com
3. Hard refresh the page
4. Check that `config-loader.js` is loaded in `index.html`

### White Screen / Blank Page
1. Open browser console (F12)
2. Look for errors
3. Most likely a JSON syntax error in `config.json`

## Support

For issues or questions:
- Check browser console for errors (F12)
- Validate JSON at jsonlint.com
- Ensure all file paths are correct
- Test locally before deploying

## Example: Complete Update Workflow

Let's say you want to:
1. Update the logo
2. Change contact phone number
3. Add a new product

**Step 1:** Upload new logo
```
Save new-logo.png to project folder
```

**Step 2:** Edit config.json
```json
{
  "logo": {
    "main": "./new-logo.png"  // Updated
  },
  "contact": {
    "phone": "+919876543210",  // Updated
    "phoneDisplay": "+91 98765 43210"  // Updated
  },
  "products": {
    "items": [
      // ... existing products ...
      {
        "id": "new-product",
        "name": "New Product",
        "description": "Description here",
        "image": "./images/new-product.jpg"
      }
    ]
  }
}
```

**Step 3:** Test locally
- Open index.html in browser
- Check if logo updated
- Check if phone number updated
- Check if new product appears

**Step 4:** Deploy
- Upload to Cloudflare Pages
- Verify live site

Done! 🎉
