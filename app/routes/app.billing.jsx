import { Page, Layout, Card, BlockStack, Text, Button, Grid, Badge, List, Banner } from "@shopify/polaris";
import { useLoaderData, useSubmit, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  try {
    const { session, billing } = await authenticate.admin(request);
    const shop = session.shop;

    let billingCheck;
    try {
      billingCheck = await billing.check({
        plans: ['basic', 'pro'],
        isTest: true,
      });
    } catch (error) {
      console.error("Billing Check 403 Error:", error.message);
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

    let settings = await prisma.shopSettings.findUnique({
      where: { shop },
    });

    if (!settings) {
      settings = await prisma.shopSettings.create({
        data: { shop, currentPlan: activePlan },
      });
    } else if (settings.currentPlan !== activePlan) {
      settings = await prisma.shopSettings.update({
        where: { shop },
        data: { currentPlan: activePlan },
      });
    }

    return json({ currentPlan: settings.currentPlan });
  } catch (error) {
    console.error("LOADER CRASH:", error);
    return json({ currentPlan: "error", error: error.message + " | " + error.stack });
  }
};

export const action = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = formData.get("plan");

  const planName = plan === "basic" ? "basic" : "pro";
  
  // Construct the absolute Shopify Admin embedded URL!
  const shopName = session.shop.replace('.myshopify.com', '');
  const returnUrl = `https://admin.shopify.com/store/${shopName}/apps/promptpopup/app/billing`;
    
  try {
    await billing.require({
      plans: [planName],
      isTest: true,
      onFailure: async () => billing.request({
        plan: planName,
        isTest: true,
        returnUrl: returnUrl,
      }),
    });
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      // Catch the Shopify billing redirect and pass the URL to the frontend
      return json({ redirectUrl: error.headers.get("Location") });
    }
    throw error;
  }

  return json({});
};

import { useEffect } from "react";

export default function Billing() {
  const { currentPlan, error } = useLoaderData();
  const submit = useSubmit();
  const actionData = useActionData();

  if (error) {
    return (
      <Page title="Billing Error">
        <Banner title="Server Error" status="critical">
          <p>{error}</p>
        </Banner>
      </Page>
    );
  }

  useEffect(() => {
    if (actionData?.redirectUrl) {
      // Safely redirect the top frame within the Shopify admin
      open(actionData.redirectUrl, "_top");
    }
  }, [actionData]);

  const handleUpgrade = (plan) => {
    submit({ plan }, { method: "post" });
  };

  return (
    <Page title="Billing">
      <Layout>
        <Layout.Section>
          <Text as="p" variant="bodyMd">
            Current Plan: <Badge tone="info">{currentPlan.toUpperCase()}</Badge>
          </Text>
          <div style={{ marginTop: '20px' }}>
            <Grid>
              {/* Free Plan */}
              <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingLg">Free</Text>
                    <Text as="h3" variant="headingMd">$0/mo</Text>
                    <List>
                      <List.Item>Minimal template only</List.Item>
                      <List.Item>Default text only</List.Item>
                      <List.Item>Fixed 5 second delay</List.Item>
                      <List.Item>No image</List.Item>
                      <List.Item>No custom colors</List.Item>
                    </List>
                    <Button disabled={currentPlan === 'free'}>
                      {currentPlan === 'free' ? 'Current Plan' : 'Free Plan'}
                    </Button>
                  </BlockStack>
                </Card>
              </Grid.Cell>
              
              {/* Basic Plan */}
              <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingLg">Basic</Text>
                    <Text as="h3" variant="headingMd">$4.99/mo</Text>
                    <List>
                      <List.Item>All 4 templates</List.Item>
                      <List.Item>Custom headline and message</List.Item>
                      <List.Item>Custom delay time</List.Item>
                      <List.Item>No image</List.Item>
                      <List.Item>No custom colors</List.Item>
                    </List>
                    <Button 
                      disabled={currentPlan === 'basic'}
                      onClick={() => handleUpgrade('basic')}
                      variant="primary"
                    >
                      {currentPlan === 'basic' ? 'Current Plan' : 'Upgrade to Basic'}
                    </Button>
                  </BlockStack>
                </Card>
              </Grid.Cell>
              
              {/* Pro Plan */}
              <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingLg">Pro</Text>
                    <Text as="h3" variant="headingMd">$9.99/mo</Text>
                    <List>
                      <List.Item>All 4 templates</List.Item>
                      <List.Item>Custom headline and message</List.Item>
                      <List.Item>Custom delay time</List.Item>
                      <List.Item>Image support</List.Item>
                      <List.Item>Full color customization</List.Item>
                    </List>
                    <Button 
                      disabled={currentPlan === 'pro'}
                      onClick={() => handleUpgrade('pro')}
                      variant="primary"
                    >
                      {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                    </Button>
                  </BlockStack>
                </Card>
              </Grid.Cell>
            </Grid>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
