import axios from "axios";
import { WhatsAppError } from "../utils/errors";

const GRAPH_API_URL = "https://graph.facebook.com/v22.0";

export async function getMediaUrl(
  mediaId: string,
  accessToken: string,
  phoneNumberId?: string
): Promise<string> {
  try {
    let url = `${GRAPH_API_URL}/${mediaId}`;
    if (phoneNumberId) url += `?phone_number_id=${phoneNumberId}`;

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

export async function downloadMedia(
  mediaUrl: string,
  accessToken: string
): Promise<ArrayBuffer> {
  try {
    const response = await axios.get(mediaUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to download media: ${error.message}`);
  }
}
