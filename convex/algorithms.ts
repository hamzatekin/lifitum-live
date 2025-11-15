/**
 * Calculate stimulus-to-fatigue ratio for a set
 *
 * Stimulus = mechanical tension created (load × reps)
 * Fatigue = accumulated fatigue based on proximity to failure (inverse of RIR)
 *
 * @param load - Weight lifted (in lbs or kg)
 * @param reps - Number of repetitions performed
 * @param rir - Reps in Reserve (distance from muscular failure)
 * @returns Stimulus-to-Fatigue Ratio
 */
export function calculateStimulusToFatigueRatio(
  load: number,
  reps: number,
  rir: number
): number {
  // Stimulus = mechanical tension created
  const stimulus = load * reps;

  // Fatigue = function of proximity to failure
  // Lower RIR = higher fatigue (closer to failure)
  // Adding 1 to RIR to avoid division by zero
  const fatigueMultiplier = 1 / (rir + 1);

  // Fatigue combines rep count and proximity to failure
  const fatigue = reps * fatigueMultiplier;

  // SFR = Stimulus / Fatigue
  // Higher ratio = more stimulus relative to fatigue incurred
  const sfr = stimulus / (fatigue || 1); // Avoid division by zero

  return parseFloat(sfr.toFixed(2));
}

/**
 * Generate feedback and feedback type based on stimulus-to-fatigue ratio
 *
 * @param sfr - Stimulus-to-Fatigue Ratio
 * @returns Object containing feedback text and type
 */
export function generateSFRFeedback(sfr: number): {
  feedback: string;
  feedbackType: string;
} {
  // Mock implementation based on SFR ranges
  if (sfr > 20) {
    return {
      feedback: "🔥 Excellent stimulus with minimal fatigue!",
      feedbackType: "excellent",
    };
  } else if (sfr > 12) {
    return {
      feedback: "✅ Great balance of stimulus and fatigue.",
      feedbackType: "good",
    };
  } else if (sfr > 6) {
    return {
      feedback: "⚠️ Moderate stimulus-to-fatigue ratio.",
      feedbackType: "moderate",
    };
  } else {
    return {
      feedback: "💪 High fatigue relative to stimulus. Consider reducing RIR.",
      feedbackType: "suboptimal",
    };
  }
}

