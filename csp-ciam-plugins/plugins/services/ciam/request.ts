/* eslint-disable @typescript-eslint/no-explicit-any */

type FetchRequestParams = {
  url: string;
  body: Record<string, any>;
  method: 'GET' | 'POST' | 'PUT';
  signal?: AbortSignal;
  accept?: 'application/json' | 'text/html';
};

function getJwtToken() {
  return localStorage.getItem('jwtToken') || '';
}

/**
 * Custom fetch function that Handles communication with CIAM and processes errors accordingly.
 *
 * @param  options - The request parameters including URL, body, method, and optional signal.
 * @returns The parsed JSON response from the server.
 * @throws - Throws an error if the request fails or is aborted.
 */
export async function request({ url, body, method, signal, accept = 'application/json' }: FetchRequestParams) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getJwtToken()}`,
      Accept: accept,
    },
    signal,
  };

  console.log('Request options:', options);

  if (method !== 'GET' && body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      handleHttpError(response.status);
    }

    if (accept === 'application/json') {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // Request was intentionally aborted using AbortController.
      // This is expected behavior to prevent unnecessary state updates in React.
      return;
    }
    throw error;
  }
}

export const REQUEST_ERROR_EVENT = 'request-error';

function handleHttpError(status: number) {
  if (status === 401) {
    window.location.href = '/logout';
  } else {
    window.dispatchEvent(
      new CustomEvent(REQUEST_ERROR_EVENT, {
        detail: {
          status,
          message: `An error occurred while processing your request. Status code: ${status}`,
        },
      })
    );
  }
}
