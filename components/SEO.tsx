import { SITE_BASE_URL } from "../utils.ts";

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  author?: string;
  publishedTime?: string;
}

export default function SEO({
  title,
  description,
  url = SITE_BASE_URL,
  image = "/logo.svg",
  type = "website",
  author,
  publishedTime,
}: SEOProps) {
  const fullTitle = title.includes("PigMint")
    ? title
    : `${title} - PigMint Blog`;
  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_BASE_URL}${image}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="PigMint Blog" />

      {/* Article specific */}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Telegram */}
      <meta name="telegram:channel" content="@pigmint" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Threads / Instagram */}
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="en_US" />
    </>
  );
}
