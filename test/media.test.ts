import { getMediaUrl as mainGetMediaUrl } from '../src';
import { getMediaUrl as subpathGetMediaUrl } from '../src/media';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Media Functions', () => {
  describe('getMediaUrl', () => {
    it('should fetch media URL successfully', async () => {
      const mockResponse = {
        data: {
          url: 'https://example.com/media',
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const url = await mainGetMediaUrl('media-id', 'test-token');
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

      const result = await mainGetMediaUrl('https://example.com/media', 'test-token');
      expect(result).toEqual(Buffer.from('test-data'));
    });
  });

  describe('Media exports', () => {
    it('should be accessible from main export', async () => {
      expect(mainGetMediaUrl).toBeDefined();
      // Add your existing tests...
    });

    it('should be accessible from media subpath', async () => {
      expect(subpathGetMediaUrl).toBeDefined();
      // Add your existing tests...
    });
  });
}); 