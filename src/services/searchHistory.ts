// src/services/searchHistory.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { HasilGeocoding } from "../../types/geocoding";

const KUNCI_RIWAYAT = "riwayat_pencarian";
const MAKS_RIWAYAT = 10;

export async function ambilRiwayat(): Promise<HasilGeocoding[]> {
  try {
    const mentah = await AsyncStorage.getItem(KUNCI_RIWAYAT);
    return mentah ? JSON.parse(mentah) : [];
  } catch {
    return [];
  }
}

export async function tambahRiwayat(kota: HasilGeocoding): Promise<void> {
  // "Lokasi Saat Ini" (id -1) tidak disimpan karena koordinatnya berubah-ubah
  if (kota.id === -1) return;

  const saatIni = await ambilRiwayat();
  const tanpaDuplikat = saatIni.filter((k) => k.id !== kota.id);
  const baru = [kota, ...tanpaDuplikat].slice(0, MAKS_RIWAYAT);

  await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(baru));
}

export async function kosongkanRiwayat(): Promise<void> {
  await AsyncStorage.removeItem(KUNCI_RIWAYAT);
}