/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  Type,
  Trash2,
  Printer,
  Eraser,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LayoutTemplate,
  School,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Minus,
  FunctionSquare,
} from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";
import SheetHeader from "./SheetHeader";
import HeaderConfigPanel from "./HeaderConfigPanel";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
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

const FONT_FAMILIES = [
  "Arial",
  "Verdana",
  "Georgia",
  "Times New Roman",
  "Trebuchet MS",
  "Comic Sans MS",
];

const SHAPE_STYLES = {
  rectangle: { borderRadius: "4px" },
  circle: { borderRadius: "50%" },
  triangle: {
    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
    borderRadius: "0",
  },
  star: {
    clipPath:
      "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
    borderRadius: "0",
  },
  heart: {
    clipPath: "polygon(25% 0%,75% 0%,100% 25%,100% 50%,50% 100%,0% 50%,0% 25%)",
    borderRadius: "0",
  },
  diamond: {
    clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
    borderRadius: "0",
  },
  line: { borderRadius: "4px" },
};

const SHAPE_PRESETS = [
  { key: "rectangle", label: "Quadrado", Icon: Square },
  { key: "circle", label: "Círculo", Icon: Circle },
  { key: "triangle", label: "Triângulo", Icon: Triangle },
  { key: "star", label: "Estrela", Icon: Star },
  { key: "heart", label: "Coração", Icon: Heart },
  { key: "diamond", label: "Losango", Icon: Square },
  { key: "line", label: "Linha", Icon: Minus },
];

const BORDER_PRESETS = [
  { key: "none", label: "Sem borda" },
  { key: "simple", label: "Simples" },
  { key: "double", label: "Dupla" },
  { key: "dashed", label: "Tracejada" },
  { key: "dotted", label: "Pontilhada" },
];

const BACKGROUND_PRESETS = [
  { key: "white", label: "Branco", style: { background: "#ffffff" } },
  {
    key: "lined",
    label: "Pautado",
    style: {
      backgroundImage:
        "repeating-linear-gradient(transparent, transparent 27px, #cbd5e1 27px, #cbd5e1 28px)",
      backgroundSize: "100% 28px",
    },
  },
  {
    key: "grid",
    label: "Quadriculado",
    style: {
      backgroundImage:
        "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
      backgroundSize: "20px 20px",
    },
  },
  {
    key: "dots",
    label: "Pontilhado",
    style: {
      backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
      backgroundSize: "20px 20px",
    },
  },
  {
    key: "pastel",
    label: "Pastel",
    style: {
      background:
        "linear-gradient(135deg, #fdf4ff 0%, #eff6ff 50%, #f0fdf4 100%)",
    },
  },
  { key: "yellow", label: "Amarelo", style: { background: "#fefce8" } },
];

const MATH_TEMPLATES = [
  {
    category: "Básico",
    items: [
      { label: "Fração", code: "\\frac{a}{b}" },
      { label: "Raiz", code: "\\sqrt{x}" },
      { label: "Potência", code: "x^{n}" },
      { label: "Índice", code: "x_{i}" },
      { label: "Raiz n", code: "\\sqrt[n]{x}" },
      { label: "Valor abs.", code: "|x|" },
    ],
  },
  {
    category: "Álgebra",
    items: [
      { label: "Bhaskara", code: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
      {
        label: "Sistema",
        code: "\\begin{cases} x + y = 1 \\\\ x - y = 0 \\end{cases}",
      },
      { label: "Módulo", code: "\\left| \\frac{a}{b} \\right|" },
      { label: "Binômio", code: "(a + b)^2 = a^2 + 2ab + b^2" },
    ],
  },
  {
    category: "Cálculo",
    items: [
      { label: "Limite", code: "\\lim_{x \\to \\infty} f(x)" },
      { label: "Derivada", code: "\\frac{d}{dx} f(x)" },
      { label: "Integral", code: "\\int_{a}^{b} f(x)\\,dx" },
      { label: "Somatório", code: "\\sum_{i=1}^{n} i" },
      { label: "Produtório", code: "\\prod_{i=1}^{n} i" },
    ],
  },
  {
    category: "Trigonometria",
    items: [
      { label: "Seno", code: "\\sin(\\theta)" },
      { label: "Cosseno", code: "\\cos(\\theta)" },
      { label: "Tangente", code: "\\tan(\\theta)" },
      { label: "Pitágoras", code: "a^2 + b^2 = c^2" },
      { label: "Lei cossenos", code: "c^2 = a^2 + b^2 - 2ab\\cos(C)" },
    ],
  },
  {
    category: "Símbolos",
    items: [
      { label: "Pi", code: "\\pi" },
      { label: "Infinito", code: "\\infty" },
      { label: "Pertence", code: "\\in" },
      { label: "Não pertence", code: "\\notin" },
      { label: "Subconjunto", code: "\\subset" },
      { label: "União", code: "A \\cup B" },
      { label: "Interseção", code: "A \\cap B" },
      { label: "Portanto", code: "\\therefore" },
    ],
  },
];

const createTextItem = () => ({
  id: crypto.randomUUID(),
  type: "text",
  x: 40,
  y: 40,
  w: 200,
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

const createShapeItem = (shape) => ({
  id: crypto.randomUUID(),
  type: "shape",
  shape,
  x: 60,
  y: 60,
  w: 80,
  h: shape === "line" ? 6 : 80,
  fillColor: "#e2e8f0",
  strokeColor: "#64748b",
  strokeWidth: 2,
  opacity: 1,
});

const createMathItem = () => ({
  id: crypto.randomUUID(),
  type: "math",
  x: 60,
  y: 60,
  w: 260,
  h: 90,
  latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  fontSize: 22,
  color: "#0f172a",
  displayMode: true,
});

const fieldCls =
  "w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-400";

const ToggleButton = ({ active, onClick, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "border-slate-700 bg-slate-900 text-white"
        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
    }`}
  >
    {children}
  </button>
);

const SliderRow = ({ label, min, max, step = 1, value, onChange, display }) => (
  <div className="flex items-center gap-2">
    <label className="w-24 shrink-0 text-xs font-medium text-slate-600">
      {label}
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="flex-1"
    />
    <span className="w-10 text-right text-xs font-bold text-slate-700">
      {display}
    </span>
  </div>
);

const SectionBox = ({ title, children }) => (
  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3">
    <p className="text-xs font-semibold text-slate-700">{title}</p>
    {children}
  </div>
);

const MathRenderer = ({ item }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      katex.render(item.latex || "\\text{Fórmula vazia}", ref.current, {
        throwOnError: false,
        displayMode: item.displayMode ?? true,
        output: "html",
      });
    } catch {
      ref.current.textContent = "Erro no LaTeX";
    }
  }, [item.latex, item.displayMode]);

  return (
    <div
      ref={ref}
      className="h-full w-full flex items-center justify-center overflow-hidden px-2"
      style={{ fontSize: item.fontSize, color: item.color }}
    />
  );
};

const ShapeRenderer = ({ item }) => (
  <div
    className="h-full w-full"
    style={{
      ...SHAPE_STYLES[item.shape],
      backgroundColor: item.fillColor,
      border:
        item.strokeWidth > 0
          ? `${item.strokeWidth}px solid ${item.strokeColor}`
          : "none",
      opacity: item.opacity,
      boxSizing: "border-box",
    }}
  />
);

const getBorderStyle = (preset, color, width) => {
  if (preset === "none") return {};
  const styleMap = {
    simple: "solid",
    double: "double",
    dashed: "dashed",
    dotted: "dotted",
  };
  return { border: `${width}px ${styleMap[preset] ?? "solid"} ${color}` };
};

function CreativeBoardPage() {
  const [header, setHeader] = useState(INITIAL_HEADER);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [imageError, setImageError] = useState("");
  const [boardBg, setBoardBg] = useState("white");
  const [borderPreset, setBorderPreset] = useState("none");
  const [borderColor, setBorderColor] = useState("#64748b");
  const [borderWidth, setBorderWidth] = useState(8);
  const [mathTab, setMathTab] = useState(MATH_TEMPLATES[0].category);

  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId],
  );

  const handleHeaderChange = useCallback((key, value) => {
    setHeader((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clampToBoard = useCallback((next) => {
    if (!boardRef.current) return next;
    const maxX = boardRef.current.clientWidth - next.w;
    const maxY = boardRef.current.clientHeight - next.h;
    return {
      ...next,
      x: Math.max(0, Math.min(next.x, maxX)),
      y: Math.max(0, Math.min(next.y, maxY)),
    };
  }, []);

  const updateItem = useCallback(
    (id, patch) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? clampToBoard({ ...item, ...patch }) : item,
        ),
      );
    },
    [clampToBoard],
  );

  const addImageFromFile = useCallback((file) => {
    if (!file.type.startsWith("image/")) {
      setImageError("Escolha um arquivo de imagem válido.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = createImageItem(String(reader.result ?? ""));
      setItems((prev) => [...prev, img]);
      setSelectedId(img.id);
      setImageError("");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAddText = () => {
    const item = createTextItem();
    setItems((prev) => [...prev, item]);
    setSelectedId(item.id);
  };

  const handleAddShape = (shape) => {
    const item = createShapeItem(shape);
    setItems((prev) => [...prev, item]);
    setSelectedId(item.id);
  };

  const handleAddMath = () => {
    const item = createMathItem();
    setItems((prev) => [...prev, item]);
    setSelectedId(item.id);
  };

  const handleUploadImage = (e) => {
    const file = e.target.files?.[0];
    if (file) addImageFromFile(file);
    e.target.value = "";
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  };

  const handleClear = () => {
    setItems([]);
    setSelectedId(null);
    setHeader(INITIAL_HEADER);
    setBoardBg("white");
    setBorderPreset("none");
  };

  const handlePrint = async () => {
    const imgs = boardRef.current
      ? Array.from(boardRef.current.querySelectorAll("img"))
      : [];
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.addEventListener("load", res, { once: true });
              img.addEventListener("error", res, { once: true });
            }),
      ),
    );
    window.print();
  };

  const startDrag = (e, item) => {
    if (editingId === item.id) return;
    e.preventDefault();
    setSelectedId(item.id);
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      id: item.id,
      offsetX: e.clientX - rect.left - item.x,
      offsetY: e.clientY - rect.top - item.y,
    };
  };

  const startResize = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = {
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      startW: item.w,
      startH: item.h,
    };
  };

  useEffect(() => {
    const onMove = (e) => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (dragRef.current) {
        const { id, offsetX, offsetY } = dragRef.current;
        updateItem(id, {
          x: e.clientX - rect.left - offsetX,
          y: e.clientY - rect.top - offsetY,
        });
      }
      if (resizeRef.current) {
        const { id, startX, startY, startW, startH } = resizeRef.current;
        updateItem(id, {
          w: Math.max(60, startW + e.clientX - startX),
          h: Math.max(6, startH + e.clientY - startY),
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
    const onPaste = (e) => {
      const file = Array.from(e.clipboardData?.files ?? []).find((f) =>
        f.type.startsWith("image/"),
      );
      if (file) addImageFromFile(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addImageFromFile]);

  const sel = selectedItem?.type === "text" ? selectedItem : null;
  const selShape = selectedItem?.type === "shape" ? selectedItem : null;
  const selMath = selectedItem?.type === "math" ? selectedItem : null;

  const activeBg =
    BACKGROUND_PRESETS.find((b) => b.key === boardBg) ?? BACKGROUND_PRESETS[0];
  const borderStyle = getBorderStyle(borderPreset, borderColor, borderWidth);
  const sheetPadding = borderPreset !== "none" ? `${borderWidth + 8}px` : "8mm";

  const activeMathCategory = MATH_TEMPLATES.find((g) => g.category === mathTab);

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-4 sm:px-4 sm:py-6 print:bg-white print:p-0">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; }
          .print-sheet {
            position: fixed !important; top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            padding: 8mm !important; box-sizing: border-box !important;
          }
        }
      `}</style>

      <div className="mx-auto grid max-w-7xl gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[340px_1fr] print:block">
        <aside className="rounded-xl border bg-white p-4 sm:p-5 print:hidden lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="mb-4 flex items-center gap-2 text-lg font-bold">
            <LayoutTemplate size={20} /> Board Criativo
          </div>

          <HeaderConfigPanel
            header={header}
            onHeaderChange={handleHeaderChange}
            months={MONTHS}
            title="Informações da folha"
            collapsible
            icon={School}
          />

          <SectionBox title="Ferramentas">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddText}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 active:scale-95 transition-all"
              >
                <Type size={13} /> Texto
              </button>

              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600 active:scale-95 transition-all">
                <ImagePlus size={13} /> Imagem
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImage}
                />
              </label>

              <button
                type="button"
                onClick={handleAddMath}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 active:scale-95 transition-all"
              >
                <FunctionSquare size={13} /> Fórmula
              </button>

              <button
                type="button"
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
              >
                <Trash2 size={13} /> Remover
              </button>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-600">
                Formas
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {SHAPE_PRESETS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    title={label}
                    onClick={() => handleAddShape(key)}
                    className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                  >
                    <Icon size={16} />
                    <span className="text-[10px] leading-none">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Dica: use Ctrl+V para colar imagem.
            </p>
            {imageError && (
              <p className="text-xs font-semibold text-red-600">{imageError}</p>
            )}
          </SectionBox>

          <SectionBox title="Aparência da folha">
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-600">Fundo</p>
              <div className="grid grid-cols-3 gap-1.5">
                {BACKGROUND_PRESETS.map((bg) => (
                  <button
                    key={bg.key}
                    type="button"
                    onClick={() => setBoardBg(bg.key)}
                    className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                      boardBg === bg.key
                        ? "border-slate-700 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-600">
                Margem decorativa
              </p>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {BORDER_PRESETS.map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => setBorderPreset(b.key)}
                    className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                      borderPreset === b.key
                        ? "border-slate-700 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              {borderPreset !== "none" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="w-24 shrink-0 text-xs font-medium text-slate-600">
                      Cor
                    </label>
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="h-8 w-full cursor-pointer rounded-md border border-slate-300 bg-white p-0.5"
                    />
                  </div>
                  <SliderRow
                    label="Espessura"
                    min={2}
                    max={24}
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(Number(e.target.value))}
                    display={`${borderWidth}px`}
                  />
                </div>
              )}
            </div>
          </SectionBox>

          {sel && (
            <SectionBox title="Editar texto">
              <p className="text-xs text-slate-500 italic">
                💡 Clique duplo no texto para editar diretamente na folha.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    Fonte
                  </label>
                  <select
                    className={fieldCls}
                    value={sel.fontFamily}
                    onChange={(e) =>
                      updateItem(sel.id, { fontFamily: e.target.value })
                    }
                  >
                    {FONT_FAMILIES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    Cor
                  </label>
                  <input
                    type="color"
                    className="h-9 w-full cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                    value={sel.color}
                    onChange={(e) =>
                      updateItem(sel.id, { color: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <ToggleButton
                  active={sel.fontWeight === "700"}
                  title="Bold"
                  onClick={() =>
                    updateItem(sel.id, {
                      fontWeight: sel.fontWeight === "700" ? "400" : "700",
                    })
                  }
                >
                  <Bold size={13} />
                </ToggleButton>
                <ToggleButton
                  active={sel.fontStyle === "italic"}
                  title="Italic"
                  onClick={() =>
                    updateItem(sel.id, {
                      fontStyle:
                        sel.fontStyle === "italic" ? "normal" : "italic",
                    })
                  }
                >
                  <Italic size={13} />
                </ToggleButton>
                <ToggleButton
                  active={sel.textDecoration === "underline"}
                  title="Underline"
                  onClick={() =>
                    updateItem(sel.id, {
                      textDecoration:
                        sel.textDecoration === "underline"
                          ? "none"
                          : "underline",
                    })
                  }
                >
                  <Underline size={13} />
                </ToggleButton>
                <div className="ml-1 flex gap-1">
                  {[
                    { align: "left", Icon: AlignLeft },
                    { align: "center", Icon: AlignCenter },
                    { align: "right", Icon: AlignRight },
                    { align: "justify", Icon: AlignJustify },
                  ].map(({ align, Icon }) => (
                    <ToggleButton
                      key={align}
                      active={sel.textAlign === align}
                      onClick={() => updateItem(sel.id, { textAlign: align })}
                    >
                      <Icon size={13} />
                    </ToggleButton>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <SliderRow
                  label="Tamanho"
                  min={12}
                  max={72}
                  value={sel.fontSize}
                  onChange={(e) =>
                    updateItem(sel.id, { fontSize: Number(e.target.value) })
                  }
                  display={`${sel.fontSize}px`}
                />
                <SliderRow
                  label="Linha"
                  min={1}
                  max={2.2}
                  step={0.05}
                  value={sel.lineHeight}
                  onChange={(e) =>
                    updateItem(sel.id, { lineHeight: Number(e.target.value) })
                  }
                  display={sel.lineHeight.toFixed(2)}
                />
                <SliderRow
                  label="Indentação"
                  min={0}
                  max={60}
                  value={sel.textIndent}
                  onChange={(e) =>
                    updateItem(sel.id, { textIndent: Number(e.target.value) })
                  }
                  display={`${sel.textIndent}px`}
                />
                <SliderRow
                  label="Espaç. letras"
                  min={-1}
                  max={6}
                  step={0.2}
                  value={sel.letterSpacing}
                  onChange={(e) =>
                    updateItem(sel.id, {
                      letterSpacing: Number(e.target.value),
                    })
                  }
                  display={`${sel.letterSpacing.toFixed(1)}px`}
                />
              </div>
            </SectionBox>
          )}

          {selShape && (
            <SectionBox title="Editar forma">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    Preenchimento
                  </label>
                  <input
                    type="color"
                    className="h-9 w-full cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                    value={selShape.fillColor}
                    onChange={(e) =>
                      updateItem(selShape.id, { fillColor: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    Contorno
                  </label>
                  <input
                    type="color"
                    className="h-9 w-full cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                    value={selShape.strokeColor}
                    onChange={(e) =>
                      updateItem(selShape.id, { strokeColor: e.target.value })
                    }
                  />
                </div>
              </div>
              <SliderRow
                label="Espessura"
                min={0}
                max={12}
                value={selShape.strokeWidth}
                onChange={(e) =>
                  updateItem(selShape.id, {
                    strokeWidth: Number(e.target.value),
                  })
                }
                display={`${selShape.strokeWidth}px`}
              />
              <SliderRow
                label="Opacidade"
                min={0.1}
                max={1}
                step={0.05}
                value={selShape.opacity}
                onChange={(e) =>
                  updateItem(selShape.id, { opacity: Number(e.target.value) })
                }
                display={`${Math.round(selShape.opacity * 100)}%`}
              />
            </SectionBox>
          )}

          {selMath && (
            <SectionBox title="✦ Fórmula Matemática">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Código LaTeX
                </label>
                <textarea
                  className={`${fieldCls} min-h-[72px] resize-y font-mono text-xs`}
                  value={selMath.latex}
                  onChange={(e) =>
                    updateItem(selMath.id, { latex: e.target.value })
                  }
                  placeholder="\frac{a}{b}"
                  spellCheck={false}
                />
              </div>

              <div className="flex items-center gap-2">
                <ToggleButton
                  active={selMath.displayMode}
                  onClick={() =>
                    updateItem(selMath.id, {
                      displayMode: !selMath.displayMode,
                    })
                  }
                  title="Modo display (centralizado, maior)"
                >
                  Display
                </ToggleButton>
                <span className="text-xs text-slate-500">
                  {selMath.displayMode
                    ? "Centralizado (ideal para provas)"
                    : "Inline (dentro de texto)"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    Cor
                  </label>
                  <input
                    type="color"
                    className="h-9 w-full cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                    value={selMath.color}
                    onChange={(e) =>
                      updateItem(selMath.id, { color: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    Tamanho
                  </label>
                  <input
                    type="number"
                    min={12}
                    max={80}
                    className={fieldCls}
                    value={selMath.fontSize}
                    onChange={(e) =>
                      updateItem(selMath.id, {
                        fontSize: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium text-slate-600">
                  Inserir template
                </p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {MATH_TEMPLATES.map((g) => (
                    <button
                      key={g.category}
                      type="button"
                      onClick={() => setMathTab(g.category)}
                      className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-colors ${
                        mathTab === g.category
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {g.category}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1">
                  {activeMathCategory?.items.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => updateItem(selMath.id, { latex: t.code })}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-left text-[11px] font-medium text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-[10px] text-slate-400">
                  Clique para substituir • edite o LaTeX manualmente para
                  personalizar
                </p>
              </div>
            </SectionBox>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-700 active:scale-95 transition-all text-sm font-medium shadow-sm"
            >
              <Printer size={15} /> Imprimir
            </button>
            <button
              onClick={handleClear}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-300 text-slate-600 py-2 px-3 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all text-sm font-medium"
            >
              <Eraser size={15} /> Limpar
            </button>
          </div>
        </aside>

        <main className="flex justify-center print:block overflow-x-auto">
          <section
            className="print-sheet w-[210mm] min-h-[297mm] bg-white shadow-md print:w-full print:min-h-0 print:shadow-none"
            style={{ padding: sheetPadding, ...borderStyle }}
          >
            <SheetHeader
              header={header}
              monthLabel={MONTHS[header.month - 1]}
              year={header.year}
            />

            <div
              ref={boardRef}
              className="relative min-h-[215mm] print:min-h-0 print:h-[230mm] print:rounded-none print:border-0"
              style={{
                ...activeBg.style,
                borderRadius: borderPreset === "none" ? "8px" : "0",
                border: borderPreset === "none" ? "2px dashed #e2e8f0" : "none",
              }}
              onMouseDown={() => { setSelectedId(null); setEditingId(null); }}
            >
              {items.map((item) => {
                const isSelected = item.id === selectedId;
                const isShape = item.type === "shape";
                const isMath = item.type === "math";

                return (
                  <div
                    key={item.id}
                    className={`absolute select-none print:rounded-none print:border-0 print:bg-transparent print:shadow-none ${
                      editingId === item.id ? "cursor-text" : "cursor-move"
                    } ${
                      !isShape && !isMath
                        ? "overflow-hidden rounded border bg-white"
                        : ""
                    } ${
                      !isShape && !isMath && isSelected
                        ? "border-slate-700 shadow-md"
                        : ""
                    } ${
                      !isShape && !isMath && !isSelected
                        ? "border-slate-300"
                        : ""
                    }`}
                    style={{
                      left: item.x,
                      top: item.y,
                      width: item.w,
                      height: item.h,
                      ...(isSelected && (isShape || isMath)
                        ? { outline: "2px solid #6366f1", outlineOffset: "2px" }
                        : {}),
                    }}
                    onMouseDown={(e) => startDrag(e, item)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(item.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (item.type === "text") {
                        setSelectedId(item.id);
                        setEditingId(item.id);
                      }
                    }}
                  >
                    {item.type === "image" && (
                      <img
                        src={item.src}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    )}
                    {item.type === "text" && (() => {
                      const textStyle = {
                        fontSize: item.fontSize,
                        color: item.color,
                        fontWeight: item.fontWeight,
                        fontStyle: item.fontStyle,
                        textDecoration: item.textDecoration,
                        textAlign: item.textAlign,
                        fontFamily: item.fontFamily,
                        lineHeight: item.lineHeight,
                        letterSpacing: `${item.letterSpacing}px`,
                        textIndent: `${item.textIndent}px`,
                      };
                      return editingId === item.id ? (
                        <textarea
                          autoFocus
                          className="h-full w-full resize-none bg-transparent p-2 outline-none border-0 cursor-text print:hidden"
                          style={textStyle}
                          value={item.content}
                          onChange={(e) =>
                            updateItem(item.id, { content: e.target.value })
                          }
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setEditingId(null);
                            e.stopPropagation();
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div
                          className="h-full w-full whitespace-pre-wrap p-2"
                          style={textStyle}
                        >
                          {item.content}
                        </div>
                      );
                    })()}
                    {item.type === "shape" && <ShapeRenderer item={item} />}
                    {item.type === "math" && <MathRenderer item={item} />}

                    {isSelected && (
                      <button
                        type="button"
                        className="absolute right-1 top-1 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 print:hidden"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setItems((prev) =>
                            prev.filter((b) => b.id !== item.id),
                          );
                          setSelectedId(null);
                        }}
                        aria-label="Excluir"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}

                    <button
                      type="button"
                      className="absolute bottom-0 right-0 h-3.5 w-3.5 cursor-se-resize rounded-tl bg-slate-600 print:hidden"
                      onMouseDown={(e) => startResize(e, item)}
                      aria-label="Redimensionar"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default CreativeBoardPage;
