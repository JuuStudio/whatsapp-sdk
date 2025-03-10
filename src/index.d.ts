declare module "@juutech/whatsapp-sdk" {
  interface BotConfig {
    accessToken: string;
    verifyToken: string;
    phoneNumberId: string;
  }

  interface ReadReceiptResponse {
    success: boolean;
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

  export class WhatsAppClient {
    constructor(config: BotConfig);
    sendText(to: string, text: string): Promise<WhatsAppResponse>;
    sendImage(
      to: string,
      image: { id?: string; link?: string; caption?: string }
    ): Promise<WhatsAppResponse>;
    sendVideo(
      to: string,
      video: { id?: string; link?: string; caption?: string }
    ): Promise<WhatsAppResponse>;
    sendAudio(
      to: string,
      audio: { id?: string; link?: string }
    ): Promise<WhatsAppResponse>;
    sendDocument(
      to: string,
      document: {
        id?: string;
        link?: string;
        caption?: string;
        filename: string;
      }
    ): Promise<WhatsAppResponse>;
    sendSticker(
      to: string,
      sticker: { id?: string; link?: string }
    ): Promise<WhatsAppResponse>;
    sendLocation(
      to: string,
      location: {
        latitude: number;
        longitude: number;
        name?: string;
        address?: string;
      }
    ): Promise<WhatsAppResponse>;
    sendInteractiveButtons(
      to: string,
      options: { body: string; buttons: Array<{ title: string }> }
    ): Promise<WhatsAppResponse>;
    sendInteractiveList(
      to: string,
      options: {
        body: string;
        buttonText: string;
        sections: Array<{
          title: string;
          rows: Array<{ id: string; title: string; description?: string }>;
        }>;
      }
    ): Promise<WhatsAppResponse>;
    markMessageAsRead(messageId: string): Promise<ReadReceiptResponse>;
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

  export function createBot(config: BotConfig): WhatsAppClient;
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
