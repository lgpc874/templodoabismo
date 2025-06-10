# Payment Gateways Integration - Templo do Abismo

## Visão Geral

Sistema completo de pagamentos integrado com 5 gateways principais para suportar diferentes métodos de pagamento no Brasil e internacionalmente.

## Gateways Integrados

### 1. Stripe
- **Uso**: Cartões de crédito/débito internacionais
- **Documentação**: https://stripe.com/docs
- **Configuração necessária**:
  - `STRIPE_SECRET_KEY` (servidor)
  - `VITE_STRIPE_PUBLIC_KEY` (cliente)

### 2. PayPal
- **Uso**: Conta PayPal, cartões via PayPal
- **Documentação**: https://developer.paypal.com
- **Configuração necessária**:
  - `PAYPAL_CLIENT_ID`
  - `PAYPAL_CLIENT_SECRET`

### 3. Mercado Pago
- **Uso**: PIX, cartões, boleto (Brasil)
- **Documentação**: https://www.mercadopago.com.br/developers
- **Configuração necessária**:
  - `MERCADOPAGO_ACCESS_TOKEN`
  - `VITE_MERCADOPAGO_PUBLIC_KEY`

### 4. PagSeguro
- **Uso**: PIX, boleto, cartões (Brasil)
- **Documentação**: https://dev.pagseguro.uol.com.br
- **Configuração necessária**:
  - `PAGSEGURO_TOKEN`
  - `PAGSEGURO_EMAIL`

### 5. InfinitePay
- **Uso**: Pagamentos instantâneos
- **Documentação**: https://infinitepay.io/docs
- **Configuração necessária**:
  - `INFINITEPAY_API_KEY`

## Configuração de Ambiente

### 1. Copie o arquivo de exemplo
```bash
cp .env.example .env
```

### 2. Configure as variáveis de ambiente
Edite o arquivo `.env` com suas credenciais:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token
VITE_MERCADOPAGO_PUBLIC_KEY=your_mercadopago_public_key

# PagSeguro
PAGSEGURO_TOKEN=your_pagseguro_token
PAGSEGURO_EMAIL=your_pagseguro_email

# InfinitePay
INFINITEPAY_API_KEY=your_infinitepay_api_key

# Base URL para webhooks
BASE_URL=https://seu-dominio.com
```

## Endpoints da API

### Criar Pagamento
```
POST /api/payments/create
```
**Body:**
```json
{
  "amount": 197.00,
  "currency": "BRL",
  "description": "Curso Avançado de Luciferian Studies",
  "customerEmail": "cliente@email.com",
  "customerName": "Nome do Cliente",
  "gateway": "stripe|paypal|mercadopago|pagseguro|infinitepay",
  "metadata": {}
}
```

### PayPal Token
```
GET /api/payments/paypal/token
```

### Capturar Pagamento PayPal
```
POST /api/payments/paypal/capture/:orderId
```

### Webhooks
- `POST /api/payments/webhook/stripe`
- `POST /api/payments/webhook/mercadopago`
- `POST /api/payments/webhook/pagseguro`
- `POST /api/payments/webhook/infinitepay`

## Uso no Frontend

### Componente PaymentGateway
```tsx
import PaymentGateway from '@/components/PaymentGateway';

function CheckoutPage() {
  return (
    <PaymentGateway
      amount={197}
      currency="BRL"
      description="Curso Avançado"
      onSuccess={(paymentData) => {
        console.log('Pagamento realizado:', paymentData);
      }}
      onError={(error) => {
        console.error('Erro no pagamento:', error);
      }}
    />
  );
}
```

### Página de Teste
Acesse `/payment-test` para testar todos os gateways de pagamento.

## Fluxo de Pagamento

### 1. Stripe (Cartão de Crédito)
1. Cliente preenche dados do cartão
2. Frontend cria PaymentIntent via API
3. Stripe processa o pagamento
4. Retorna resultado do pagamento

### 2. PayPal
1. Cliente seleciona PayPal
2. Sistema gera token de autorização
3. Cliente é redirecionado para PayPal
4. PayPal retorna com aprovação
5. Sistema captura o pagamento

### 3. Mercado Pago (PIX)
1. Cliente seleciona Mercado Pago
2. Sistema gera código PIX/QR Code
3. Cliente escaneia QR Code
4. Pagamento é processado automaticamente

### 4. PagSeguro
1. Cliente seleciona PagSeguro
2. Sistema gera link de pagamento
3. Cliente é redirecionado para PagSeguro
4. Webhook confirma o pagamento

### 5. InfinitePay
1. Cliente seleciona InfinitePay
2. Sistema processa pagamento instantâneo
3. Confirmação imediata

## Segurança

### Validações
- Verificação de valor mínimo
- Validação de email e nome
- Verificação de gateway suportado
- Sanitização de dados de entrada

### Webhooks
- Verificação de assinatura (quando disponível)
- Validação de origem da requisição
- Log de todas as transações

### Chaves de API
- Chaves secretas apenas no servidor
- Chaves públicas no frontend (prefixadas com VITE_)
- Nunca expor chaves secretas no código cliente

## Monitoramento

### Logs
Todos os pagamentos são logados com:
- ID da transação
- Gateway utilizado
- Valor e moeda
- Status do pagamento
- Timestamp

### Métricas Recomendadas
- Taxa de conversão por gateway
- Valor médio por transação
- Falhas de pagamento por gateway
- Tempo de processamento

## Troubleshooting

### Problemas Comuns

1. **Stripe: "Invalid API Key"**
   - Verificar se `STRIPE_SECRET_KEY` está configurado
   - Confirmar se é a chave correta (test/live)

2. **PayPal: "Client authentication failed"**
   - Verificar `PAYPAL_CLIENT_ID` e `PAYPAL_CLIENT_SECRET`
   - Confirmar se está usando sandbox/production correto

3. **Mercado Pago: "Invalid access token"**
   - Verificar `MERCADOPAGO_ACCESS_TOKEN`
   - Confirmar se o token tem permissões necessárias

4. **PagSeguro: "Unauthorized"**
   - Verificar `PAGSEGURO_TOKEN` e `PAGSEGURO_EMAIL`
   - Confirmar se a conta está ativa

5. **Pagamento não aparece**
   - Verificar logs do servidor
   - Confirmar se webhooks estão configurados
   - Verificar se BASE_URL está correto

### Debug Mode
Para habilitar logs detalhados, adicione ao `.env`:
```env
NODE_ENV=development
DEBUG_PAYMENTS=true
```

## Próximos Passos

1. Configurar webhooks em produção
2. Implementar retry logic para falhas
3. Adicionar métricas de monitoramento
4. Configurar alertas para falhas de pagamento
5. Implementar reconciliação automática