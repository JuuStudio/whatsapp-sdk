import { getMediaUrl as mainGetMediaUrl, downloadMedia as mainDownloadMedia } from '../src';
import { getMediaUrl as subpathGetMediaUrl, downloadMedia as subpathDownloadMedia } from '../src/media';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Media Functions', () => {
  const ACCESS_TOKEN = 'test-token';

  describe('getMediaUrl', () => {
    it('should fetch media URL successfully', async () => {
      const mockResponse = {
        data: {
          url: 'https://example.com/media',
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const url = await mainGetMediaUrl('media-id', ACCESS_TOKEN);
      expect(url).toBe('https://example.com/media');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://graph.facebook.com/v22.0/media-id',
        expect.any(Object)
      );
    });
  });

  describe('downloadMedia', () => {
    it('should download media successfully', async () => {
      const mockResponse = {
        data: Buffer.from('test-data'),
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await mainDownloadMedia('media-id', ACCESS_TOKEN);
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