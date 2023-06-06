'use strict';

const fs = require('fs');

const { runStoredProc } = require('../app/runner');
const { syncFlatTables } = require('../app/process-manager');

// Mock the dependencies
jest.mock('fs');
jest.mock('../app/runner', () => {
  return {
    runStoredProc: jest.fn(),
  };
});

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

describe('syncFlatTables', () => {
  beforeEach(() => {
    // Clear all mock implementations and calls before each test
    jest.clearAllMocks();
  });

  it('should process day jobs when time is "day"', async () => {
    const config = {
      jobs: {
        day: [
          {
            name: 'Job 1',
            procedure: 'Procedure 1',
            priority: 1,
            isEnabled: true,
          },
          {
            name: 'Job 2',
            procedure: 'Procedure 2',
            priority: 2,
            isEnabled: true,
          },
        ],
        night: [],
      },
    };
    fs.readFileSync.mockImplementationOnce(() => JSON.stringify(config));
    runStoredProc.mockResolvedValueOnce();

    await syncFlatTables('day');

    expect(fs.readFileSync).toHaveBeenCalledWith(
      './conf/sync-jobs.json',
      'utf8'
    );
    //expect(runStoredProc).toHaveBeenCalledTimes(2);
    expect(runStoredProc).toHaveBeenNthCalledWith(1, {
      procedure: 'Procedure 1',
      name: 'Job 1',
    });
    expect(runStoredProc).toHaveBeenNthCalledWith(2, {
      procedure: 'Procedure 2',
      name: 'Job 2',
    });
  });

  it('should process night jobs when time is not "day"', async () => {
    const config = {
      jobs: {
        day: [],
        night: [
          {
            name: 'Job 3',
            procedure: 'Procedure 3',
            priority: 3,
            isEnabled: true,
          },
        ],
      },
    };
    fs.readFileSync.mockReturnValueOnce(JSON.stringify(config));

    await syncFlatTables('night');

    expect(fs.readFileSync).toHaveBeenCalledWith(
      './conf/sync-jobs.json',
      'utf8'
    );
    expect(runStoredProc).toHaveBeenCalledTimes(1);
    expect(runStoredProc).toHaveBeenCalledWith({
      procedure: 'Procedure 3',
      name: 'Job 3',
    });
  });

  it('should skip disabled jobs', async () => {
    const config = {
      jobs: {
        day: [
          {
            name: 'Job 4',
            procedure: 'Procedure 4',
            priority: 4,
            isEnabled: false,
          },
        ],
        night: [],
      },
    };
    fs.readFileSync.mockReturnValueOnce(JSON.stringify(config));

    await syncFlatTables('day');

    expect(fs.readFileSync).toHaveBeenCalledWith(
      './conf/sync-jobs.json',
      'utf8'
    );
    expect(runStoredProc).not.toHaveBeenCalled();
  });

  it('should handle invalid config structure', async () => {
    const config = {
      jobs: {
        // Missing required properties
      },
    };
    fs.readFileSync.mockReturnValueOnce(JSON.stringify(config));

    await syncFlatTables();

    expect(fs.readFileSync).toHaveBeenCalledWith(
      './conf/sync-jobs.json',
      'utf8'
    );
    //expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Invalid config structure'));
  });

  it('should handle errors thrown during job processing', async () => {
    const config = {
      jobs: {
        day: [
          {
            name: 'Job 5',
            procedure: 'Procedure 5',
            priority: 5,
            isEnabled: true,
          },
        ],
        night: [],
      },
    };
    fs.readFileSync.mockReturnValueOnce(JSON.stringify(config));
    runStoredProc.mockRejectedValueOnce(
      new Error('Failed to run stored procedure')
    );

    await syncFlatTables('day');

    expect(fs.readFileSync).toHaveBeenCalledWith(
      './conf/sync-jobs.json',
      'utf8'
    );
    expect(runStoredProc).toHaveBeenCalledTimes(1);
    expect(runStoredProc).toHaveBeenCalledWith({
      procedure: 'Procedure 5',
      name: 'Job 5',
    });
  });
});
