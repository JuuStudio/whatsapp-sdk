import { getMediaUrl, downloadMedia } from '../src/utils/media';
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

      const url = await getMediaUrl('media-id', 'test-token');
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

      const result = await downloadMedia('https://example.com/media', 'test-token');
      expect(result).toEqual(Buffer.from('test-data'));
    });
  });
}); 