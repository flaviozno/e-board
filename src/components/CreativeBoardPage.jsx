import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  Type,
  Trash2,
  Printer,
  Sparkles,
  School,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import SheetHeader from "./SheetHeader";
import HeaderConfigPanel from "./HeaderConfigPanel";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DEFAULT_YEAR = new Date().getFullYear();
const DEFAULT_MONTH = new Date().getMonth() + 1;

const INITIAL_HEADER = {
  teacher: "",
  school: "",
  className: "",
  shift: "",
  month: DEFAULT_MONTH,
  year: DEFAULT_YEAR,
  room: "",
  period: "",
  notes: "",
};

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const createTextItem = () => ({
  id: crypto.randomUUID(),
  type: "text",
  x: 40,
  y: 40,
  w: 180,
  h: 70,
  content: "Digite aqui...",
  fontSize: 18,
  color: "#0f172a",
  fontWeight: "400",
  fontStyle: "normal",
  textDecoration: "none",
  textAlign: "left",
  fontFamily: "Arial",
  lineHeight: 1.35,
  letterSpacing: 0,
  textIndent: 0,
});

const createImageItem = (src) => ({
  id: crypto.randomUUID(),
  type: "image",
  x: 60,
  y: 60,
  w: 220,
  h: 160,
  src,
});

function CreativeBoardPage() {
  const [header, setHeader] = useState(INITIAL_HEADER);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [imageError, setImageError] = useState("");
  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) || null,
    [items, selectedId]
  );

  const textStylePreset = selectedItem?.type === "text"
    ? {
        color: selectedItem.color || "#0f172a",
        fontWeight: selectedItem.fontWeight || "400",
        fontStyle: selectedItem.fontStyle || "normal",
        textDecoration: selectedItem.textDecoration || "none",
        textAlign: selectedItem.textAlign || "left",
        fontFamily: selectedItem.fontFamily || "Arial",
        lineHeight: selectedItem.lineHeight || 1.35,
        letterSpacing: selectedItem.letterSpacing || 0,
        textIndent: selectedItem.textIndent || 0,
      }
    : null;

  const handleHeaderChange = (key, value) => {
    setHeader((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clampToBoard = useCallback((nextItem) => {
    if (!boardRef.current) return nextItem;

    const maxX = boardRef.current.clientWidth - nextItem.w;
    const maxY = boardRef.current.clientHeight - nextItem.h;

    return {
      ...nextItem,
      x: Math.max(0, Math.min(nextItem.x, maxX)),
      y: Math.max(0, Math.min(nextItem.y, maxY)),
    };
  }, []);

  const handleAddText = () => {
    const item = createTextItem();
    setItems((prev) => [...prev, item]);
    setSelectedId(item.id);
  };

  const addImageFromFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setImageError("Escolha um arquivo de imagem valido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageItem = createImageItem(String(reader.result || ""));
      setItems((prev) => [...prev, imageItem]);
      setSelectedId(imageItem.id);
      setImageError("");
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    addImageFromFile(file);
    event.target.value = "";
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };

  const updateItem = useCallback((id, patch) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? clampToBoard({ ...item, ...patch }) : item))
    );
  }, [clampToBoard]);

  const startDrag = (event, item) => {
    event.preventDefault();
    setSelectedId(item.id);

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    dragRef.current = {
      id: item.id,
      offsetX: event.clientX - boardRect.left - item.x,
      offsetY: event.clientY - boardRect.top - item.y,
    };
  };

  const startResize = (event, item) => {
    event.preventDefault();
    event.stopPropagation();

    resizeRef.current = {
      id: item.id,
      startX: event.clientX,
      startY: event.clientY,
      startW: item.w,
      startH: item.h,
    };
  };

  useEffect(() => {
    const onMove = (event) => {
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      if (dragRef.current) {
        const { id, offsetX, offsetY } = dragRef.current;
        updateItem(id, {
          x: event.clientX - boardRect.left - offsetX,
          y: event.clientY - boardRect.top - offsetY,
        });
      }

      if (resizeRef.current) {
        const { id, startX, startY, startW, startH } = resizeRef.current;
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        updateItem(id, {
          w: Math.max(60, startW + deltaX),
          h: Math.max(50, startH + deltaY),
        });
      }
    };

    const onUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [updateItem]);

  useEffect(() => {
    const onPaste = (event) => {
      const files = Array.from(event.clipboardData?.files || []);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        addImageFromFile(imageFile);
      }
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const handleClearBoard = () => {
    setItems([]);
    setSelectedId(null);
  };

  const handlePrint = async () => {
    const imageElements = boardRef.current
      ? Array.from(boardRef.current.querySelectorAll("img"))
      : [];

    if (imageElements.length > 0) {
      await Promise.all(
        imageElements.map((img) => {
          if (img.complete) return Promise.resolve();

          return new Promise((resolve) => {
            const finish = () => resolve();
            img.addEventListener("load", finish, { once: true });
            img.addEventListener("error", finish, { once: true });
          });
        })
      );
    }

    window.print();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.16),transparent_35%),linear-gradient(to_bottom,#f0f9ff,#ecfeff)] px-4 py-8 text-slate-900 print:bg-white print:p-0">
      <div className="mx-auto grid w-full max-w-[1500px] items-start gap-6 xl:grid-cols-[380px_1fr] print:block print:max-w-none">
        <aside className="rounded-[28px] border border-cyan-200/70 bg-white/90 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-lg xl:sticky xl:top-6 print:hidden">
          <div className="mb-2 flex items-center gap-3 text-2xl font-extrabold text-slate-900">
            <Sparkles size={24} className="text-cyan-700" />
            <span className="bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-700 bg-clip-text text-transparent">
              Board Criativo
            </span>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-slate-500">
            A4 retrato para montar atividades: cole imagem com Ctrl+V, suba arquivos e organize livremente.
          </p>

          <HeaderConfigPanel
            header={header}
            onHeaderChange={handleHeaderChange}
            months={MONTHS}
            title="Informacoes da folha"
            collapsible
            icon={School}
          />

          <div className="mb-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
            <div className="mb-3 text-sm font-bold text-slate-800">Ferramentas do board</div>
            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={handleAddText} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-3 py-2 text-xs font-bold text-white hover:bg-cyan-700">
                <Type size={14} />
                Inserir texto
              </button>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700">
                <ImagePlus size={14} />
                Carregar imagem
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
              </label>

              <button type="button" onClick={handleDeleteSelected} className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-bold text-sky-900 hover:bg-sky-100">
                <Trash2 size={14} />
                Remover item
              </button>

              <button type="button" onClick={handleClearBoard} className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-bold text-sky-900 hover:bg-sky-100">
                Limpar board
              </button>

              <button type="button" onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 px-3 py-2 text-xs font-bold text-white hover:from-cyan-700 hover:to-blue-800">
                <Printer size={14} />
                Imprimir
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600">Dica: clique no board e use Ctrl+V para colar imagem da internet.</p>
            {imageError ? <p className="mt-1 text-xs font-semibold text-rose-600">{imageError}</p> : null}
          </div>

          {selectedItem?.type === "text" ? (
            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
              <div className="mb-2 text-sm font-bold text-slate-800">Editar texto selecionado</div>
              <textarea
                className={`${fieldClassName} min-h-[90px] resize-y`}
                value={selectedItem.content}
                onChange={(e) => updateItem(selectedItem.id, { content: e.target.value })}
              />

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Fonte</label>
                  <select
                    className={fieldClassName}
                    value={textStylePreset.fontFamily}
                    onChange={(e) => updateItem(selectedItem.id, { fontFamily: e.target.value })}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Cor do texto</label>
                  <input
                    type="color"
                    className="h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                    value={textStylePreset.color}
                    onChange={(e) => updateItem(selectedItem.id, { color: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateItem(selectedItem.id, {
                      fontWeight: textStylePreset.fontWeight === "700" ? "400" : "700",
                    })
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-semibold ${
                    textStylePreset.fontWeight === "700"
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <Bold size={13} />
                  Bold
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateItem(selectedItem.id, {
                      fontStyle: textStylePreset.fontStyle === "italic" ? "normal" : "italic",
                    })
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-semibold ${
                    textStylePreset.fontStyle === "italic"
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <Italic size={13} />
                  Italic
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateItem(selectedItem.id, {
                      textDecoration: textStylePreset.textDecoration === "underline" ? "none" : "underline",
                    })
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-semibold ${
                    textStylePreset.textDecoration === "underline"
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <Underline size={13} />
                  Underline
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateItem(selectedItem.id, { textAlign: "left" })}
                  className={`rounded-lg border px-2 py-1.5 ${
                    textStylePreset.textAlign === "left"
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <AlignLeft size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => updateItem(selectedItem.id, { textAlign: "center" })}
                  className={`rounded-lg border px-2 py-1.5 ${
                    textStylePreset.textAlign === "center"
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <AlignCenter size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => updateItem(selectedItem.id, { textAlign: "right" })}
                  className={`rounded-lg border px-2 py-1.5 ${
                    textStylePreset.textAlign === "right"
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <AlignRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => updateItem(selectedItem.id, { textAlign: "justify" })}
                  className={`rounded-lg border px-2 py-1.5 ${
                    textStylePreset.textAlign === "justify"
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <AlignJustify size={13} />
                </button>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700">Tamanho</label>
                <input
                  type="range"
                  min={12}
                  max={48}
                  value={selectedItem.fontSize}
                  onChange={(e) => updateItem(selectedItem.id, { fontSize: Number(e.target.value) })}
                />
                <span className="text-xs font-bold text-slate-700">{selectedItem.fontSize}px</span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700">Espaco linha</label>
                <input
                  type="range"
                  min={1}
                  max={2.2}
                  step={0.05}
                  value={textStylePreset.lineHeight}
                  onChange={(e) => updateItem(selectedItem.id, { lineHeight: Number(e.target.value) })}
                />
                <span className="text-xs font-bold text-slate-700">{textStylePreset.lineHeight.toFixed(2)}</span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700">Indentacao</label>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={textStylePreset.textIndent}
                  onChange={(e) => updateItem(selectedItem.id, { textIndent: Number(e.target.value) })}
                />
                <span className="text-xs font-bold text-slate-700">{textStylePreset.textIndent}px</span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700">Espaco letras</label>
                <input
                  type="range"
                  min={-1}
                  max={6}
                  step={0.2}
                  value={textStylePreset.letterSpacing}
                  onChange={(e) => updateItem(selectedItem.id, { letterSpacing: Number(e.target.value) })}
                />
                <span className="text-xs font-bold text-slate-700">{textStylePreset.letterSpacing.toFixed(1)}px</span>
              </div>
            </div>
          ) : null}
        </aside>

        <main className="overflow-auto pb-5 print:overflow-visible print:pb-0">
          <div className="flex justify-start xl:justify-center print:block">
            <section className="w-[210mm] min-h-[297mm] rounded-[20px] bg-white p-[8mm] shadow-2xl shadow-sky-900/15 print:h-[281mm] print:w-full print:min-h-0 print:overflow-hidden print:rounded-none print:p-0 print:shadow-none">
              <SheetHeader header={header} monthLabel={MONTHS[header.month - 1]} year={header.year} />

              <div
                ref={boardRef}
                className="relative min-h-[215mm] rounded-xl border-2 border-dashed border-cyan-300 bg-gradient-to-b from-cyan-50/30 to-white print:h-[170mm] print:min-h-0 print:overflow-hidden print:rounded-none print:border-0 print:bg-white"
                onMouseDown={() => setSelectedId(null)}
              >
                {items.map((item) => {
                  const isSelected = item.id === selectedId;

                  return (
                    <div
                      key={item.id}
                      className={`absolute cursor-move select-none overflow-hidden rounded-lg border ${isSelected ? "border-cyan-600 shadow-lg" : "border-cyan-200"} bg-white/80 print:rounded-none print:border-0 print:bg-transparent print:shadow-none`}
                      style={{ left: item.x, top: item.y, width: item.w, height: item.h }}
                      onMouseDown={(event) => startDrag(event, item)}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedId(item.id);
                      }}
                    >
                      {item.type === "image" ? (
                        <img src={item.src} alt="item" className="h-full w-full object-cover" draggable={false} />
                      ) : (
                        <div
                          className="h-full w-full whitespace-pre-wrap p-2"
                          style={{
                            fontSize: item.fontSize,
                            color: item.color || "#0f172a",
                            fontWeight: item.fontWeight || "400",
                            fontStyle: item.fontStyle || "normal",
                            textDecoration: item.textDecoration || "none",
                            textAlign: item.textAlign || "left",
                            fontFamily: item.fontFamily || "Arial",
                            lineHeight: item.lineHeight || 1.35,
                            letterSpacing: `${item.letterSpacing || 0}px`,
                            textIndent: `${item.textIndent || 0}px`,
                          }}
                        >
                          {item.content}
                        </div>
                      )}

                      {isSelected ? (
                        <button
                          type="button"
                          className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 print:hidden"
                          onMouseDown={(event) => event.stopPropagation()}
                          onClick={(event) => {
                            event.stopPropagation();
                            setItems((prev) => prev.filter((boardItem) => boardItem.id !== item.id));
                            setSelectedId(null);
                          }}
                          aria-label="Excluir item"
                          title="Excluir item"
                        >
                          <Trash2 size={13} />
                        </button>
                      ) : null}

                      <button
                        type="button"
                        className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize rounded-tl bg-cyan-600 print:hidden"
                        onMouseDown={(event) => startResize(event, item)}
                        aria-label="Redimensionar"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreativeBoardPage;
