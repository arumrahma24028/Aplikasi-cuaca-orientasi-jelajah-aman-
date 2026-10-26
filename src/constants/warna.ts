// src/constants/warna.ts
export interface Warna {
  latar: string;
  kartu: string;
  header: string;
  teks: string;
  teksSekunder: string;
  garis: string;
  placeholder: string;
  aksen: string;
  bahaya: string;
  kartuDalam: string;
}

export const paletTerang: Warna = {
  latar: "#E8F3FD",
  kartu: "#FFFFFF",
  kartuDalam: "#EEF4FB",
  header: "#FFFFFF",
  teks: "#111111",
  teksSekunder: "#666666",
  garis: "#CCCCCC",
  placeholder: "#888888",
  aksen: "#007AFF",
  bahaya: "#D32F2F",
};

export const paletGelap: Warna = {
  latar: "#121212",
  kartu: "#1E2530",
  kartuDalam: "#2A3340",
  header: "#1C1C1E",
  teks: "#F2F2F2",
  teksSekunder: "#A0A0A0",
  garis: "#3A3A3A",
  placeholder: "#8A8A8A",
  aksen: "#4DA3FF",
  bahaya: "#EF5350",
};

export interface PilihanAksen {
  id: string;
  nama: string;
  terang: string;
  gelap: string;
}