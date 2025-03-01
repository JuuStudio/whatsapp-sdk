import { getMediaUrl as mainGetMediaUrl, downloadMedia as mainDownloadMedia } from '../src';
import { getMediaUrl as subpathGetMediaUrl, downloadMedia as subpathDownloadMedia } from '../src/media';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Media Functions', () => {
  const params = {
    mediaId: 'media-id',
    accessToken: 'test-token'
  };

  describe('getMediaUrl', () => {
    it('should fetch media URL successfully', async () => {
      const mockResponse = { data: { url: 'https://example.com/media' } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const url = await mainGetMediaUrl(params);
      expect(url).toBe('https://example.com/media');
    });
  });

  describe('downloadMedia', () => {
    it('should download media successfully', async () => {
      // First mock: getMediaUrl response
      mockedAxios.get.mockResolvedValueOnce({ 
        data: { url: 'https://example.com/media' } 
      });
      // Second mock: actual media download response
      mockedAxios.get.mockResolvedValueOnce({ 
        data: Buffer.from('test-data') 
      });

      const result = await mainDownloadMedia(params);
      expect(result).toEqual(Buffer.from('test-data'));
    });
  });

  describe('Media exports', () => {
    it('should be accessible from main export', () => {
      expect(mainGetMediaUrl).toBeDefined();
      expect(mainDownloadMedia).toBeDefined();
    });

    it('should be accessible from media subpath', () => {
      expect(subpathGetMediaUrl).toBeDefined();
      expect(subpathDownloadMedia).toBeDefined();
    });
  });
}); 