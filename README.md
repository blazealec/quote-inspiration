# Quote Inspiration - Farcaster Mini App

A beautiful quote generator mini app for Farcaster that displays inspirational quotes with aesthetic backgrounds. Share your favorite quotes directly to Farcaster!

## Try it now!

Use the official Warpcast mini app link: [https://warpcast.com/miniapps/DiW2u0T_OXr3/quote-inspiration](https://warpcast.com/miniapps/DiW2u0T_OXr3/quote-inspiration)

## Features

- 🎯 Random inspirational quotes from a curated API
- 🖼️ Beautiful dynamic backgrounds that change with each quote
- 🌟 Modern, glassmorphic UI design
- 📱 Fully responsive layout
- 🔄 Smooth transitions and animations
- 📢 Direct sharing to Farcaster with quote images
- 🧩 Fully interactive Farcaster Frame support
- 📌 One-click add to Warpcast

## Tech Stack

- React + TypeScript
- Vite
- Emotion (Styled Components)
- Farcaster Frame SDK
- Axios
- Satori + resvg-js for image generation

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

## Farcaster Frame Support

This app implements the Farcaster Frame protocol, allowing users to:

- View beautiful quotes with images when shared on Farcaster
- Get new quotes by clicking the refresh button
- Add the app to Warpcast with a single click
- Share quotes to their feed with proper attribution

### Frame Implementation

The app uses a serverless API endpoint to handle Frame requests:

- `/api/frame` - Handles the Frame protocol requests
- `/api/quote-image` - Generates beautiful quote images dynamically

## Contributing

Feel free to open issues and pull requests!

## `farcaster.json`

The `/.well-known/farcaster.json` is served from the [public
directory](https://vite.dev/guide/assets) and can be updated by editing
`./public/.well-known/farcaster.json`.

You can also use the `public` directory to serve a static image for `splashBackgroundImageUrl`.

## Frame Embed

The app includes Frame metadata in `index.html` to make your root app URL sharable in feeds:

```html
<meta name="fc:frame" content='{"version":"vNext","imageUrl":"https://quote-inspiration.vercel.app/api/frame","buttons":[{"label":"🔄 New Quote","action":"post"},{"label":"➕ Add App","action":"post"},{"label":"📢 Share","action":"post"}],"postUrl":"https://quote-inspiration.vercel.app/api/frame"}' />
```
