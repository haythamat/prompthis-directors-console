# PROMPTHIS - Director's Console v6.2

A professional AI video/image prompt generator for creating detailed technical prompts for models like Sora, Runway Gen-3, Midjourney, DALL-E 3, and more.

## Features

- **Builder Mode**: Comprehensive form-based prompt creation with controls for:
  - Set & Atmosphere (location, scene, time, weather)
  - Camera & Optics (framing, lens, movement, ISO, aperture, etc.)
  - Cast & Action (characters, demographics, wardrobe, expressions)
  - Cinematography & Physics (lighting, tone, motion, wind)
  - Post & Technical (visual style, color grading, film stock)

- **Magic Writer Mode**: AI-powered prompt enhancement (requires API key configuration)

- **Multiple Model Support**:
  - Video: Sora, Runway Gen-3, Flow, JSON Style
  - Image: Midjourney v6, DALL-E 3, Gemini

- **Output Formats**: Narrative prompts, Midjourney commands, or structured JSON

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React Icons

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy
vercel
```

### Option 2: GitHub Integration

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite and configure the build settings
6. Click "Deploy"

### Option 3: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository or upload the project folder
4. Vercel will automatically detect Vite configuration
5. Click "Deploy"

## Configuration

The app is pre-configured for Vercel deployment. The `vercel.json` file specifies:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: `vite`

## API Key Configuration (Magic Writer)

The Magic Writer feature uses Google Gemini API through a secure backend proxy. The API key is stored securely as an environment variable and never exposed to the client.

### Setting up the API Key in Vercel

1. **Get your Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Add to Vercel Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add a new variable:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: Your Gemini API key
     - **Environment**: Production, Preview, and Development (select all)
   - Click **Save**

3. **Redeploy** (if already deployed):
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

### How It Works

- The API key is stored securely in Vercel's environment variables
- Client requests go to `/api/generate-prompt` (Vercel serverless function)
- The serverless function securely calls Gemini API with the key
- The API key is never exposed to the browser or client-side code

### Local Development

For local development, create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_api_key_here
```

**Note**: `.env.local` is already in `.gitignore` and will not be committed to Git.

## License

Created by Bashar Alasaad

