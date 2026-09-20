"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { plainText, richTextHtml, safeLink } from "@/lib/rich-text";

type Props = {
  name?: string;
  defaultValue?: string | number | readonly string[];
  required?: boolean;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
};

const buttonClass = "rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-cpe-royal disabled:opacity-40 aria-pressed:border-cpe-royal aria-pressed:bg-blue-50";

function colorPickerValue(color: string) {
  if (/^#[\da-f]{6}$/i.test(color)) return color;
  const rgb = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  return rgb ? `#${rgb.slice(1).map((channel) => Number(channel).toString(16).padStart(2, "0")).join("")}` : "#172554";
}

export function RichTextEditor({ name, defaultValue, required, placeholder, rows = 2, disabled }: Props) {
  const initialValue = String(defaultValue ?? "");
  const [value, setValue] = useState(initialValue);
  const [invalid, setInvalid] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkError, setLinkError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState({ from: 1, to: 1 });
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: false, bulletList: false, orderedList: false, listItem: false, listKeymap: false,
        blockquote: false, codeBlock: false, code: false, horizontalRule: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https", isAllowedUri: (url) => !!safeLink(url), HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } },
      }),
      TextStyleKit.configure({ fontFamily: false, backgroundColor: false, lineHeight: false }),
      TextAlign.configure({ types: ["paragraph"] }),
    ],
    content: richTextHtml(initialValue),
    editorProps: {
      attributes: {
        role: "textbox", "aria-label": placeholder || name || "Texto", "aria-multiline": "true",
        "aria-required": required ? "true" : "false",
        class: "rich-editor-content outline-none px-3.5 py-3 text-sm text-slate-800",
        style: `min-height: ${Math.max(rows * 24, 64)}px`,
      },
      transformPastedHTML: (html) => richTextHtml(html),
    },
    onUpdate: ({ editor }) => {
      setValue(editor.isEmpty ? "" : editor.getHTML());
      if (!editor.isEmpty) setInvalid(false);
    },
  });
  const state = useEditorState({
    editor,
    selector: ({ editor }) => editor ? {
      bold: editor.isActive("bold"), italic: editor.isActive("italic"), underline: editor.isActive("underline"),
      link: editor.isActive("link"), size: editor.getAttributes("textStyle").fontSize ?? "",
      color: editor.getAttributes("textStyle").color ?? "#172554",
      align: editor.getAttributes("paragraph").textAlign ?? "left",
      undo: editor.can().undo(), redo: editor.can().redo(),
    } : null,
  });

  useEffect(() => {
    const form = textareaRef.current?.form;
    if (!form || !editor) return;
    function reset() {
      editor?.commands.setContent(richTextHtml(initialValue));
      setValue(initialValue);
      setInvalid(false);
      setLinkOpen(false);
    }
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [editor, initialValue]);

  function openLink() {
    if (!editor) return;
    if (editor.isActive("link")) editor.commands.extendMarkRange("link");
    setSelection({ from: editor.state.selection.from, to: editor.state.selection.to });
    setLinkUrl(editor.getAttributes("link").href ?? "");
    setLinkText("");
    setLinkError("");
    setLinkOpen(true);
  }

  function applyLink() {
    if (!editor) return;
    const href = safeLink(linkUrl);
    if (!href) { setLinkError("Ingresá una URL con https://, un correo con mailto:, un teléfono con tel: o una ruta del sitio (/…)."); return; }
    const chain = editor.chain().focus().setTextSelection(selection);
    if (selection.from === selection.to) {
      chain.insertContent({ type: "text", text: linkText.trim() || href, marks: [{ type: "link", attrs: { href } }] }).run();
    } else chain.setLink({ href }).run();
    setLinkOpen(false);
  }

  return (
    <div className={`relative min-w-0 overflow-hidden rounded-xl border bg-white shadow-sm focus-within:ring-2 focus-within:ring-cpe-royal/20 ${invalid ? "border-red-500" : "border-slate-200"}`}>
      <div role="toolbar" aria-label={`Formato de ${name ?? "texto"}`} className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-slate-50 p-2">
        <button type="button" className={buttonClass} aria-label="Negrita" title="Negrita (Ctrl/Cmd+B)" aria-pressed={state?.bold ?? false} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleBold().run()}><strong>N</strong></button>
        <button type="button" className={buttonClass} aria-label="Cursiva" aria-pressed={state?.italic ?? false} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleItalic().run()}><em>C</em></button>
        <button type="button" className={buttonClass} aria-label="Subrayado" aria-pressed={state?.underline ?? false} disabled={!editor || disabled} onClick={() => editor?.chain().focus().toggleUnderline().run()}><u>S</u></button>
        <select aria-label="Tamaño de texto" className={buttonClass} value={state?.size ?? ""} disabled={!editor || disabled} onChange={(event) => { const chain = editor?.chain().focus(); if (event.target.value) chain?.setFontSize(event.target.value).run(); else chain?.unsetFontSize().run(); }}>
          <option value="">Tamaño del sitio</option>
          {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((size) => <option key={size} value={`${size}px`}>{size} px</option>)}
        </select>
        <label className={`${buttonClass} inline-flex items-center gap-1.5`}>Color<input aria-label="Color de texto" type="color" className="h-5 w-6 cursor-pointer border-0 p-0" value={colorPickerValue(state?.color ?? "#172554")} disabled={!editor || disabled} onChange={(event) => editor?.chain().focus().setColor(event.target.value).run()} /></label>
        <select aria-label="Alineación" className={buttonClass} value={state?.align ?? "left"} disabled={!editor || disabled} onChange={(event) => editor?.chain().focus().setTextAlign(event.target.value).run()}>
          <option value="left">Izquierda</option><option value="center">Centro</option><option value="right">Derecha</option><option value="justify">Justificar</option>
        </select>
        <button type="button" className={buttonClass} aria-pressed={state?.link ?? false} disabled={!editor || disabled} onClick={openLink}>Enlace</button>
        <button type="button" className={buttonClass} disabled={!state?.link || disabled} onClick={() => editor?.chain().focus().extendMarkRange("link").unsetLink().run()}>Quitar enlace</button>
        <button type="button" className={buttonClass} disabled={!editor || disabled} onClick={() => editor?.chain().focus().unsetAllMarks().unsetTextAlign().run()}>Limpiar formato</button>
        <button type="button" className={buttonClass} aria-label="Deshacer" disabled={!state?.undo || disabled} onClick={() => editor?.chain().focus().undo().run()}>↶</button>
        <button type="button" className={buttonClass} aria-label="Rehacer" disabled={!state?.redo || disabled} onClick={() => editor?.chain().focus().redo().run()}>↷</button>
      </div>
      {linkOpen && <div role="group" aria-label="Editar enlace" className="space-y-2 border-b border-slate-200 bg-blue-50 p-3" onKeyDown={(event) => {
        if (event.key === "Enter") { event.preventDefault(); applyLink(); }
        if (event.key === "Escape") { event.preventDefault(); setLinkOpen(false); editor?.commands.focus(); }
      }}>
        <label className="block text-xs font-medium text-slate-700">Destino del enlace<input autoFocus aria-label="Destino del enlace" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="https://ejemplo.com" className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm" /></label>
        {selection.from === selection.to && <label className="block text-xs font-medium text-slate-700">Texto del enlace<input aria-label="Texto del enlace" value={linkText} onChange={(event) => setLinkText(event.target.value)} placeholder="Ver más información" className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm" /></label>}
        {linkError && <p role="alert" className="text-xs text-red-700">{linkError}</p>}
        <div className="flex gap-2"><button type="button" className={buttonClass} onClick={applyLink}>Aplicar enlace</button><button type="button" className={buttonClass} onClick={() => { setLinkOpen(false); editor?.commands.focus(); }}>Cancelar</button></div>
      </div>}
      <EditorContent editor={editor} />
      {!editor && <p className="px-3.5 py-3 text-sm text-slate-500">Cargando editor…</p>}
      <textarea ref={textareaRef} name={name} value={plainText(value).trim() ? value : ""} onChange={() => {}} required={required} disabled={disabled} tabIndex={-1} aria-label={`Contenido de ${name ?? "texto"}`} className="pointer-events-none absolute bottom-0 left-0 h-px w-px opacity-0" onInvalid={(event) => { event.preventDefault(); setInvalid(true); editor?.commands.focus(); }} />
      {invalid && <p role="alert" className="px-3.5 pb-2 text-xs text-red-600">Completá este campo.</p>}
      <p className="border-t border-slate-100 px-3 py-1.5 text-[11px] text-slate-400">Seleccioná el texto para darle formato o agregar un enlace.</p>
    </div>
  );
}
