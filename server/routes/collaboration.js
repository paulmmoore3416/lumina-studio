import express from 'express';
import aiEngine from '../services/aiEngine.js';

const router = express.Router();

// In-memory storage for collaboration sessions (in production, use a database)
const sessions = new Map();

/**
 * Create a new collaboration session
 * POST /api/collaboration/session
 */
router.post('/session', (req, res) => {
  try {
    const { projectName, creatorName } = req.body;

    if (!projectName || projectName.trim().length === 0) {
      return res.status(400).json({
        error: 'Project name is required',
        timestamp: new Date().toISOString()
      });
    }

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const session = {
      id: sessionId,
      projectName,
      creatorName: creatorName || 'Anonymous',
      createdAt: new Date().toISOString(),
      participants: [creatorName || 'Anonymous'],
      content: {
        story: '',
        visuals: [],
        scenes: []
      },
      activity: []
    };

    sessions.set(sessionId, session);

    res.json({
      success: true,
      data: session,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      error: 'Failed to create session',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get session details
 * GET /api/collaboration/session/:sessionId
 */
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: session,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve session',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Update session content
 * PUT /api/collaboration/session/:sessionId
 */
router.put('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { content, participantName } = req.body;

    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        timestamp: new Date().toISOString()
      });
    }

    // Update content
    if (content) {
      session.content = { ...session.content, ...content };
    }

    // Add participant if new
    if (participantName && !session.participants.includes(participantName)) {
      session.participants.push(participantName);
    }

    // Log activity
    session.activity.push({
      timestamp: new Date().toISOString(),
      participant: participantName || 'Anonymous',
      action: 'updated content'
    });

    sessions.set(sessionId, session);

    res.json({
      success: true,
      data: session,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Session update error:', error);
    res.status(500).json({
      error: 'Failed to update session',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get AI brainstorming suggestions for collaboration
 * POST /api/collaboration/brainstorm
 */
router.post('/brainstorm', async (req, res) => {
  try {
    const { context, focusArea } = req.body;

    const suggestions = await aiEngine.generateSuggestions(context, 5);

    // Add collaboration-specific suggestions
    const collaborationSuggestions = [
      {
        id: `collab-${Date.now()}-1`,
        text: 'Assign different team members to develop parallel storylines',
        type: 'workflow',
        confidence: 0.85
      },
      {
        id: `collab-${Date.now()}-2`,
        text: 'Create a shared mood board for visual consistency',
        type: 'visual',
        confidence: 0.82
      },
      {
        id: `collab-${Date.now()}-3`,
        text: 'Establish character voice guidelines for dialogue consistency',
        type: 'character',
        confidence: 0.88
      }
    ];

    res.json({
      success: true,
      data: {
        aiSuggestions: suggestions,
        collaborationTips: collaborationSuggestions
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Brainstorming error:', error);
    res.status(500).json({
      error: 'Failed to generate brainstorming suggestions',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get active sessions (for demo purposes)
 * GET /api/collaboration/sessions
 */
router.get('/sessions', (req, res) => {
  try {
    const allSessions = Array.from(sessions.values()).map(session => ({
      id: session.id,
      projectName: session.projectName,
      creatorName: session.creatorName,
      participantCount: session.participants.length,
      createdAt: session.createdAt
    }));

    res.json({
      success: true,
      data: allSessions,
      count: allSessions.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sessions list error:', error);
    res.status(500).json({
      error: 'Failed to retrieve sessions',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;

// Made with Bob
