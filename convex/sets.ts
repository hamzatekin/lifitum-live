import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createRoom = mutation({
  args: { goal: v.string() },
  handler: async (ctx, args) => {
    const roomId = await ctx.db.insert("rooms", {
      goal: args.goal,
      createdAt: Date.now(),
    });
    return roomId;
  },
});

export const logSet = mutation({
  args: {
    roomId: v.id("rooms"),
    exercise: v.string(),
    load: v.number(),
    reps: v.number(),
    rir: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sets", { ...args, createdAt: Date.now() });
  },
});

export const getSets = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sets")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .collect();
  },
});
