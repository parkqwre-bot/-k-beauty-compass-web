import { Product, allProducts } from '../data/products';

interface QuizAnswers {
  [key: number]: number[];
}

function isKorean(text: string): boolean {
  return /[가-힯ᄀ-ᇿ㄰-㆏]/.test(text);
}

export async function getRecommendations(
  answers: QuizAnswers,
  isUS: boolean
): Promise<Product[]> {
  console.log("--- Intelligent Recommendation Service Start ---");
  console.log("Received answers:", answers);
  console.log("User location isUS:", isUS);

  // --- Determine User's Profile from Answers ---
  let userSkinType: string | undefined;
  const skinFeelAnswer = answers[1]?.[0];
  if (skinFeelAnswer !== undefined) {
    if (skinFeelAnswer === 0) userSkinType = 'dry';
    if (skinFeelAnswer === 1) userSkinType = 'normal';
    if (skinFeelAnswer === 2) userSkinType = 'oily';
  }

  const sensitivityAnswer = answers[3]?.[0];
  if (sensitivityAnswer === 0 || sensitivityAnswer === 1) {
    userSkinType = 'sensitive';
  }

  const userConcerns: string[] = [];
  const concernAnswers = answers[2];
  if (concernAnswers) {
    for (const answer of concernAnswers) {
      switch (answer) {
        case 0: userConcerns.push('acne'); break;
        case 1: userConcerns.push('pore'); break;
        case 2: userConcerns.push('aging'); break;
        case 3: userConcerns.push('sensitive'); break;
        case 4: userConcerns.push('brightening'); break;
      }
    }
  }

  console.log("User Profile - Skin Type:", userSkinType, ", Concerns:", userConcerns);

  // --- Implement Scoring-Based Recommendation ---
  const scoredProducts: { product: Product; score: number }[] = [];

  for (const product of allProducts) {
    let score = 0;

    // 1. Location Check (Mandatory)
    const locationMatch = isUS
      ? product.affiliateUrlAmazon && !isKorean(product.name)
      : product.affiliateUrlCoupang;

    if (!locationMatch) {
      continue; // Skip products not available in the user's region
    }

    // 2. Skin Type Match (Score: 2)
    if (userSkinType && product.attributes.skinTypes.includes(userSkinType)) {
      score += 2;
    }

    // 3. Concern Match (Score: 3 - higher priority)
    if (userConcerns.length > 0) {
      const hasConcernMatch = userConcerns.some(concern => product.attributes.concerns.includes(concern));
      if (hasConcernMatch) {
        score += 3;
      }
    }

    // Only add products that have at least one match (score > 0)
    if (score > 0) {
      scoredProducts.push({ product, score });
    }
  }

  // Sort by score (descending) and then by product name (for consistent order)
  scoredProducts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score; // Higher score first
    }
    return a.product.name.localeCompare(b.product.name); // Alphabetical if scores are equal
  });

  // Extract just the products from the scored list
  const uniqueRecommendedProducts = Array.from(new Map(scoredProducts.map(p => [p.name, p.product])).values());

  console.log(`Found ${uniqueRecommendedProducts.length} matching products.`);
  console.log("--- Intelligent Recommendation Service End ---");

  return uniqueRecommendedProducts;
}nswers[2];
  if (concernAnswers) {
    for (const answer of concernAnswers) {
      switch (answer) {
        case 0: userConcerns.push('acne'); break;
        case 1: userConcerns.push('pore'); break;
        case 2: userConcerns.push('aging'); break;
        case 3: userConcerns.push('sensitive'); break;
        case 4: userConcerns.push('brightening'); break;
      }
    }
  }

  console.log("User Profile - Skin Type:", userSkinType, ", Concerns:", userConcerns);

  // --- Filter Available Products with User Profile ---
  let recommendedProducts: Product[] = availableProducts.filter((product) => {
    const { skinTypes, concerns } = product.attributes;
    const skinTypeMatch = userSkinType ? skinTypes.includes(userSkinType) : true;
    const concernMatch = userConcerns.length === 0 ? true : userConcerns.some(concern => concerns.includes(concern));
    return skinTypeMatch && concernMatch;
  });

  // Simple de-duplication
  const uniqueRecommendedProducts = Array.from(new Map(recommendedProducts.map(p => [p.name, p])).values());

  console.log(`Found ${uniqueRecommendedProducts.length} matching products after profile filtering.`);
  console.log("--- Intelligent Recommendation Service End ---");

  return uniqueRecommendedProducts;
}