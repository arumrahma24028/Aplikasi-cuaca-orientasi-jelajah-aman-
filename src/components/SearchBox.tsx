// src/components/SearchBox.tsx
import { useState } from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../context/TemaContext";

interface SearchBoxProps {
    onCari: (teks: string) => void;
}

export default function SearchBox({ onCari }: SearchBoxProps) {
    const [teks, setTeks] = useState("");
    const { warna } = useTema();

    function handleChange(nilaiBaru: string) {
        setTeks(nilaiBaru);
        onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
    }

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: warna.garis,
                backgroundColor: warna.kartu,
            }}
        >
            <Ionicons name="search" size={20} color={warna.placeholder} />
            <TextInput
                placeholder="Cari nama kota..."
                placeholderTextColor={warna.placeholder}
                value={teks}
                onChangeText={handleChange}
                accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
                style={{ flex: 1, paddingVertical: 12, color: warna.teks }}
            />
        </View>
    );
}