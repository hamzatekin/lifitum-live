import { feature, product, featureItem, priceItem } from "atmn";

// Features
export const volumeTrackingPerMuscleGroup = feature({
  id: "volume_tracking_per_muscle_group",
  name: "Volume tracking per muscle group",
  type: "boolean",
});

export const roomCreation = feature({
  id: "room_creation",
  name: "Room creation",
  type: "continuous_use",
});

// Products
export const free = product({
  id: "free",
  name: "Free",
  items: [
    featureItem({
      feature_id: roomCreation.id,
      included_usage: 100,
    }),
  ],
});

export const pro = product({
  id: "pro",
  name: "Pro",
  items: [
    priceItem({
      price: 9.99,
      interval: "month",
    }),

    featureItem({
      feature_id: roomCreation.id,
      included_usage: "inf",
      reset_usage_when_enabled: true,
    }),

    featureItem({
      feature_id: volumeTrackingPerMuscleGroup.id,
      included_usage: undefined,
    }),
  ],
});
