# Lumina Studio - Setup Guide

Complete setup instructions for running Lumina Studio locally.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16.x or higher ([Download](https://nodejs.org/))
- **npm** 7.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Optional:
- **IBM watsonx API credentials** (for full AI functionality)
- **OpenAI API key** (alternative AI provider)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/paulmmoore3416/lumina-studio.git
cd lumina-studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your preferred settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# AI Configuration (Optional - works in mock mode without these)
WATSONX_API_KEY=your_key_here
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Enable mock mode for demo (default: true)
ENABLE_MOCK_MODE=true
```

### 4. Start Development Server

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### 5. Open in Browser

Navigate to http://localhost:5173 to see Lumina Studio in action!

---

## Detailed Setup

### Environment Variables Explained

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `WATSONX_API_KEY` | IBM watsonx API key | No | - |
| `WATSONX_PROJECT_ID` | watsonx project ID | No | - |
| `WATSONX_URL` | watsonx API endpoint | No | https://us-south.ml.cloud.ibm.com |
| `OPENAI_API_KEY` | OpenAI API key (alternative) | No | - |
| `ANTHROPIC_API_KEY` | Anthropic API key (alternative) | No | - |
| `ENABLE_MOCK_MODE` | Use mock AI responses | No | true |
| `CORS_ORIGIN` | CORS allowed origin | No | http://localhost:5173 |

### Mock Mode vs. Real AI

**Mock Mode (Default)**
- No API keys required
- Instant responses
- Pre-defined creative content
- Perfect for demos and development

**Real AI Mode**
- Requires API credentials
- Dynamic AI-generated content
- More varied and creative outputs
- Production-ready

To enable real AI:
1. Set `ENABLE_MOCK_MODE=false` in `.env`
2. Add your API credentials
3. Restart the server

---

## Development Workflow

### Running the Application

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Build**:
```bash
npm run build
npm run preview
```

**Server Only**:
```bash
npm run server
```

**Client Only**:
```bash
npm run client
```

### Project Structure

```
lumina-studio/
├── server/              # Backend API
│   ├── index.js        # Express server
│   ├── routes/         # API endpoints
│   └── services/       # Business logic
├── src/                # Frontend application
│   ├── main.js         # Entry point
│   ├── modules/        # Feature modules
│   └── styles/         # CSS styles
├── docs/               # Documentation & GitHub Pages
├── dist/               # Production build output
└── package.json        # Dependencies
```

---

## Testing

### Manual Testing Checklist

**Story Generator:**
- [ ] Generate story with different genres
- [ ] Enhance existing content
- [ ] Get AI suggestions
- [ ] Export story to Markdown

**Visual Concepts:**
- [ ] Generate visual concept
- [ ] Try different styles and moods
- [ ] View color palettes
- [ ] Export visual guidelines

**Scene Builder:**
- [ ] Create interactive scene
- [ ] Review scene elements
- [ ] Check branching paths
- [ ] Export scene specification

**Collaboration Hub:**
- [ ] Create new session
- [ ] Save content
- [ ] Get brainstorming ideas
- [ ] View activity log

### API Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:3000/api/health

# Generate story
curl -X POST http://localhost:3000/api/story/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A space adventure","genre":"scifi"}'

# Generate visual concept
curl -X POST http://localhost:3000/api/visual/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Futuristic city","style":"cinematic"}'
```

---

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Change port in .env
PORT=3001
```

**Dependencies Not Installing**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Build Errors**
```bash
# Ensure Node.js version is 16+
node --version

# Update npm
npm install -g npm@latest
```

**API Not Responding**
- Check if server is running on correct port
- Verify CORS settings in `.env`
- Check browser console for errors

**Mock Mode Not Working**
- Ensure `ENABLE_MOCK_MODE=true` in `.env`
- Restart the server after changing `.env`

---

## Production Deployment

### Building for Production

```bash
# Create production build
npm run build

# Test production build locally
npm run preview
```

### Deployment Options

**Option 1: Traditional Hosting**
1. Build the project: `npm run build`
2. Upload `dist/` folder to your hosting
3. Configure server to serve `index.html` for all routes

**Option 2: Node.js Hosting (Heroku, Railway, etc.)**
1. Push code to hosting platform
2. Set environment variables
3. Platform will run `npm install` and `npm start`

**Option 3: Serverless (Vercel, Netlify)**
1. Connect GitHub repository
2. Configure build command: `npm run build`
3. Set output directory: `dist`

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
ENABLE_MOCK_MODE=false
WATSONX_API_KEY=your_production_key
CORS_ORIGIN=https://yourdomain.com
```

---

## Getting IBM watsonx Credentials

1. Visit [IBM Cloud](https://cloud.ibm.com/registration?utm_content=academicsb)
2. Create an account or sign in
3. Navigate to watsonx.ai
4. Create a new project
5. Get your API key and project ID
6. Add to `.env` file

---

## Additional Resources

- **GitHub Repository**: https://github.com/paulmmoore3416/lumina-studio
- **Live Demo**: https://paulmmoore3416.github.io/lumina-studio/
- **API Documentation**: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- **IBM Bob Usage**: [docs/IBM_BOB_USAGE.md](docs/IBM_BOB_USAGE.md)

---

## Support

If you encounter issues:

1. Check this setup guide
2. Review [README.md](README.md)
3. Check [GitHub Issues](https://github.com/paulmmoore3416/lumina-studio/issues)
4. Contact: paulmmoore3416@gmail.com

---

## Next Steps

After setup:

1. ✅ Explore the Story Generator
2. ✅ Try Visual Concepts
3. ✅ Build Interactive Scenes
4. ✅ Test Collaboration Features
5. ✅ Read the full documentation
6. ✅ Customize for your needs

---

**Happy Creating with Lumina Studio! ✨**