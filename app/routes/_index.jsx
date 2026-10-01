import { redirect } from "@remix-run/node";
import { login } from "../shopify.server";
import { Form } from "@remix-run/react";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  
  // If Shopify sends a request with a shop parameter, redirect to the embedded app
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  
  return null;
};

export const action = async ({ request }) => {
  const body = await request.formData();
  const shop = String(body.get("shop") || "");
  
  if (!shop) {
    return Response.json({ error: "Shop is required" }, { status: 400 });
  }

  throw await login(shop, {
    url: request.url,
  });
};

export default function Index() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>PromoPopup App</h1>
      <p>To install this app, enter your store domain below:</p>
      <Form method="post" action="/?index">
        <input 
          type="text" 
          name="shop" 
          placeholder="your-store.myshopify.com" 
          style={{ padding: '0.5rem', width: '300px' }} 
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }}>
          Install
        </button>
      </Form>
    </div>
  );
}
