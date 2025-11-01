# Logo System Documentation

## Overview
This project uses a centralized logo system that allows you to easily manage logos across all components from a single configuration file.

## Files Structure
```
src/
├── config/
│   └── logoConfig.js          # Main configuration file
├── components/
│   └── Logo.js               # Reusable Logo component
└── styles/
    └── logo.css              # CSS styles for all logo variants
```

## Quick Usage

### 1. Using the Logo Component
Import and use the Logo component in any React component:

```jsx
import Logo from "./Logo";

// Different variants
<Logo variant="navbar" type="image" theme="dark" />     // For navbar
<Logo variant="auth" type="image" theme="dark" />       // For login/register
<Logo variant="dashboard" type="image" theme="dark" />  // For dashboard
<Logo variant="small" type="image" theme="dark" />      // Small size
<Logo variant="icon" type="image" theme="dark" />       // Icon only

// Text logo
<Logo type="text" />
```

### 2. Available Variants
- `navbar` - Large logo for homepage navbar (180px)
- `auth` - Medium logo for login/register pages (120px) 
- `dashboard` - Logo for dashboard sidebar (140px)
- `small` - Small logo for general use (100px)
- `icon` - Icon-only size (40px)

### 3. Configuration
Edit `src/config/logoConfig.js` to change:
- Logo image paths
- Text logo settings
- Size presets
- Alt text

### 4. Global Changes
To change the logo across all pages:
1. Replace the image file in `/public/` folder
2. Update the path in `logoConfig.js`
3. All components using the Logo component will automatically update

### 5. Page-Specific Logos
If you want different logos for different page types:
1. Add new image paths to `logoConfig.js`
2. Use the `theme` prop: `theme="light"` or `theme="dark"`

## Example: Adding a New Logo Variant
1. Add to `logoConfig.js`:
```js
sizes: {
  // existing sizes...
  header: "200px"  // new size
}
```

2. Add CSS class to `logo.css`:
```css
.logo-header {
  width: 200px;
  height: auto;
  object-fit: contain;
}
```

3. Update Logo component to support the new variant.

## Benefits
- ✅ Change logos once, update everywhere
- ✅ Consistent sizing across components  
- ✅ Easy to maintain and modify
- ✅ Responsive design built-in
- ✅ Accessibility support with alt text
