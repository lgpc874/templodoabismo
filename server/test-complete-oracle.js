import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function testOracleEndpoint(type, question) {
  try {
    const response = await fetch(`${API_BASE}/api/oracle/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, question })
    });

    const data = await response.json();
    console.log(`\n=== ${type.toUpperCase()} TEST ===`);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
    
    return response.status === 200 && data;
  } catch (error) {
    console.error(`Error testing ${type}:`, error.message);
    return false;
  }
}

async function runCompleteOracleTest() {
  console.log('🔮 Testing Complete Oracle Fallback System...\n');
  
  const tests = [
    { type: 'tarot', question: 'What does the future hold for my spiritual journey?' },
    { type: 'mirror', question: 'What truth about myself do I need to see?' },
    { type: 'runes', question: 'What ancient wisdom guides my path?' },
    { type: 'fire', question: 'What visions do the flames reveal?' },
    { type: 'voice', question: 'What do the voices of the abyss whisper?' }
  ];

  let successCount = 0;
  
  for (const test of tests) {
    const success = await testOracleEndpoint(test.type, test.question);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  }
  
  console.log(`\n📊 TEST RESULTS: ${successCount}/${tests.length} Oracle types working correctly`);
  
  if (successCount === tests.length) {
    console.log('✅ All Oracle consultation types are providing proper fallback responses!');
    console.log('🔑 System ready for production with valid OpenAI API key activation.');
  } else {
    console.log('❌ Some Oracle types failed - manual investigation needed.');
  }
}

runCompleteOracleTest().catch(console.error);