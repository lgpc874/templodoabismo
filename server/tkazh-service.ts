import { supabase } from './supabase-client';

export interface TKAZHTransaction {
  userId: string;
  type: 'gain' | 'spend' | 'purchase' | 'bonus' | 'reset';
  amount: number;
  reason: string;
  metadata?: any;
}

export interface UserCredits {
  current: number;
  purchased: number;
  lastWeeklyReset: Date;
  canUseDaily: boolean;
}

export class TKAZHService {
  // Custos dos oráculos em T'KAZH
  private oracleCosts = {
    tarot: 30,
    mirror: 25,
    runes: 35,
    fire: 20,
    voice: 40
  };

  // Recompensas por ações
  private rewards = {
    course_complete: 100,
    achievement: 50,
    daily_login: 10,
    ritual_complete: 75,
    vip_daily: 25
  };

  async getUserCredits(userId: string): Promise<UserCredits> {
    const { data: user } = await supabase
      .from('users')
      .select('tkazh_credits, tkazh_purchased, last_weekly_reset, member_type, last_daily_bonus')
      .eq('id', userId)
      .single();

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se precisa fazer reset semanal
    await this.checkWeeklyReset(userId, user.last_weekly_reset);

    // Verificar se pode usar oráculo gratuitamente hoje
    const canUseDaily = this.canUseDailyOracle(user.last_daily_bonus);

    return {
      current: user.tkazh_credits || 0,
      purchased: user.tkazh_purchased || 0,
      lastWeeklyReset: new Date(user.last_weekly_reset),
      canUseDaily
    };
  }

  async spendCredits(userId: string, oracleType: string): Promise<boolean> {
    const cost = this.oracleCosts[oracleType as keyof typeof this.oracleCosts] || 30;
    const credits = await this.getUserCredits(userId);

    if (credits.current < cost) {
      return false;
    }

    // Deduzir créditos
    await supabase
      .from('users')
      .update({ tkazh_credits: credits.current - cost })
      .eq('id', userId);

    // Registrar transação
    await this.recordTransaction({
      userId,
      type: 'spend',
      amount: -cost,
      reason: `Consulta ${oracleType}`,
      metadata: { oracleType }
    });

    return true;
  }

  async addCredits(userId: string, amount: number, reason: string, type: TKAZHTransaction['type'] = 'gain'): Promise<void> {
    const { data: user } = await supabase
      .from('users')
      .select('tkazh_credits, tkazh_purchased')
      .eq('id', userId)
      .single();

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    let updateData: any = {
      tkazh_credits: (user.tkazh_credits || 0) + amount
    };

    // Se for compra, adicionar aos créditos permanentes
    if (type === 'purchase') {
      updateData.tkazh_purchased = (user.tkazh_purchased || 0) + amount;
    }

    await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);

    await this.recordTransaction({
      userId,
      type,
      amount,
      reason,
      metadata: { previousCredits: user.tkazh_credits }
    });
  }

  async giveVIPDailyBonus(userId: string): Promise<boolean> {
    const { data: user } = await supabase
      .from('users')
      .select('member_type, last_daily_bonus')
      .eq('id', userId)
      .single();

    if (!user || user.member_type !== 'vip') {
      return false;
    }

    const lastBonus = user.last_daily_bonus ? new Date(user.last_daily_bonus) : null;
    const today = new Date();
    const canReceive = !lastBonus || 
      (today.getTime() - lastBonus.getTime()) >= 24 * 60 * 60 * 1000;

    if (canReceive) {
      await this.addCredits(userId, this.rewards.vip_daily, 'Bônus diário VIP', 'bonus');
      
      await supabase
        .from('users')
        .update({ last_daily_bonus: today.toISOString() })
        .eq('id', userId);

      return true;
    }

    return false;
  }

  private async checkWeeklyReset(userId: string, lastReset: string): Promise<void> {
    const lastResetDate = new Date(lastReset);
    const now = new Date();
    const weeksPassed = Math.floor((now.getTime() - lastResetDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

    if (weeksPassed >= 1) {
      // Fazer reset semanal - resetar apenas créditos gratuitos
      const { data: user } = await supabase
        .from('users')
        .select('tkazh_purchased, member_type')
        .eq('id', userId)
        .single();

      let newCredits = user?.tkazh_purchased || 0;
      
      // Dar créditos base da semana
      if (user?.member_type === 'vip') {
        newCredits += 200; // VIP ganha mais créditos semanais
      } else if (user?.member_type === 'iniciado') {
        newCredits += 100;
      } else {
        newCredits += 50; // Visitantes ganham menos
      }

      await supabase
        .from('users')
        .update({
          tkazh_credits: newCredits,
          last_weekly_reset: now.toISOString()
        })
        .eq('id', userId);

      await this.recordTransaction({
        userId,
        type: 'reset',
        amount: newCredits - (user?.tkazh_purchased || 0),
        reason: 'Reset semanal de créditos',
        metadata: { weeksPassed, memberType: user?.member_type }
      });
    }
  }

  private canUseDailyOracle(lastDailyBonus: string | null): boolean {
    if (!lastDailyBonus) return true;
    
    const lastBonus = new Date(lastDailyBonus);
    const now = new Date();
    return (now.getTime() - lastBonus.getTime()) >= 24 * 60 * 60 * 1000;
  }

  private async recordTransaction(transaction: TKAZHTransaction): Promise<void> {
    await supabase
      .from('tkazh_transactions')
      .insert({
        user_id: transaction.userId,
        type: transaction.type,
        amount: transaction.amount,
        reason: transaction.reason,
        metadata: transaction.metadata || {}
      });
  }

  async getTransactionHistory(userId: string, limit: number = 20): Promise<any[]> {
    const { data } = await supabase
      .from('tkazh_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  }

  getOracleCost(oracleType: string): number {
    return this.oracleCosts[oracleType as keyof typeof this.oracleCosts] || 30;
  }
}

export const tkazhService = new TKAZHService();