import { routePaths } from "@/app/router";
import type { PaperResultCardProps } from "@/features/search/types";
import ListWorkLayout from "@/layout/global/ListWorkLayout";

export function PaperResultCard({ paper }: PaperResultCardProps) {
  return (
    <ListWorkLayout
      abstractText={paper.abstract}
      authors={paper.authors}
      authorRefs={paper.authorRefs}
      citations={paper.citations}
      detailHref={routePaths.paperDetail(paper.id)}
      doi={paper.doi}
      field={paper.field}
      isSaved={paper.saved}
      keywords={paper.keywords}
      pdfUrl={paper.pdfUrl}
      subField={paper.subField}
      title={paper.title}
      topic={paper.topic}
      topicRef={paper.topicRef}
      source={paper.source}
      workId={paper.id}
      year={paper.year}
    />
  );
}

