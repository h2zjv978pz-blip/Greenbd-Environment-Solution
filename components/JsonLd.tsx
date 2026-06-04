// JSON-LD structured data for SEO
// Renders as <script type="application/ld+json"> in <head>

interface Props { data: Record<string, unknown> }

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
