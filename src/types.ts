export type IsoDate = `${number}-${number}-${number}`; // YYYY-MM-DD

export type Holiday = {
  date: IsoDate;
  name: string;
};

export type DayPhoto = {
  id: string;
  dataUrl: string; // base64 (or blob URL if you adapt later)
  fileName: string;
  createdAt: number;
};

export type PhotoByDate = Record<IsoDate, DayPhoto[]>;

