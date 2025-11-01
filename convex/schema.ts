import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    goal: v.string(),
    createdAt: v.number(),
  }),
  sets: defineTable({
    roomId: v.id("rooms"),
    exercise: v.string(),
    load: v.number(),
    reps: v.number(),
    rir: v.number(),
    createdAt: v.number(),
  }),
  explanations: defineTable({
    topic: v.string(),
    text: v.string(),
    lastFetched: v.number(),
  }),
});
