import { feature, product, featureItem, priceItem } from "atmn";

// Features
export const evidenceBasedVolumeTrackingPerMuscleGroup = feature({
  id: "evidence_based_volume_tracking_per_muscle_group",
  name: "Evidence based volume tracking per muscle group",
  type: "boolean",
});

export const unlimitedRoomCreation = feature({
  id: "unlimited_room_creation",
  name: "Unlimited room creation",
  type: "continuous_use",
});

// Products
export const pro = product({
  id: "pro",
  name: "Pro",
  items: [
    priceItem({
      price: 9.99,
      interval: "month",
    }),

    featureItem({
      feature_id: evidenceBasedVolumeTrackingPerMuscleGroup.id,
      included_usage: undefined,
    }),

    featureItem({
      feature_id: unlimitedRoomCreation.id,
      included_usage: "inf",
      reset_usage_when_enabled: true,
    }),
  ],
});
