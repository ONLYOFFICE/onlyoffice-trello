export async function fetchWithTimeout(
  url: string,
  options: { timeout: number },
  init: RequestInit | undefined,
): Promise<Response> {
  const cancellation = new AbortController();
  const callTimeout = setTimeout(() => cancellation.abort(), options.timeout);
  const queryOptions: RequestInit = {
    ...init,
    signal: cancellation.signal,
  };
  const response = await fetch(
    url,
    queryOptions,
  );
  clearTimeout(callTimeout);
  return response;
}

export function delay(ms: number): Promise<unknown> {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}
