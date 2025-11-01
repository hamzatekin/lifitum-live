import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createRoom = mutation({
  args: { ownerId: v.id("users"), goal: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("rooms", { ...args, createdAt: Date.now() });
  },
});

export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db.get(roomId);
  },
});
