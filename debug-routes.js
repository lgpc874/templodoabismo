import express from 'express';

const app = express();
app.use(express.json());

// Add basic test route
app.post('/api/oracle/ritual-consult', (req, res) => {
  console.log('Direct route hit!', req.body);
  res.json({ 
    success: true, 
    message: 'Direct route working',
    received: req.body 
  });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Basic test working' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
});