import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    deviceId: v.string(),
    autumnCustomerId: v.optional(v.string()),
    subscriptionTier: v.optional(v.string()),
    roomsCreated: v.optional(v.number()),
    sessionsCompleted: v.optional(v.number()),
    setsLogged: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_deviceId", ["deviceId"]),

  sessions: defineTable({
    userId: v.id("users"),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  sets: defineTable({
    sessionId: v.optional(v.id("sessions")),
    userId: v.id("users"),
    exercise: v.string(),
    load: v.number(),
    reps: v.number(),
    rir: v.number(),
    stimulusToFatigueRatio: v.optional(v.number()),
    feedback: v.optional(v.string()),
    feedbackType: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_userId", ["userId"]),

  explanations: defineTable({
    topic: v.string(),
    text: v.string(),
    lastFetched: v.number(),
  }).index("by_topic", ["topic"]),
});
