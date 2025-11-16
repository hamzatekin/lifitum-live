import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSession = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", { ...args, startedAt: Date.now() });
  },
});

export const endSession = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db.patch(sessionId, { endedAt: Date.now() });
  },
});

export const getSession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db.get(sessionId);
  },
});

export const getActiveSession = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    if (session && !session.endedAt) {
      return session;
    }

    return null;
  },
});

export const getFinishedSessions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return sessions.filter((s) => s.endedAt !== undefined);
  },
});
