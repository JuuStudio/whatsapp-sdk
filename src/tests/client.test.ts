import { createBot, verifyWebhook, handleWebhook } from "../index";
import { WebhookMessageType } from "../types/core";

describe("WhatsApp Client", () => {
  const bot = createBot({
    token: "test-token",
    numberId: "test-number",
  });

  test("createBot returns client instance", () => {
    expect(bot).toBeDefined();
  });

  test("verifyWebhook validates correctly", () => {
    const result = verifyWebhook(
      "subscribe",
      "valid-token",
      "1234",
      "valid-token"
    );
    expect(result).toBe("1234");
  });

  test("verifyWebhook rejects invalid token", () => {
    const result = verifyWebhook(
      "subscribe",
      "invalid-token",
      "1234",
      "valid-token"
    );
    expect(result).toBe(false);
  });

  test("handleWebhook processes message correctly", () => {
    const payload: any = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "test",
          changes: [
            {
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "1234567890",
                  phone_number_id: "1234",
                },
                contacts: [
                  {
                    profile: { name: "Test User" },
                    wa_id: "1234567890",
                  },
                ],
                messages: [
                  {
                    from: "1234567890",
                    id: "msg-id",
                    timestamp: "1234567890",
                    type: "text",
                    text: { body: "Hello" },
                  },
                ],
              },
              field: "messages",
            },
          ],
        },
      ],
    };

    const result = handleWebhook(payload);
    expect(result.messages[0]).toHaveProperty("from", "1234567890");
    expect(result.messages[0].text?.body).toBe("Hello");
    expect(result.messages[0].content).toEqual(result.messages[0].text);
  });

  test("handleWebhook processes interactive message correctly", () => {
    const payload: any = {
      object: "whatsapp_business_account",
      entry: [{
        id: "test",
        changes: [{
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "1234567890",
              phone_number_id: "1234"
            },
            contacts: [{
              profile: { name: "Test User" },
              wa_id: "1234567890"
            }],
            messages: [{
              from: "1234567890",
              id: "msg-id",
              timestamp: "1234567890",
              type: "interactive",
              interactive: {
                type: {
                  button_reply: {
                    id: "btn_1",
                    title: "Yes"
                  }
                }
              }
            }]
          },
          field: "messages"
        }]
      }]
    };

    const result = handleWebhook(payload);
    expect(result.messages[0].content).toHaveProperty("type.button_reply.id", "btn_1");
  });

  test("handleWebhook processes status updates", () => {
    const payload: any = {
      object: "whatsapp_business_account",
      entry: [{
        id: "test",
        changes: [{
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "1234567890",
              phone_number_id: "1234"
            },
            contacts: [{
              profile: { name: "Test User" },
              wa_id: "1234567890"
            }],
            statuses: [{
              id: "msg-id",
              status: "delivered",
              timestamp: "1234567890",
              recipient_id: "1234567890",
              conversation: {
                id: "conv_id",
                origin: {
                  type: "service"
                }
              }
            }]
          },
          field: "messages"
        }]
      }]
    };

    const result = handleWebhook(payload);
    expect(result.statuses[0].status).toBe("delivered");
    expect(result.statuses[0].conversation.origin.type).toBe("service");
  });

  test("sendText with preview URL", async () => {
    const mockApi = jest.spyOn(bot['api'], 'post').mockResolvedValueOnce({
      data: {
        messaging_product: "whatsapp",
        contacts: [{ input: "+16505551234", wa_id: "16505551234" }],
        messages: [{ id: "test-message-id" }]
      }
    });

    await bot.sendText("16505551234", "Hello with URL", true);

    expect(mockApi).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "16505551234",
        type: "text",
        text: {
          preview_url: true,
          body: "Hello with URL"
        }
      })
    );

    mockApi.mockRestore();
  });

  test("sendImage with media ID", async () => {
    const mockApi = jest.spyOn(bot['api'], 'post').mockResolvedValueOnce({
      data: {
        messaging_product: "whatsapp",
        contacts: [{ input: "+16505551234", wa_id: "16505551234" }],
        messages: [{ id: "test-message-id" }]
      }
    });

    await bot.sendImage("16505551234", {
      id: "test-image-id",
      caption: "Test image"
    });

    expect(mockApi).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "16505551234",
        type: "image",
        image: {
          id: "test-image-id",
          caption: "Test image"
        }
      })
    );

    mockApi.mockRestore();
  });

  test("handleWebhook extracts messages directly", () => {
    const payload: any = {
      object: "whatsapp_business_account",
      entry: [{
        id: "test",
        changes: [{
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "1234567890",
              phone_number_id: "1234"
            },
            contacts: [{
              profile: { name: "Test User" },
              wa_id: "1234567890"
            }],
            messages: [{
              from: "1234567890",
              id: "msg-id",
              timestamp: "1234567890",
              type: "text",
              text: { body: "Hello" }
            }]
          },
          field: "messages"
        }]
      }]
    };

    const { messages, statuses, contacts } = handleWebhook(payload);
    expect(messages).toHaveLength(1);
    expect(messages[0].text?.body).toBe("Hello");
    expect(contacts).toHaveLength(1);
    expect(statuses).toHaveLength(0);
  });
});
