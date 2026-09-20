import sanitizeHtml from "sanitize-html";
import { Parser } from "htmlparser2";

const allowedStyles = {
  color: [/^#[\da-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i],
  "font-size": [/^(12|14|16|18|20|24|28|32|36|48)px$/],
  "text-align": [/^(left|center|right|justify)$/],
};
const options: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "span", "a"],
  allowedAttributes: { "*": ["style"], a: ["href", "target", "rel"] },
  allowedStyles: { "*": allowedStyles },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
  transformTags: {
    a: (_tag, attributes) => ({ tagName: "a", attribs: { ...attributes, target: "_blank", rel: "noopener noreferrer" } }),
  },
};

export function isRichText(value: string) {
  return /<\/?[a-z][^>]*>/i.test(value);
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function richTextHtml(value: string | null | undefined): string {
  if (!value) return "";
  if (isRichText(value)) return sanitizeHtml(value, options);
  return value.split("\n").map((line) => `<p>${escapeHtml(line) || "<br>"}</p>`).join("");
}

export function plainText(value: string | null | undefined): string {
  if (!value) return "";
  if (!isRichText(value)) return value;
  let text = "";
  const parser = new Parser({
    ontext(chunk) { text += chunk; },
    onopentag(name) { if (name === "br") text += "\n"; },
    onclosetag(name) { if (name === "p") text += "\n"; },
  }, { decodeEntities: true });
  parser.end(sanitizeHtml(value, options));
  return text.trim();
}

/** Safe phrasing markup, valid inside existing headings, paragraphs and table cells. */
export function richTextInlineHtml(value: string | null | undefined, links = true) {
  const html = richTextHtml(value);
  return sanitizeHtml(html, {
    ...options,
    transformTags: {
      ...options.transformTags,
      p: (_tag, attributes) => ({ tagName: "span", attribs: { ...attributes, class: "rich-text-paragraph" } }),
      ...(!links ? { a: "span" } : {}),
    },
    allowedAttributes: { ...options.allowedAttributes, span: ["style", "class"] },
    allowedClasses: { span: ["rich-text-paragraph"] },
  });
}

export function readRichText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!isRichText(text)) return text;
  const html = richTextHtml(text);
  return plainText(html).trim() ? html : "";
}

/** Each editor paragraph becomes one entry of existing String[]/JSON lists. */
export function richTextLines(value: FormDataEntryValue | null): string[] {
  const text = readRichText(value);
  if (!isRichText(text)) return text.split("\n").map((line) => line.trim()).filter(Boolean);
  return (text.match(/<p\b[^>]*>[\s\S]*?<\/p>/g) ?? [text]).filter((line) => plainText(line).trim());
}

export function joinRichTextLines(lines: string[]) {
  if (!lines.some(isRichText)) return lines.join("\n");
  return lines.map(richTextHtml).join("");
}

export function safeLink(value: string): string | null {
  const href = value.trim();
  if (!href || /[\u0000-\u0020\u007f\\]/.test(href)) return null;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href) || /^\/(?!\/)/.test(href) || /^#[\w-]+$/.test(href)) return href;
  return null;
}
