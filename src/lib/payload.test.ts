import { describe, expect, it, vi } from 'vitest';
import { createPayloadClient } from './payload';

const options = { endpoint: 'pages', global: false, lang: 'en' };

function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

function calledUrl(mock: ReturnType<typeof vi.fn>): URL {
  return new URL((mock.mock.calls as unknown[][])[0][0] as string);
}

describe('createPayloadClient', () => {
  it.each([undefined, '', '   '])('rejects a missing base URL', (baseUrl) => {
    expect(() => createPayloadClient(baseUrl)).toThrow(/PUBLIC_PAYLOAD_URL.*missing or empty/);
  });

  it.each(['relative/path', '://broken'])('rejects malformed base URLs', (baseUrl) => {
    expect(() => createPayloadClient(baseUrl)).toThrow(/valid absolute URL/);
  });

  it('rejects unsupported protocols', () => {
    expect(() => createPayloadClient('file:///tmp/payload')).toThrow(/must use http or https/);
  });

  it('normalizes paths and builds the generic collection query', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ docs: [] }));
    const client = createPayloadClient('https://example.com/cms/', fetchMock);
    await client({ ...options, endpoint: '/pages', lang: 'fi', sort: '-date' });

    const url = calledUrl(fetchMock);
    expect(url.pathname).toBe('/cms/api/pages');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      locale: 'fi',
      limit: '2000',
      sort: '-date',
    });
  });

  it('uses wildcard locale when language is omitted', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}));
    const client = createPayloadClient('https://example.com', fetchMock);
    await client({ endpoint: 'pages', global: false });
    expect(calledUrl(fetchMock).searchParams.get('locale')).toBe('*');
  });

  it('builds globals and localized menu requests without collection limits', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}));
    const client = createPayloadClient('https://example.com', fetchMock);
    await client({ endpoint: 'mainNav', global: true, menu: true, lang: 'fi' });

    const url = calledUrl(fetchMock);
    expect(url.pathname).toBe('/api/globals/mainNav');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      locale: 'fi',
      depth: '2',
      draft: 'false',
      trash: 'false',
    });
  });

  it.each([
    ['criteria', 'criterionSort'],
    ['guidelines', 'guidelineNumber'],
    ['principles', 'principleNumber'],
  ])('applies the %s collection rule', async (endpoint, sort) => {
    const fetchMock = vi.fn(async () => jsonResponse({}));
    const client = createPayloadClient('https://example.com', fetchMock);
    await client({ endpoint, global: false, lang: 'en', sort: 'ignored' });
    const params = calledUrl(fetchMock).searchParams;
    expect(params.getAll('sort')).toEqual([sort]);
    expect(params.getAll('limit')).toEqual(['200']);
  });

  it('merges search parameters without collection limits', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}));
    const client = createPayloadClient('https://example.com', fetchMock);
    await client({
      endpoint: 'search',
      global: false,
      lang: 'en',
      searchString: 'where%5Btitle%5D%5Blike%5D=contrast&locale=fi',
    });
    const params = calledUrl(fetchMock).searchParams;
    expect(params.get('where[title][like]')).toBe('contrast');
    expect(params.get('locale')).toBe('en');
    expect(params.get('pagination')).toBe('false');
    expect(params.has('limit')).toBe(false);
  });

  it('unwraps one cached raw response independently per caller', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ docs: [1], totalDocs: 1 }));
    const client = createPayloadClient('https://example.com', fetchMock);
    await expect(client<number[]>({ ...options, wrappedByKey: 'docs' })).resolves.toEqual([1]);
    await expect(client<number>({ ...options, wrappedByKey: 'totalDocs' })).resolves.toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reports missing wrapper, HTTP, network, and JSON errors with context', async () => {
    const wrapperClient = createPayloadClient('https://example.com', async () => jsonResponse({}));
    await expect(wrapperClient({ ...options, wrappedByKey: 'docs' })).rejects.toThrow(
      /missing wrapper key "docs".*pages/
    );

    const httpClient = createPayloadClient(
      'https://example.com',
      async () => new Response('', { status: 503, statusText: 'Unavailable' })
    );
    await expect(httpClient(options)).rejects.toThrow(/pages: 503 Unavailable.*example\.com/);

    const networkClient = createPayloadClient('https://example.com', async () => {
      throw new Error('offline');
    });
    await expect(networkClient(options)).rejects.toThrow(/pages.*example\.com/);

    const jsonClient = createPayloadClient('https://example.com', async () => new Response('bad'));
    await expect(jsonClient(options)).rejects.toThrow(/not valid JSON for pages.*example\.com/);
  });

  it('deduplicates concurrent and sequential successful requests', async () => {
    let resolveResponse!: (response: Response) => void;
    const fetchMock = vi.fn(
      () => new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      })
    );
    const client = createPayloadClient('https://example.com', fetchMock);
    const first = client(options);
    const second = client(options);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolveResponse(jsonResponse({ ok: true }));
    await expect(Promise.all([first, second])).resolves.toEqual([{ ok: true }, { ok: true }]);
    await client(options);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('keeps distinct URLs independent and retries failed requests', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 500 }))
      .mockImplementation(async () => jsonResponse({ ok: true }));
    const client = createPayloadClient('https://example.com', fetchMock);

    await expect(client(options)).rejects.toThrow(/500/);
    await expect(client(options)).resolves.toEqual({ ok: true });
    await client({ ...options, lang: 'fi' });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
