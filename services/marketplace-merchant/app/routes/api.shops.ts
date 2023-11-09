import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getShop, getShops } from "~/models/Shop.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const shops = await getShops();
  return json({ shops });
};
