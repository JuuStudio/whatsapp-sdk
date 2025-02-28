export interface InteractiveButton {
  type: "reply" | "url";
  title: string;
  id?: string;
  url?: string;
}

export interface ListOption {
  title: string;
  description?: string;
  id: string;
}

export interface LocationMessage {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface ProductMessage {
  catalogId: string;
  productId: string;
}

export interface TemplateMessage {
  name: string;
  language: string;
  components?: {
    type: "body" | "header" | "button";
    parameters: Array<{
      type: "text" | "currency" | "date_time" | "image" | "document";
      text?: string;
      currency?: {
        code: string;
        amount: number;
      };
      date_time?: string;
      image?: {
        url: string;
      };
    }>;
  }[];
}

export interface ReactionMessage {
  messageId: string;
  emoji: string;
}

export type MessageType =
  | "text"
  | "image"
  | "video"
  | "document"
  | "audio"
  | "location"
  | "contacts"
  | "interactive"
  | "product"
  | "template"
  | "reaction";
