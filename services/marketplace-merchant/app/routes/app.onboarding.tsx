import { Page, Text } from "@shopify/polaris";

export default function Onboarding() {
  return (
    <Page backAction={{ url: "/app" }}>
      <Text variant="heading2xl" as="h2">
        Onboarding
      </Text>
    </Page>
  );
}
