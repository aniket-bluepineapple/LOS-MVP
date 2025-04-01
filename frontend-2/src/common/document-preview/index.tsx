"use client";

import { FunctionComponent } from "react";

const DocumentPreview: FunctionComponent<TDocumentPreviewProps> = ({
  docPreview,
  previewText,
}) => {
  return (
    docPreview && (
      <a
        href={docPreview}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-blue-500"
      >
        {previewText}
      </a>
    )
  );
};

export type TDocumentPreviewProps = {
  docPreview: string | null;
  previewText: string;
};

export default DocumentPreview;
