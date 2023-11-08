import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { BlockStack, Page, Text, Button } from "@shopify/polaris";
import { useState } from "react";
import {
  OnboardingInfoCard1,
  OnboardingInfoCard2,
} from "~/components/OnboardingInfoCard";
import { finishOnboarding } from "~/models/Shop.server";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  await finishOnboarding(session.shop);
  return redirect("/app");
};

export default function Onboarding() {
  const submit = useSubmit();
  const [showUnderstood, setShowUnderstood] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [isUnderstood, setIsUnderstood] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleUnderstand = () => {
    setIsUnderstood(true);
    setShowUnderstood(false);
    setShowTerms(true);
  };

  const handleAccept = () => {
    setTermsAccepted(true);
    setShowTerms(false);
  };

  const handleFinish = () => {
    submit({}, { replace: true, method: "POST" });
  };

  return (
    <Page
      backAction={{ url: "/app" }}
      title="Setup Mocking Marketplace"
      subtitle="Complete setup to start selling your products on Klader."
      primaryAction={
        <Button
          variant="primary"
          onClick={handleFinish}
          disabled={!isUnderstood || !termsAccepted}
        >
          Finish
        </Button>
      }
    >
      <BlockStack gap="400">
        <OnboardingInfoCard1
          showUnderstood={showUnderstood}
          isUnderstood={isUnderstood}
          setShowUnderstood={setShowUnderstood}
          handleUnderstand={handleUnderstand}
        />
        <OnboardingInfoCard2
          showTerms={showTerms}
          isAccepted={termsAccepted}
          setShowTerms={setShowTerms}
          termsAccepted={termsAccepted}
          handleAccept={handleAccept}
        />
      </BlockStack>
    </Page>
  );
}
