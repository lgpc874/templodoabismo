import { supabaseAdmin } from './supabase-client';

export interface VozPlumaManifestation {
  id?: number;
  manifestation_time: string;
  type: string;
  title: string;
  content: string;
  author: string;
  posted_date: string;
  posted_at?: string;
  is_current?: boolean;
}

export class SupabaseMigration {
  
  // Buscar manifestações do Voz da Pluma
  async getVozPlumaManifestations(date?: string): Promise<VozPlumaManifestation[]> {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      // Tentar buscar dados da tabela, usando fallback se não existir
      let { data, error } = await supabaseAdmin
        .from('voz_pluma_manifestations')
        .select('*')
        .eq('posted_date', targetDate)
        .eq('is_current', true)
        .order('manifestation_time');

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log('Tabela voz_pluma_manifestations não existe, usando dados padrão');
          return this.getDefaultManifestations(targetDate);
        }
        throw error;
      }

      // Se não há dados para hoje, retornar dados padrão
      if (!data || data.length === 0) {
        return this.getDefaultManifestations(targetDate);
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar manifestações:', error);
      return this.getDefaultManifestations(date || new Date().toISOString().split('T')[0]);
    }
  }

  // Salvar manifestação
  async saveVozPlumaManifestation(manifestation: VozPlumaManifestation): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('voz_pluma_manifestations')
        .insert(manifestation);

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log('Tentando criar dados de fallback...');
          return false;
        }
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar manifestação:', error);
      return false;
    }
  }

  // Dados padrão quando a tabela não existe
  private getDefaultManifestations(date: string): VozPlumaManifestation[] {
    const dayOfWeek = new Date(date).getDay();
    
    return [
      {
        id: 1,
        manifestation_time: '07:00',
        type: dayOfWeek === 0 ? 'ritual' : 'dica',
        title: dayOfWeek === 0 ? 'Ritual Dominical' : 'Despertar da Consciência',
        content: dayOfWeek === 0 
          ? 'Acenda uma vela branca ao amanhecer. Respire profundamente três vezes, visualizando luz dourada preenchendo seu ser. Declare: "Eu sou luz, eu sou poder, eu sou transformação." Permita que esta energia guie seu domingo.'
          : 'Ao amanhecer, quando as energias se renovam, permita que sua consciência desperte não apenas para o mundo físico, mas para as dimensões superiores de sua essência. O primeiro pensamento do dia molda toda a jornada.',
        author: dayOfWeek === 0 ? 'Guardião dos Rituais' : 'Escriba do Templo',
        posted_date: date,
        posted_at: new Date().toISOString(),
        is_current: true
      },
      {
        id: 2,
        manifestation_time: '09:00',
        type: 'verso',
        title: 'Verso da Manhã',
        content: 'Nas brumas matinais da existência,\nEu caminho entre mundos visíveis e ocultos,\nCarregando em mim a chama ancestral\nQue jamais se extingue.\n\nSou ponte entre o que foi e o que será,\nEterno dançarino da transformação.',
        author: 'Voz da Pluma',
        posted_date: date,
        posted_at: new Date().toISOString(),
        is_current: true
      },
      {
        id: 3,
        manifestation_time: '11:00',
        type: 'reflexao',
        title: dayOfWeek === 0 ? 'Contemplação Dominical' : 'Reflexão do Meio-Dia',
        content: dayOfWeek === 0
          ? 'Neste domingo sagrado, reflita sobre o ciclo eterno de morte e renascimento que governa toda a existência. Como a serpente que troca de pele, você também pode se transformar. Que verdades antigas emergem em sua contemplação?'
          : 'No auge do dia, quando o sol atinge seu zênite, reflita sobre o poder que reside em você. Cada decisão, cada pensamento, cada ação carrega o potencial de transformação. Use-o conscientemente.',
        author: 'Guardião da Sabedoria',
        posted_date: date,
        posted_at: new Date().toISOString(),
        is_current: true
      }
    ];
  }

  // Buscar manifestação por horário específico
  async getManifestationByTime(time: string, date?: string): Promise<VozPlumaManifestation | null> {
    const manifestations = await this.getVozPlumaManifestations(date);
    return manifestations.find(m => m.manifestation_time === time) || null;
  }

  // Verificar se o banco está disponível
  async isDatabaseAvailable(): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('voz_pluma_manifestations')
        .select('count')
        .limit(1);

      return !error || !error.message.includes('does not exist');
    } catch {
      return false;
    }
  }

  // Buscar consultas oraculares
  async getOracleConsultations(userId?: string, limit: number = 10): Promise<any[]> {
    try {
      let query = supabaseAdmin
        .from('oracle_consultations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        if (error.message.includes('does not exist')) {
          return [];
        }
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar consultas oraculares:', error);
      return [];
    }
  }

  // Salvar consulta oracular
  async saveOracleConsultation(consultation: any): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('oracle_consultations')
        .insert(consultation);

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log('Tabela oracle_consultations não existe');
          return false;
        }
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar consulta oracular:', error);
      return false;
    }
  }
}

export const supabaseMigration = new SupabaseMigration();