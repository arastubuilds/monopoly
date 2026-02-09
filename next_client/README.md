# Capital City Landing Page

A modern Next.js landing page built with TypeScript and Tailwind CSS, featuring a playful Monopoly-inspired design.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Custom Google Fonts** (Fraunces, Inter, Fredoka)
- **Material Symbols** icons
- Fully responsive design
- Animated elements and hover effects
- Playful character mascots
- Glass morphism design elements

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
capital-city-landing/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with font configuration
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles and Tailwind directives
│   └── components/
│       ├── Header.tsx      # Navigation header
│       ├── Hero.tsx        # Main hero section
│       ├── Footer.tsx      # Footer component
│       └── Mascots.tsx     # Decorative character components
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Build for Production

```bash
npm run build
npm start
```

## Customization

### Colors

All custom colors are defined in `tailwind.config.ts`. You can modify the Monopoly-themed colors to match your brand.

### Fonts

Fonts are configured in `src/app/layout.tsx` using Next.js font optimization. The project uses:
- **Fraunces** for headings (serif)
- **Inter** for body text (sans-serif)
- **Fredoka** for display text

### Components

Each component is modular and can be easily customized:
- `Header.tsx` - Navigation and branding
- `Hero.tsx` - Main content area with CTA buttons
- `Mascots.tsx` - Decorative character illustrations
- `Footer.tsx` - Site footer with links

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
