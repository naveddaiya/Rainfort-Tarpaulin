# RainFort Tarpaulin - Industrial Design System

## Overview
A shadcn/ui based website for RainFort Tarpaulin with an industrial, rugged design aesthetic.

## 🎨 Color Scheme

### Primary Colors
- **Navy Blue** (`#1a4d7a`) - Main brand color
  - Used for primary buttons, headers, and key UI elements
  - Conveys strength, trust, and professionalism

- **Charcoal/Slate** (`#4b5563`) - Secondary color
  - Used for secondary elements and backgrounds
  - Provides industrial, solid feel

- **Safety Orange** (`#ff6b00`) - Accent color
  - Used for CTAs, highlights, and important actions
  - Draws attention and conveys urgency

- **Light Gray** (`#f5f6f7`) - Background (Light mode)
  - Clean, minimal background for readability

### Usage Guidelines
```jsx
// Primary action buttons
<Button variant="default">Primary Action</Button>

// Secondary buttons
<Button variant="secondary">Secondary</Button>

// Important CTAs
<Button variant="accent">Get Quote</Button>

// Outlined buttons
<Button variant="outline">Learn More</Button>
```

## 🧩 Components

### Button
Industrial-style buttons with:
- Bold, uppercase text
- 2px borders
- Subtle elevation on hover
- Active press state

**Variants:**
- `default` - Navy blue, primary actions
- `secondary` - Charcoal, secondary actions
- `accent` - Safety orange, CTAs
- `outline` - Border only, subtle actions
- `ghost` - Minimal, navigation

**Sizes:**
- `sm` - Small buttons (h-10)
- `default` - Standard buttons (h-12)
- `lg` - Large CTAs (h-14)

### Card
Heavy, solid cards with:
- Small border radius (`rounded-sm`)
- 2px borders
- Heavy shadow effect
- Border on header section

```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge
Industrial badges for labels:
- Bold uppercase text
- 2px borders
- Small border radius

```jsx
<Badge variant="default">Industrial</Badge>
<Badge variant="accent">Premium</Badge>
<Badge variant="outline">Featured</Badge>
```

## 🎯 Design Principles

### 1. Minimal Border Radius
- Use `rounded-sm` (0.25rem) for most elements
- Avoid rounded corners except for pills/badges
- Creates sharp, industrial aesthetic

### 2. Heavy Borders
- 2px borders on cards, buttons, inputs
- Creates solid, sturdy appearance
- Use `border-2` class

### 3. Industrial Shadows
- Custom `heavy-shadow` utility class
- Multiple shadow layers for depth
- Subtle inset highlights

### 4. Strong Typography
- Bold, uppercase headings
- Wide letter spacing (`tracking-wider`)
- Clear hierarchy with font weights

### 5. Functional Colors
- Navy: Trust and reliability
- Charcoal: Strength and durability
- Safety Orange: Action and urgency
- No playful or bright colors

## 🌓 Dark Mode

Toggle between light and dark themes:

```jsx
import { useTheme } from '@/components/theme-provider';

function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

### Color Adjustments
- Dark mode uses darker navy and charcoal backgrounds
- Maintains same accent colors for consistency
- Text colors automatically adjust for readability

## 📄 Page Structure

### Home
- Hero section with stats
- Feature cards grid
- CTA section

### Products
- Product catalog with cards
- Specifications grid
- Custom order section

### Applications
- Industry-specific use cases
- 6 main application categories
- Case study highlight

### About
- Company story
- Core values grid
- Timeline of milestones

### Contact
- Contact information cards
- Form with industrial styling
- Quick response section

## 🛠 Utility Classes

### Industrial Texture
```css
.industrial-texture {
  background-image:
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### Heavy Shadow
```css
.heavy-shadow {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
}
```

### Rugged Button
```css
.rugged-button {
  @apply font-bold uppercase tracking-wider border-2 px-6 py-3 text-sm
         transition-all duration-200 hover:translate-y-[-2px] active:translate-y-0
         heavy-shadow;
}
```

## 📱 Responsive Design

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Mobile-First Approach
All components are designed mobile-first and scale up for larger screens.

## 🚀 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📦 Tech Stack
- React 19
- Tailwind CSS
- shadcn/ui (custom styled)
- Lucide React (icons)
- Vite

## 🎨 Brand Traits
- Strong
- Industrial
- Weather-resistant
- Trustworthy
- Premium but rugged
- No playful or SaaS-style design
