import { useState, useEffect, useCallback, useRef } from "react";
import "./RichEditor.css";

export default function RichEditor({ value, onChange, readonly, placeholder }) {
  const [editor, setEditor] = useState(null);
  const [ready, setReady] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      const { Editor } = await import("@tiptap/core");
      const StarterKit = (await import("@tiptap/starter-kit")).default;
      const Underline = (await import("@tiptap/extension-underline")).default;
      const Link = (await import("@tiptap/extension-link")).default.configure({ openOnClick: false });
      const Image = (await import("@tiptap/extension-image")).default;
      const Table = (await import("@tiptap/extension-table")).default.configure({ resizable: true });
      const TableRow = (await import("@tiptap/extension-table-row")).default;
      const TableCell = (await import("@tiptap/extension-table-cell")).default;
      const TableHeader = (await import("@tiptap/extension-table-header")).default;
      const TextAlign = (await import("@tiptap/extension-text-align")).default.configure({ types: ["heading", "paragraph"] });
      const Placeholder = (await import("@tiptap/extension-placeholder")).default.configure({ placeholder: placeholder || "开始编辑..." });
      const CharacterCount = (await import("@tiptap/extension-character-count")).default.configure({ limit: 100000 });
      const TextStyle = (await import("@tiptap/extension-text-style")).default;
      const Color = (await import("@tiptap/extension-color")).default;
      const Highlight = (await import("@tiptap/extension-highlight")).default.configure({ multicolor: true });
      const FontFamily = (await import("@tiptap/extension-font-family")).default;

      const ed = new Editor({
        element: editorRef.current,
        extensions: [
          StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
          Underline, TextStyle, Color, Highlight, FontFamily,
          Link.configure({ openOnClick: false, autolink: true }),
          Image.configure({ allowBase64: true, inline: false }),
          TextAlign.configure({ types: ["heading", "paragraph"] }),
          Table.configure({ resizable: true }), TableRow, TableCell, TableHeader,
          Placeholder, CharacterCount,
        ],
        editorProps: {
          attributes: { class: "rich-editor-content" },
          handlePaste: (view, event) => {
            const html = event.clipboardData.getData("text/html");
            if (!html) return false;
            event.preventDefault();
            const cleaned = html
              .replace(/<meta[^>]*>/gi, "").replace(/<link[^>]*>/gi, "")
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
              .replace(/ class="[^"]*"/gi, "").replace(/ style="[^"]*"/gi, "")
              .replace(/ lang="[^"]*"/gi, "").replace(/<span[^>]*>/gi, "").replace(/<\/span>/gi, "")
              .replace(/<!--[\s\S]*?-->/g, "");
            ed.commands.setContent(cleaned, false, { preserveWhitespace: true });
            return true;
          },
        },
        content: value || "",
        onUpdate: function () {
          if (this && onChange) onChange(this.getHTML());
        },
      });

      if (!readonly && ed) ed.setEditable(true);
      if (mounted) {
        setEditor(ed);
        setReady(true);
      }
    }
    init();
    return () => {
      mounted = false;
      if (editor) editor.destroy();
    };
  }, []);

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value]);

  useEffect(() => {
    if (editor && readonly) editor.setEditable(false);
  }, [readonly]);

  return (
    <div className="rich-editor-wrapper">
      {ready && <Toolbar editor={editor} />}
      <div ref={editorRef} className="rich-editor-mount" style={{ minHeight: "300px" }} />
      {ready && (
        <div className="rich-editor-footer">
          <span className="ree-char-count">
            {editor.storage.characterCount?.characters?.() || 0} 字
          </span>
        </div>
      )}
    </div>
  );
}

function Toolbar({ editor }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLink, setShowLink] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("16");

  if (!editor) return null;

  const Btn = ({ active, onClick, title, children }) => (
    <button className={"re-tool-btn " + (active ? "active" : "")} onClick={onClick} title={title} type="button">
      {children}
    </button>
  );
  const Sep = () => <span className="re-divider" />;

  return (
    <div className="re-toolbar">
      <div className="re-toolbar-row">
        <Btn onClick={() => editor.chain().focus().undo().run()} title="撤销">↩</Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="重做">↪</Btn>
        <Btn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="清除格式">✕</Btn>
        <Sep />

        <select
          className="re-select"
          value={editor.isActive("heading") ? "h" + editor.getAttributes("heading").level : "p"}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(v[1]) }).run();
          }}
        >
          <option value="p">正文</option>
          {[1, 2, 3, 4, 5, 6].map((l) => (
            <option key={l} value={"h" + l}>标题 H{l}</option>
          ))}
        </select>

        <select
          className="re-select"
          value={fontSize}
          onChange={(e) => {
            setFontSize(e.target.value);
            editor.chain().focus().setFontSize(e.target.value + "px").run();
          }}
        >
          {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((s) => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>
        <Sep />

        <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="加粗"><b>B</b></Btn>
        <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="斜体"><i>I</i></Btn>
        <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="下划线"><u>U</u></Btn>
        <Btn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="删除线"><s>S</s></Btn>
        <Sep />

        <div style={{ position: "relative", display: "flex" }}>
          <Btn onClick={() => setShowColor(!showColor)} title="文字颜色">
            <span style={{ borderBottom: "2px solid", borderColor: color }}>A</span>
          </Btn>
          {showColor && (
            <div className="re-color-picker">
              <input type="color" value={color} onChange={(e) => { setColor(e.target.value); editor.chain().focus().setColor(e.target.value).run(); }} />
            </div>
          )}
        </div>
        <div style={{ position: "relative", display: "flex" }}>
          <Btn onClick={() => setShowBg(!showBg)} title="背景颜色">
            <span style={{ background: bgColor, padding: "0 2px", borderRadius: "2px" }}>A</span>
          </Btn>
          {showBg && (
            <div className="re-color-picker">
              <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); editor.chain().focus().toggleHighlight({ color: e.target.value }).run(); }} />
            </div>
          )}
        </div>
        <Sep />

        <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="左对齐">≡</Btn>
        <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="居中">≡</Btn>
        <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="右对齐">≡</Btn>
        <Sep />

        <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="无序列表">•≡</Btn>
        <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="有序列表">1.</Btn>
        <Btn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="引用">"</Btn>
        <Sep />

        <Btn active={editor.isActive("link")} onClick={() => setShowLink(!showLink)} title="链接">🔗</Btn>
        <Btn onClick={() => { const u = prompt("请输入图片URL:"); if (u) editor.chain().focus().setImage({ src: u }).run(); }} title="图片">🖼</Btn>
        <Btn onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="表格">⊞</Btn>
        <Sep />

        <Btn onClick={() => { document.querySelector(".rich-editor-wrapper")?.classList.toggle("fullscreen"); }} title="全屏">⛶</Btn>
      </div>

      {showLink && (
        <div className="re-link-input">
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="输入链接地址..."
            onKeyDown={(e) => { if (e.key === "Enter" && linkUrl) { editor.chain().focus().setLink({ href: linkUrl }).run(); setShowLink(false); setLinkUrl(""); } }}
          />
          <button onClick={() => { if (linkUrl) { editor.chain().focus().setLink({ href: linkUrl }).run(); setShowLink(false); setLinkUrl(""); } }}>确定</button>
          {editor.isActive("link") && <button onClick={() => { editor.chain().focus().unsetLink().run(); setShowLink(false); }}>删除链接</button>}
          <button onClick={() => setShowLink(false)}>取消</button>
        </div>
      )}
    </div>
  );
}
