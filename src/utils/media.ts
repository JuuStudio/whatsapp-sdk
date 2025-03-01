import axios from "axios";
import { WhatsAppError } from "../utils/errors";
import { MediaParams } from '../types/core';

const GRAPH_API_URL = "https://graph.facebook.com/v22.0";

export async function getMediaUrl(params: MediaParams): Promise<string> {
  const { mediaId, accessToken } = params;
  try {
    const url = `${GRAPH_API_URL}/${mediaId}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data.url;
  } catch (error: any) {
    console.error("Media URL fetch failed:", error);
    if (axios.isAxiosError(error)) {
      throw new WhatsAppError(
        error.response?.data?.message || error.message,
        String(error.response?.status || 500)
      );
    }
    throw error;
  }
}

export async function downloadMedia(params: MediaParams): Promise<Buffer> {
  const { accessToken } = params;
  try {
    const mediaUrl = await getMediaUrl(params);
    const response = await axios.get(mediaUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data);
  } catch (error: any) {
    throw new Error(`Failed to download media: ${error.message}`);
  }
}
