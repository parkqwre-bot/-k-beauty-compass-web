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

  let uniqueRecommendedProducts = Array.from(new Map(scoredProducts.map(p => [p.product.name, p.product])).values());

  // --- Fallback Logic: Ensure products are always returned ---
  if (uniqueRecommendedProducts.length === 0) {
    console.log("No specific recommendations found. Returning default products.");
    if (isUS) {
      uniqueRecommendedProducts = defaultAmazonProducts;
    } else {
      uniqueRecommendedProducts = defaultCoupangProducts;
    }
  }

  console.log(`Found ${uniqueRecommendedProducts.length} matching products.`);
  console.log("--- Intelligent Recommendation Service End ---");

  return uniqueRecommendedProducts;
}

// Define default products outside the function
const defaultCoupangProducts: Product[] = [
  { "id": 1, "name": "라네즈 크림스킨", "description": "세안 후 피부를 진정시키고 수분 보충에 효과적이라는 평이 많음.", "imageUrl": "https://thumbnail1.coupangcdn.com/thumbnails/remote/212x212ex/image/vendor_inventory/d027/a7b5e3491d038d2ba2275247975f17d49f3e52411a5136613baba1762c34.jpg", "affiliateUrlCoupang": "https://link.coupang.com/a/cM7hXW", "affiliateUrlAmazon": "", "attributes": { "skinTypes": ["dry", "sensitive"], "concerns": [], "formulation": "toner" } },
  { "id": 12, "name": "닥터지 레드 블레미쉬 클리어 수딩 크림", "description": "저자극, 트러블 진정용으로 많이 사용됨.", "imageUrl": "https://thumbnail14.coupangcdn.com/thumbnails/remote/212x212ex/image/vendor_inventory/image_audit/stage/manual/3c1d5ec6-0aea-4087-8bf8-92b8e589a552_1750659497348.jpeg", "affiliateUrlCoupang": "https://link.coupang.com/a/cM71k9", "affiliateUrlAmazon": "", "attributes": { "skinTypes": ["oily", "combination", "sensitive"], "concerns": ["acne"], "formulation": "cream" } }
];

const defaultAmazonProducts: Product[] = [
  { "id": 7, "name": "Cetaphil Daily Hydrating Lotion", "description": "가벼우면서 피부에 수분 공급이 좋음.", "imageUrl": "", "affiliateUrlCoupang": "", "affiliateUrlAmazon": "https://amzn.to/3HViIIb", "attributes": { "skinTypes": ["dry"], "concerns": [], "formulation": "lotion" } },
  { "id": 16, "name": "La Roche-Posay Effaclar Medicated Gel Cleanser", "description": "여드름 피부용 클렌저로 인기.", "imageUrl": "", "affiliateUrlCoupang": "", "affiliateUrlAmazon": "https://amzn.to/3K0mIHR", "attributes": { "skinTypes": ["oily", "acne"], "concerns": ["acne"], "formulation": "cleanser" } }
];
