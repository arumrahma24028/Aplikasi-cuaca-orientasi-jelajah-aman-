// src/constants/weatherCodes.ts
const kamusKodeCuaca: Record<number, string> = {
    0: "Cerah",
    1: "Cerah Berawan",
    2: "Berawan Sebagian",
    3: "Mendung",
    45: "Berkabut",
    48: "Kabut Beku",
    51: "Gerimis Ringan",
    53: "Gerimis Sedang",
    55: "Gerimis Lebat",
    61: "Hujan Ringan",
    63: "Hujan Sedang",
    65: "Hujan Lebat",
    71: "Salju Ringan",
    80: "Hujan Lokal Ringan",
    81: "Hujan Lokal Sedang",
    82: "Hujan Lokal Lebat",
    95: "Badai Petir",
};

export function labelKodeCuaca(kode: number): string {
    return kamusKodeCuaca[kode] ?? "Tidak diketahui";
}

import { Ionicons } from "@expo/vector-icons";

export function ikonKodeCuaca(kode: number): keyof typeof Ionicons.glyphMap {
    if (kode === 0) return "sunny";
    if (kode === 1 || kode === 2) return "partly-sunny";
    if (kode === 3 || kode === 45 || kode === 48) return "cloud";
    if (kode === 71) return "snow";
    if (kode === 95) return "thunderstorm";
    if (kode >= 51) return "rainy";
    return "cloud";
}