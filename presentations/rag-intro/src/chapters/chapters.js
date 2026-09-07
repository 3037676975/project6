import { renderWhyRag } from './01-why-rag/chapter.js';
import { narrations as whyRagNarrations } from './01-why-rag/narrations.js';
import { renderValueAndLimit } from './02-value-and-limit/chapter.js';
import { narrations as valueNarrations } from './02-value-and-limit/narrations.js';

export const chapters = [
  {
    id: 'why-rag',
    title: '为什么需要 RAG',
    narrations: whyRagNarrations,
    render: renderWhyRag
  },
  {
    id: 'value-and-limit',
    title: '价值与边界',
    narrations: valueNarrations,
    render: renderValueAndLimit
  }
];

export const totalSteps = chapters.reduce((sum, chapter) => sum + chapter.narrations.length, 0);

export function resolveGlobalStep(globalStep) {
  let cursor = 0;
  for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex += 1) {
    const chapter = chapters[chapterIndex];
    const next = cursor + chapter.narrations.length;
    if (globalStep < next) {
      return {
        chapter,
        chapterIndex,
        localStep: globalStep - cursor,
        globalStep,
        narration: chapter.narrations[globalStep - cursor]
      };
    }
    cursor = next;
  }
  const chapter = chapters[chapters.length - 1];
  return {
    chapter,
    chapterIndex: chapters.length - 1,
    localStep: chapter.narrations.length - 1,
    globalStep: totalSteps - 1,
    narration: chapter.narrations[chapter.narrations.length - 1]
  };
}
