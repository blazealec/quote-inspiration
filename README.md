# Quote Inspiration - Farcaster Mini App

A beautiful quote generator mini app for Farcaster that displays inspirational quotes with aesthetic backgrounds. Share your favorite quotes directly to Farcaster!

## Features

- 🎯 Random inspirational quotes from a curated API
- 🖼️ Beautiful dynamic backgrounds that change with each quote
- 🌟 Modern, glassmorphic UI design
- 📱 Fully responsive layout
- 🔄 Smooth transitions and animations
- 📢 Direct sharing to Farcaster

## Tech Stack

- React + TypeScript
- Vite
- Emotion (Styled Components)
- Farcaster Frame SDK
- Axios

## Getting Started

1. Clone the repository
```bash
git clone [your-repo-url]
cd inspiration
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Contributing

Feel free to open issues and pull requests!

## `farcaster.json`

The `/.well-known/farcaster.json` is served from the [public
directory](https://vite.dev/guide/assets) and can be updated by editing
`./public/.well-known/farcaster.json`.

You can also use the `public` directory to serve a static image for `splashBackgroundImageUrl`.

## Frame Embed

Add a the `fc:frame` in `index.html` to make your root app URL sharable in feeds:

```html
  <head>
    <!--- other tags --->
    <meta name="fc:frame" content='{"version":"next","imageUrl":"https://placehold.co/900x600.png?text=Frame%20Image","button":{"title":"Open","action":{"type":"launch_frame","name":"App Name","url":"https://app.com"}}}' /> 
  </head>
```
