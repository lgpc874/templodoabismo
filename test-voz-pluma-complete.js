const http = require('http');

async function testVozPlumaSystem() {
  console.log('🔮 Testing Complete Voz da Pluma System...\n');

  // Test 1: Check if server is running
  console.log('1. Testing server connection...');
  try {
    const response = await makeRequest('GET', '/api/voz-pluma/current');
    console.log('✅ Server is running');
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return;
  }

  // Test 2: Check manifestations for today
  console.log('\n2. Testing today\'s manifestations...');
  try {
    const manifestations = await makeRequest('GET', '/api/voz-pluma/current');
    
    console.log(`Found ${manifestations.length} manifestations for today`);
    
    const times = ['07:00', '09:00', '11:00'];
    const expectedTypes = {
      '07:00': 'dica', // Will be 'ritual' on Sundays
      '09:00': 'verso',
      '11:00': 'reflexao'
    };
    
    times.forEach(time => {
      const manifestation = manifestations.find(m => m.manifestation_time === time);
      if (manifestation) {
        console.log(`✅ ${time}: ${manifestation.type} - "${manifestation.title}"`);
        console.log(`   Content preview: ${manifestation.content.substring(0, 100)}...`);
      } else {
        console.log(`❌ Missing manifestation for ${time}`);
      }
    });
    
  } catch (error) {
    console.log('❌ Failed to fetch manifestations:', error.message);
  }

  // Test 3: Check if regeneration works
  console.log('\n3. Testing manifestation regeneration...');
  try {
    const newManifestation = await makeRequest('POST', '/api/voz-pluma/regenerate', {
      time: '11:00'
    });
    console.log('✅ Regeneration successful');
    console.log('New manifestation:', newManifestation.title);
  } catch (error) {
    console.log('❌ Regeneration failed:', error.message);
  }

  // Test 4: Check Sunday ritual schedule logic
  console.log('\n4. Testing Sunday ritual schedule logic...');
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  
  if (dayOfWeek === 0) {
    console.log('📅 Today is Sunday - 07:00 should show ritual');
  } else {
    console.log(`📅 Today is ${getDayName(dayOfWeek)} - 07:00 should show dica`);
  }

  console.log('\n🔮 Voz da Pluma System Test Complete!');
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5173,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

function getDayName(dayNum) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNum];
}

// Run the test
testVozPlumaSystem().catch(console.error);