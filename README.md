# VisualizeAI

A modern web application for data visualization with a beautiful UI and interactive features. Built with Next.js 14, TailwindCSS, and ShadCN UI.

## Features

- 🎨 Modern UI with glassmorphism design
- ✨ Dynamic glowing cursor effect
- 📊 Support for Excel and CSV file uploads
- 📈 Multiple chart types (Bar, Line, Pie)
- 🌓 Dark and light theme support
- 📱 Responsive design
- 💾 Local storage for file history
- 🚀 Built with Next.js 14 and TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/visualizeai.git
cd visualizeai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- [Next.js 14](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [XLSX](https://github.com/SheetJS/sheetjs)
- [PapaParse](https://www.papaparse.com/)
- [Zustand](https://github.com/pmndrs/zustand)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── FileUploader.tsx
│   ├── GlowCursor.tsx
│   └── theme-provider.tsx
├── store/
│   └── useStore.ts
└── utils/
    └── fileParser.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
