import "dotenv/config";
import Firecrawl from "@mendable/firecrawl-js";
import OpenAI from "openai";
import { ConvexHttpClient } from "convex/browser"; // or convex/node based on your setup
import { api } from "convex/_generated/api";
import { env } from "cloudflare:workers";

if (!env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

if (!env.FIRECRAWL_API_KEY) {
  throw new Error("FIRECRAWL_API_KEY is not set");
}

if (!env.VITE_CONVEX_URL) {
  throw new Error("VITE_CONVEX_URL is not set");
}

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const firecrawl = new Firecrawl({
  apiKey: env.FIRECRAWL_API_KEY,
});

const convex = new ConvexHttpClient(env.VITE_CONVEX_URL!);

const sfrStudyLinks = [
  {
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8126497/",
    topics: ["fatigue management", "recovery", "costly", "excessive fatigue"],
    title: "Stimulus-Fatigue Recovery framework",
  },
  {
    url: "https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2022.949021/full",
    topics: ["optimal", "efficient", "stimulus-fatigue ratio", "great", "good"],
    title: "S/F ratio optimization",
  },
  {
    url: "https://sportsmedicine-open.springeropen.com/articles/10.1186/s40798-023-00554-y",
    topics: ["effective", "stimulus", "fatigue management", "good", "great"],
    title: "Fatigue management in resistance training",
  },
  {
    url: "https://pubmed.ncbi.nlm.nih.gov/27038416/",
    topics: ["recovery", "fatigue", "costly", "overtraining"],
    title: "Recovery dynamics and training adaptation",
  },
  {
    url: "https://www.mdpi.com/2411-5142/9/4/186",
    topics: ["stimulus quantification", "meh", "suboptimal", "ignored", "warm-up"],
    title: "Effective stimulus quantification",
  },
];

async function scrapeWebsite(url: string) {
  const result = (await firecrawl.scrape(url, {
    formats: ["markdown"],
  })) as WebsiteScrapeResult;
  return result;
}

async function embedText(text: string) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding; // length 1536
}

// naive chunker
function chunkText(text: string, maxTokens = 500) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    if ((current + " " + s).length > maxTokens * 4) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += " " + s;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// main runner
async function run() {
  console.log("Starting SFR embedding seed...");

  for (const study of sfrStudyLinks) {
    console.log("Scraping:", study.url);

    const { markdown, metadata } = await scrapeWebsite(study.url);
    const chunks = chunkText(markdown);

    console.log(` → ${chunks.length} chunks`);

    for (const chunk of chunks) {
      const embedding = await embedText(chunk);

      await convex.mutation(api.sfrEmbeddings.insert, {
        text: chunk,
        vector: embedding,
        url: study.url,
        metadata: {
          ...metadata,
          topics: study.topics,
          title: study.title,
        },
      });
    }

    console.log("Done:", study.url);
  }

  console.log("🎉 Finished seeding SFR embeddings!");
}

run();
