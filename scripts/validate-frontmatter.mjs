import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

// Define the Zod schema for frontmatter - must match src/lib/posts.ts
const PostFrontmatterSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  title: z.string().min(1, "Title cannot be empty"),
  thumbnail: z.string().optional(),
  description: z.string().min(1, "Description cannot be empty"),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
});

const postsDirectory = path.join(process.cwd(), 'posts');
let hasErrors = false;

async function validateFrontmatter(locale) {
  const fullPath = path.join(postsDirectory, locale);
  let fileNames = [];
  try {
    fileNames = fs.readdirSync(fullPath);
  } catch (err) {
    console.error(`Error: Could not read directory '${fullPath}'. Skipping validation for this locale.`);
    hasErrors = true;
    return;
  }

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) {
      continue;
    }
    const id = fileName.replace(/\.md$/, '');
    const fullFilePath = path.join(fullPath, fileName);
    let fileContents;

    try {
      fileContents = fs.readFileSync(fullFilePath, 'utf8');
    } catch (readError) {
      console.error(`ERROR: [${locale}/${fileName}] Could not read file:`, readError.message);
      hasErrors = true;
      continue;
    }

    try {
      const matterResult = matter(fileContents);
      const validatedData = PostFrontmatterSchema.safeParse(matterResult.data);

      if (!validatedData.success) {
        console.error(`ERROR: [${locale}/${fileName}] Frontmatter validation failed:`);
        validatedData.error.errors.forEach(err => {
          console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
        hasErrors = true;
      }
    } catch (parseError) {
      console.error(`ERROR: [${locale}/${fileName}] YAML parsing failed:`, parseError.message);
      hasErrors = true;
    }
  }
}

async function runValidation() {
  console.log("Starting frontmatter validation...");
  await validateFrontmatter('en');
  await validateFrontmatter('ko');

  if (hasErrors) {
    console.error("
Frontmatter validation FAILED. Please fix the errors listed above.");
    process.exit(1);
  } else {
    console.log("
Frontmatter validation PASSED for all files.");
    process.exit(0);
  }
}

runValidation();
