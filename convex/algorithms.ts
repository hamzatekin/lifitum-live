import { v } from "convex/values";
import { query } from "./_generated/server";

function estimateE1RM(weight: number, reps: number, rir: number): number {
  return weight * (1 + (reps + rir) / 30);
}

function relativeIntensity(weight: number, e1rm: number): number {
  return Math.min(weight / Math.max(1e-6, e1rm), 0.98);
}

function effectiveReps(reps: number, rir: number): number {
  const effectiveWindow = 5;
  return Math.max(0, Math.min(reps, effectiveWindow - rir));
}

function loadEffectiveness(relativeInt: number): number {
  const minLoadThreshold = 0.3;
  const fullLoadThreshold = 0.5;

  if (relativeInt <= minLoadThreshold) return 0;
  if (relativeInt >= fullLoadThreshold) return 1;

  return (relativeInt - minLoadThreshold) / (fullLoadThreshold - minLoadThreshold);
}

function calculateStimulus(effReps: number, loadFactor: number): number {
  return effReps * loadFactor;
}

function calculateFatigue(reps: number, relativeInt: number): number {
  const baseSetCost = 0.5;
  const loadCostExponent = 1.25;
  return baseSetCost + reps * Math.pow(relativeInt, loadCostExponent);
}

function isWarmUpSet(reps: number, relativeInt: number): boolean {
  const minRepsForEffect = 3;
  const minRelativeIntensity = 0.3;
  return reps < minRepsForEffect || relativeInt < minRelativeIntensity;
}

export function calculateStimulusToFatigueRatio(
  load: number,
  reps: number,
  rir: number
): { ratio: number; stimulus: number; fatigue: number; verdict: string } {
  const clampedReps = Math.max(0, Math.min(Math.round(reps), 40));
  const clampedRir = Math.max(0, Math.min(rir, 6));
  const clampedLoad = Math.max(0, load);

  if (clampedLoad <= 0 || clampedReps <= 0) {
    return { ratio: 0, stimulus: 0, fatigue: 0, verdict: "ignored" };
  }

  const e1rm = estimateE1RM(clampedLoad, clampedReps, clampedRir);
  const relIntensity = relativeIntensity(clampedLoad, e1rm);
  const effReps = effectiveReps(clampedReps, clampedRir);
  const loadFactor = loadEffectiveness(relIntensity);

  const rawStimulus = calculateStimulus(effReps, loadFactor);
  const rawFatigue = calculateFatigue(clampedReps, relIntensity);

  const warmUp = isWarmUpSet(clampedReps, relIntensity);
  const finalStimulus = warmUp ? 0 : rawStimulus;
  const finalFatigue = warmUp ? 0 : rawFatigue;

  const ratio = finalFatigue > 0 ? finalStimulus / finalFatigue : 0;
  const verdict = getVerdictFromRatio(ratio, warmUp);

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    stimulus: parseFloat(finalStimulus.toFixed(2)),
    fatigue: parseFloat(finalFatigue.toFixed(2)),
    verdict,
  };
}

function getVerdictFromRatio(ratio: number, ignored: boolean): string {
  if (ignored) return "ignored";
  if (ratio >= 0.8) return "great";
  if (ratio >= 0.5) return "good";
  if (ratio >= 0.3) return "meh";
  return "costly";
}

export function generateSFRFeedback(
  sfrOrResult: number | { ratio: number; verdict: string },
  relevantStudies?: Array<{ text: string; url: string; metadata?: any }>
): {
  feedback: string;
  feedbackType: string;
  attribution?: {
    text: string;
    urls: string[];
    studies?: Array<{ text: string; url: string; metadata?: any }>;
  };
} {
  const ratio = typeof sfrOrResult === "number" ? sfrOrResult : sfrOrResult.ratio;
  const verdict = typeof sfrOrResult === "object" ? sfrOrResult.verdict : getVerdictFromRatio(ratio, false);

  const getAttribution = (
    verdict: string,
    studies?: Array<{ text: string; url: string; metadata?: any }>
  ): { text: string; urls: string[]; studies?: Array<{ text: string; url: string; metadata?: any }> } => {
    if (studies && studies.length > 0) {
      return {
        text: `This matches ${studies.length} relevant ${getVerdictDescription(verdict)} findings`,
        urls: studies.map((study) => study.url),
        studies,
      };
    }

    switch (verdict) {
      case "great":
      case "good":
        return {
          text: "Based on S/F optimization studies",
          urls: [
            "https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2022.949021/full",
            "https://sportsmedicine-open.springeropen.com/articles/10.1186/s40798-023-00554-y",
          ],
        };
      case "meh":
        return {
          text: "Supported by stimulus quantification research",
          urls: ["https://www.mdpi.com/2411-5142/9/4/186"],
        };
      case "costly":
        return {
          text: "Informed by fatigue management studies",
          urls: ["https://pubmed.ncbi.nlm.nih.gov/27038416/", "https://pmc.ncbi.nlm.nih.gov/articles/PMC8126497/"],
        };
      case "ignored":
        return {
          text: "Warm-up detection based on load threshold research",
          urls: ["https://www.mdpi.com/2411-5142/9/4/186"],
        };
      default:
        return {
          text: "Based on S/F research collection",
          urls: ["https://pmc.ncbi.nlm.nih.gov/articles/PMC8126497/"],
        };
    }
  };

  function getVerdictDescription(verdict: string): string {
    switch (verdict) {
      case "great":
      case "good":
        return "training efficiency";
      case "meh":
        return "stimulus optimization";
      case "costly":
        return "fatigue management";
      case "ignored":
        return "warm-up detection";
      default:
        return "training research";
    }
  }

  switch (verdict) {
    case "great":
      return {
        feedback: "🔥 Excellent stimulus with minimal fatigue! Great balance of intensity and volume.",
        feedbackType: "excellent",
        attribution: getAttribution(verdict, relevantStudies),
      };

    case "good":
      return {
        feedback: "✅ Good balance of stimulus and fatigue. You're training effectively.",
        feedbackType: "good",
        attribution: getAttribution(verdict, relevantStudies),
      };

    case "meh":
      return {
        feedback: "⚠️ Moderate stimulus-to-fatigue ratio. Consider increasing weight or training closer to failure.",
        feedbackType: "moderate",
        attribution: getAttribution(verdict, relevantStudies),
      };

    case "costly":
      return {
        feedback: "💪 High fatigue relative to stimulus. Increase weight or reduce RIR for better efficiency.",
        feedbackType: "suboptimal",
        attribution: getAttribution(verdict, relevantStudies),
      };

    case "ignored":
      return {
        feedback: "🔄 Warm-up set detected. This doesn't count toward your main training stimulus.",
        feedbackType: "warmup",
        attribution: getAttribution(verdict, relevantStudies),
      };

    default:
      return {
        feedback: "❓ Unable to calculate feedback. Please check your inputs.",
        feedbackType: "error",
        attribution: getAttribution(verdict, relevantStudies),
      };
  }
}

export const calculateSFR = query({
  args: {
    load: v.number(),
    reps: v.number(),
    rir: v.number(),
  },
  handler: async (_ctx, args) => {
    return calculateStimulusToFatigueRatio(args.load, args.reps, args.rir);
  },
});

export function calculateStimulusToFatigueRatioLegacy(load: number, reps: number, rir: number): number {
  const result = calculateStimulusToFatigueRatio(load, reps, rir);
  return result.ratio;
}
