import { CIAM_API_BASE_URL, request } from './request';

export async function getPreferences(signal: AbortSignal) {
  const data = await request({
    url: `${CIAM_API_BASE_URL}/csp/agent/preferences`,
    method: 'GET',
    signal,
  });
  return data;
}
