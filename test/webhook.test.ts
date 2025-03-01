import { handleWebhook, verifyWebhook } from '../src/index';
import { WebhookPayload, WebhookMessageType } from '../src/types/core';

describe('Webhook Functions', () => {
  describe('verifyWebhook', () => {
    it('should verify valid webhook challenge', () => {
      const result = verifyWebhook(
        'subscribe',
        'correct-token',
        'challenge-string',
        'correct-token'
      );
      expect(result).toBe('challenge-string');
    });

    it('should reject invalid verify token', () => {
      const result = verifyWebhook(
        'subscribe',
        'wrong-token',
        'challenge-string',
        'correct-token'
      );
      expect(result).toBe(false);
    });
  });

  describe('handleWebhook', () => {
    it('should process text message webhook', async () => {
      const webhookPayload: WebhookPayload = {
        object: 'whatsapp_business_account',
        entry: [{
          id: 'entry-id',
          changes: [{
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '1234567890',
                phone_number_id: 'phone-id',
              },
              contacts: [{
                profile: { name: 'Test User' },
                wa_id: '1234567890',
              }],
              messages: [{
                from: '1234567890',
                id: 'message-id',
                timestamp: '1234567890',
                text: { body: 'Hello!' },
                type: 'text' as WebhookMessageType,
              }],
            },
            field: 'messages',
          }],
        }],
      };

      const result = await handleWebhook(webhookPayload);
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].text?.body).toBe('Hello!');
    });

    it('should handle invalid payload', async () => {
      const invalidPayload: WebhookPayload = {
        object: 'whatsapp_business_account',
        entry: [{
          id: 'test-id',
          changes: []
        }]
      };
      
      const result = await handleWebhook(invalidPayload);
      expect(result).toEqual({
        contacts: [],
        messages: [],
        statuses: []
      });
    });
  });
}); 