// IMPORTANT: imported FIRST in main.tsx, before the Firebase SDK loads, so our
// wrapper is in place before the SDK captures a reference to window.fetch.
//
// The Firebase Auth SDK has been throwing "Failed to execute 'fetch' on
// 'Window': Invalid value" in this environment. This wrapper (a) logs the full
// request the SDK builds for Google identity endpoints so we can see exactly
// which value is invalid, and (b) defensively sanitizes header values.

const originalFetch = window.fetch.bind(window);

function sanitizeHeaderValue(value: string): string {
  // Valid HTTP header value chars: HTAB (0x09) plus visible ASCII 0x20-0x7E.
  return value.replace(/[^\t\x20-\x7E]/g, "");
}

window.fetch = function patchedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : (input as Request).url;

  const isGoogleAuth =
    typeof url === "string" &&
    (url.includes("identitytoolkit") || url.includes("securetoken"));

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
        const value = String(rawValue);
        cleaned[key] = sanitizeHeaderValue(value);
      }
      init = { ...init, headers: cleaned };
    } catch {
      /* fall through */
    }
  }

  if (isGoogleAuth) {
    try {
      const info: Record<string, unknown> = { url };
      if (init) {
        for (const k of Object.keys(init)) {
          const v = (init as Record<string, unknown>)[k];
          if (k === "headers") {
            const h =
              v instanceof Headers
                ? Object.fromEntries(v.entries())
                : v;
            info.headers = h;
          } else if (k === "body") {
            info.body = typeof v === "string" ? v.slice(0, 200) : `[${typeof v}]`;
          } else {
            info[k] = v;
          }
        }
      }
      console.log("[ChikkaChat] >>> Firebase fetch call:", info);
    } catch (e) {
      console.log("[ChikkaChat] could not log fetch info", e);
    }
  }

  return originalFetch(input, init);
};

export {};
