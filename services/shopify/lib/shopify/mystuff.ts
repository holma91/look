import { SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import { removeEdgesAndNodes, reshapeProduct, reshapeProducts } from '.';
import { getProductQuery, getProductsQuery } from './queries/product';
import {
  Product,
  ShopifyProductOperation,
  ShopifyProductsOperation,
} from './types';

// const domain = process.env.SHOPIFY_STORE_DOMAIN
//   ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
//   : '';
// const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const salesChannelDomain = process.env.SALES_CHANNEL_DOMAIN + '/api/shops';
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

export async function salesChannelFetch<T>(): Promise<{ body: T }> {
  const result = await fetch(salesChannelDomain!, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': key,
    },
  });

  const body = await result.json();

  if (body.errors) {
    throw body.errors[0];
  }

  return {
    body,
  };
}

export async function newShopifyFetch<T>({
  cache = 'force-cache',
  domain,
  key,
  headers,
  query,
  tags,
  variables,
}: {
  domain: string;
  key: string;
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    console.log('domain: ', domain);

    const url = `https://${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

async function getStorefrontAccessToken(domain: string): Promise<string> {
  const salesChannelDomain =
    process.env.SALES_CHANNEL_DOMAIN + `/api/storefront?domain=${domain}`;
  const result = await fetch(salesChannelDomain!, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = await result.json();

  if (body.errors) {
    throw body.errors[0];
  }

  return body.storefrontAccessToken;
}

export async function getProduct(
  domain: string,
  handle: string
): Promise<Product | undefined> {
  const storefrontAccessToken = await getStorefrontAccessToken(domain);
  const res = await newShopifyFetch<ShopifyProductOperation>({
    domain: domain,
    key: storefrontAccessToken,
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle,
    },
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProducts({
  domain,
  query,
  reverse,
  sortKey,
}: {
  domain: string;
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const storefrontAccessToken = await getStorefrontAccessToken(domain);
  const res = await newShopifyFetch<ShopifyProductsOperation>({
    domain: domain,
    key: storefrontAccessToken,
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey,
    },
    cache: 'no-cache',
  });

  // console.log('res: ', res);

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}
