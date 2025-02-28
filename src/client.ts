import axios, { AxiosInstance } from "axios";
import {
  BotConfig,
  WhatsAppResponse,
  TextMessage,
  MessageResponse,
} from "./types/core";
import { handleApiError, WhatsAppError } from "./utils/errors";

export class WhatsAppClient {
  protected api: AxiosInstance;
  private config: BotConfig;

  constructor(config: BotConfig) {
    this.config = {
      apiVersion: "v22.0",
      ...config,
    };

    this.api = axios.create({
      baseURL: `https://graph.facebook.com/${this.config.apiVersion}`,
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        "Content-Type": "application/json",
      },
    });
  }

  private async sendMessage(payload: any): Promise<WhatsAppResponse> {
    try {
      const response = await this.api.post<WhatsAppResponse>(
        `/${this.config.numberId}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          ...payload,
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async sendText(
    to: string,
    text: string,
    previewUrl: boolean = false
  ): Promise<WhatsAppResponse> {
    return this.sendMessage({
      to,
      type: "text",
      text: {
        preview_url: previewUrl,
        body: text,
      },
    });
  }

  async sendImage(
    to: string,
    image: { id?: string; link?: string; caption?: string }
  ): Promise<WhatsAppResponse> {
    if (!image.id && !image.link) {
      throw new WhatsAppError("Either image id or link must be provided");
    }

    return this.sendMessage({
      to,
      type: "image",
      image: {
        ...(image.id && { id: image.id }),
        ...(image.link && { link: image.link }),
        ...(image.caption && { caption: image.caption }),
      },
    });
  }

  async sendVideo(
    to: string,
    video: { id?: string; link?: string; caption?: string }
  ): Promise<WhatsAppResponse> {
    if (!video.id && !video.link) {
      throw new WhatsAppError("Either video id or link must be provided");
    }

    return this.sendMessage({
      to,
      type: "video",
      video: {
        ...(video.id && { id: video.id }),
        ...(video.link && { link: video.link }),
        ...(video.caption && { caption: video.caption }),
      },
    });
  }

  async sendAudio(
    to: string,
    audio: { id?: string; link?: string }
  ): Promise<WhatsAppResponse> {
    if (!audio.id && !audio.link) {
      throw new WhatsAppError("Either audio id or link must be provided");
    }

    return this.sendMessage({
      to,
      type: "audio",
      audio: {
        ...(audio.id && { id: audio.id }),
        ...(audio.link && { link: audio.link }),
      },
    });
  }

  async sendDocument(
    to: string,
    document: { id?: string; link?: string; caption?: string; filename: string }
  ): Promise<WhatsAppResponse> {
    if (!document.id && !document.link) {
      throw new WhatsAppError("Either document id or link must be provided");
    }

    return this.sendMessage({
      to,
      type: "document",
      document: {
        ...(document.id && { id: document.id }),
        ...(document.link && { link: document.link }),
        ...(document.caption && { caption: document.caption }),
        filename: document.filename,
      },
    });
  }

  async sendSticker(
    to: string,
    sticker: { id?: string; link?: string }
  ): Promise<WhatsAppResponse> {
    if (!sticker.id && !sticker.link) {
      throw new WhatsAppError("Either sticker id or link must be provided");
    }

    return this.sendMessage({
      to,
      type: "sticker",
      sticker: {
        ...(sticker.id && { id: sticker.id }),
        ...(sticker.link && { link: sticker.link }),
      },
    });
  }

  async sendLocation(
    to: string,
    location: {
      latitude: number;
      longitude: number;
      name?: string;
      address?: string;
    }
  ): Promise<WhatsAppResponse> {
    return this.sendMessage({
      to,
      type: "location",
      location,
    });
  }

  async sendInteractiveButtons(
    to: string,
    { body, buttons }: { body: string; buttons: Array<{ title: string }> }
  ): Promise<WhatsAppResponse> {
    return this.sendMessage({
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: body },
        action: {
          buttons: buttons.map((button, index) => ({
            type: "reply",
            reply: {
              id: `button_${index}`,
              title: button.title,
            },
          })),
        },
      },
    });
  }

  async sendInteractiveList(
    to: string,
    {
      body,
      buttonText,
      sections,
    }: {
      body: string;
      buttonText: string;
      sections: Array<{
        title: string;
        rows: Array<{ id: string; title: string; description?: string }>;
      }>;
    }
  ): Promise<WhatsAppResponse> {
    return this.sendMessage({
      to,
      type: "interactive",
      interactive: {
        type: "list",
        body: { text: body },
        action: {
          button: buttonText,
          sections,
        },
      },
    });
  }
}
