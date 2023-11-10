import { json } from "@remix-run/node";
import db from "../db.server";
import { log } from "console";

export async function getShop(domain: string) {
  const shop = await db.shop.findFirst({ where: { domain: domain } });

  return shop;
}

export async function getShops() {
  const shops = await db.shop.findMany();

  return shops;
}

export async function finishOnboarding(domain: string) {
  const shop = await db.shop.update({
    where: { domain: domain },
    data: {
      onboardingInfoCompleted: true,
      termsAccepted: true,
      onboardingCompleted: true,
    },
  });

  return shop;
}
