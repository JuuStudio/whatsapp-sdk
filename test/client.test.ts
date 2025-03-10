import { WhatsAppClient } from "../src/client";
import axios from "axios";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
  isAxiosError: jest.fn(),
}));

describe("WhatsAppClient", () => {
  let client: WhatsAppClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
    };
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    client = new WhatsAppClient({
      token: "test-token",
      numberId: "test-number-id",
    });
  });

  describe("sendText", () => {
    it("should send a text message successfully", async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: {
          messaging_product: "whatsapp",
          contacts: [{ wa_id: "1234567890" }],
          messages: [{ id: "message-id" }],
        },
      });

      const result = await client.sendText("1234567890", "Hello, World!");
      expect(result.messages[0].id).toBe("message-id");
    });

    it("should handle errors properly", async () => {
      const errorResponse = {
        response: {
          data: {
            error: {
              message: "Invalid phone number",
              code: "invalid_number",
            },
          },
          status: 400,
        },
      };

      mockAxiosInstance.post.mockRejectedValueOnce(errorResponse);

      await expect(client.sendText("invalid", "test")).rejects.toThrow(
        "Invalid phone number"
      );
    });
  });

  describe("sendImage", () => {
    it("should send an image message successfully", async () => {
      const mockResponse = {
        data: {
          messaging_product: "whatsapp",
          contacts: [{ wa_id: "1234567890" }],
          messages: [{ id: "message-id" }],
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await client.sendImage("1234567890", {
        link: "https://example.com/image.jpg",
        caption: "Test image",
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/test-number-id/messages",
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: "1234567890",
          type: "image",
          image: {
            link: "https://example.com/image.jpg",
            caption: "Test image",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark a message as read successfully", async () => {
      const mockResponse = {
        data: {
          success: true,
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await client.markMessageAsRead("test-message-id");

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/test-number-id/messages",
        {
          messaging_product: "whatsapp",
          status: "read",
          message_id: "test-message-id",
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors when marking message as read", async () => {
      const errorResponse = {
        response: {
          data: {
            error: {
              message: "Invalid message ID",
              code: "invalid_message_id",
            },
          },
          status: 400,
        },
      };

      mockAxiosInstance.post.mockRejectedValueOnce(errorResponse);

      await expect(client.markMessageAsRead("invalid-id")).rejects.toThrow(
        "Invalid message ID"
      );
    });
  });
});
