// Direct test of ritual consultation functionality
const express = require('express');
const app = express();

app.use(express.json());

// Simple ritual response generator
function generateRitualResponse(question, oracleType, entityName) {
  const responses = {
    'Arcanum': {
      response: `The ancient cards whisper of your question: "${question}". I see paths converging in shadow and light. The tarot reveals that transformation awaits those who dare to embrace the unknown depths within themselves.`,
      farewell: 'Arcanum fades back into the mystical veil, leaving only echoes of wisdom...'
    },
    'Speculum': {
      response: `The mirror shows reflections of your soul's inquiry: "${question}". Within the obsidian surface, I perceive truths that mortal eyes cannot see. Your reflection speaks of hidden potentials waiting to be awakened.`,
      farewell: 'The mirror grows dark as Speculum retreats into the realm of reflections...'
    },
    'Runicus': {
      response: `The ancient stones have been cast for your question: "${question}". The runes speak of destiny carved in stone and fate written in starlight. Your path holds both challenge and revelation.`,
      farewell: 'The runes grow silent as Runicus returns to the ancient circle...'
    },
    'Ignis': {
      response: `The sacred flames dance with insight for your inquiry: "${question}". Fire speaks of passion, purification, and the burning away of what no longer serves. In the flames, I see transformation through trial.`,
      farewell: 'The flames diminish as Ignis retreats to the eternal hearth...'
    },
    'Abyssos': {
      response: `From the deepest void comes wisdom for your question: "${question}". The abyss speaks in whispers older than time itself. What you seek lies not in light, but in the embrace of primordial darkness.`,
      farewell: 'Abyssos dissolves back into the infinite void, leaving only profound silence...'
    }
  };

  return responses[entityName] || {
    response: `The entity ${entityName} acknowledges your question: "${question}". The cosmic forces align to provide guidance through this consultation.`,
    farewell: `${entityName} departs to the ethereal realm...`
  };
}

app.post('/api/oracle/ritual-consult', (req, res) => {
  try {
    console.log('=== RITUAL TEST REQUEST ===');
    console.log('Body:', req.body);
    
    const { question, oracleType, entityName } = req.body;
    
    if (!question || !oracleType || !entityName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['question', 'oracleType', 'entityName']
      });
    }

    const result = generateRitualResponse(question, oracleType, entityName);
    
    res.json({
      success: true,
      response: result.response,
      farewell: result.farewell,
      entityName,
      oracleType,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ritual-test' });
});

const PORT = 5002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ritual test server running on port ${PORT}`);
});