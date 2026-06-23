// IMPORTANT: imported FIRST in main.tsx, before the Firebase SDK loads, so this
// wrapper is in place before the SDK captures a reference to window.fetch.
//
// In some environments the Firebase Auth SDK builds a request header whose
// value contains a character that is invalid in HTTP header values. The browser
// then throws "Failed to execute 'fetch' on 'Window': Invalid value", which the
// SDK surfaces as the misleading `auth/network-request-failed`. We defend by
// stripping any character outside the valid HTTP header-value range from
// outgoing header values before the request is sent.

const originalFetch = window.fetch.bind(window);

// Valid HTTP header value characters: HTAB (0x09) plus visible ASCII 0x20-0x7E.
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[^\t\x20-\x7E]/g, "");
}

window.fetch = function patchedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  if (init?.headers) {
    try {
      const entries: [string, string][] =
        init.headers instanceof Headers
          ? [...init.headers.entries()]
          : Array.isArray(init.headers)
            ? (init.headers as [string, string][])
            : Object.entries(init.headers as Record<string, string>);

      const cleaned: Record<string, string> = {};
      for (const [key, rawValue] of entries) {
        cleaned[key] = sanitizeHeaderValue(String(rawValue));
      }
      init = { ...init, headers: cleaned };
    } catch {
      // If anything goes wrong, fall through with the original init.
    }
  }
  return originalFetch(input, init);
};

export {};
