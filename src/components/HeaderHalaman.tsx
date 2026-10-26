// src/components/HeaderHalaman.tsx
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useTema } from "../context/TemaContext";
import Teks from "./Teks";

interface HeaderHalamanProps {
  ikon: keyof typeof Ionicons.glyphMap;
  judul: string;
  subjudul: string;
}

export default function HeaderHalaman({ ikon, judul, subjudul }: HeaderHalamanProps) {
  const { warna } = useTema();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Ionicons name={ikon} size={52} color={warna.aksen} />
      <View>
        <Teks style={{ fontSize: 28, fontWeight: "bold" }}>{judul}</Teks>
        <Teks redup>{subjudul}</Teks>
      </View>
    </View>
  );
}