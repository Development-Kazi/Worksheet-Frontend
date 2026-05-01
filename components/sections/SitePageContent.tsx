type Props = {
  title: string;
  description?: string;
  content?: string;
};

export default function SitePageContent({ title, description, content }: Props) {
  const hasContent = Boolean(content?.trim());

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 32, marginBottom: 14 }}>{title}</h1>
      {!hasContent && description ? (
        <p style={{ color: "#4b5563", lineHeight: 1.8, marginBottom: content ? 20 : 0 }}>
          {description}
        </p>
      ) : null}
      {hasContent ? (
        <div
          style={{ color: "#4b5563", lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : null}
    </main>
  );
}
