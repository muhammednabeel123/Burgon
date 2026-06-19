import axios from 'axios';
import config from '@config/config';
import { Logger } from '@lib/logger';

export let createTapCharge = async (amount: number, currency: string, customerId: string): Promise<string> => {
  // ---- Create Tap payment charge ----
  let response = await axios.post(
    'https://api.tap.company/v2/charges',
    {
      amount,
      currency,
      customer: { id: customerId },
    },
    {
      headers: {
        Authorization: `Bearer ${config.tap.secretKey}`,
        'Content-Type': 'application/json',
      },
    },
  );

  Logger.info(`Tap charge created: ${response.data.id}`);
  return response.data.transaction.url;
};
