import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { calculateStimulusToFatigueRatio, generateSFRFeedback } from "./algorithms";

export const logSet = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    exercise: v.string(),
    load: v.number(),
    reps: v.number(),
    rir: v.number(),
    stimulusToFatigueRatio: v.optional(v.number()),
    feedback: v.optional(v.string()),
    feedbackType: v.optional(v.string()),
    attribution: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const sfrResult = calculateStimulusToFatigueRatio(args.load, args.reps, args.rir);
    const stimulusToFatigueRatio = args.stimulusToFatigueRatio ?? sfrResult.ratio;

    const relevantStudies = await ctx.runQuery(api.sfrEmbeddings.getStudiesByVerdict, {
      verdict: sfrResult.verdict,
      limit: 3,
    });

    const feedbackData = generateSFRFeedback(sfrResult, relevantStudies);

    return await ctx.db.insert("sets", {
      ...args,
      stimulusToFatigueRatio,
      feedback: args.feedback ?? feedbackData.feedback,
      feedbackType: args.feedbackType ?? feedbackData.feedbackType,
      attribution: feedbackData.attribution,
      createdAt: Date.now(),
    });
  },
});

export const getSets = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("sets")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .order("asc")
      .collect();
  },
});
