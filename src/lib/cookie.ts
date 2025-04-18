/**
 * Set a cookie with the given name and value
 * @param name Cookie name
 * @param value Cookie value (will be encoded with encodeURIComponent)
 * @param days Number of days until the cookie expires
 * @param path Cookie path (default: '/')
 * @param domain Cookie domain
 * @param secure Whether the cookie should only be transmitted over secure protocol
 */
export function setCookie(
  name: string,
  value: string,
  days?: number,
  path: string = '/',
  domain?: string,
  secure: boolean = false
): void {
  const encodedValue = encodeURIComponent(value);
  let cookieString = `${name}=${encodedValue}`;

  if (days !== undefined) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 * @param name Cookie name
 * @returns Decoded cookie value or empty string if not found
 */
export function getCookie(name: string): string {
  const nameEq = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();

    if (cookie.indexOf(nameEq) === 0) {
      const encodedValue = cookie.substring(nameEq.length);
      return decodeURIComponent(encodedValue);
    }
  }

  return '';
}

/**
 * Check if a cookie exists
 * @param name Cookie name
 * @returns Boolean indicating if the cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== '';
}

/**
 * Remove a cookie by setting its expiration to the past
 * @param name Cookie name
 * @param path Cookie path (default: '/')
 * @param domain Cookie domain
 */
export function removeCookie(
  name: string,
  path: string = '/',
  domain?: string
): void {
  setCookie(name, '', -1, path, domain);
}
