import http from 'http';

async function testVozPlumaSystem() {
  console.log('\n🔥 === TESTE COMPLETO DO SISTEMA VOZ DA PLUMA === 🔥\n');
  
  const baseUrl = 'http://localhost:5000';
  
  try {
    // 1. Testar endpoint GET das manifestações
    console.log('1. Testando GET /api/voz-pluma/manifestations...');
    const manifestations = await makeRequest('GET', '/api/voz-pluma/manifestations');
    console.log('✅ Manifestações atuais:', manifestations.length > 0 ? manifestations.length : 'Nenhuma');
    
    // 2. Testar geração de manifestação para hoje
    console.log('\n2. Testando geração de manifestação...');
    const generated = await makeRequest('POST', '/api/voz-pluma/generate-today');
    console.log('✅ Manifestação gerada:', generated.success ? 'Sucesso' : 'Falhou');
    
    // 3. Testar buscar manifestação atual
    console.log('\n3. Testando manifestação atual...');
    const current = await makeRequest('GET', '/api/voz-pluma/current');
    console.log('✅ Manifestação atual:', current ? current.type + ' - ' + current.title : 'Nenhuma');
    
    // 4. Verificar se o sistema está funcionando corretamente
    console.log('\n4. Verificando status do sistema...');
    const status = await makeRequest('GET', '/api/health');
    console.log('✅ Status do servidor:', status ? 'Online' : 'Offline');
    
    console.log('\n🎯 === TESTE CONCLUÍDO === 🎯\n');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve(jsonData);
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Executar o teste
testVozPlumaSystem();