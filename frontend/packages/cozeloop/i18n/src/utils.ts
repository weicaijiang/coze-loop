// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
function getCookieValue(name: string) {
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');

    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
}

const DETECT_FROM = {
  querystring: (q: string) => {
    const url = new URL(location.href);

    return url.searchParams.get(q);
  },
  cookie: (k: string) => getCookieValue(k),
  localStorage: (k: string) => localStorage.getItem(k),
  navigator: () => navigator.language,
  htmlTag: () => {
    const htmlElement = document.documentElement;
    if (htmlElement && htmlElement.hasAttribute('lang')) {
      return htmlElement.getAttribute('lang');
    }
    return null;
  },
} as const;

/**
 * detect language with default language (highest priority)
 *
 * see detection config 👇
 * ``` typescript
 * detection: {
 *   order: [
 *     'querystring',
 *     'cookie',
 *     'localStorage',
 *     'navigator',
 *     'htmlTag',
 *   ],
 *   lookupQuerystring: 'lng',
 *   lookupCookie: 'i18next',
 *   lookupLocalStorage: 'i18next',
 *   caches: ['cookie'],
 * },
 * ```
 */
export function detectLng(defaultLng?: string) {
  return (
    defaultLng ||
    DETECT_FROM.querystring('lng') ||
    DETECT_FROM.cookie('i18next') ||
    DETECT_FROM.localStorage('i18next') ||
    DETECT_FROM.navigator() ||
    DETECT_FROM.htmlTag() ||
    undefined
  );
}
