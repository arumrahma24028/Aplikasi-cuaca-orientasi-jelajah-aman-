// src/components/Teks.tsx
import { Text, type TextProps } from "react-native";
import { useTema } from "../context/TemaContext";

interface TeksProps extends TextProps {
  redup?: boolean; // true = warna teks sekunder
}

export default function Teks({ style, redup, ...sisa }: TeksProps) {
  const { warna } = useTema();

  return (
    <Text
      style={[{ color: redup ? warna.teksSekunder : warna.teks }, style]}
      {...sisa}
    />
  );
}