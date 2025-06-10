import fetch from 'node-fetch';

async function testRitualEndpoint() {
  const ports = [3000, 5000, 5173, 8080];
  
  for (const port of ports) {
    try {
      console.log(`Testing port ${port}...`);
      
      const response = await fetch(`http://localhost:${port}/api/oracle/ritual-consult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: "Qual é meu destino?",
          oracleType: "tarot", 
          entityName: "Arcanum"
        })
      });
      
      const data = await response.text();
      console.log(`Port ${port} - Status: ${response.status}`);
      console.log(`Port ${port} - Response:`, data);
      
      if (response.status !== 404) {
        console.log(`✓ Found working server on port ${port}`);
        return;
      }
    } catch (error) {
      console.log(`Port ${port} - Error: ${error.message}`);
    }
  }
}

testRitualEndpoint();