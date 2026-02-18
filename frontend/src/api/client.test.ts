import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './client';

describe('API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should make GET requests to /api prefix', async () => {
    const mockData = [{ id: '1', name: 'Test Game' }];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await api.get('/games');
    expect(fetch).toHaveBeenCalledWith('/api/games', {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result).toEqual(mockData);
  });

  it('should make POST requests with JSON body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }),
    );

    await api.post('/sync/steam', { key: 'value' });
    expect(fetch).toHaveBeenCalledWith('/api/sync/steam', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: '{"key":"value"}',
    });
  });

  it('should throw on non-ok responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' }),
      }),
    );

    await expect(api.get('/games/unknown')).rejects.toThrow('Not found');
  });
});
