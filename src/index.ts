import { WhatsAppClient } from "./client";
import {
  BotConfig,
  WebhookPayload,
  WebhookMessage,
  WebhookStatus,
  WebhookVerifyParams,
} from "./types/core";
import { getMediaUrl, downloadMedia } from "./utils/media";
export function createBot(config: BotConfig): WhatsAppClient {
  return new WhatsAppClient(config);
}

/**
 * Verifies a WhatsApp webhook request
 * @param params The parameters for verifying the webhook
 * @returns The challenge string if verification succeeds, false otherwise
 */
export function verifyWebhook(params: WebhookVerifyParams): string | false {
  const { mode, token, challenge, verifyToken } = params;
  
  if (!mode || !token || !challenge) {
    return false;
  }

  if (mode === "subscribe" && token === verifyToken) {
    return challenge;
  }
  return false;
}

/**
 * Processes a WhatsApp webhook payload
 * @param payload The webhook payload from WhatsApp
 * @returns Parsed messages, statuses and contacts from the webhook
 * @throws {Error} If the payload is invalid
 */
export function handleWebhook(payload: WebhookPayload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid webhook payload: payload must be an object");
  }

  if (payload.object !== "whatsapp_business_account") {
    throw new Error("Invalid webhook payload: invalid object type");
  }

  const messages: WebhookMessage[] = [];
  const statuses: WebhookStatus[] = [];
  const contacts: Array<{
    profile: {
      name: string;
    };
    wa_id: string;
  }> = [];

  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      const value = change.value;

      if (value.messages) {
        messages.push(
          ...value.messages.map((msg) => {
            const content = msg[msg.type as keyof typeof msg];
            return {
              ...msg,
              content: content || undefined,
            };
          })
        );
      }

      if (value.statuses) {
        statuses.push(...value.statuses);
      }

      if (value.contacts) {
        contacts.push(...value.contacts);
      }
    }
  }

  return {
    messages,
    statuses,
    contacts,
  };
}

export { WhatsAppClient };
export * from "./types/core";
export { getMediaUrl, downloadMedia };
