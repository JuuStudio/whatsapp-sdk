import { WhatsAppClient } from "./client";
import {
  BotConfig,
  WebhookPayload,
  WebhookMessage,
  WebhookStatus,
} from "./types/core";

export function createBot(config: BotConfig): WhatsAppClient {
  return new WhatsAppClient(config);
}

/**
 * Verifies a WhatsApp webhook request
 * @param mode The hub.mode query parameter
 * @param token The hub.verify_token query parameter
 * @param challenge The hub.challenge query parameter
 * @param verifyToken Your configured verify token
 * @returns The challenge string if verification succeeds, false otherwise
 */
export function verifyWebhook(
  mode: string,
  token: string,
  challenge: string,
  verifyToken: string
): string | false {
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
