export function getDomain(url: string): string | null {
  try {
    let hostname = new URL(url).hostname;
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    } else if (hostname.startsWith('www2.')) {
      hostname = hostname.slice(5);
    }
    return hostname;
  } catch (error) {
    // console.error('Invalid URL');
    return null;
  }
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
