# Lumina Studio API Documentation

Complete API reference for Lumina Studio backend services.

---

## Base URL

```
http://localhost:3000/api
```

---

## Authentication

Currently, the API does not require authentication. Future versions will implement API key authentication.

---

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

### Error Response
```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

## Health Check

### Check API Status

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-07-01T12:00:00.000Z",
  "service": "Lumina Studio API",
  "version": "1.0.0"
}
```

---

## Story Generation

### Generate Story

Generate a new story based on a prompt and parameters.

```http
POST /api/story/generate
```

**Request Body:**
```json
{
  "prompt": "A young inventor discovers a portal to another dimension",
  "genre": "fantasy",
  "tone": "adventurous",
  "length": "medium",
  "style": "narrative"
}
```

**Parameters:**

| Field | Type | Required | Description | Options |
|-------|------|----------|-------------|---------|
| prompt | string | Yes | Story description | Any text |
| genre | string | No | Story genre | fantasy, scifi, mystery, romance, thriller |
| tone | string | No | Story tone | adventurous, dark, lighthearted, dramatic, mysterious |
| length | string | No | Story length | short, medium, long |
| style | string | No | Writing style | narrative, descriptive, dialogue-heavy |

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "In a realm where magic intertwines with reality...",
    "metadata": {
      "genre": "fantasy",
      "tone": "adventurous",
      "wordCount": 245,
      "generatedAt": "2024-07-01T12:00:00.000Z",
      "model": "mock-creative-engine-v1"
    },
    "suggestions": [
      "Consider adding more sensory details",
      "Develop the character motivations further"
    ]
  },
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Enhance Story

Enhance existing story content with AI improvements.

```http
POST /api/story/enhance
```

**Request Body:**
```json
{
  "content": "The hero walked into the dark forest...",
  "enhancementType": "general"
}
```

**Parameters:**

| Field | Type | Required | Description | Options |
|-------|------|----------|-------------|---------|
| content | string | Yes | Story content to enhance | Any text |
| enhancementType | string | No | Type of enhancement | general, dialogue, description, pacing |

**Response:**
```json
{
  "success": true,
  "data": {
    "improved": "Enhanced story content...",
    "changes": [
      "Added sensory details",
      "Improved pacing",
      "Strengthened transitions"
    ]
  },
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Get Story Suggestions

Get AI-powered creative suggestions for story development.

```http
POST /api/story/suggestions
```

**Request Body:**
```json
{
  "context": "Current story context...",
  "count": 3
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| context | string | No | Story context for suggestions |
| count | number | No | Number of suggestions (default: 3) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "suggestion-1234567890-0",
      "text": "What if the protagonist discovers a hidden truth?",
      "type": "plot",
      "confidence": 0.85
    }
  ],
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Get Story Templates

Retrieve available story structure templates.

```http
GET /api/story/templates
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "hero-journey",
      "name": "Hero's Journey",
      "description": "Classic narrative structure",
      "genre": "fantasy",
      "structure": ["Ordinary World", "Call to Adventure", "Trials"]
    }
  ],
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

## Visual Concepts

### Generate Visual Concept

Create a detailed visual concept with color palettes and composition.

```http
POST /api/visual/generate
```

**Request Body:**
```json
{
  "prompt": "A futuristic cityscape at sunset with neon lights",
  "style": "cinematic",
  "mood": "dramatic",
  "colorPalette": "vibrant",
  "composition": "balanced"
}
```

**Parameters:**

| Field | Type | Required | Description | Options |
|-------|------|----------|-------------|---------|
| prompt | string | Yes | Visual description | Any text |
| style | string | No | Visual style | cinematic, minimalist, surreal, photorealistic, abstract, vintage |
| mood | string | No | Mood/atmosphere | dramatic, serene, mysterious, joyful, melancholic, epic |
| colorPalette | string | No | Color scheme | vibrant, muted, monochrome, warm, cool, earth |
| composition | string | No | Composition type | balanced, dynamic, asymmetric, centered |

**Response:**
```json
{
  "success": true,
  "data": {
    "description": "A cinematic composition featuring...",
    "colorPalette": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    "elements": [
      {
        "type": "foreground",
        "description": "Primary subject with strong presence"
      }
    ],
    "composition": {
      "rule": "rule-of-thirds",
      "focalPoint": "center-right",
      "balance": "balanced"
    },
    "lighting": {
      "type": "high-contrast",
      "direction": "three-quarter",
      "temperature": "warm"
    },
    "metadata": {
      "style": "cinematic",
      "mood": "dramatic",
      "generatedAt": "2024-07-01T12:00:00.000Z"
    }
  },
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Get Visual Styles

Retrieve available visual style presets.

```http
GET /api/visual/styles
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cinematic",
      "name": "Cinematic",
      "description": "Film-inspired compositions",
      "characteristics": ["Wide aspect ratio", "Depth of field"]
    }
  ],
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Get Color Palettes

Retrieve available color palette presets.

```http
GET /api/visual/palettes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "vibrant",
      "name": "Vibrant",
      "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
      "mood": "energetic"
    }
  ],
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Get Mood Presets

Retrieve available mood presets.

```http
GET /api/visual/moods
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dramatic",
      "name": "Dramatic",
      "description": "High contrast, intense emotions"
    }
  ],
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

## Scene Building

### Generate Scene

Create an interactive scene with elements and branching paths.

```http
POST /api/scene/generate
```

**Request Body:**
```json
{
  "prompt": "A tense negotiation in a dimly lit warehouse",
  "sceneType": "interactive",
  "complexity": "medium",
  "interactivity": "high"
}
```

**Parameters:**

| Field | Type | Required | Description | Options |
|-------|------|----------|-------------|---------|
| prompt | string | Yes | Scene description | Any text |
| sceneType | string | No | Type of scene | interactive, dialogue, exploration, action, puzzle |
| complexity | string | No | Scene complexity | simple, medium, complex |
| interactivity | string | No | Interaction level | low, medium, high |

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Interactive Scene: A tense negotiation...",
    "description": "An immersive interactive experience...",
    "elements": [
      {
        "id": "element-1",
        "type": "character",
        "name": "Protagonist",
        "description": "The main character",
        "interactions": ["dialogue", "movement", "decision"]
      }
    ],
    "branches": [
      {
        "id": "branch-1",
        "condition": "User chooses path A",
        "outcome": "Story progresses toward resolution",
        "nextScene": "scene-2a"
      }
    ],
    "interactivity": {
      "level": "high",
      "types": ["click", "hover", "choice"],
      "feedback": "immediate"
    },
    "metadata": {
      "complexity": "medium",
      "estimatedDuration": "5-10 minutes",
      "generatedAt": "2024-07-01T12:00:00.000Z"
    }
  },
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Get Scene Templates

Retrieve available scene templates.

```http
GET /api/scene/templates
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dialogue-scene",
      "name": "Dialogue Scene",
      "description": "Character-driven conversation",
      "elements": ["characters", "dialogue", "choices"],
      "interactivity": "high"
    }
  ],
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Get Interaction Types

Retrieve available interaction types.

```http
GET /api/scene/interactions
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "click",
      "name": "Click",
      "description": "Simple click/tap interaction",
      "complexity": "low"
    }
  ],
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

## Collaboration

### Create Session

Create a new collaboration session.

```http
POST /api/collaboration/session
```

**Request Body:**
```json
{
  "projectName": "My Creative Project",
  "creatorName": "John Doe"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| projectName | string | Yes | Name of the project |
| creatorName | string | No | Creator's name (default: "Anonymous") |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session-1234567890-abc123",
    "projectName": "My Creative Project",
    "creatorName": "John Doe",
    "createdAt": "2024-07-01T12:00:00.000Z",
    "participants": ["John Doe"],
    "content": {
      "story": "",
      "visuals": [],
      "scenes": []
    },
    "activity": []
  },
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Get Session

Retrieve session details.

```http
GET /api/collaboration/session/:sessionId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session-1234567890-abc123",
    "projectName": "My Creative Project",
    "participants": ["John Doe", "Jane Smith"],
    "content": { /* session content */ },
    "activity": [ /* activity log */ ]
  },
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Update Session

Update session content.

```http
PUT /api/collaboration/session/:sessionId
```

**Request Body:**
```json
{
  "content": {
    "story": "Updated story content..."
  },
  "participantName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session-1234567890-abc123",
    "content": { /* updated content */ },
    "activity": [ /* updated activity log */ ]
  },
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### Brainstorm

Get AI-powered brainstorming suggestions.

```http
POST /api/collaboration/brainstorm
```

**Request Body:**
```json
{
  "context": "Current project context...",
  "focusArea": "plot"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "aiSuggestions": [
      {
        "id": "suggestion-1",
        "text": "Consider exploring...",
        "type": "plot",
        "confidence": 0.85
      }
    ],
    "collaborationTips": [
      {
        "id": "collab-1",
        "text": "Assign different team members...",
        "type": "workflow",
        "confidence": 0.85
      }
    ]
  },
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

### List Sessions

Get all active sessions.

```http
GET /api/collaboration/sessions
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "session-1234567890-abc123",
      "projectName": "My Creative Project",
      "creatorName": "John Doe",
      "participantCount": 2,
      "createdAt": "2024-07-01T12:00:00.000Z"
    }
  ],
  "count": 1,
  "timestamp": "2024-07-01T12:00:00.000Z"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, there are no rate limits. Future versions will implement:
- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## Examples

### cURL Examples

**Generate Story:**
```bash
curl -X POST http://localhost:3000/api/story/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A space explorer finds an ancient artifact",
    "genre": "scifi",
    "tone": "mysterious"
  }'
```

**Generate Visual Concept:**
```bash
curl -X POST http://localhost:3000/api/visual/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A cyberpunk street market at night",
    "style": "cinematic",
    "mood": "mysterious"
  }'
```

### JavaScript Examples

**Using Fetch API:**
```javascript
// Generate Story
const response = await fetch('http://localhost:3000/api/story/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A detective solves a mysterious case',
    genre: 'mystery',
    tone: 'dark'
  })
});

const data = await response.json();
console.log(data.data.content);
```

---

## Support

For API issues or questions:
- GitHub Issues: [lumina-studio/issues](https://github.com/paulmmoore3416/lumina-studio/issues)
- Email: paulmmoore3416@gmail.com

---

**API Version:** 1.0.0  
**Last Updated:** July 2026