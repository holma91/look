export function getDomain(url: string): string | null {
  try {
    let hostname = new URL(url).hostname;
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }
    return hostname;
  } catch (error) {
    console.error('Invalid URL');
    return null;
  }
}
