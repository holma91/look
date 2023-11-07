import { useNavigate } from "@remix-run/react";
import { Page, BlockStack, Box, Card, Text, Button } from "@shopify/polaris";

export function Introduction() {
  const navigate = useNavigate();

  return (
    <Page>
      <Card padding="0">
        <div
          style={{
            position: "relative",
            background:
              "linear-gradient(38.9deg, #DBFAED 15.63%, #43B38E 76.62%)",
            padding: "5% 5% 0",
            display: "grid",
            gridTemplateAreas: "'image'",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              width: "80%",
              gridArea: "image",
              justifySelf: "center",
              marginTop: "10%",
              marginBottom: "-10%",
            }}
            src={"/images/desktop-feature.png"}
          />
          <img
            style={{
              width: "20%",
              gridArea: "image",
              justifySelf: "end",
            }}
            src={"/images/mobile-feature.png"}
          />
          <img
            style={{
              gridArea: "image",
              alignSelf: "start",
              justifySelf: "start",
            }}
            src={"/images/icon.svg"}
          />
        </div>
        <Box padding="500">
          <BlockStack gap="200">
            <Text variant="heading2xl" as="h2">
              Sell your products on Mockingbird
            </Text>
            <Text variant="bodyLg" as="p">
              Let customers discover your brand and purchase your products
              directly on the Mockingbird marketplace. Lorem ipsum dolor sit
              amet, consectetur adipisicing elit. Impedit est quibusdam
              explicabo voluptas, voluptatum repellendus dolore et.
            </Text>
          </BlockStack>
          <Box paddingBlockStart="400">
            <Button
              variant="primary"
              onClick={() => {
                navigate("/app/onboarding");
              }}
            >
              Continue setup
            </Button>
          </Box>
        </Box>
      </Card>
    </Page>
  );
}
