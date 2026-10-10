function absolutePublicUrl(path: string): string | undefined {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (!base || !path.startsWith("/")) return undefined;
  return `${base}${path}`;
}

/** Inline preview for league PDFs/DOCX (DOCX uses Microsoft Office web viewer when app URL is set). */
export function LeagueDocumentEmbed({ docUrl }: { docUrl: string }) {
  const abs = absolutePublicUrl(docUrl);
  const lower = docUrl.toLowerCase();

  if (lower.endsWith(".pdf") && abs) {
    return (
      <div className="mt-6 overflow-hidden rounded-xl border border-electric-blue/25 bg-[#020a18]/80">
        <iframe
          title="League document preview"
          src={`${docUrl}#view=FitH`}
          className="h-[min(70vh,42rem)] w-full bg-white"
        />
      </div>
    );
  }

  if (lower.endsWith(".docx") && abs) {
    const embed = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(abs)}`;
    return (
      <div className="mt-6 overflow-hidden rounded-xl border border-electric-blue/25 bg-[#020a18]/80">
        <iframe title="League document preview" src={embed} className="h-[min(70vh,42rem)] w-full bg-white" />
      </div>
    );
  }

  return (
    <p className="mt-4 text-sm text-cool-grey">
      Use the download button below to open this document on your device.
    </p>
  );
}
