// src/components/WeatherCard.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { WeatherCardProps, TingkatAQI } from "../../types/cuaca";
import { typeScale, spacing } from "../constants/styles";
import { ikonKodeCuaca } from "../constants/weatherCodes";
import { useTema } from "../context/TemaContext";
import Teks from "./Teks";

const warnaPerTingkat: Record<TingkatAQI, string> = {
    BAIK: "green",
    SEDANG: "goldenrod",
    TIDAK_SEHAT: "orange",
    BERBAHAYA: "crimson",
};

const latarBadge: Record<TingkatAQI, string> = {
    BAIK: "rgba(0,128,0,0.15)",
    SEDANG: "rgba(218,165,32,0.18)",
    TIDAK_SEHAT: "rgba(255,165,0,0.18)",
    BERBAHAYA: "rgba(220,20,60,0.15)",
};

export default function WeatherCard({
    kota,
    suhu,
    tingkatAQI,
    indeksAQI,
    kodeCuaca,
    kondisi,
    kecepatanAngin,
}: WeatherCardProps) {
    const { warna } = useTema();

    const teksAQI =
        indeksAQI !== undefined
            ? `AQI: ${indeksAQI} (${tingkatAQI})`
            : `AQI: ${tingkatAQI}`;

    const labelAksesibilitas =
        indeksAQI !== undefined
            ? `Cuaca ${kota}, suhu ${suhu} derajat, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}`
            : `Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`;

    const adaDetail = kondisi !== undefined && kecepatanAngin !== undefined;
    const cerah = kodeCuaca !== undefined && kodeCuaca <= 2;

    return (
        <View
            accessible
            accessibilityLabel={labelAksesibilitas}
            style={{
                padding: spacing.sedang,
                borderRadius: 16,
                backgroundColor: warna.kartu,
                gap: 12,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1, gap: 6 }}>
                    <Teks style={{ fontWeight: "bold", fontSize: typeScale.judul }}>
                        {kota}
                    </Teks>

                    <Teks style={{ fontSize: 40, fontWeight: "bold" }}>
                        {suhu}°C
                    </Teks>

                    <View
                        style={{
                            alignSelf: "flex-start",
                            paddingVertical: 4,
                            paddingHorizontal: 12,
                            borderRadius: 20,
                            backgroundColor: latarBadge[tingkatAQI],
                        }}
                    >
                        <Teks
                            style={{
                                color: warnaPerTingkat[tingkatAQI],
                                fontSize: typeScale.isi,
                                fontWeight: "bold",
                            }}
                        >
                            {teksAQI}
                        </Teks>
                    </View>
                </View>

                {kodeCuaca !== undefined && (
                    <Ionicons
                        name={ikonKodeCuaca(kodeCuaca)}
                        size={72}
                        color={cerah ? "#F5A623" : warna.aksen}
                    />
                )}
            </View>

            {adaDetail && (
                <>
                    <View style={{ height: 1, backgroundColor: warna.garis }} />

                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Ionicons name="cloud-outline" size={30} color={warna.aksen} />
                            <View>
                                <Teks redup style={{ fontSize: typeScale.keterangan }}>
                                    Kondisi Cuaca
                                </Teks>
                                <Teks style={{ fontWeight: "600" }}>{kondisi}</Teks>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <MaterialCommunityIcons name="weather-windy" size={30} color={warna.aksen} />
                            <View>
                                <Teks redup style={{ fontSize: typeScale.keterangan }}>
                                    Angin
                                </Teks>
                                <Teks style={{ fontWeight: "600" }}>{kecepatanAngin} km/j</Teks>
                            </View>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}