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
    console.error('Invalid URL');
    console.log(error);
    return null;
  }
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function arraysAreEqual(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}
