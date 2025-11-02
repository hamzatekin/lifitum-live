import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const ensureUser = mutation({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("users", { deviceId, createdAt: Date.now() });
  },
});

export const me = query({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();
  },
});
