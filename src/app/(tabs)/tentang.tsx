// src/app/(tabs)/tentang.tsx
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AtribusiCuaca from "../../components/AtribusiCuaca";
import HeaderHalaman from "../../components/HeaderHalaman";
import KartuBagian from "../../components/KartuBagian";
import Teks from "../../components/Teks";
import { spacing, typeScale } from "../../constants/styles";
import { useTema } from "../../context/TemaContext";

export default function TabTentang() {
  const { warna } = useTema();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.latar }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.sedang, gap: spacing.sedang }}
      >
        <HeaderHalaman
          ikon="information-circle"
          judul="Tentang"
          subjudul="Informasi aplikasi"
        />

        <KartuBagian judul="Jelajah Aman">
          <View style={{ alignItems: "center", gap: 6, paddingVertical: 8 }}>
            <Ionicons name="partly-sunny" size={64} color="#F5A623" />
            <Teks
              accessible
              accessibilityLabel="Judul halaman Tentang aplikasi Jelajah Aman"
              style={{ fontWeight: "bold", fontSize: typeScale.judul }}
            >
              Jelajah Aman
            </Teks>
            <Teks redup style={{ fontSize: typeScale.isi }}>
              Aplikasi cuaca dan kualitas udara
            </Teks>
          </View>

          <View style={{ height: 1, backgroundColor: warna.garis }} />

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="pricetag-outline" size={22} color={warna.aksen} />
            <View>
              <Teks redup style={{ fontSize: typeScale.keterangan }}>
                Versi
              </Teks>
              <Teks style={{ fontSize: typeScale.isi, fontWeight: "600" }}>
                1.0.0
              </Teks>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="person-outline" size={22} color={warna.aksen} />
            <View>
              <Teks redup style={{ fontSize: typeScale.keterangan }}>
                Dibuat oleh
              </Teks>
              <Teks style={{ fontSize: typeScale.isi, fontWeight: "600" }}>
                Arum Rahma Putri Sabrina
              </Teks>
            </View>
          </View>
        </KartuBagian>

        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}
