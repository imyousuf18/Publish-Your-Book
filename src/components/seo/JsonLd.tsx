/**
 * Renders structured data as a JSON-LD script. No visual output.
 *
 * `<` is escaped so a string containing "</script>" can never close the tag
 * early; every value here comes from our own content files, but the escape is
 * cheap and keeps that true if a CMS ever feeds this.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
