import { RenderClient } from '../src/renderClient';
import axios from 'axios';
import { LogsParams, LogsResponse } from '../src/types/renderTypes';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RenderClient', () => {
  let client: RenderClient;
  let mockAxiosInstance: any;
  const mockApiKey = 'test-api-key';
  
  // Mock axios.create before creating the client
  beforeEach(() => {
    // Create a mock axios instance with all required methods and properties
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn()
        },
        response: {
          use: jest.fn()
        }
      }
    };
    
    // Mock the axios.create method to return our mock instance
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    
    // Now create the client
    client = new RenderClient(mockApiKey);
    jest.clearAllMocks();
  });

  describe('listServices', () => {
    it('should fetch services successfully', async () => {
      const mockServices = {
        data: [
          {
            id: 'srv-123',
            name: 'Test Service',
            type: 'web_service',
          },
        ],
        cursor: 'next-page',
      };

      // Set up the mock response
      mockAxiosInstance.get.mockResolvedValue({ data: mockServices });

      const result = await client.listServices({ limit: 10 });
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/services', { params: { limit: 10 } });
      expect(result).toEqual(mockServices);
    });
  });

  describe('getService', () => {
    it('should fetch a service by ID', async () => {
      const mockService = {
        data: {
          id: 'srv-123',
          name: 'Test Service',
          type: 'web_service',
        },
      };

      // Set up the mock response
      mockAxiosInstance.get.mockResolvedValue({ data: mockService });

      const result = await client.getService('srv-123');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/services/srv-123');
      expect(result).toEqual(mockService.data);
    });
  });

  describe('deployService', () => {
    it('should deploy a service', async () => {
      const mockDeploy = {
        data: {
          id: 'dep-123',
          status: 'created',
        },
      };

      // Set up the mock response
      mockAxiosInstance.post.mockResolvedValue({ data: mockDeploy });

      const result = await client.deployService('srv-123', { clearCache: true });
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/services/srv-123/deploys', { clearCache: true });
      expect(result).toEqual(mockDeploy.data);
    });
  });

  describe('getLogs', () => {
    it('should fetch logs for a specific service', async () => {
      const mockLogs: LogsResponse = {
        logs: [
          {
            id: 'log-1',
            timestamp: '2024-01-01T12:00:00Z',
            level: 'info',
            message: 'Server started',
            instanceId: 'inst-123',
          },
          {
            id: 'log-2',
            timestamp: '2024-01-01T12:00:01Z',
            level: 'error',
            message: 'Connection failed',
            instanceId: 'inst-123',
          },
        ],
        hasMore: true,
        nextStartTime: '2024-01-01T12:00:02Z',
        nextEndTime: '2024-01-01T12:00:10Z',
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockLogs });

      const params: LogsParams = {
        serviceId: 'srv-123',
        limit: 100,
        level: 'error',
      };

      const result = await client.getLogs(params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/services/srv-123/logs',
        {
          params: {
            limit: 100,
            level: 'error',
          },
        }
      );
      expect(result).toEqual(mockLogs);
    });

    it('should fetch logs across all services when no serviceId provided', async () => {
      const mockLogs: LogsResponse = {
        logs: [],
        hasMore: false,
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockLogs });

      const params: LogsParams = {
        startTime: '2024-01-01T00:00:00Z',
        endTime: '2024-01-01T23:59:59Z',
      };

      const result = await client.getLogs(params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/logs',
        {
          params: {
            startTime: '2024-01-01T00:00:00Z',
            endTime: '2024-01-01T23:59:59Z',
          },
        }
      );
      expect(result).toEqual(mockLogs);
    });

    it('should handle errors gracefully', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('API error'));

      const params: LogsParams = {
        serviceId: 'srv-123',
      };

      const result = await client.getLogs(params);

      expect(result).toEqual({
        logs: [],
        hasMore: false,
      });
    });
  });

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      // Set up the mock response
      mockAxiosInstance.get.mockResolvedValue({ data: { data: [] } });

      const result = await client.testConnection();
      
      expect(mockAxiosInstance.get).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      // Set up the mock response
      mockAxiosInstance.get.mockRejectedValue(new Error('Connection failed'));

      const result = await client.testConnection();
      
      expect(mockAxiosInstance.get).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
