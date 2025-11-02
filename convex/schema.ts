import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    deviceId: v.string(),
    autumnCustomerId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_deviceId", ["deviceId"]),

  rooms: defineTable({
    ownerId: v.id("users"),
    goal: v.string(),
    createdAt: v.number(),
  }).index("by_ownerId", ["ownerId"]),

  sets: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    exercise: v.string(),
    load: v.number(),
    reps: v.number(),
    rir: v.number(),
    createdAt: v.number(),
  }).index("by_roomId", ["roomId"]),

  explanations: defineTable({
    topic: v.string(),
    text: v.string(),
    lastFetched: v.number(),
  }).index("by_topic", ["topic"]),
});
