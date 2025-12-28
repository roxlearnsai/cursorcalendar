import React from "react";
import { format } from "date-fns";
import type { DayPhoto, IsoDate } from "../types";

function uid(): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function filesToDataUrls(files: File[]): Promise<DayPhoto[]> {
  const readers = files.map(
    (file) =>
      new Promise<DayPhoto>((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = () => reject(new Error("Failed to read file"));
        fr.onload = () =>
          resolve({
            id: uid(),
            dataUrl: String(fr.result),
            fileName: file.name,
            createdAt: Date.now()
          });
        fr.readAsDataURL(file);
      })
  );
  return Promise.all(readers);
}

export function DayTile(props: {
  iso: IsoDate;
  date: Date;
  inMonth: boolean;
  isWeekend: boolean;
  holidayNames: string[] | undefined;
  photos: DayPhoto[] | undefined;
  onAddPhotos: (iso: IsoDate, photos: DayPhoto[]) => void;
  onRemovePhoto: (iso: IsoDate, photoId: string) => void;
}) {
  const { iso, date, inMonth, isWeekend, holidayNames, photos, onAddPhotos, onRemovePhoto } = props;
  const dayNumber = format(date, "d");
  const photoCount = photos?.length ?? 0;
  const canAddMore = inMonth && photoCount < 4;
  const holidayText = holidayNames?.[0];

  return (
    <div
      className={`dayTile ${inMonth ? "" : "dayTileMuted"} ${isWeekend ? "dayTileWeekend" : ""}`}
      title={iso}
    >
      {holidayText ? (
        <div className="holidayText" title={holidayNames?.join(", ")}>
          {holidayText}
        </div>
      ) : null}

      {canAddMore ? (
        <label className="addPhotosCorner" title="Add photos (max 4)">
          <span className="addPhotosPlus" aria-hidden>
            +
          </span>
          <span className="srOnly">Add photos</span>
          <input
            className="fileInput"
            type="file"
            accept="image/*"
            multiple
            onChange={async (e) => {
              const fileList = e.currentTarget.files;
              if (!fileList) return;
              const remaining = 4 - (photos?.length ?? 0);
              const toTake = Array.from(fileList).slice(0, remaining);
              // reset input so selecting same file again works
              e.currentTarget.value = "";
              if (toTake.length === 0) return;
              const nextPhotos = await filesToDataUrls(toTake);
              onAddPhotos(iso, nextPhotos);
            }}
          />
        </label>
      ) : null}

      <div className={`dayNumber ${inMonth ? "dayNumberInMonth" : "dayNumberOutMonth"}`}>{dayNumber}</div>

      {photos && photos.length > 0 ? (
        <div className="photoStack">
          {photos.slice(0, 4).map((p, idx) => (
            <button
              key={p.id}
              className="photoCard"
              type="button"
              title="Remove photo"
              onClick={() => onRemovePhoto(iso, p.id)}
              style={
                {
                  ["--dx" as any]: `${idx * 10}px`,
                  ["--dy" as any]: `${idx * 4}px`,
                  ["--rot" as any]: `${idx === 0 ? -4 : idx === 1 ? 3 : idx === 2 ? -2 : 2}deg`
                } as React.CSSProperties
              }
            >
              <img src={p.dataUrl} alt={p.fileName} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

