import express, { type Request, Response } from "express";
import { temploAI } from "./ai-service";

const app = express();
app.use(express.json());

// Oracle ritual consultation with entities
app.post('/api/oracle/ritual-consult', async (req: any, res: Response) => {
  try {
    console.log('Ritual consultation request received:', req.body);
    
    const { question, oracleType, entityName } = req.body;
    
    if (!question?.trim() || !oracleType || !entityName) {
      console.log('Missing required fields:', { question: !!question, oracleType: !!oracleType, entityName: !!entityName });
      return res.status(400).json({ 
        error: 'Question, oracle type, and entity name are required' 
      });
    }

    console.log('Calling temploAI.generateRitualResponse with:', { question: question.trim(), oracleType, entityName });
    
    const result = await temploAI.generateRitualResponse(question.trim(), oracleType, entityName);
    
    console.log('AI response received:', { hasResponse: !!result.response, hasFarewell: !!result.farewell });
    
    res.json({
      success: true,
      response: result.response,
      farewell: result.farewell,
      entityName,
      oracleType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in ritual consultation:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to perform ritual consultation', details: error.message });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ritual-consultation' });
});

const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ritual consultation server running on port ${PORT}`);
});