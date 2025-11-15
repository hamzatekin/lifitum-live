import { mutation, query } from "./_generated/server";
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

export const getStudiesByVerdict = query({
  args: {
    verdict: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { verdict, limit = 5 }) => {
    const verdictUrls = {
      great: [
        "https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2022.949021/full",
        "https://sportsmedicine-open.springeropen.com/articles/10.1186/s40798-023-00554-y",
      ],
      good: [
        "https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2022.949021/full",
        "https://sportsmedicine-open.springeropen.com/articles/10.1186/s40798-023-00554-y",
      ],
      costly: ["https://pmc.ncbi.nlm.nih.gov/articles/PMC8126497/", "https://pubmed.ncbi.nlm.nih.gov/27038416/"],
      meh: ["https://www.mdpi.com/2411-5142/9/4/186"],
      ignored: ["https://www.mdpi.com/2411-5142/9/4/186"],
    };

    const targetUrls = verdictUrls[verdict as keyof typeof verdictUrls] || [];
    const relevantStudies = [];

    for (const url of targetUrls) {
      const studies = await ctx.db
        .query("sfrEmbeddings")
        .filter((q) => q.eq(q.field("url"), url))
        .take(1);
      relevantStudies.push(...studies);

      if (relevantStudies.length >= limit) break;
    }

    const uniqueStudies = relevantStudies
      .filter((study, index, self) => index === self.findIndex((s) => s.url === study.url))
      .slice(0, limit);

    return uniqueStudies.map((study) => ({
      text: study.text.slice(0, 200) + "...",
      url: study.url,
      metadata: study.metadata,
    }));
  },
});
