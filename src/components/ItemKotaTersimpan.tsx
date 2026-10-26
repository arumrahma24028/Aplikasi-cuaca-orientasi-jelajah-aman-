// src/components/ItemKotaTersimpan.tsx
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useTema } from "../context/TemaContext";
import Teks from "./Teks";

interface ItemKotaProps {
  nama: string;
  onPilih?: () => void;
  onHapus?: () => void;
  ikon?: keyof typeof Ionicons.glyphMap;
  labelHapus?: string;
}

export default function ItemKotaTersimpan({
  nama,
  onPilih,
  onHapus,
  ikon = "location",
  labelHapus,
}: ItemKotaProps) {
  const { warna } = useTema();

  const isi = (
    <>
      <Ionicons name={ikon} size={20} color={warna.aksen} />
      <Teks style={{ fontWeight: "600", flexShrink: 1 }}>{nama}</Teks>
    </>
  );

  const gayaIsi = {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    paddingVertical: 6,
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: warna.kartuDalam,
        borderRadius: 12,
        paddingVertical: 8,
        paddingLeft: 14,
        paddingRight: 8,
        minHeight: 52,
      }}
    >
      {onPilih ? (
        <TouchableOpacity
          onPress={onPilih}
          accessibilityLabel={`Buka cuaca ${nama}`}
          style={gayaIsi}
        >
          {isi}
        </TouchableOpacity>
      ) : (
        <View style={gayaIsi}>{isi}</View>
      )}

      {onHapus && (
        <TouchableOpacity
          onPress={onHapus}
          accessibilityLabel={labelHapus ?? `Hapus ${nama}`}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(211,47,47,0.12)",
          }}
        >
          <Ionicons name="trash-outline" size={20} color={warna.bahaya} />
        </TouchableOpacity>
      )}
    </View>
  );
}