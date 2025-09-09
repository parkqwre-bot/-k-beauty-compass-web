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
    // if 3 (notSure), userSkinType remains undefined
  }

  const sensitivityAnswer = answers[3]?.[0];
  // If user says they are sensitive, this overrides their basic skin type for recommendation purposes.
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
        case 4: userConcerns.push('brightening'); break; // Mapped from dullness
      }
    }
  }

  console.log("User Profile - Skin Type:", userSkinType, ", Concerns:", userConcerns);

  // --- Filter Products with New Logic ---
  let recommendedProducts: Product[] = allProducts.filter((product) => {
    const { skinTypes, concerns } = product.attributes;

    // If user has no specific skin type, it matches all products.
    const skinTypeMatch = userSkinType ? skinTypes.includes(userSkinType) : true;

    // If user has no specific concerns, it matches all products.
    // Otherwise, check if there is at least one overlapping concern.
    const concernMatch = userConcerns.length === 0 ? true : userConcerns.some(concern => concerns.includes(concern));

    // A product is recommended only if it matches BOTH skin type AND concerns.
    return skinTypeMatch && concernMatch;
  });

  // Filter by location
  if (isUS) {
    recommendedProducts = recommendedProducts.filter(
      (p) => p.affiliateUrlAmazon && !isKorean(p.name)
    );
  } else {
    recommendedProducts = recommendedProducts.filter(
      (p) => p.affiliateUrlCoupang
    );
  }

  // Simple de-duplication
  const uniqueRecommendedProducts = Array.from(new Map(recommendedProducts.map(p => [p.name, p])).values());

  console.log(`Found ${uniqueRecommendedProducts.length} matching products.`);
  console.log("--- Intelligent Recommendation Service End ---");

  return uniqueRecommendedProducts;
}