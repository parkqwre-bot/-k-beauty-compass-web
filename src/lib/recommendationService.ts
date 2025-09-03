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
  console.log("--- New Recommendation Service Start ---");
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
        case 0:
          userConcerns.push('acne');
          break;
        case 1:
          userConcerns.push('pore');
          break;
        case 2:
          userConcerns.push('anti-aging');
          break;
        case 3:
          userConcerns.push('sensitive');
          break;
        case 4:
          userConcerns.push('dullness');
          break;
      }
    }
  }

  console.log("User Profile - Skin Type:", userSkinType, ", Concerns:", userConcerns);

  // --- Filter Products ---
  let recommendedProducts: Product[] = allProducts.filter((product) => {
    const productAttributes = product.attributes;
    let skinTypeMatch = false;
    let concernMatch = false;

    if (userSkinType) {
      const productSkinType = productAttributes['skinType'] as string;
      if (productSkinType && productSkinType === userSkinType) {
        skinTypeMatch = true;
      }
    } else {
      skinTypeMatch = true;
    }

    if (userConcerns.length > 0) {
      const productSkinType = productAttributes['skinType'] as string;
      if (productSkinType) {
        for (const concern of userConcerns) {
          if (productSkinType === concern) {
            concernMatch = true;
            break;
          }
        }
      }
    } else {
      concernMatch = true;
    }

    return skinTypeMatch || concernMatch;
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

  console.log(`Found ${recommendedProducts.length} matching products.`);
  console.log("--- New Recommendation Service End ---");

  return recommendedProducts;
}
