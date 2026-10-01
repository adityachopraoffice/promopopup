import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return json(
      { error: "Missing shop parameter" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  let settings = await prisma.shopSettings.findUnique({
    where: { shop },
  });

  if (!settings) {
    settings = {
      shop,
      headline: "🎉 Special Offer Just For You!",
      message: "Shop now and enjoy our latest deals!",
      imageUrl: "",
      delaySeconds: 5,
      selectedTemplate: "minimal",
      bgColor: "#FFFFFF",
      textColor: "#000000",
      buttonColor: "#000000",
      buttonTextColor: "#FFFFFF",
      overlayColor: "rgba(0,0,0,0.5)",
      currentPlan: "free",
    };
  }

  return json(settings, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};
