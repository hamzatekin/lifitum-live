import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logSet = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
    exercise: v.string(),
    load: v.number(),
    reps: v.number(),
    rir: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sets", { ...args, createdAt: Date.now() });
  },
});

export const getSets = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("sets")
      .withIndex("by_roomId", (q) => q.eq("roomId", roomId))
      .order("asc")
      .collect();
  },
});
