// src/app/(tabs)/riwayat.tsx
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderHalaman from "../../components/HeaderHalaman";
import ItemKotaTersimpan from "../../components/ItemKotaTersimpan";
import KartuBagian from "../../components/KartuBagian";
import Teks from "../../components/Teks";
import TombolAksi from "../../components/TombolAksi";
import { useTema } from "../../context/TemaContext";
import {daftarKotaTersimpan,hapusCacheKota} from "../../services/cacheRepository";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { ambilRiwayat, kosongkanRiwayat } from "../../services/searchHistory";

import type { RingkasanKotaTersimpan } from "../../../types/cache";
import type { KotaFavorit } from "../../../types/favorit";
import type { HasilGeocoding } from "../../../types/geocoding";

export default function TabRiwayat() {
  const { warna } = useTema();
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [riwayat, setRiwayat] = useState<HasilGeocoding[]>([]);
  const [kotaCache, setKotaCache] = useState<RingkasanKotaTersimpan[]>([]);

  async function muatData() {
    try {
      setDaftarFavorit(await ambilSemuaFavorit());
      setRiwayat(await ambilRiwayat());
      setKotaCache(await daftarKotaTersimpan());
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, []),
  );

  // Klik kota -> pindah ke Beranda dan langsung cari kota tersebut
  function bukaDiBeranda(id: number, nama: string, lat: number, lon: number) {
    router.navigate({
      pathname: "/",
      params: {
        kotaId: String(id),
        nama,
        lat: String(lat),
        lon: String(lon),
        ts: String(Date.now()),
      },
    });
  }

  function bersihkanRiwayat() {
    tampilkanKonfirmasi(
      "Hapus",
      "Seluruh riwayat pencarian akan dihapus. Lanjutkan?",
      "Hapus",
      async () => {
        try {
          await kosongkanRiwayat();
          setRiwayat([]);
        } catch (error) {
          console.error("Gagal menghapus riwayat:", error);
          Alert.alert("Gagal", "Riwayat pencarian tidak berhasil dihapus.");
        }
      },
    );
  }

  // Dialog konfirmasi yang jalan di web dan di HP
  function tampilkanKonfirmasi(
    judul: string,
    pesan: string,
    teksTombol: string,
    saatYakin: () => void,
  ) {
    if (Platform.OS === "web") {
      if (window.confirm(pesan)) saatYakin();
    } else {
      Alert.alert(judul, pesan, [
        { text: "Batal", style: "cancel" },
        { text: teksTombol, style: "destructive", onPress: saatYakin },
      ]);
    }
  }

  function konfirmasiHapus(kota: KotaFavorit) {
    tampilkanKonfirmasi(
      "Konfirmasi Hapus",
      `Yakin hapus ${kota.nama} dari daftar favorit?`,
      "Hapus",
      async () => {
        try {
          await hapusFavorit(kota.id);
          setDaftarFavorit(await ambilSemuaFavorit());
        } catch (error) {
          console.error("Gagal menghapus favorit:", error);
          Alert.alert("Gagal", "Kota tidak berhasil dihapus dari favorit.");
        }
      },
    );
  }

  function konfirmasiHapusCache(kota: RingkasanKotaTersimpan) {
    tampilkanKonfirmasi(
      "Hapus Cache",
      `Data cuaca ${kota.nama} akan dihapus dari perangkat dan tidak bisa dibuka offline lagi. Lanjutkan?`,
      "Hapus",
      async () => {
        try {
          await hapusCacheKota(kota.kunci);
          setKotaCache(await daftarKotaTersimpan());
        } catch (error) {
          console.error("Gagal menghapus cache:", error);
          Alert.alert("Gagal", "Cache kota tidak berhasil dihapus.");
        }
      },
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.latar }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <HeaderHalaman
          ikon="time"
          judul="Riwayat"
          subjudul="Pencarian, cache, dan favorit"
        />

        {/* ===== Riwayat pencarian ===== */}
        <KartuBagian judul="Riwayat Pencarian">
          {riwayat.length === 0 && (
            <Teks redup>Belum ada riwayat pencarian</Teks>
          )}

          {riwayat.map((kota) => (
            <ItemKotaTersimpan
              key={kota.id}
              nama={kota.name}
              ikon="time-outline"
              onPilih={() =>
                bukaDiBeranda(kota.id, kota.name, kota.latitude, kota.longitude)
              }
            />
          ))}

          {riwayat.length > 0 && (
            <TombolAksi
              judul="Hapus Semua Riwayat"
              ikon="trash"
              bahaya
              onPress={bersihkanRiwayat}
            />
          )}
        </KartuBagian>

        {/* ===== Kota tersimpan di perangkat (cache offline) ===== */}
        <KartuBagian judul="Kota Tersimpan di Perangkat">
          {kotaCache.length === 0 && <Teks redup>Belum ada cache kota</Teks>}

          {kotaCache.map((kota) => (
            <ItemKotaTersimpan
              key={kota.kunci}
              nama={kota.nama}
              labelHapus={`Hapus cache ${kota.nama}`}
              onPilih={() =>
                bukaDiBeranda(kota.id, kota.nama, kota.latitude, kota.longitude)
              }
              onHapus={() => konfirmasiHapusCache(kota)}
            />
          ))}
        </KartuBagian>

        {/* ===== Kota favorit ===== */}
        <KartuBagian judul="Kota Favorit">
          <Teks redup>Tersimpan {daftarFavorit.length} kota</Teks>

          {daftarFavorit.length === 0 && <Teks>Belum ada kota favorit</Teks>}

          {daftarFavorit.map((kota) => (
            <ItemKotaTersimpan
              key={kota.id}
              nama={kota.nama}
              ikon="heart"
              labelHapus={`Hapus ${kota.nama} dari favorit`}
              onHapus={() => konfirmasiHapus(kota)}
            />
          ))}
        </KartuBagian>
      </ScrollView>
    </SafeAreaView>
  );
}
