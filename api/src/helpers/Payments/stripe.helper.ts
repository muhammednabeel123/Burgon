import Stripe from 'stripe';
import config from '@config/config';

let stripeClient = new Stripe(config.stripe.secretKey);

export let createStripePaymentIntent = async (amount: number, currency: string): Promise<string> => {
  // ---- Create Stripe payment intent ----
  let paymentIntent = await stripeClient.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
  });

  return paymentIntent.client_secret || '';
};
