// src/components/KartuBagian.tsx
import type { ReactNode } from "react";
import { View } from "react-native";
import { useTema } from "../context/TemaContext";
import Teks from "./Teks";

interface KartuBagianProps {
  judul: string;
  children: ReactNode;
}

export default function KartuBagian({ judul, children }: KartuBagianProps) {
  const { warna } = useTema();

  return (
    <View
      style={{
        backgroundColor: warna.kartu,
        borderRadius: 16,
        padding: 16,
        gap: 10,
      }}
    >
      <Teks style={{ fontSize: 20, fontWeight: "bold" }}>{judul}</Teks>
      {children}
    </View>
  );
}