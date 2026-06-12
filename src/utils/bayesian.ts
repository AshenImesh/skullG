import type { Mammal } from '../types';

/**
 * Calculates the Shannon Entropy of a probability distribution.
 * Entropy is a measure of uncertainty: H(P) = -sum(p_i * log2(p_i))
 */
export function calculateEntropy(probs: Record<string, number>): number {
  let entropy = 0;
  for (const p of Object.values(probs)) {
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

/**
 * Soft matches values to handle user uncertainty or database boundary cases.
 * Returns a likelihood score between 0.0 and 1.0.
 */
export function getLikelihood(
  trait: keyof Mammal,
  mammalValue: string,
  userSelectedValue: string
): number {
  const mVal = mammalValue.trim().toLowerCase();
  const uVal = userSelectedValue.trim().toLowerCase();

  if (mVal === uVal) return 0.95;

  // Soft matches for Diet
  if (trait === 'Diet Category') {
    const dietPairs: Record<string, string[]> = {
      carnivore: ['omnivore'],
      herbivore: ['omnivore'],
      insectivore: ['omnivore'],
      omnivore: ['carnivore', 'herbivore', 'insectivore'],
    };
    if (dietPairs[mVal]?.includes(uVal)) return 0.30;
  }

  // Soft matches for Body Size Class
  if (trait === 'Body Size Class') {
    const sizeAdj: Record<string, string[]> = {
      small: ['medium'],
      medium: ['small', 'large'],
      large: ['medium', 'verylarge'],
      verylarge: ['large'],
    };
    if (sizeAdj[mVal]?.includes(uVal)) return 0.35;
  }

  // Soft matches for Skull Robustness
  if (trait === 'Skull Robustness') {
    const robustAdj: Record<string, string[]> = {
      gracile: ['moderate'],
      moderate: ['gracile', 'robust'],
      robust: ['moderate'],
    };
    if (robustAdj[mVal]?.includes(uVal)) return 0.35;
  }

  // Soft matches for Jaw Length Ratio
  if (trait === 'Jaw Length Ratio') {
    const jawAdj: Record<string, string[]> = {
      short: ['medium'],
      medium: ['short', 'long'],
      long: ['medium'],
    };
    if (jawAdj[mVal]?.includes(uVal)) return 0.35;
  }

  // Handle minor variations or sub-types in Habitat (e.g. "Generalist" matches others slightly)
  if (trait === 'Habitat (Terrestrial)') {
    if (mVal === 'generalist' || uVal === 'generalist') return 0.20;
    if (mVal.includes(uVal) || uVal.includes(mVal)) return 0.50;
  }

  // Fallback for non-matching traits
  return 0.02; // Small non-zero probability to allow recovery from user error
}

/**
 * Updates candidate probabilities using Bayes' Theorem.
 * P(Mammal_i | Answer) = ( P(Answer | Mammal_i) * P(Mammal_i) ) / Normalization_Constant
 */
export function updateBayesianProbabilities(
  currentProbs: Record<string, number>,
  mammals: Mammal[],
  trait: keyof Mammal,
  selectedValue: string
): Record<string, number> {
  const updatedProbs: Record<string, number> = {};
  let total = 0;

  for (const m of mammals) {
    const prior = currentProbs[m['Common Name']] ?? 0;
    const likelihood = getLikelihood(trait, m[trait], selectedValue);
    const posterior = prior * likelihood;
    updatedProbs[m['Common Name']] = posterior;
    total += posterior;
  }

  // Normalize
  if (total > 0) {
    for (const name in updatedProbs) {
      updatedProbs[name] /= total;
    }
  } else {
    // If everything went to zero (should not happen due to 0.02 fallback), reset to uniform
    const uniformProb = 1 / mammals.length;
    for (const m of mammals) {
      updatedProbs[m['Common Name']] = uniformProb;
    }
  }

  return updatedProbs;
}

/**
 * Calculates the expected information gain for all remaining traits.
 * IG(Trait) = H(P) - sum_{v} ( P(v) * H(P | v) )
 */
export function calculateInformationGainForTraits(
  currentProbs: Record<string, number>,
  mammals: Mammal[],
  availableTraits: (keyof Mammal)[],
  traitOptions: Record<keyof Mammal, string[]>
): { trait: keyof Mammal; infoGain: number }[] {
  const currentEntropy = calculateEntropy(currentProbs);
  const results: { trait: keyof Mammal; infoGain: number }[] = [];

  for (const trait of availableTraits) {
    const options = traitOptions[trait];
    if (!options || options.length <= 1) continue;

    let expectedEntropy = 0;

    // For each possible option value of this trait
    for (const optVal of options) {
      // Calculate P(optVal) = sum_{m} P(m) * P(optVal | m)
      let pOptVal = 0;
      const posteriorProbs: Record<string, number> = {};

      for (const m of mammals) {
        const pMammal = currentProbs[m['Common Name']] ?? 0;
        const likelihood = getLikelihood(trait, m[trait], optVal);
        const post = pMammal * likelihood;
        posteriorProbs[m['Common Name']] = post;
        pOptVal += post;
      }

      // If this option value is possible
      if (pOptVal > 0.0001) {
        // Normalize the conditional distribution P(m | optVal)
        for (const name in posteriorProbs) {
          posteriorProbs[name] /= pOptVal;
        }

        // Calculate conditional entropy H(P | optVal)
        const condEntropy = calculateEntropy(posteriorProbs);
        expectedEntropy += pOptVal * condEntropy;
      }
    }

    const infoGain = currentEntropy - expectedEntropy;
    results.push({ trait, infoGain: Math.max(0, infoGain) });
  }

  // Sort by highest information gain
  return results.sort((a, b) => b.infoGain - a.infoGain);
}

/**
 * Finds a trait that discriminates between the two top candidates.
 */
export function findDiscriminatorTrait(
  m1: Mammal,
  m2: Mammal,
  availableTraits: (keyof Mammal)[]
): keyof Mammal | null {
  for (const trait of availableTraits) {
    const val1 = m1[trait].trim().toLowerCase();
    const val2 = m2[trait].trim().toLowerCase();
    if (val1 !== val2) {
      return trait;
    }
  }
  return null;
}
