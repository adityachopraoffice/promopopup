import { useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { AppProvider, Page, Layout, Card, Text, Button, FormLayout, TextField } from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { login } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const errors = await login(request);
  return { errors };
};

export const action = async ({ request }) => {
  const errors = await login(request);
  return { errors };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  return (
    <AppProvider i18n={polarisTranslations}>
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <Form method="post">
                <FormLayout>
                  <Text variant="headingMd" as="h2">
                    Log in
                  </Text>
                  <TextField
                    type="text"
                    name="shop"
                    label="Shop domain"
                    helpText="example.myshopify.com"
                    value={shop}
                    onChange={setShop}
                    autoComplete="on"
                    error={errors?.shop}
                  />
                  <Button submit primary>
                    Log in
                  </Button>
                </FormLayout>
              </Form>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
