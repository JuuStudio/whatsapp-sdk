declare module "@juutech/whatsapp-sdk" {
  interface BotConfig {
    accessToken: string;
    verifyToken: string;
    phoneNumberId: string;
  }

  interface WebhookEvent {
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
            profile: { name: string };
            wa_id: string;
          }>;
          messages?: Array<{
            from: string;
            id: string;
            timestamp: string;
            type: WebhookMessageType;
            text?: { body: string };
            image?: { id: string; mime_type: string };
            video?: { id: string; mime_type: string };
            audio?: { id: string; mime_type: string };
            document?: {
              id: string;
              mime_type: string;
              filename: string;
            };
            interactive?: {
              type: string;
              button_reply?: {
                id: string;
                title: string;
              };
              list_reply?: {
                id: string;
                title: string;
                description?: string;
              };
            };
            location?: {
              latitude: number;
              longitude: number;
              name?: string;
              address?: string;
            };
            sticker?: {
              mime_type: string;
              sha256: string;
              id: string;
              animated: boolean;
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

  interface WebhookVerifyParams {
    mode: string;
    token: string;
    challenge: string;
    verifyToken: string;
  }

  interface MediaParams {
    mediaId: string;
    accessToken: string;
  }

  interface WebhookMessage {
    from: string;
    id: string;
    timestamp: string;
    type: string;
    text?: { body: string };
    image?: { id: string; mime_type: string };
  }

  interface WebhookStatus {
    id: string;
    status: string;
    timestamp: string;
    recipient_id: string;
    conversation: {
      id: string;
      origin: { type: string };
    };
  }

  type WebhookMessageType =
    | "text"
    | "image"
    | "video"
    | "audio"
    | "document"
    | "interactive"
    | "button"
    | "sticker"
    | "system"
    | "location"
    | "unknown";

  export function createBot(config: BotConfig): Bot;
  export function handleWebhook(event: WebhookEvent): Promise<{
    messages: WebhookMessage[];
    statuses: WebhookStatus[];
    contacts: Array<{ profile: { name: string }; wa_id: string }>;
  }>;
  export function verifyWebhook(params: WebhookVerifyParams): string | false;
  export function getMediaUrl(params: MediaParams): Promise<string>;
  export function downloadMedia(params: MediaParams): Promise<Buffer>;
}

// Add a new module declaration for the media subpath
declare module "@juutech/whatsapp-sdk/media" {
  interface MediaParams {
    mediaId: string;
    accessToken: string;
  }
  export function getMediaUrl(params: MediaParams): Promise<string>;
  export function downloadMedia(params: MediaParams): Promise<Buffer>;
}
