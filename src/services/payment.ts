// ToyyibPay Payment Gateway Service
// Documentation: https://toyyibpay.com/apireference

import { logger } from '@/lib/logger';

const TOYYIB_API_URL = process.env.TOYYIB_API_URL || 'https://toyyibpay.com';
const TOYYIB_SECRET_KEY = process.env.TOYYIB_SECRET_KEY!;
const TOYYIB_CATEGORY_CODE = process.env.TOYYIB_CATEGORY_CODE!;

export interface CreateBillInput {
  billName: string;
  billDescription: string;
  billPriceSetting: 1 | 0; // 1 = fixed, 0 = user can change
  billPayorInfo: 1 | 0; // 1 = require payor info
  billAmount: number; // in cents (RM 1 = 100)
  billReturnUrl: string;
  billCallbackUrl: string;
  billExternalReferenceNo: string;
  billTo: string;
  billEmail: string;
  billPhone: string;
  billContentEmail?: string;
  billChargeToCustomer?: 0 | 1 | 2; // 0 = charge to owner, 1 = FPX, 2 = FPX + CC
}

export interface CreateBillResponse {
  BillCode: string;
}

export interface BillTransaction {
  billName: string;
  billDescription: string;
  billTo: string;
  billEmail: string;
  billPhone: string;
  billStatus: string;
  billAmount: string;
  billpaymentAmount: string;
  paidAmount: string;
  billpaymentStatus: string;
  billpaymentInvoiceNo: string;
  billSplitPayment: string;
  billSplitPaymentArgs: string;
  billPaymentChannel: string;
  billPaymentSettlement: string;
  billPaymentSettlementDate: string;
  billExternalReferenceNo: string;
  categoryCode: string;
  categoryName: string;
}

export interface WebhookPayload {
  refno: string;
  status: string;
  reason: string;
  billcode: string;
  order_id: string;
  amount: string;
  transaction_time?: string;
}

class PaymentService {
  /**
   * Create a new bill in ToyyibPay
   */
  async createBill(input: CreateBillInput): Promise<{ success: boolean; billCode?: string; paymentUrl?: string; error?: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append('userSecretKey', TOYYIB_SECRET_KEY);
      formData.append('categoryCode', TOYYIB_CATEGORY_CODE);
      formData.append('billName', input.billName);
      formData.append('billDescription', input.billDescription);
      formData.append('billPriceSetting', input.billPriceSetting.toString());
      formData.append('billPayorInfo', input.billPayorInfo.toString());
      formData.append('billAmount', input.billAmount.toString());
      formData.append('billReturnUrl', input.billReturnUrl);
      formData.append('billCallbackUrl', input.billCallbackUrl);
      formData.append('billExternalReferenceNo', input.billExternalReferenceNo);
      formData.append('billTo', input.billTo);
      formData.append('billEmail', input.billEmail);
      formData.append('billPhone', input.billPhone);
      formData.append('billChargeToCustomer', (input.billChargeToCustomer || 1).toString());

      if (input.billContentEmail) {
        formData.append('billContentEmail', input.billContentEmail);
      }

      const response = await fetch(`${TOYYIB_API_URL}/index.php/api/createBill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data && data[0]?.BillCode) {
        const billCode = data[0].BillCode;
        const paymentUrl = `${TOYYIB_API_URL}/${billCode}`;
        
        logger.info('Bill created successfully', { billCode, orderId: input.billExternalReferenceNo });
        
        return {
          success: true,
          billCode,
          paymentUrl,
        };
      }

      logger.error('Failed to create bill', new Error('Invalid response'), { response: data });
      return {
        success: false,
        error: 'Failed to create payment bill',
      };
    } catch (error) {
      logger.error('ToyyibPay createBill error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get bill transactions/status
   */
  async getBillTransactions(billCode: string): Promise<BillTransaction[] | null> {
    try {
      const formData = new URLSearchParams();
      formData.append('billCode', billCode);

      const response = await fetch(`${TOYYIB_API_URL}/index.php/api/getBillTransactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();
      return data as BillTransaction[];
    } catch (error) {
      logger.error('ToyyibPay getBillTransactions error', error);
      return null;
    }
  }

  /**
   * Verify webhook payload
   * ToyyibPay doesn't provide signature verification, so we verify by checking the bill exists
   */
  async verifyWebhook(payload: WebhookPayload): Promise<{ isValid: boolean; orderId?: string }> {
    try {
      // Get bill transactions to verify
      const transactions = await this.getBillTransactions(payload.billcode);
      
      if (!transactions || transactions.length === 0) {
        logger.warn('Webhook verification failed - no transactions found', { billCode: payload.billcode });
        return { isValid: false };
      }

      const transaction = transactions[0];
      
      // Verify external reference matches
      if (transaction.billExternalReferenceNo !== payload.order_id) {
        logger.warn('Webhook verification failed - order ID mismatch', {
          expected: transaction.billExternalReferenceNo,
          received: payload.order_id,
        });
        return { isValid: false };
      }

      return {
        isValid: true,
        orderId: transaction.billExternalReferenceNo,
      };
    } catch (error) {
      logger.error('Webhook verification error', error);
      return { isValid: false };
    }
  }

  /**
   * Check if payment was successful
   */
  isPaymentSuccessful(status: string): boolean {
    return status === '1' || status.toLowerCase() === 'success';
  }

  /**
   * Format amount for ToyyibPay (convert RM to cents)
   */
  formatAmount(amountRM: number): number {
    return Math.round(amountRM * 100);
  }
}

export const paymentService = new PaymentService();
