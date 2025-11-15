import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const checkFeatureAccess = mutation({
  args: {
    userId: v.id("users"),
    feature: v.string(),
  },
  handler: async (ctx, { userId, feature }) => {
    const user = await ctx.db.get(userId);
    if (!user) return { allowed: false };

    const tier = user.subscriptionTier || "free";

    // Define feature access by tier
    const featureLimits = {
      free: {
        maxRooms: 3,
        maxSets: 50,
        features: ["basic_tracking", "room_creation"],
      },
      pro: {
        maxRooms: 999,
        maxSets: 999,
        features: ["basic_tracking", "room_creation", "advanced_analytics", "unlimited_rooms"],
      },
      coach: {
        maxRooms: 999,
        maxSets: 999,
        features: ["basic_tracking", "room_creation", "advanced_analytics", "unlimited_rooms", "client_management"],
      },
    };

    const limits = featureLimits[tier as keyof typeof featureLimits] || featureLimits.free;
    const hasAccess = limits.features.includes(feature);

    return {
      allowed: hasAccess,
      tier,
      limits,
      usage: {
        roomsCreated: user.roomsCreated || 0,
        setsLogged: user.setsLogged || 0,
      },
    };
  },
});

export const trackUsage = mutation({
  args: {
    userId: v.id("users"),
    action: v.string(),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, { userId, action, amount = 1 }) => {
    const user = await ctx.db.get(userId);
    if (!user) return;

    let updateData: any = {};

    switch (action) {
      case "room_created":
        updateData.roomsCreated = (user.roomsCreated || 0) + amount;
        break;
      case "set_logged":
        updateData.setsLogged = (user.setsLogged || 0) + amount;
        break;
    }

    await ctx.db.patch(userId, updateData);
    return { success: true, newUsage: updateData };
  },
});

export const upgradeSubscription = mutation({
  args: {
    userId: v.id("users"),
    newTier: v.string(),
    autumnCustomerId: v.string(),
  },
  handler: async (ctx, { userId, newTier, autumnCustomerId }) => {
    await ctx.db.patch(userId, {
      subscriptionTier: newTier,
      autumnCustomerId,
    });

    return { success: true, newTier };
  },
});

export const getSubscriptionStatus = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return null;

    return {
      tier: user.subscriptionTier || "free",
      autumnCustomerId: user.autumnCustomerId,
      usage: {
        sessionsCompleted: user.sessionsCompleted || 0,
        setsLogged: user.setsLogged || 0,
      },
    };
  },
});
