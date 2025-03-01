declare module "@juutech/whatsapp-sdk" {
  interface BotConfig {
    accessToken: string;
    verifyToken: string;
    phoneNumberId: string;
  }

  interface WebhookEvent {
    // Add webhook event properties based on WhatsApp API response
    object: string;
    entry: Array<{
      id: string;
      changes: Array<{
        value: {
          messaging_product: string;
          metadata: {
            display_phone_number: string;
            phone_number_id: string;
          };
          contacts?: Array<{
            profile: {
              name: string;
            };
            wa_id: string;
          }>;
          messages?: Array<{
            from: string;
            id: string;
            timestamp: string;
            text?: {
              body: string;
            };
            type: string;
            image?: {
              id: string;
              mime_type: string;
            };
          }>;
        };
        field: string;
      }>;
    }>;
  }

  interface WhatsAppResponse {
    messaging_product: string;
    contacts: Array<{ wa_id: string }>;
    messages: Array<{ id: string }>;
  }

  interface Bot {
    sendText(to: string, text: string): Promise<WhatsAppResponse>;
    sendImage(
      to: string,
      url: string,
      caption?: string
    ): Promise<WhatsAppResponse>;
    // Add other bot methods as needed
  }

  export function createBot(config: BotConfig): Bot;
  export function handleWebhook(event: WebhookEvent): Promise<void>;
  export function verifyWebhook(
    mode: string,
    token: string,
    challenge: string
  ): string | boolean;
}

export function getMediaUrl(mediaId: string): Promise<string>;
export function downloadMedia(mediaId: string): Promise<Buffer>;
