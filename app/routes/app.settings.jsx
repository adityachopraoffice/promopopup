import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  TextField,
  Tooltip,
  Grid,
  Box,
  Badge,
  Banner,
} from "@shopify/polaris";
import { useSubmit, useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  let settings = await prisma.shopSettings.findUnique({
    where: { shop },
  });

  if (!settings) {
    settings = await prisma.shopSettings.create({
      data: { shop },
    });
  }

  // Enforce plan limits dynamically for the UI dashboard preview
  if (settings.currentPlan === "free") {
    settings.selectedTemplate = "minimal";
    settings.delaySeconds = 5;
    settings.imageUrl = "";
    settings.bgColor = "#FFFFFF";
    settings.textColor = "#000000";
    settings.buttonColor = "#000000";
    settings.buttonTextColor = "#FFFFFF";
    settings.overlayColor = "rgba(0,0,0,0.5)";
    settings.headline = "Special Offer Just For You!";
    settings.message = "Shop now and enjoy our latest deals!";
  } else if (settings.currentPlan === "basic") {
    settings.imageUrl = "";
    settings.bgColor = "#FFFFFF";
    settings.textColor = "#000000";
    settings.buttonColor = "#000000";
    settings.buttonTextColor = "#FFFFFF";
    settings.overlayColor = "rgba(0,0,0,0.5)";
  }

  return json({ settings });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  
  const currentPlan = formData.get("currentPlan");
  const isFree = currentPlan === "free";
  const isPro = currentPlan === "pro";

  const dataToUpdate = {
    headline: isFree ? "Special Offer Just For You!" : (formData.get("headline") || ""),
    message: isFree ? "Shop now and enjoy our latest deals!" : (formData.get("message") || ""),
    imageUrl: isPro ? (formData.get("imageUrl") || "") : "",
    delaySeconds: isFree ? 5 : parseInt(formData.get("delaySeconds") || "5", 10),
    selectedTemplate: formData.get("selectedTemplate") || "minimal",
    bgColor: isPro ? (formData.get("bgColor") || "#FFFFFF") : "#FFFFFF",
    textColor: isPro ? (formData.get("textColor") || "#000000") : "#000000",
    buttonColor: isPro ? (formData.get("buttonColor") || "#000000") : "#000000",
    buttonTextColor: isPro ? (formData.get("buttonTextColor") || "#FFFFFF") : "#FFFFFF",
    overlayColor: isPro ? (formData.get("overlayColor") || "rgba(0,0,0,0.5)") : "rgba(0,0,0,0.5)",
  };
  
  if (isFree && dataToUpdate.selectedTemplate !== "minimal") {
    dataToUpdate.selectedTemplate = "minimal";
  }

  await prisma.shopSettings.update({
    where: { shop },
    data: dataToUpdate,
  });

  return json({ success: true });
};

export default function Settings() {
  const { settings } = useLoaderData();
  const submit = useSubmit();
  const actionData = useActionData();

  const [formState, setFormState] = useState(settings);
  const isFree = formState.currentPlan === "free";
  const isPro = formState.currentPlan === "pro";

  useEffect(() => {
    if (actionData?.success) {
      if (typeof shopify !== 'undefined' && shopify.toast) {
        shopify.toast.show('Settings saved');
      }
    }
  }, [actionData]);

  const handleChange = (field) => (value) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleSave = () => {
    submit(formState, { method: "post" });
  };

  const renderTooltip = (content, disabled, children) => {
    if (disabled) {
      return (
        <Tooltip content={content}>
          <div style={{ display: 'inline-block', width: '100%' }}>{children}</div>
        </Tooltip>
      );
    }
    return children;
  };

  return (
    <Page title="PromoPopup Settings" primaryAction={{ content: 'Save', onAction: handleSave }}>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Popup Content</Text>
              {renderTooltip("Upgrade to Basic", isFree, 
                <TextField
                  label="Headline"
                  value={formState.headline}
                  onChange={handleChange("headline")}
                  disabled={isFree}
                  autoComplete="off"
                />
              )}
              {renderTooltip("Upgrade to Basic", isFree, 
                <TextField
                  label="Message"
                  value={formState.message}
                  onChange={handleChange("message")}
                  multiline={3}
                  disabled={isFree}
                  autoComplete="off"
                />
              )}
              {renderTooltip("Upgrade to Pro", !isPro, 
                <TextField
                  label="Image URL"
                  helpText="Paste a direct image URL (e.g. from your Shopify files)"
                  value={formState.imageUrl}
                  onChange={handleChange("imageUrl")}
                  disabled={!isPro}
                  autoComplete="off"
                />
              )}
            </BlockStack>
          </Card>
          <Box paddingBlockStart="400">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Timing</Text>
                {renderTooltip("Upgrade to Basic", isFree, 
                  <TextField
                    label="Delay (seconds)"
                    helpText="How many seconds after page load before popup appears"
                    type="number"
                    value={formState.delaySeconds.toString()}
                    onChange={(val) => handleChange("delaySeconds")(parseInt(val, 10))}
                    disabled={isFree}
                    autoComplete="off"
                  />
                )}
              </BlockStack>
            </Card>
          </Box>
          <Box paddingBlockStart="400">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Template</Text>
                <Grid>
                  {/* Minimal */}
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                    <div 
                      style={{ border: formState.selectedTemplate === 'minimal' ? '2px solid #005bd3' : '1px solid #e1e3e5', padding: '16px', cursor: 'pointer' }}
                      onClick={() => handleChange('selectedTemplate')('minimal')}
                    >
                      <Text as="h3" variant="headingSm">Minimal</Text>
                    </div>
                  </Grid.Cell>
                  {/* Bold */}
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                    <div 
                      style={{ border: formState.selectedTemplate === 'bold' ? '2px solid #005bd3' : '1px solid #e1e3e5', padding: '16px', cursor: isFree ? 'not-allowed' : 'pointer', opacity: isFree ? 0.5 : 1 }}
                      onClick={() => !isFree && handleChange('selectedTemplate')('bold')}
                    >
                      <Text as="h3" variant="headingSm">Bold {isFree && <Badge tone="warning">Basic</Badge>}</Text>
                    </div>
                  </Grid.Cell>
                  {/* Elegant */}
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                    <div 
                      style={{ border: formState.selectedTemplate === 'elegant' ? '2px solid #005bd3' : '1px solid #e1e3e5', padding: '16px', cursor: isFree ? 'not-allowed' : 'pointer', opacity: isFree ? 0.5 : 1 }}
                      onClick={() => !isFree && handleChange('selectedTemplate')('elegant')}
                    >
                      <Text as="h3" variant="headingSm">Elegant {isFree && <Badge tone="warning">Basic</Badge>}</Text>
                    </div>
                  </Grid.Cell>
                  {/* Dark */}
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                    <div 
                      style={{ border: formState.selectedTemplate === 'dark' ? '2px solid #005bd3' : '1px solid #e1e3e5', padding: '16px', cursor: isFree ? 'not-allowed' : 'pointer', opacity: isFree ? 0.5 : 1 }}
                      onClick={() => !isFree && handleChange('selectedTemplate')('dark')}
                    >
                      <Text as="h3" variant="headingSm">Dark {isFree && <Badge tone="warning">Basic</Badge>}</Text>
                    </div>
                  </Grid.Cell>
                </Grid>
              </BlockStack>
            </Card>
          </Box>
          <Box paddingBlockStart="400">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Colors</Text>
                {!isPro && <Banner title="Upgrade to Pro to customize colors" tone="warning" />}
                <div style={{ opacity: !isPro ? 0.5 : 1, pointerEvents: !isPro ? 'none' : 'auto' }}>
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                      <TextField type="color" label="Background Color" value={formState.bgColor} onChange={handleChange("bgColor")} autoComplete="off" />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                      <TextField type="color" label="Text Color" value={formState.textColor} onChange={handleChange("textColor")} autoComplete="off" />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                      <TextField type="color" label="Button Color" value={formState.buttonColor} onChange={handleChange("buttonColor")} autoComplete="off" />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                      <TextField type="color" label="Button Text Color" value={formState.buttonTextColor} onChange={handleChange("buttonTextColor")} autoComplete="off" />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                      <TextField type="color" label="Overlay Color" value={formState.overlayColor} onChange={handleChange("overlayColor")} autoComplete="off" />
                    </Grid.Cell>
                  </Grid>
                </div>
              </BlockStack>
            </Card>
          </Box>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Live Preview</Text>
              <div style={{ padding: '20px', background: isPro ? formState.overlayColor : 'rgba(0,0,0,0.5)', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PreviewPopup settings={formState} isPro={isPro} />
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function PreviewPopup({ settings, isPro }) {
  const getTemplateStyles = () => {
    switch (settings.selectedTemplate) {
      case 'bold':
        return { background: '#1A1A1A', color: '#FFFFFF', buttonBg: '#FF4444', buttonText: '#FFFFFF', radius: '4px', font: 'sans-serif', border: 'none' };
      case 'elegant':
        return { background: '#FDF6F0', color: '#5C4033', buttonBg: '#C49A6C', buttonText: '#FFFFFF', radius: '20px', font: 'Georgia, serif', border: '1px solid #E8D5C4' };
      case 'dark':
        return { background: '#0D0D0D', color: '#FFFFFF', buttonBg: '#00FF88', buttonText: '#000000', radius: '6px', font: 'monospace', border: '1px solid #00FF88' };
      case 'minimal':
      default:
        return { background: '#FFFFFF', color: '#000000', buttonBg: '#000000', buttonText: '#FFFFFF', radius: '4px', font: 'sans-serif', border: '1px solid #E0E0E0' };
    }
  };

  const tStyles = getTemplateStyles();
  const bg = isPro ? settings.bgColor : tStyles.background;
  const color = isPro ? settings.textColor : tStyles.color;
  const btnBg = isPro ? settings.buttonColor : tStyles.buttonBg;
  const btnColor = isPro ? settings.buttonTextColor : tStyles.buttonText;

  return (
    <div style={{
      background: bg,
      color: color,
      borderRadius: tStyles.radius,
      fontFamily: tStyles.font,
      border: tStyles.border,
      padding: '32px',
      maxWidth: '480px',
      width: '90%',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>X</div>
      {isPro && settings.imageUrl && (
        <img src={settings.imageUrl} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderTopLeftRadius: tStyles.radius, borderTopRightRadius: tStyles.radius, marginTop: '-32px', marginLeft: '-32px', marginRight: '-32px', width: 'calc(100% + 64px)', marginBottom: '16px' }} />
      )}
      <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px' }}>{settings.headline}</div>
      <div style={{ fontSize: '15px', marginBottom: '20px' }}>{settings.message}</div>
      <button style={{ background: btnBg, color: btnColor, padding: '10px 20px', border: 'none', borderRadius: tStyles.radius, cursor: 'pointer', width: '100%' }}>Got it!</button>
    </div>
  );
}
