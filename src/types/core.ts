/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BotConfig {
  token: string;
  numberId: string;
  apiVersion?: string;
}

export interface MessageResponse {
  messageId: string;
  status: string;
}

export type WebhookMessageType =
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

export interface WebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: WebhookMessageType;
  content?: any;
  text?: {
    body: string;
    preview_url?: boolean;
  };
  image?: {
    id: string;
    mimeType: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  video?: {
    id: string;
    mimeType: string;
  };
  audio?: {
    id: string;
    mimeType: string;
  };
  document?: {
    id: string;
    mimeType: string;
    filename: string;
  };
  button?: {
    payload: string;
    text: string;
  };
  context?: {
    forwarded: boolean;
    frequently_forwarded: boolean;
    from: string;
    id: string;
    referred_product?: {
      catalog_id: string;
      product_retailer_id: string;
    };
  };
  order?: {
    catalog_id: string;
    text: string;
    product_items: Array<{
      product_retailer_id: string;
      quantity: string;
      item_price: string;
      currency: string;
    }>;
  };
  referral?: {
    source_url: string;
    source_type: string;
    source_id: string;
    headline: string;
    body: string;
    media_type: string;
    image_url?: string;
    video_url?: string;
    thumbnail_url?: string;
    ctwa_clid: string;
  };
  system?: {
    body: string;
    identity: string;
    wa_id: string;
    type: "customer_changed_number" | "customer_identity_changed";
    customer: string;
  };
  sticker?: {
    mime_type: string;
    sha256: string;
    id: string;
    animated: boolean;
  };
  interactive?: {
    type: {
      button_reply?: {
        id: string;
        title: string;
      };
      list_reply?: {
        id: string;
        title: string;
        description: string;
      };
    };
  };
}

export interface WebhookStatus {
  id: string;
  status: "sent" | "delivered" | "read";
  timestamp: string;
  recipient_id: string;
  conversation: {
    id: string;
    origin: {
      type:
        | "authentication"
        | "marketing"
        | "utility"
        | "service"
        | "referral_conversion";
    };
    expiration_timestamp?: string;
  };
  pricing?: {
    billable: boolean;
    category:
      | "authentication"
      | "authentication-international"
      | "marketing"
      | "utility"
      | "service"
      | "referral_conversion";
    pricing_model: "CBP";
  };
  biz_opaque_callback_data?: string;
}

export interface WebhookPayload {
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
        contacts: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: WebhookMessage[];
        statuses?: WebhookStatus[];
      };
      field: string;
    }>;
  }>;
}

export interface WhatsAppContact {
  input: string;
  wa_id: string;
}

export interface WhatsAppResponse {
  messaging_product: string;
  contacts: WhatsAppContact[];
  messages: Array<{
    id: string;
  }>;
}

export interface TextMessage {
  to: string;
  text: {
    body: string;
    preview_url?: boolean;
  };
}

export interface ImageMessage {
  id?: string;
  link?: string;
  caption?: string;
}

export interface SendImageMessage {
  to: string;
  image: ImageMessage;
}

export interface DocumentMessage {
  id?: string;
  link?: string;
  caption?: string;
  filename: string;
}

export interface SendDocumentMessage {
  to: string;
  document: DocumentMessage;
}
