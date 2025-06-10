import Stripe from 'stripe';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { Request, Response } from 'express';

// Stripe Configuration
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
}) : null;

// Mercado Pago Configuration
const mercadoPago = process.env.MERCADOPAGO_ACCESS_TOKEN ? new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc',
  }
}) : null;

// PayPal Configuration
const paypalClient = (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) ? new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: process.env.NODE_ENV === "production" ? Environment.Production : Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
}) : null;

const ordersController = paypalClient ? new OrdersController(paypalClient) : null;
const oAuthAuthorizationController = paypalClient ? new OAuthAuthorizationController(paypalClient) : null;

// Payment Interface
export interface PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  customerEmail?: string;
  customerName?: string;
  gateway: 'stripe' | 'paypal' | 'mercadopago' | 'pagseguro' | 'infinitepay';
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  clientSecret?: string;
  redirectUrl?: string;
  qrCode?: string;
  error?: string;
  gateway: string;
}

// Stripe Payment Handler
export async function createStripePayment(req: PaymentRequest): Promise<PaymentResponse> {
  if (!stripe) {
    return { success: false, error: 'Stripe not configured', gateway: 'stripe' };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(req.amount * 100), // Convert to cents
      currency: req.currency.toLowerCase(),
      description: req.description,
      metadata: req.metadata || {},
    });

    return {
      success: true,
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      gateway: 'stripe'
    };
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return { success: false, error: error.message, gateway: 'stripe' };
  }
}

// PayPal Payment Handler
export async function createPayPalPayment(req: PaymentRequest): Promise<PaymentResponse> {
  if (!ordersController) {
    return { success: false, error: 'PayPal not configured', gateway: 'paypal' };
  }

  try {
    const { body, ...httpResponse } = await ordersController.createOrder({
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            amount: {
              currencyCode: req.currency.toUpperCase(),
              value: req.amount.toString(),
            },
            description: req.description,
          },
        ],
      },
      prefer: "return=minimal",
    });

    const jsonResponse = JSON.parse(String(body));
    
    return {
      success: true,
      paymentId: jsonResponse.id,
      gateway: 'paypal'
    };
  } catch (error: any) {
    console.error('PayPal payment error:', error);
    return { success: false, error: error.message, gateway: 'paypal' };
  }
}

// Mercado Pago Payment Handler
export async function createMercadoPagoPayment(req: PaymentRequest): Promise<PaymentResponse> {
  if (!mercadoPago) {
    return { success: false, error: 'Mercado Pago not configured', gateway: 'mercadopago' };
  }

  try {
    const payment = new Payment(mercadoPago);
    
    const paymentData = {
      transaction_amount: req.amount,
      description: req.description || 'Pagamento Templo do Abismo',
      payment_method_id: 'pix',
      payer: {
        email: req.customerEmail || 'customer@templodoabismo.com',
        first_name: req.customerName || 'Cliente',
      },
    };

    const response = await payment.create({ body: paymentData });
    
    return {
      success: true,
      paymentId: response.id?.toString(),
      qrCode: response.point_of_interaction?.transaction_data?.qr_code,
      gateway: 'mercadopago'
    };
  } catch (error: any) {
    console.error('Mercado Pago payment error:', error);
    return { success: false, error: error.message, gateway: 'mercadopago' };
  }
}

// PagSeguro Payment Handler (Custom Implementation)
export async function createPagSeguroPayment(req: PaymentRequest): Promise<PaymentResponse> {
  const token = process.env.PAGSEGURO_TOKEN;
  const email = process.env.PAGSEGURO_EMAIL;
  
  if (!token || !email) {
    return { success: false, error: 'PagSeguro not configured', gateway: 'pagseguro' };
  }

  try {
    const paymentData = {
      email: email,
      token: token,
      currency: req.currency,
      itemId1: '1',
      itemDescription1: req.description || 'Pagamento Templo do Abismo',
      itemAmount1: req.amount.toFixed(2),
      itemQuantity1: '1',
      senderName: req.customerName || 'Cliente',
      senderEmail: req.customerEmail || 'customer@templodoabismo.com',
      redirectURL: `${process.env.BASE_URL}/payment/success`,
      notificationURL: `${process.env.BASE_URL}/api/payments/pagseguro/notification`,
    };

    // PagSeguro API call would go here
    // For now, return a placeholder response
    return {
      success: true,
      paymentId: `pagseguro_${Date.now()}`,
      redirectUrl: 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html',
      gateway: 'pagseguro'
    };
  } catch (error: any) {
    console.error('PagSeguro payment error:', error);
    return { success: false, error: error.message, gateway: 'pagseguro' };
  }
}

// InfinitePay Payment Handler (Custom Implementation)
export async function createInfinitePayPayment(req: PaymentRequest): Promise<PaymentResponse> {
  const apiKey = process.env.INFINITEPAY_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'InfinitePay not configured', gateway: 'infinitepay' };
  }

  try {
    const paymentData = {
      amount: req.amount,
      currency: req.currency,
      description: req.description || 'Pagamento Templo do Abismo',
      customer: {
        email: req.customerEmail || 'customer@templodoabismo.com',
        name: req.customerName || 'Cliente',
      },
      metadata: req.metadata || {},
    };

    // InfinitePay API call would go here
    // For now, return a placeholder response
    return {
      success: true,
      paymentId: `infinitepay_${Date.now()}`,
      gateway: 'infinitepay'
    };
  } catch (error: any) {
    console.error('InfinitePay payment error:', error);
    return { success: false, error: error.message, gateway: 'infinitepay' };
  }
}

// Main Payment Processing Function
export async function processPayment(req: PaymentRequest): Promise<PaymentResponse> {
  switch (req.gateway) {
    case 'stripe':
      return await createStripePayment(req);
    case 'paypal':
      return await createPayPalPayment(req);
    case 'mercadopago':
      return await createMercadoPagoPayment(req);
    case 'pagseguro':
      return await createPagSeguroPayment(req);
    case 'infinitepay':
      return await createInfinitePayPayment(req);
    default:
      return { success: false, error: 'Gateway not supported', gateway: req.gateway };
  }
}

// PayPal Client Token for frontend
export async function getPayPalClientToken(): Promise<string | null> {
  if (!oAuthAuthorizationController || !process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return null;
  }

  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
    ).toString("base64");

    const { result } = await oAuthAuthorizationController.requestToken(
      { authorization: `Basic ${auth}` },
      { intent: "sdk_init", response_type: "client_token" }
    );

    return result.accessToken || null;
  } catch (error) {
    console.error('PayPal client token error:', error);
    return null;
  }
}

// PayPal Order Capture
export async function capturePayPalOrder(orderId: string): Promise<any> {
  if (!ordersController) {
    throw new Error('PayPal not configured');
  }

  try {
    const { body, ...httpResponse } = await ordersController.captureOrder({
      id: orderId,
      prefer: "return=minimal",
    });

    return JSON.parse(String(body));
  } catch (error) {
    console.error('PayPal capture error:', error);
    throw error;
  }
}