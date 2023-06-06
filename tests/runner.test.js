'use strict';

const { runStoredProc } = require('../app/runner');
const { connectionPool } = require('../app/conn/connection');
const { postToSlack } = require('../app/service/slack.service');

// Mock the dependencies
jest.mock('../app/conn/connection', () => {
  const mockConnection = {
    query: jest.fn((procedure, callback) => {
      callback(null /* mocked results */);
    }),
    release: jest.fn(),
  };

  return {
    connectionPool: {
      getConnection: jest.fn((callback) => {
        callback(null, mockConnection);
      }),
    },
  };
});

// Mock the Slack service module
jest.mock('../app/service/slack.service', () => {
  return {
    postToSlack: jest.fn(),
  };
});

describe('runStoredProc', () => {
  beforeEach(() => {
    // Clear all mock implementations and calls before each test
    jest.clearAllMocks();
  });

  it('should run the stored procedure and resolve with the results', async () => {
    const mockProcedure = 'CALL flat_table_sync();';
    const mockResults = [
      /* mocked results */
    ];
    const mockConnection = {
      query: jest.fn((procedure, callback) => {
        callback(null, mockResults);
      }),
      release: jest.fn(),
    };
    connectionPool.getConnection.mockImplementation((callback) => {
      callback(null, mockConnection);
    });

    const result = await runStoredProc({ procedure: mockProcedure });

    expect(connectionPool.getConnection).toHaveBeenCalledTimes(1);
    expect(mockConnection.query).toHaveBeenCalledWith(
      mockProcedure,
      expect.any(Function)
    );
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResults);
  });

  it('should handle connection acquisition error and reject with the error', async () => {
    const mockError = new Error('Failed to acquire connection');
    connectionPool.getConnection.mockImplementation((callback) => {
      callback(mockError);
    });

    await expect(
      runStoredProc({ procedure: 'CALL flat_table_sync();' })
    ).rejects.toThrowError(mockError);
    expect(connectionPool.getConnection).toHaveBeenCalledTimes(1);
    expect(postToSlack).not.toHaveBeenCalled();
  });

  it('should handle procedure execution error, post to Slack, and reject with the error', async () => {
    const mockError = new Error('Failed to execute procedure');
    const mockProcedure = 'CALL flat_table_sync();';
    connectionPool.getConnection.mockImplementation((callback) => {
      const mockConnection = {
        query: jest.fn((procedure, callback) => {
          callback(mockError);
        }),
        release: jest.fn(),
      };
      callback(null, mockConnection);
    });

    await expect(
      runStoredProc({ procedure: mockProcedure })
    ).rejects.toThrowError(mockError);
    expect(connectionPool.getConnection).toHaveBeenCalledTimes(1);
    expect(postToSlack).toHaveBeenCalledTimes(1);
    expect(postToSlack).toHaveBeenCalledWith(
      expect.stringContaining(mockProcedure)
    );
  });
});
