import { memo } from "react";

import { routePaths } from "@/app/router";
import type { PaperResultCardProps } from "@/features/search/types";
import ListWorkLayout from "@/layout/components/ListWorkLayout";

function PaperResultCardComponent({ paper }: PaperResultCardProps) {
  return (
    <ListWorkLayout
      abstractText={paper.abstract}
      authors={paper.authors}
      citations={paper.citations}
      detailHref={routePaths.paperDetail(paper.id)}
      doi={paper.doi}
      field={paper.field}
      isSaved={paper.saved}
      isTrendTopic={paper.isTrendTopic}
      keywords={paper.tags}
      pdfUrl={paper.pdfUrl}
      subField={paper.subField}
      title={paper.title}
      topic={paper.topic}
      venue={paper.venue}
      year={paper.year}
    />
  );
}

export const PaperResultCard = memo(PaperResultCardComponent);

