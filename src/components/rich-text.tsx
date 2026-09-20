import { richTextInlineHtml } from "@/lib/rich-text";

export function RichText({ value, links = true, className = "" }: { value?: string | null; links?: boolean; className?: string }) {
  return <span className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: richTextInlineHtml(value, links) }} />;
}
