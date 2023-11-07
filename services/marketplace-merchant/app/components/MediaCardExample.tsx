import { MediaCard, VideoThumbnail } from "@shopify/polaris";
import React from "react";

export function MediaCardExample() {
  return (
    <MediaCard
      portrait
      title="Turn your side-project into a business"
      primaryAction={{
        content: "Get started",
        onAction: () => {},
      }}
      secondaryAction={{
        content: "Hey",
        onAction: () => {},
      }}
      description="In this course, you’ll learn how the Kular family turned their mom’s recipe book into a global business."
      popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
    >
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
    </MediaCard>
  );
}
