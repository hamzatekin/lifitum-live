import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const insert = mutation({
  args: {
    text: v.string(),
    vector: v.array(v.number()),
    url: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sfrEmbeddings", {
      text: args.text,
      vector: args.vector,
      url: args.url,
      metadata: args.metadata,
    });
  },
});
