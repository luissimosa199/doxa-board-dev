import { TimeLineEntryData } from "@/types";
import { cropImageLink } from "@/utils/cropImageLink";
import { stripHtml } from "@/utils/stripHtml";
import { FunctionComponent } from "react";

interface HeadMetaTagsProps {
  timeline?: TimeLineEntryData[];
  timelineName: string;
  timeLineUrl: string;
  message?: string;
  siteName: string;
}

const HeadMetaTags: FunctionComponent<HeadMetaTagsProps> = ({
  timeline,
  timelineName,
  timeLineUrl,
  message,
  siteName,
}) => {
  const url = timeline?.[0]?.url
    ? cropImageLink(timeline[0].url, "c_fill,h_630,w_1200,f_png/")
    : "";

  return (
    <>
      <meta
        property="og:image"
        itemProp="image"
        content={url || ""}
      />
      <meta
        name="twitter:image"
        content={url || ""}
      />

      <meta
        property="og:image:width"
        content="1200"
      />
      <meta
        property="og:image:height"
        content="630"
      />

      <title>{stripHtml(timelineName)}</title>
      <meta
        property="og:description"
        content={stripHtml(timelineName)}
      >
        {stripHtml(timelineName)}
      </meta>

      <meta
        property="og:url"
        content={`${timeLineUrl}`}
      />
      <meta
        property="og:title"
        content={`${timelineName}`}
      />
      <meta
        name="twitter:title"
        content={`${timelineName}`}
      />
      <meta
        property="og:description"
        content={`${message}`}
      />
      <meta
        name="twitter:description"
        content={`${message}`}
      />
      <meta
        property="og:type"
        content="website"
      />
      <meta
        property="og:image:type"
        content="image/jpeg"
      />
      <meta
        property="og:site_name"
        content={siteName}
      />
    </>
  );
};

export default HeadMetaTags;
