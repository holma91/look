import db from "../db.server";

export async function getShop(domain: string) {
  const shop = await db.shop.findFirst({ where: { domain: domain } });

  return shop;
}
