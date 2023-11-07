import db from "../db.server";

export async function getShop(domain: string) {
  const shop = await db.shop.findFirst({ where: { domain: domain } });

  return shop;
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
