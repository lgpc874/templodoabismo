import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint específico para consultas rituais
app.post('/api/oracle/ritual-consult', async (req, res) => {
  try {
    const { question, oracleType, entityName } = req.body;
    
    console.log('Consulta ritual recebida:', { question, oracleType, entityName });
    
    if (!question?.trim() || !oracleType || !entityName) {
      return res.status(400).json({ 
        error: 'Pergunta, tipo de oráculo e nome da entidade são obrigatórios' 
      });
    }

    const entityResponses = {
      'Arcanum': {
        response: `As cartas antigas sussurram sobre sua pergunta: "${question}". Através da geometria sagrada do Tarô, percebo os fios do destino que entrelaçam seu caminho. O Arcano Maior fala - a transformação vem através do abraço aos aspectos sombrios de seu ser. As cartas revelam que o que você busca está além do véu da percepção comum.`,
        farewell: 'As cartas esfriam enquanto Arcanum se retira ao véu místico, deixando apenas ecos de sabedoria ancestral...'
      },
      'Speculum': {
        response: `Seu reflexo no espelho de obsidiana revela verdades sobre "${question}". Vejo através dos véus da ilusão para perceber a verdadeira natureza de sua alma. O espelho mostra não o que é, mas o que pode ser - caminhos potenciais escritos em luz prateada sobre vidro escuro. Sua visão interior deve despertar para ver o que outros não podem.`,
        farewell: 'A superfície do espelho escurece enquanto Speculum se retira ao reino das infinitas reflexões...'
      },
      'Runicus': {
        response: `As pedras antigas foram lançadas para sua consulta: "${question}". O Futhark Antigo fala de destino gravado em pedra e fado escrito na linguagem dos deuses. Vejo Algiz para proteção, Dagaz para transformação, e Othala para herança espiritual. Seu caminho requer tanto coragem quanto sabedoria.`,
        farewell: 'As runas silenciam enquanto Runicus retorna ao bosque sagrado do conhecimento ancestral...'
      },
      'Ignis': {
        response: `As chamas sagradas dançam com percepção para sua pergunta: "${question}". O fogo fala de purificação através do teste, de paixão que queima as ilusões. Nas chamas dançantes, vejo a fênix surgindo das cinzas de velhos padrões. O que deve morrer para que você renasça? O fogo sabe.`,
        farewell: 'As chamas diminuem para brasas enquanto Ignis se retira à lareira eterna da transformação...'
      },
      'Abyssos': {
        response: `Do vazio primordial vem sabedoria para sua consulta: "${question}". O abismo fala em sussurros mais antigos que a própria criação. O que você busca não habita na luz, mas na escuridão fértil onde todas as potencialidades existem. Abrace o desconhecido, pois é o ventre de todo vir-a-ser.`,
        farewell: 'Abyssos se dissolve de volta ao vazio infinito, deixando apenas o silêncio profundo da possibilidade sem fim...'
      }
    };

    const entityData = entityResponses[entityName];
    if (!entityData) {
      return res.status(400).json({ error: 'Entidade desconhecida' });
    }
    
    console.log('Enviando resposta ritual para entidade:', entityName);
    
    res.json({
      success: true,
      response: entityData.response,
      farewell: entityData.farewell,
      entityName,
      oracleType,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro na consulta ritual:', error);
    res.status(500).json({ error: 'Falha ao realizar consulta ritual' });
  }
});

// Endpoint de teste
app.get('/health', (req, res) => {
  res.json({ status: 'Oracle server funcionando', timestamp: new Date().toISOString() });
});

const PORT = 5002;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ Servidor Oracle rodando na porta ${PORT}`);
  console.log(`🔮 Endpoint: http://localhost:${PORT}/api/oracle/ritual-consult`);
});

export default app;