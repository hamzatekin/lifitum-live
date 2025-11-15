import {
	feature,
	product,
	featureItem,
	pricedFeatureItem,
	priceItem,
} from "atmn";

// Features
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
			feature_id: unlimitedRoomCreation.id,
			included_usage: "inf",
			reset_usage_when_enabled: true,
		}),
	],
});
