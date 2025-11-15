import "dotenv/config";
import Firecrawl from "@mendable/firecrawl-js";
import OpenAI from "openai";
import { ConvexHttpClient } from "convex/browser"; // or convex/node based on your setup
import { api } from "convex/_generated/api";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

if (!process.env.FIRECRAWL_API_KEY) {
  throw new Error("FIRECRAWL_API_KEY is not set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY!,
});

if (!process.env.VITE_CONVEX_URL) {
  throw new Error("VITE_CONVEX_URL is not set");
}

const convex = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

const sfrStudyLinks = [
  "https://pmc.ncbi.nlm.nih.gov/articles/PMC8126497/",
  "https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2022.949021/full",
  "https://sportsmedicine-open.springeropen.com/articles/10.1186/s40798-023-00554-y",
  "https://pubmed.ncbi.nlm.nih.gov/27038416/",
  "https://www.mdpi.com/2411-5142/9/4/186",
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

  for (const url of sfrStudyLinks) {
    console.log("Scraping:", url);

    const { markdown, metadata } = await scrapeWebsite(url);
    const chunks = chunkText(markdown);

    console.log(` → ${chunks.length} chunks`);

    for (const chunk of chunks) {
      const embedding = await embedText(chunk);

      await convex.mutation(api.sfrEmbeddings.insert, {
        text: chunk,
        vector: embedding,
        url,
        metadata,
      });
    }

    console.log("Done:", url);
  }

  console.log("🎉 Finished seeding SFR embeddings!");
}

run();
