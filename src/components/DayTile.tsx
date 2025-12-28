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
  holidayNames: string[] | undefined;
  photos: DayPhoto[] | undefined;
  onAddPhotos: (iso: IsoDate, photos: DayPhoto[]) => void;
  onRemovePhoto: (iso: IsoDate, photoId: string) => void;
}) {
  const { iso, date, inMonth, holidayNames, photos, onAddPhotos, onRemovePhoto } = props;
  const dayNumber = format(date, "d");
  const photoCount = photos?.length ?? 0;
  const canAddMore = inMonth && photoCount < 4;

  return (
    <div className={`dayTile ${inMonth ? "" : "dayTileMuted"}`}>
      <div className="dayTileHeader">
        <div className="dayNumber" title={iso}>
          {dayNumber}
        </div>
        {canAddMore ? (
          <label className="addPhotosButton" title="Add photos (max 4)">
            <span aria-hidden>＋</span>
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
        ) : (
          <div className="addPhotosButtonDisabled" title={inMonth ? "Max 4 photos" : ""}>
            <span aria-hidden>＋</span>
          </div>
        )}
      </div>

      {holidayNames && holidayNames.length > 0 ? (
        <div className="holidayList">
          {holidayNames.slice(0, 2).map((name) => (
            <div className="holidayPill" key={name} title={name}>
              {name}
            </div>
          ))}
          {holidayNames.length > 2 ? (
            <div className="holidayMore" title={holidayNames.join(", ")}>
              +{holidayNames.length - 2} more
            </div>
          ) : null}
        </div>
      ) : (
        <div className="holidaySpacer" />
      )}

      {photos && photos.length > 0 ? (
        <div className="photoGrid">
          {photos.slice(0, 4).map((p) => (
            <button
              key={p.id}
              className="photoThumb"
              type="button"
              title="Remove photo"
              onClick={() => onRemovePhoto(iso, p.id)}
            >
              <img src={p.dataUrl} alt={p.fileName} />
              <span className="photoRemove">Remove</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="photoEmpty">{inMonth ? "No photos" : ""}</div>
      )}
    </div>
  );
}

