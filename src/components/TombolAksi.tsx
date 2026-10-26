// src/components/TombolAksi.tsx
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { useTema } from "../context/TemaContext";

interface TombolAksiProps {
  judul: string;
  ikon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  bahaya?: boolean; // true = tombol merah (aksi menghapus)
}

export default function TombolAksi({
  judul,
  ikon,
  onPress,
  disabled,
  bahaya,
}: TombolAksiProps) {
  const { warna } = useTema();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={judul}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: bahaya ? warna.bahaya : warna.aksen,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Ionicons name={ikon} size={22} color="#FFFFFF" />
      <Text
        style={{
          color: "#FFFFFF",
          fontWeight: "bold",
          fontSize: 14,
          textTransform: "uppercase",
        }}
      >
        {judul}
      </Text>
    </TouchableOpacity>
  );
}