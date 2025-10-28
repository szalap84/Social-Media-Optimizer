export interface SuggestedItem {
  content: string;
  reason: string;
}

export interface Guideline {
    title: string;
    explanation: string;
}

export interface OptimizationResult {
    suggestions: SuggestedItem[];
    guidelines: Guideline[];
    tags?: string[];
}
