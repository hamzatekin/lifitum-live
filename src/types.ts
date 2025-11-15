type WebsiteScrapeResult = {
  markdown: string;
  html: string;
  metadata: {
    title: string;
    description: string;
    language: string;
    keywords: string[];
    robots: string;
    ogTitle: string;
    ogDescription: string;
    ogUrl: string;
    ogImage: string;
    ogLocaleAlternate: string[];
    ogSiteName: string;
    sourceURL: string;
    statusCode: number;
  };
};
