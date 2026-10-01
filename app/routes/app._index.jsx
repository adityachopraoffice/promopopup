import { Page, Layout, Card, Text, Button, BlockStack, InlineStack, Badge, CalloutCard } from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = session.shop;

  let billingCheck;
  try {
    billingCheck = await billing.check({
      plans: ['basic', 'pro'],
      isTest: true,
    });
  } catch (error) {
    billingCheck = { hasActivePayment: false, appSubscriptions: [] };
  }

  let activePlan = "free";
  if (billingCheck.hasActivePayment) {
    if (billingCheck.appSubscriptions.some(sub => sub.name === 'pro')) {
      activePlan = "pro";
    } else if (billingCheck.appSubscriptions.some(sub => sub.name === 'basic')) {
      activePlan = "basic";
    }
  }

  return json({ shop, activePlan });
};

export default function Dashboard() {
  const { shop, activePlan } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <CalloutCard
            title="Welcome to PromoPopup!"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            primaryAction={{
              content: 'Customize Popup',
              onAction: () => navigate("/app/settings"),
            }}
          >
            <p>
              Your store is ready to convert more visitors into customers. 
              Configure your popup message, timing, and design in the Settings tab.
            </p>
          </CalloutCard>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Current Plan</Text>
              <InlineStack align="space-between">
                <Text as="p" variant="bodyMd">You are currently on the</Text>
                <Badge tone="info">{activePlan.toUpperCase()}</Badge>
              </InlineStack>
              {activePlan === "free" && (
                <Button onClick={() => navigate("/app/billing")}>
                  Upgrade Plan
                </Button>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">App Embed Status</Text>
              <Text as="p" variant="bodyMd">
                Make sure PromoPopup is toggled ON in your Shopify Theme Editor for it to appear on your storefront.
              </Text>
              <Button 
                variant="primary" 
                url={`https://${shop}/admin/themes/current/editor?context=apps`} 
                target="_blank"
              >
                Open Theme Editor
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
