# Lumina Studio - Quick Start Guide

Get Lumina Studio running in 3 simple steps for your demo video!

---

## 🚀 Quick Start (3 Steps)

### Step 1: Open Terminal
Open a terminal in the project directory:
```bash
cd /home/paul/Documents/julyhackathon
```

### Step 2: Run the Startup Script
```bash
./start.sh
```

Or manually:
```bash
npm run dev
```

### Step 3: Open Your Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

**That's it! The app is now running with mock AI mode enabled.**

---

## 🎬 Creating Your Demo Video

### What to Show

**1. Story Generator (📝)**
- Click "Story Architect" button
- Enter a prompt: "A space explorer discovers an ancient alien artifact"
- Select genre: "Science Fiction"
- Click "Generate Story"
- Show the generated story
- Click "✨ Enhance" to improve it
- Click "💡 Get Suggestions" for ideas
- Click "📤 Export" to download

**2. Visual Concepts (🎨)**
- Click "Visual Concepts" button
- Enter prompt: "A futuristic cyberpunk city at night with neon lights"
- Select style: "Cinematic"
- Select mood: "Dramatic"
- Click "Generate Visual Concept"
- Show the color palette
- Show composition details
- Show lighting specifications

**3. Scene Builder (🎬)**
- Click "Scene Builder" button
- Enter prompt: "A tense negotiation in a dimly lit warehouse"
- Select scene type: "Interactive"
- Click "Generate Scene"
- Show scene elements
- Show branching paths
- Show interactivity options

**4. Collaboration Hub (🤝)**
- Click "Collaborate" button
- Create a session: "My Creative Project"
- Enter your name
- Click "Create Session"
- Type some content in the workspace
- Click "💾 Save Changes"
- Click "🧠 Get Ideas" for brainstorming

---

## ✅ Verification Checklist

Before recording, verify:
- [ ] Both servers are running (check terminal output)
- [ ] Frontend loads at http://localhost:5173
- [ ] API responds at http://localhost:3000/api/health
- [ ] Story generation works
- [ ] Visual concepts generate
- [ ] Scene builder works
- [ ] Collaboration hub functions

---

## 🐛 Troubleshooting

### "Nothing happens when I click Generate"

**Solution 1: Check if servers are running**
```bash
# You should see both:
# - Vite dev server on port 5173
# - Express API on port 3000
```

**Solution 2: Check browser console**
- Press F12 to open developer tools
- Look for any red errors
- Most common: API not running

**Solution 3: Restart everything**
```bash
# Stop servers (Ctrl+C)
# Then restart:
./start.sh
```

### "Port already in use"

```bash
# Kill processes on ports
killall node
# Then restart
./start.sh
```

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
./start.sh
```

---

## 📹 Demo Video Tips

### Recording Setup
1. **Screen Resolution**: 1920x1080 recommended
2. **Browser**: Use Chrome or Firefox
3. **Zoom**: Set browser zoom to 100%
4. **Close Tabs**: Close unnecessary browser tabs
5. **Disable Notifications**: Turn off system notifications

### What to Record

**Introduction (15 seconds)**
- Show the homepage
- Highlight the tagline: "Where Ideas Illuminate Reality"
- Mention it's built with IBM Bob

**Feature Demos (2 minutes)**
- Story Generator: 30 seconds
- Visual Concepts: 30 seconds
- Scene Builder: 30 seconds
- Collaboration: 30 seconds

**Conclusion (15 seconds)**
- Show the GitHub repository
- Mention key technologies (IBM Bob, watsonx, Node.js)
- End with the live demo link

### Script Example

```
"Welcome to Lumina Studio - an AI-powered creative platform built entirely 
with IBM Bob for the July 2026 AI Builders Challenge.

[Show Story Generator]
Let's generate a science fiction story. I'll enter a prompt about a space 
explorer... and click generate. Within seconds, we have a complete narrative 
with AI-powered suggestions for improvement.

[Show Visual Concepts]
Now let's create visual concepts. I'll describe a cyberpunk city... and 
generate. We get detailed color palettes, composition guidelines, and 
lighting specifications.

[Show Scene Builder]
The scene builder creates interactive experiences with branching narratives 
and dynamic elements.

[Show Collaboration]
And teams can collaborate in real-time with AI-powered brainstorming.

Lumina Studio demonstrates how AI can transform creative workflows. 
Built with IBM Bob, watsonx, and modern web technologies. 
Check out the live demo and source code on GitHub."
```

---

## 🎥 Recording Tools

**Free Options:**
- **OBS Studio** (Windows/Mac/Linux) - Professional, free
- **SimpleScreenRecorder** (Linux) - Easy to use
- **QuickTime** (Mac) - Built-in, simple
- **Xbox Game Bar** (Windows) - Built-in (Win+G)

**Online Options:**
- **Loom** - Easy browser recording
- **Screencast-O-Matic** - Simple and free

---

## 📊 Demo Checklist

Before you start recording:

- [ ] Servers are running (`./start.sh`)
- [ ] Browser is open to http://localhost:5173
- [ ] Screen recording software is ready
- [ ] Audio is working (if narrating)
- [ ] Browser is at 100% zoom
- [ ] Unnecessary tabs/windows closed
- [ ] Notifications disabled
- [ ] Script prepared (if using one)

During recording:
- [ ] Show homepage and features
- [ ] Demonstrate Story Generator
- [ ] Demonstrate Visual Concepts
- [ ] Demonstrate Scene Builder
- [ ] Demonstrate Collaboration Hub
- [ ] Show smooth transitions
- [ ] Keep it under 3 minutes

After recording:
- [ ] Review the video
- [ ] Check audio quality
- [ ] Verify all features shown
- [ ] Export in good quality (1080p)
- [ ] Upload to YouTube/Vimeo
- [ ] Make it public
- [ ] Add link to README

---

## 🔗 After Recording

1. **Upload Video**
   - YouTube (recommended)
   - Vimeo
   - Google Drive (make public)

2. **Update README**
   - Add video link to README.md
   - Update GitHub Pages with video

3. **Test the Link**
   - Verify video is publicly accessible
   - Check it plays correctly

---

## 💡 Pro Tips

1. **Practice First**: Do a test run before recording
2. **Keep It Short**: Aim for 2-3 minutes maximum
3. **Show, Don't Tell**: Let the features speak
4. **Smooth Transitions**: Plan your clicks
5. **Good Lighting**: If showing yourself
6. **Clear Audio**: If narrating
7. **Professional**: Keep it focused and polished

---

## 📞 Need Help?

If you encounter issues:
1. Check the terminal for error messages
2. Review the browser console (F12)
3. Restart the servers
4. Check SETUP.md for detailed troubleshooting

---

**Ready to create an amazing demo! 🎬✨**