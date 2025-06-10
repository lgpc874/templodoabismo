import { temploAI } from './ai-service.js';

async function testOracleAI() {
  console.log('Testing Oracle AI functionality...');
  
  try {
    // Test Tarot Reading
    console.log('\n=== Testing Tarot Reading ===');
    const tarotResult = await temploAI.generateTarotReading('What is my spiritual path?');
    console.log('Tarot Result:', JSON.stringify(tarotResult, null, 2));
    
    // Test Mirror Reading
    console.log('\n=== Testing Mirror Reading ===');
    const mirrorResult = await temploAI.generateMirrorReading('What should I see in myself?');
    console.log('Mirror Result:', JSON.stringify(mirrorResult, null, 2));
    
    // Test Rune Reading
    console.log('\n=== Testing Rune Reading ===');
    const runeResult = await temploAI.generateRuneReading('What guidance do the ancestors offer?');
    console.log('Rune Result:', JSON.stringify(runeResult, null, 2));
    
    console.log('\n✅ All Oracle AI tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Oracle AI test failed:', error.message);
    
    if (error.message.includes('OpenAI API key')) {
      console.log('\n🔑 OpenAI API Key needs to be configured in environment variables.');
    }
  }
}

testOracleAI();