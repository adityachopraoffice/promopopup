import prisma from "./app/db.server.js";

async function test() {
  try {
    await prisma.session.upsert({
      where: { id: "test" },
      update: { shop: "test", state: "test", isOnline: false, accessToken: "test" },
      create: { id: "test", shop: "test", state: "test", isOnline: false, accessToken: "test" },
    });
    console.log("Success");
  } catch (e) {
    console.error(e);
  }
}
test();
