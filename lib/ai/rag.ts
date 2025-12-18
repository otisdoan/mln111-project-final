/**
 * RAG Logic - Retrieval-Augmented Generation
 * Search relevant lessons for context
 */

import lessons from "@/data/lessons.json";
import { LessonContext } from "@/types/chat";

/**
 * Simple keyword-based search trong lessons.json
 * Trả về top N bài học liên quan nhất
 */
export function searchRelevantLessons(
  query: string,
  topN: number = 3
): LessonContext[] {
  const queryLower = query.toLowerCase();
  const keywords = extractKeywords(queryLower);

  const results: LessonContext[] = [];

  for (const lesson of lessons) {
    let score = 0;
    const relevantSections: string[] = [];

    // Check title
    if (lesson.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Check keywords in title
    for (const keyword of keywords) {
      if (lesson.title.toLowerCase().includes(keyword)) {
        score += 5;
      }
    }

    // Check sections
    for (const section of lesson.sections) {
      let sectionScore = 0;
      let sectionText = "";

      if ("heading" in section && section.heading) {
        sectionText += section.heading + " ";
        if (section.heading.toLowerCase().includes(queryLower)) {
          sectionScore += 8;
        }
      }

      if ("body" in section && section.body) {
        sectionText += section.body + " ";
        if (section.body.toLowerCase().includes(queryLower)) {
          sectionScore += 5;
        }
      }

      // Check keywords in section
      for (const keyword of keywords) {
        if (sectionText.toLowerCase().includes(keyword)) {
          sectionScore += 2;
        }
      }

      if (sectionScore > 0) {
        score += sectionScore;
        if ("heading" in section && section.heading) {
          relevantSections.push(section.heading);
        } else if ("body" in section && section.body) {
          relevantSections.push(section.body.substring(0, 100) + "...");
        }
      }
    }

    if (score > 0) {
      results.push({
        slug: lesson.slug,
        title: lesson.title,
        relevantSections: relevantSections.slice(0, 3),
        similarity: score,
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.similarity - a.similarity);

  return results.slice(0, topN);
}

/**
 * Extract important keywords from query
 */
function extractKeywords(query: string): string[] {
  // Vietnamese stopwords to remove
  const stopwords = [
    "là",
    "gì",
    "như",
    "thế",
    "nào",
    "của",
    "và",
    "có",
    "trong",
    "được",
    "với",
    "các",
    "để",
    "về",
    "cho",
    "từ",
    "này",
    "đó",
    "khi",
    "ra",
    "vào",
    "ở",
    "hay",
    "nhưng",
    "vì",
    "nên",
    "theo",
    "mà",
    "đã",
    "sẽ",
    "đang",
  ];

  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .filter((word) => !stopwords.includes(word));

  return [...new Set(words)]; // Remove duplicates
}

/**
 * Get lesson metadata for link generation
 */
export function getLessonMetadata(
  contexts: LessonContext[]
): { slug: string; title: string }[] {
  return contexts.map((c) => ({
    slug: c.slug,
    title: c.title,
  }));
}

/**
 * Build context string from relevant lessons
 */
export function buildContextString(contexts: LessonContext[]): string {
  if (contexts.length === 0) {
    return "Không tìm thấy thông tin liên quan trong bài học.";
  }

  let contextStr = "Thông tin từ các bài học:\n\n";

  for (const context of contexts) {
    contextStr += `📚 ${context.title}\n`;
    if (context.relevantSections.length > 0) {
      contextStr += context.relevantSections
        .map((section) => `  - ${section}`)
        .join("\n");
      contextStr += "\n\n";
    }
  }

  return contextStr;
}

/**
 * Get full lesson content by slug
 */
export function getLessonContent(slug: string): string {
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) return "";

  let content = `${lesson.title}\n\n`;

  for (const section of lesson.sections) {
    if ("heading" in section && section.heading) {
      content += `\n## ${section.heading}\n`;
    }
    if ("body" in section && section.body) {
      content += `${section.body}\n`;
    }
    if ("bullets" in section && section.bullets) {
      content += section.bullets.map((b) => `• ${b}`).join("\n") + "\n";
    }
  }

  return content;
}
