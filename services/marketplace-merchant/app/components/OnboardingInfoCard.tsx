import {
  Card,
  Page,
  Text,
  Box,
  BlockStack,
  Icon,
  InlineGrid,
  InlineStack,
  Button,
  Collapsible,
  TextContainer,
  Checkbox,
} from "@shopify/polaris";
import {
  AddMajor,
  CheckoutMajor,
  ChevronDownMinor,
  CircleTickMajor,
} from "@shopify/polaris-icons";
import { useCallback, useState } from "react";

type Props1 = {
  showUnderstood: boolean;
  isUnderstood: boolean;
  setShowUnderstood: React.Dispatch<React.SetStateAction<boolean>>;
  handleUnderstand: () => void;
};

export function OnboardingInfoCard1({
  showUnderstood,
  isUnderstood,
  setShowUnderstood,
  handleUnderstand,
}: Props1) {
  const toggleTerms = () => setShowUnderstood(!showUnderstood);
  return (
    <Card>
      <BlockStack gap="300">
        <div onClick={toggleTerms} style={{ cursor: "pointer" }}>
          <InlineStack align="space-between" blockAlign="center">
            <Text variant="bodyLg" as="p" fontWeight="medium">
              What you need to know before you start
            </Text>
            <InlineStack gap="200">
              {isUnderstood ? (
                <Icon source={CircleTickMajor} tone="success" />
              ) : null}
              <Icon source={ChevronDownMinor} />
            </InlineStack>
          </InlineStack>
        </div>
        <Collapsible
          open={showUnderstood}
          id="basic-collapsible"
          transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
          expandOnPrint
        >
          <BlockStack gap="200">
            <Text variant="bodyLg" as="p">
              Buyers will be able to purchase your products directly from the
              Mockingbird Marketplace. They will be redirected to your online
              store checkout to complete their purchase.
            </Text>
            <InlineStack align="end">
              <Button variant="primary" onClick={handleUnderstand}>
                I understand
              </Button>
            </InlineStack>
          </BlockStack>
        </Collapsible>
      </BlockStack>
    </Card>
  );
}

type Props2 = {
  showTerms: boolean;
  isAccepted: boolean;
  setShowTerms: React.Dispatch<React.SetStateAction<boolean>>;
  termsAccepted: boolean;
  handleAccept: () => void;
};

export function OnboardingInfoCard2({
  showTerms,
  isAccepted,
  setShowTerms,
  termsAccepted,
  handleAccept,
}: Props2) {
  const [checked, setChecked] = useState(termsAccepted);
  const handleChange = useCallback(
    (newChecked: boolean) => setChecked(newChecked),
    []
  );
  const toggleTerms = () => setShowTerms(!showTerms);
  return (
    <Card>
      <BlockStack gap="300">
        <div onClick={toggleTerms} style={{ cursor: "pointer" }}>
          <InlineStack align="space-between" blockAlign="center">
            <Text variant="bodyLg" as="p" fontWeight="medium">
              Accept terms of service
            </Text>
            <InlineStack gap="200">
              {isAccepted ? (
                <Icon source={CircleTickMajor} tone="success" />
              ) : null}
              <Icon source={ChevronDownMinor} />
            </InlineStack>
          </InlineStack>
        </div>
        <Collapsible
          open={showTerms}
          id="basic-collapsible"
          transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
          expandOnPrint
        >
          <BlockStack gap="200">
            <Text variant="bodyLg" as="p">
              In order to complete set up, you need to read and agree to the
              Mockingbird Marketplace Terms of Service.
            </Text>
            <Checkbox
              label="I accept the terms"
              checked={checked}
              onChange={handleChange}
            />
            <InlineStack align="end">
              <Button
                variant="primary"
                onClick={handleAccept}
                disabled={!checked}
              >
                Confirm
              </Button>
            </InlineStack>
          </BlockStack>
        </Collapsible>
      </BlockStack>
    </Card>
  );
}
