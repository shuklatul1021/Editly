"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { degrees, PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  Download,
  FileImage,
  FileUp,
  LoaderCircle,
  MousePointer2,
  RefreshCcw,
  RotateCw,
  Scissors,
  Stamp,
  Trash2,
  Type,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ActivityEntry = {
  id: string;
  action: string;
  time: string;
};

type MutationResult = {
  nextPage?: number;
  action?: string;
};

type OverlayCoords = {
  x: number;
  y: number;
};

type OverlayBox = {
  width: number;
  height: number;
};

type DragTarget = "text" | "image";

type DragState = {
  target: DragTarget;
  offsetX: number;
  offsetY: number;
  boxWidth: number;
  boxHeight: number;
};

const DEFAULT_TEXT_POSITION: OverlayCoords = { x: 0.62, y: 0.08 };
const DEFAULT_IMAGE_POSITION: OverlayCoords = { x: 0.6, y: 0.24 };
const PREVIEW_TARGET_WIDTH = 1040;
const PREVIEW_TARGET_HEIGHT = 1380;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function toRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const safeHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((value) => value + value)
          .join("")
      : normalized;

  const red = Number.parseInt(safeHex.slice(0, 2), 16) / 255;
  const green = Number.parseInt(safeHex.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(safeHex.slice(4, 6), 16) / 255;

  return rgb(red, green, blue);
}

function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function toArrayBuffer(bytes: Uint8Array) {
  const normalized = new Uint8Array(bytes.byteLength);
  normalized.set(bytes);
  return normalized.buffer;
}

function createActivity(action: string): ActivityEntry {
  return {
    id: crypto.randomUUID(),
    action,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function getDownloadName(fileName: string) {
  return fileName.toLowerCase().endsWith(".pdf")
    ? `${fileName.slice(0, -4)}-edited.pdf`
    : `${fileName}-edited.pdf`;
}

function getOverlayPixelPosition(
  coords: OverlayCoords,
  box: OverlayBox,
  surface: OverlayBox,
) {
  return {
    left: coords.x * Math.max(surface.width - box.width, 0),
    top: coords.y * Math.max(surface.height - box.height, 0),
  };
}

function toPdfCoordinates(
  coords: OverlayCoords,
  box: OverlayBox,
  pageWidth: number,
  pageHeight: number,
) {
  const x = coords.x * Math.max(pageWidth - box.width, 0);
  const top = coords.y * Math.max(pageHeight - box.height, 0);
  const y = pageHeight - top - box.height;

  return { x, y };
}

export function PdfEditorWorkspace() {
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewSurfaceRef = useRef<HTMLDivElement | null>(null);
  const textOverlayRef = useRef<HTMLDivElement | null>(null);
  const imageOverlayRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const imagePreviewUrlRef = useRef<string | null>(null);

  const [pdfName, setPdfName] = useState("No file loaded");
  const [pdfSize, setPdfSize] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [originalPageCount, setOriginalPageCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [targetAllPages, setTargetAllPages] = useState(true);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(
    null,
  );
  const [editedPdfBytes, setEditedPdfBytes] = useState<Uint8Array | null>(null);
  const [overlayText, setOverlayText] = useState("Approved");
  const [fontSize, setFontSize] = useState(30);
  const [textColor, setTextColor] = useState("#141414");
  const [imageBytes, setImageBytes] = useState<Uint8Array | null>(null);
  const [imageMimeType, setImageMimeType] = useState<
    "image/png" | "image/jpeg" | null
  >(null);
  const [imageName, setImageName] = useState("No image selected");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageScalePercent, setImageScalePercent] = useState(24);
  const [textPosition, setTextPosition] = useState<OverlayCoords>(
    DEFAULT_TEXT_POSITION,
  );
  const [imagePosition, setImagePosition] = useState<OverlayCoords>(
    DEFAULT_IMAGE_POSITION,
  );
  const [surfaceSize, setSurfaceSize] = useState<OverlayBox>({
    width: 0,
    height: 0,
  });
  const [textBox, setTextBox] = useState<OverlayBox>({ width: 0, height: 0 });
  const [imageBox, setImageBox] = useState<OverlayBox>({ width: 0, height: 0 });
  const [previewBusy, setPreviewBusy] = useState(false);
  const [activity, setActivity] = useState<ActivityEntry[]>([
    createActivity("Workspace ready"),
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function stopDragging() {
      dragStateRef.current = null;
    }

    function moveDragging(event: PointerEvent) {
      if (!dragStateRef.current || !previewSurfaceRef.current) {
        return;
      }

      const rect = previewSurfaceRef.current.getBoundingClientRect();
      const drag = dragStateRef.current;
      const maxX = Math.max(rect.width - drag.boxWidth, 1);
      const maxY = Math.max(rect.height - drag.boxHeight, 1);
      const x = clamp((event.clientX - rect.left - drag.offsetX) / maxX);
      const y = clamp((event.clientY - rect.top - drag.offsetY) / maxY);

      if (drag.target === "text") {
        setTextPosition({ x, y });
      } else {
        setImagePosition({ x, y });
      }
    }

    window.addEventListener("pointermove", moveDragging);
    window.addEventListener("pointerup", stopDragging);

    return () => {
      window.removeEventListener("pointermove", moveDragging);
      window.removeEventListener("pointerup", stopDragging);
    };
  }, []);

  useEffect(() => {
    if (!textOverlayRef.current) {
      return;
    }

    setTextBox({
      width: textOverlayRef.current.offsetWidth,
      height: textOverlayRef.current.offsetHeight,
    });
  }, [overlayText, fontSize, surfaceSize.width, surfaceSize.height]);

  useEffect(() => {
    if (!imageOverlayRef.current) {
      return;
    }

    setImageBox({
      width: imageOverlayRef.current.offsetWidth,
      height: imageOverlayRef.current.offsetHeight,
    });
  }, [
    imagePreviewUrl,
    imageScalePercent,
    surfaceSize.width,
    surfaceSize.height,
  ]);

  useEffect(() => {
    if (!editedPdfBytes || !canvasRef.current) {
      const canvas = canvasRef.current;

      if (canvas) {
        const context = canvas.getContext("2d");
        context?.clearRect(0, 0, canvas.width, canvas.height);
      }

      setSurfaceSize({ width: 0, height: 0 });
      return;
    }

    let cancelled = false;
    const pdfBytes = editedPdfBytes;

    async function renderPage() {
      try {
        setPreviewBusy(true);
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const workerUrl = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        if (pdfjs.GlobalWorkerOptions.workerSrc !== workerUrl) {
          pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        }

        const loadingTask = pdfjs.getDocument({
          data: toArrayBuffer(pdfBytes),
        });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(activePage);

        if (!canvasRef.current || cancelled) {
          await loadingTask.destroy();
          return;
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          1.9,
          Math.max(
            1,
            Math.min(
              PREVIEW_TARGET_WIDTH / baseViewport.width,
              PREVIEW_TARGET_HEIGHT / baseViewport.height,
            ),
          ),
        );
        const viewport = page.getViewport({ scale });
        const devicePixelRatio = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) {
          await loadingTask.destroy();
          return;
        }

        canvas.width = Math.floor(viewport.width * devicePixelRatio);
        canvas.height = Math.floor(viewport.height * devicePixelRatio);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        }).promise;

        if (!cancelled) {
          setSurfaceSize({ width: viewport.width, height: viewport.height });
        }

        await loadingTask.destroy();
      } catch (renderError) {
        console.error(renderError);
        if (!cancelled) {
          setError("Unable to render the PDF preview.");
        }
      } finally {
        if (!cancelled) {
          setPreviewBusy(false);
        }
      }
    }

    void renderPage();

    return () => {
      cancelled = true;
    };
  }, [editedPdfBytes, activePage]);

  function pushActivity(action: string) {
    setActivity((current) => [createActivity(action), ...current].slice(0, 8));
  }

  async function loadPdfFile(file: File) {
    setError(null);
    setIsBusy(true);

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const document = await PDFDocument.load(bytes);

      setPdfName(file.name);
      setPdfSize(file.size);
      setPageCount(document.getPageCount());
      setOriginalPageCount(document.getPageCount());
      setActivePage(1);
      setTargetAllPages(true);
      setOriginalPdfBytes(bytes);
      setEditedPdfBytes(bytes);
      setTextPosition(DEFAULT_TEXT_POSITION);
      setImagePosition(DEFAULT_IMAGE_POSITION);
      pushActivity(`Loaded ${file.name}`);
    } catch {
      setError("The selected file is not a valid PDF.");
    } finally {
      setIsBusy(false);
    }
  }

  async function loadImageFile(file: File) {
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Upload a PNG or JPG image.");
      return;
    }

    setError(null);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const nextPreviewUrl = URL.createObjectURL(file);

    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }

    imagePreviewUrlRef.current = nextPreviewUrl;
    setImageBytes(bytes);
    setImageMimeType(file.type as "image/png" | "image/jpeg");
    setImageName(file.name);
    setImagePreviewUrl(nextPreviewUrl);
    setImagePosition(DEFAULT_IMAGE_POSITION);
    pushActivity(`Prepared image overlay: ${file.name}`);
  }

  async function mutatePdf(
    action: string,
    mutate: (document: PDFDocument) => Promise<MutationResult | void>,
  ) {
    if (!editedPdfBytes) {
      setError("Upload a PDF before editing.");
      return;
    }

    setError(null);
    setIsBusy(true);

    try {
      const document = await PDFDocument.load(editedPdfBytes);
      const result = await mutate(document);
      const savedBytes = new Uint8Array(await document.save());
      const nextPageCount = document.getPageCount();
      const nextPage = result?.nextPage ?? activePage;

      setEditedPdfBytes(savedBytes);
      setPdfSize(savedBytes.byteLength);
      setPageCount(nextPageCount);
      setActivePage(Math.min(Math.max(nextPage, 1), nextPageCount));
      pushActivity(result?.action ?? action);
    } catch (mutationError) {
      console.error(mutationError);
      setError("Unable to apply that change to the PDF.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleAddText() {
    const trimmedText = overlayText.trim();

    if (!trimmedText) {
      setError("Enter text to place on the PDF.");
      return;
    }

    await mutatePdf("Added text overlay", async (document) => {
      const font = await document.embedFont(StandardFonts.HelveticaBold);
      const targetIndexes = targetAllPages
        ? document.getPages().map((_, index) => index)
        : [activePage - 1];

      for (const pageIndex of targetIndexes) {
        const page = document.getPage(pageIndex);
        const textWidth = font.widthOfTextAtSize(trimmedText, fontSize);
        const textHeight = font.heightAtSize(fontSize);
        const placement = toPdfCoordinates(
          textPosition,
          { width: textWidth, height: textHeight },
          page.getWidth(),
          page.getHeight(),
        );

        page.drawText(trimmedText, {
          x: placement.x,
          y: placement.y,
          size: fontSize,
          font,
          color: toRgb(textColor),
        });
      }
    });
  }

  async function handleAddImage() {
    if (!imageBytes || !imageMimeType) {
      setError("Upload a PNG or JPG before applying an image overlay.");
      return;
    }

    await mutatePdf("Added image overlay", async (document) => {
      const image =
        imageMimeType === "image/png"
          ? await document.embedPng(imageBytes)
          : await document.embedJpg(imageBytes);
      const targetIndexes = targetAllPages
        ? document.getPages().map((_, index) => index)
        : [activePage - 1];

      for (const pageIndex of targetIndexes) {
        const page = document.getPage(pageIndex);
        const width = page.getWidth() * (imageScalePercent / 100);
        const height = width * (image.height / image.width);
        const placement = toPdfCoordinates(
          imagePosition,
          { width, height },
          page.getWidth(),
          page.getHeight(),
        );

        page.drawImage(image, {
          x: placement.x,
          y: placement.y,
          width,
          height,
        });
      }
    });
  }

  async function handleRotate() {
    await mutatePdf("Rotated pages 90 degrees", async (document) => {
      const targets = targetAllPages
        ? document.getPages()
        : [document.getPage(activePage - 1)];

      for (const page of targets) {
        const nextRotation = (page.getRotation().angle + 90) % 360;
        page.setRotation(degrees(nextRotation));
      }
    });
  }

  async function handleDuplicatePage() {
    await mutatePdf("Duplicated selected page", async (document) => {
      const donorDocument = await PDFDocument.load(await document.save());
      const [copiedPage] = await document.copyPages(donorDocument, [
        activePage - 1,
      ]);
      document.insertPage(activePage, copiedPage);

      return { nextPage: activePage + 1 };
    });
  }

  async function handleDeletePage() {
    if (pageCount <= 1) {
      setError("A PDF must contain at least one page.");
      return;
    }

    await mutatePdf("Removed selected page", async (document) => {
      document.removePage(activePage - 1);

      return { nextPage: Math.min(activePage, document.getPageCount()) };
    });
  }

  function handleReset() {
    if (!originalPdfBytes) {
      return;
    }

    setEditedPdfBytes(originalPdfBytes);
    setPdfSize(originalPdfBytes.byteLength);
    setPageCount(originalPageCount);
    setActivePage(1);
    setTargetAllPages(true);
    setTextPosition(DEFAULT_TEXT_POSITION);
    setImagePosition(DEFAULT_IMAGE_POSITION);
    setError(null);
    pushActivity("Reset edits to original file");
  }

  function handleDownload() {
    if (!editedPdfBytes) {
      setError("Upload and edit a PDF before downloading.");
      return;
    }

    const url = URL.createObjectURL(
      new Blob([toArrayBuffer(editedPdfBytes)], { type: "application/pdf" }),
    );
    const link = document.createElement("a");

    link.href = url;
    link.download = getDownloadName(pdfName);
    link.click();
    URL.revokeObjectURL(url);
    pushActivity("Downloaded edited PDF");
  }

  function beginDrag(
    target: DragTarget,
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (!previewSurfaceRef.current) {
      return;
    }

    const element =
      target === "text" ? textOverlayRef.current : imageOverlayRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    dragStateRef.current = {
      target,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      boxWidth: rect.width,
      boxHeight: rect.height,
    };
  }

  const trimmedText = overlayText.trim();
  const textPreviewPosition = getOverlayPixelPosition(
    textPosition,
    textBox,
    surfaceSize,
  );
  const imagePreviewPosition = getOverlayPixelPosition(
    imagePosition,
    imageBox,
    surfaceSize,
  );
  const imagePreviewWidth = Math.max(
    surfaceSize.width * (imageScalePercent / 100),
    96,
  );

  return (
    <section className="grid gap-6">
      <Card className="border-border/60 bg-card/85 shadow-[0_30px_120px_-72px_rgba(0,0,0,0.85)]">
        <CardHeader className="gap-5 border-b border-border/60">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Editor workspace</CardTitle>
              <CardDescription className="max-w-2xl leading-7">
                Upload a PDF, drag text or image guides on the preview, then
                apply the changes and download the edited file.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void loadPdfFile(file);
                  }
                  event.currentTarget.value = "";
                }}
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void loadImageFile(file);
                  }
                  event.currentTarget.value = "";
                }}
              />
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => pdfInputRef.current?.click()}
              >
                <FileUp className="size-4" />
                Upload PDF
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => imageInputRef.current?.click()}
                disabled={!editedPdfBytes}
              >
                <FileImage className="size-4" />
                Upload PNG/JPG
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={handleReset}
                disabled={!originalPdfBytes || isBusy}
              >
                <RefreshCcw className="size-4" />
                Reset
              </Button>
              <Button
                className="rounded-full"
                onClick={handleDownload}
                disabled={!editedPdfBytes || isBusy}
              >
                <Download className="size-4" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                className="max-w-[24rem] rounded-full bg-muted px-3 py-1 text-muted-foreground"
                title={pdfName}
              >
                <span className="truncate">{pdfName}</span>
              </Badge>
              <Badge className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                {pageCount} pages
              </Badge>
              <Badge className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                {formatBytes(pdfSize)}
              </Badge>
            </div>

            <div className="rounded-[1.75rem] border border-border/60 bg-background/80 p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-full bg-card px-3 py-1 text-muted-foreground">
                    Preview page {activePage || 1}
                  </Badge>
                  <Badge className="rounded-full bg-card px-3 py-1 text-muted-foreground">
                    Drag the guides before applying
                  </Badge>
                </div>
                {(previewBusy || isBusy) && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-sm text-muted-foreground">
                    <LoaderCircle className="size-4 animate-spin" />
                    {previewBusy ? "Rendering preview" : "Applying edit"}
                  </div>
                )}
              </div>

              <div className="overflow-auto rounded-[1.5rem] border border-border/60 bg-zinc-950/5 p-3 dark:bg-white/5">
                <div
                  ref={previewSurfaceRef}
                  className="relative mx-auto min-h-[860px] min-w-[680px]"
                  style={{
                    width: surfaceSize.width || undefined,
                    height: surfaceSize.height || undefined,
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className={`block rounded-[1.25rem] bg-white shadow-[0_24px_90px_-50px_rgba(0,0,0,0.8)] ${
                      editedPdfBytes ? "" : "hidden"
                    }`}
                  />

                  {editedPdfBytes && trimmedText ? (
                    <div
                      ref={textOverlayRef}
                      role="button"
                      tabIndex={0}
                      onPointerDown={(event) => beginDrag("text", event)}
                      className="absolute cursor-grab select-none rounded-2xl border border-dashed border-foreground/30 bg-background/80 px-4 py-2 shadow-md backdrop-blur active:cursor-grabbing"
                      style={{
                        left: textPreviewPosition.left,
                        top: textPreviewPosition.top,
                        color: textColor,
                        fontSize,
                      }}
                    >
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <Type className="size-3.5" />
                        Text
                      </div>
                      <div className="mt-1 font-semibold leading-none">
                        {trimmedText}
                      </div>
                    </div>
                  ) : null}

                  {editedPdfBytes && imagePreviewUrl ? (
                    <div
                      ref={imageOverlayRef}
                      role="button"
                      tabIndex={0}
                      onPointerDown={(event) => beginDrag("image", event)}
                      className="absolute cursor-grab select-none rounded-2xl border border-dashed border-foreground/30 bg-background/80 p-2 shadow-md backdrop-blur active:cursor-grabbing"
                      style={{
                        left: imagePreviewPosition.left,
                        top: imagePreviewPosition.top,
                        width: imagePreviewWidth,
                      }}
                    >
                      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <MousePointer2 className="size-3.5" />
                        Image
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreviewUrl}
                        alt="Overlay preview"
                        className="w-full rounded-xl object-contain"
                      />
                    </div>
                  ) : null}

                  {!editedPdfBytes ? (
                    <div className="flex min-h-[860px] flex-col items-center justify-center gap-4 px-6 text-center">
                      <div className="flex size-14 items-center justify-center rounded-3xl border border-border/70 bg-muted/60">
                        <Stamp className="size-6" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-semibold tracking-tight">
                          Upload a PDF to start editing
                        </p>
                        <p className="max-w-md text-sm leading-7 text-muted-foreground">
                          The preview is larger now and supports draggable text
                          and image guides for precise placement.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="page-mode">Apply to</Label>
                  <select
                    id="page-mode"
                    className="flex h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={targetAllPages ? "all" : "single"}
                    onChange={(event) =>
                      setTargetAllPages(event.target.value === "all")
                    }
                    disabled={!editedPdfBytes}
                  >
                    <option value="all">All pages</option>
                    <option value="single">Current preview page only</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="active-page">Preview page</Label>
                  <Input
                    id="active-page"
                    type="number"
                    min={1}
                    max={pageCount || 1}
                    value={activePage}
                    disabled={!editedPdfBytes}
                    onChange={(event) =>
                      setActivePage(
                        Math.min(
                          Math.max(Number(event.target.value) || 1, 1),
                          pageCount || 1,
                        ),
                      )
                    }
                  />
                </div>

                <div
                  className="rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground"
                  title={imageName}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>Image asset</span>
                    <span className="max-w-[12rem] truncate font-medium text-foreground">
                      {imageName}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between gap-3">
                    <span>Text guide</span>
                    <span className="font-medium text-foreground">
                      {Math.round(textPosition.x * 100)}% /{" "}
                      {Math.round(textPosition.y * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Image guide</span>
                    <span className="font-medium text-foreground">
                      {Math.round(imagePosition.x * 100)}% /{" "}
                      {Math.round(imagePosition.y * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Text overlay
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Edit the text, then drag the guide on the preview.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overlay-text">Text</Label>
                  <Input
                    id="overlay-text"
                    value={overlayText}
                    onChange={(event) => setOverlayText(event.target.value)}
                    disabled={!editedPdfBytes}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font size</Label>
                    <Input
                      id="font-size"
                      type="number"
                      min={10}
                      max={120}
                      value={fontSize}
                      onChange={(event) =>
                        setFontSize(
                          Math.max(10, Number(event.target.value) || 10),
                        )
                      }
                      disabled={!editedPdfBytes}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text color</Label>
                    <input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={(event) => setTextColor(event.target.value)}
                      disabled={!editedPdfBytes}
                      className="h-11 w-full cursor-pointer rounded-2xl border border-input bg-background px-2"
                    />
                  </div>
                </div>
                <Button
                  className="w-full rounded-full"
                  onClick={() => void handleAddText()}
                  disabled={!editedPdfBytes || isBusy}
                >
                  Add text to PDF
                </Button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Image overlay
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Long file names stay contained and the image guide is
                    draggable.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <Label htmlFor="image-scale">Image width</Label>
                    <span className="text-muted-foreground">
                      {imageScalePercent}% of page width
                    </span>
                  </div>
                  <input
                    id="image-scale"
                    type="range"
                    min={10}
                    max={60}
                    value={imageScalePercent}
                    onChange={(event) =>
                      setImageScalePercent(Number(event.target.value))
                    }
                    disabled={!editedPdfBytes}
                    className="w-full accent-foreground"
                  />
                </div>
                <Button
                  className="w-full rounded-full"
                  variant="secondary"
                  onClick={() => void handleAddImage()}
                  disabled={!editedPdfBytes || !imageBytes || isBusy}
                >
                  Add image to PDF
                </Button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => void handleRotate()}
                  disabled={!editedPdfBytes || isBusy}
                >
                  <RotateCw className="size-4" />
                  Rotate 90 degrees
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => void handleDuplicatePage()}
                  disabled={!editedPdfBytes || isBusy}
                >
                  <Scissors className="size-4" />
                  Duplicate preview page
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => void handleDeletePage()}
                  disabled={!editedPdfBytes || isBusy}
                >
                  <Trash2 className="size-4" />
                  Delete preview page
                </Button>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <div className="grid gap-2">
              {activity.slice(0, 4).map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-border/60 bg-card px-4 py-3"
                >
                  <p className="text-sm font-medium tracking-tight">
                    {entry.action}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {entry.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
