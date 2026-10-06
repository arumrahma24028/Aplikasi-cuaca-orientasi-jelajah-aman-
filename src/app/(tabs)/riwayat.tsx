// src/app/(tabs)/riwayat.tsx
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";

import type { KotaFavorit } from "../../../types/favorit";

export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [sedangMenghapus, setSedangMenghapus] = useState<number | null>(null);

  async function muatFavorit() {
    try {
      const data = await ambilSemuaFavorit();
      setDaftarFavorit(data);
    } catch (error) {
      console.error("Gagal mengambil favorit:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      muatFavorit();
    }, []),
  );

  function konfirmasiHapus(kota: KotaFavorit) {
    const prosesHapus = async () => {
      await hapusFavorit(kota.id);
      setDaftarFavorit((prev) => prev.filter((k) => k.id !== kota.id));
    };

    // Jika dibuka di browser / laptop
    if (Platform.OS === "web") {
      const yakin = window.confirm(`Yakin hapus ${kota.nama} dari daftar favorit?`);
      if (yakin) {
        prosesHapus();
      }
    } else {
      // Jika di HP (Android / iOS)
      Alert.alert(
        "Konfirmasi Hapus",
        `Yakin hapus ${kota.nama} dari daftar favorit?`,
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Hapus",
            style: "destructive",
            onPress: prosesHapus,
          },
        ]
      );
    }
  }

  async function prosesHapus(id: number) {
    try {
      setSedangMenghapus(id);

      await hapusFavorit(id);

      // Ambil ulang data dari AsyncStorage
      const dataTerbaru = await ambilSemuaFavorit();
      setDaftarFavorit(dataTerbaru);
    } catch (error) {
      console.error("Gagal menghapus favorit:", error);

      Alert.alert("Gagal", "Kota tidak berhasil dihapus dari favorit.");
    } finally {
      setSedangMenghapus(null);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 12,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Kota Favorit
      </Text>

      <Text>Tersimpan {daftarFavorit.length} kota</Text>

      {daftarFavorit.length === 0 && <Text>Belum ada kota favorit</Text>}

      {daftarFavorit.map((kota) => (
        <View
          key={kota.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{kota.nama}</Text>

          <Button
            title={sedangMenghapus === kota.id ? "Menghapus..." : "Hapus"}
            disabled={sedangMenghapus === kota.id}
            onPress={() => konfirmasiHapus(kota)}
          />
        </View>
      ))}
    </SafeAreaView>
  );
}