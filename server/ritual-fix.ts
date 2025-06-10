import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// Direct ritual consultation endpoint - bypasses all middleware conflicts
app.post('/api/oracle/ritual-consult', (req: Request, res: Response) => {
  try {
    const { question, oracleType, entityName } = req.body;
    
    if (!question?.trim() || !oracleType || !entityName) {
      return res.status(400).json({ 
        error: 'Question, oracle type, and entity name are required' 
      });
    }

    const entityResponses = {
      'Arcanum': {
        response: `The ancient cards whisper of your question: "${question}". Through the Tarot's sacred geometry, I perceive the threads of fate that bind your path. The Major Arcana speaks - transformation comes through embracing the shadow aspects of your being. The cards reveal that what you seek lies beyond the veil of ordinary perception.`,
        farewell: 'The cards grow cold as Arcanum withdraws into the mystical veil, leaving only echoes of ancient wisdom...'
      },
      'Speculum': {
        response: `Your reflection in the obsidian mirror reveals truths about "${question}". I see through the veils of illusion to perceive your soul's true nature. The mirror shows not what is, but what could be - potential paths written in silver light upon dark glass. Your inner vision must awaken to see what others cannot.`,
        farewell: 'The mirror surface grows dark as Speculum retreats into the realm of infinite reflections...'
      },
      'Runicus': {
        response: `The ancient stones have been cast for your inquiry: "${question}". The Elder Futhark speaks of destiny carved in stone and fate written in the language of the gods. I see Algiz for protection, Dagaz for transformation, and Othala for spiritual inheritance. Your path requires both courage and wisdom.`,
        farewell: 'The runes fall silent as Runicus returns to the sacred grove of ancient knowledge...'
      },
      'Ignis': {
        response: `The sacred flames dance with insight for your question: "${question}". Fire speaks of purification through trial, of passion that burns away illusion. In the dancing flames, I see the phoenix rising from ashes of old patterns. What must die for you to be reborn? The fire knows.`,
        farewell: 'The flames diminish to embers as Ignis retreats to the eternal hearth of transformation...'
      },
      'Abyssos': {
        response: `From the primordial void comes wisdom for your inquiry: "${question}". The abyss speaks in whispers older than creation itself. What you seek dwells not in light but in the fertile darkness where all potentials exist. Embrace the unknown, for it is the womb of all becoming.`,
        farewell: 'Abyssos dissolves back into the infinite void, leaving only the profound silence of endless possibility...'
      }
    };

    const entityData = entityResponses[entityName as keyof typeof entityResponses];
    if (!entityData) {
      return res.status(400).json({ error: 'Unknown entity' });
    }
    
    res.json({
      success: true,
      response: entityData.response,
      farewell: entityData.farewell,
      entityName,
      oracleType,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ritual consultation error:', error);
    res.status(500).json({ error: 'Failed to perform ritual consultation' });
  }
});

const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ritual consultation server running on port ${PORT}`);
});