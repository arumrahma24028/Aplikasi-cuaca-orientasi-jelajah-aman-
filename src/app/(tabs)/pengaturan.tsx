// src/app/(tabs)/pengaturan.tsx
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderHalaman from "../../components/HeaderHalaman";
import KartuBagian from "../../components/KartuBagian";
import Teks from "../../components/Teks";
import TombolAksi from "../../components/TombolAksi";
import { useTema, type ModeTema } from "../../context/TemaContext";
import { hapusSemuaCache } from "../../services/cacheRepository";

const OPSI_TEMA: {
  nilai: ModeTema;
  label: string;
  ikon: keyof typeof Ionicons.glyphMap;
}[] = [
  { nilai: "terang", label: "Terang", ikon: "sunny-outline" },
  { nilai: "gelap", label: "Gelap", ikon: "moon-outline" },
  { nilai: "sistem", label: "Ikuti Sistem", ikon: "phone-portrait-outline" },
];

export default function TabPengaturan() {
  const [pesan, setPesan] = useState<string | null>(null);
  const { mode, setMode, warna } = useTema();

  async function hapusDataTersimpan() {
    await hapusSemuaCache();
    setPesan("Data cuaca tersimpan sudah dihapus.");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.latar }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <HeaderHalaman
          ikon="settings"
          judul="Pengaturan"
          subjudul="Atur tampilan dan data aplikasi"
        />

        {/* ===== Mode tampilan ===== */}
        <KartuBagian judul="Mode Tampilan">
          {OPSI_TEMA.map((opsi) => {
            const dipilih = mode === opsi.nilai;
            return (
              <TouchableOpacity
                key={opsi.nilai}
                onPress={() => setMode(opsi.nilai)}
                accessibilityRole="radio"
                accessibilityState={{ selected: dipilih }}
                accessibilityLabel={`Mode tampilan ${opsi.label}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: dipilih ? warna.aksen : "transparent",
                  backgroundColor: warna.kartuDalam,
                }}
              >
                <Ionicons name={opsi.ikon} size={22} color={warna.teks} />
                <Teks style={{ flex: 1 }}>{opsi.label}</Teks>
                <Ionicons
                  name={dipilih ? "radio-button-on" : "radio-button-off"}
                  size={22}
                  color={dipilih ? warna.aksen : warna.teksSekunder}
                />
              </TouchableOpacity>
            );
          })}
        </KartuBagian>

        {/* ===== Data aplikasi ===== */}
        <KartuBagian judul="Data Aplikasi">
          <Teks redup>
            Menghapus seluruh data cuaca yang tersimpan di perangkat.
          </Teks>

          <TombolAksi
            judul="Hapus Data Cuaca Tersimpan"
            ikon="trash"
            bahaya
            onPress={hapusDataTersimpan}
          />

          {pesan && <Teks accessibilityLabel={pesan}>{pesan}</Teks>}
        </KartuBagian>
      </ScrollView>
    </SafeAreaView>
  );
}
