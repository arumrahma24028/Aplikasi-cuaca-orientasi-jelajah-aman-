// src/app/(tabs)/index.tsx
import { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { tambahRiwayat } from "../../services/searchHistory";
import Teks from "../../components/Teks";
import TombolAksi from "../../components/TombolAksi";
import ItemKotaTersimpan from "../../components/ItemKotaTersimpan";
import { useTema } from "../../context/TemaContext";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import StatusData from "../../components/StatusData";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
  hapusCacheKota,
} from "../../services/cacheRepository";

import {
  mintaIzinLokasi,
  ambilKoordinatSaatIni,
} from "../../services/locationService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { HasilGeocoding } from "../../../types/geocoding";
import {
  HasilCuacaOffline,
  RingkasanKotaTersimpan,
} from "../../../types/cache";

export default function HalamanUtama() {
  const { warna } = useTema();

  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);

  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0);

  // Menerima kota yang diklik dari tab Riwayat
  const params = useLocalSearchParams<{
    kotaId?: string;
    nama?: string;
    lat?: string;
    lon?: string;
    ts?: string;
  }>();

  useEffect(() => {
    if (!params.ts || !params.kotaId || !params.nama) return;

    pilihKota({
      id: Number(params.kotaId),
      name: params.nama,
      latitude: Number(params.lat),
      longitude: Number(params.lon),
      country: "",
    });
  }, [params.ts]);

  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }

  function konfirmasiHapusCache(k: RingkasanKotaTersimpan) {
    const pesan = `Data cuaca ${k.nama} akan dihapus dari perangkat dan tidak bisa dibuka offline lagi. Lanjutkan?`;
    const proses = async () => {
      await hapusCacheKota(k.kunci);
      muatKotaTersimpan();
    };

    if (Platform.OS === "web") {
      if (window.confirm(pesan)) proses();
    } else {
      Alert.alert("Hapus Cache", pesan, [
        { text: "Batal", style: "cancel" },
        { text: "Hapus Cache", style: "destructive", onPress: proses },
      ]);
    }
  }

  // Saat aplikasi dibuka: bersihkan cache lebih dari 7 hari.
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);

  // Mencari kota setelah pengguna selesai mengetik.
  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }

    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);

  async function pilihKota(
    kota: HasilGeocoding,
    paksaPerbarui = false
  ) {
    setKotaTerpilih(kota);

    const idSaatIni = ++requestIdRef.current;

    setSedangMemuat(true);
    setPesanError(null);

    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui }
      );

      if (idSaatIni !== requestIdRef.current) return;

      setHasil(data);
      tambahRiwayat(kota).catch(() => {});
      muatKotaTersimpan();
    } catch (err) {
      if (idSaatIni !== requestIdRef.current) return;

      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi."
      );
    } finally {
      if (idSaatIni === requestIdRef.current) {
        setSedangMemuat(false);
      }
    }
  }

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();

    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas."
      );
      return;
    }

    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual."
      );
      return;
    }

    setPesanLokasi(null);

    const koordinat = await ambilKoordinatSaatIni();

    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.latar }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ===== Header ===== */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons name="partly-sunny" size={52} color="#F5A623" />
          <View>
            <Teks style={{ fontSize: 28, fontWeight: "bold" }}>Beranda</Teks>
            <Teks redup>Informasi cuaca terkini</Teks>
          </View>
        </View>

        {/* ===== Pencarian & lokasi ===== */}
        <SearchBox onCari={setTeksCari} />

        <TombolAksi
          judul="Gunakan Lokasi Saat Ini"
          ikon="locate"
          onPress={gunakanLokasiSaatIni}
        />

        {pesanLokasi && (
          <Teks accessibilityLabel={pesanLokasi}>{pesanLokasi}</Teks>
        )}

        {hasilPencarian.length > 0 && (
          <View style={{ gap: 8 }}>
            {hasilPencarian.map((kota) => (
              <ItemKotaTersimpan
                key={kota.id}
                nama={kota.name}
                onPilih={() => pilihKota(kota)}
              />
            ))}
          </View>
        )}

        {/* ===== Kota tersimpan ===== */}
        {kotaTersimpan.length > 0 && (
          <View
            style={{
              backgroundColor: warna.kartu,
              borderRadius: 16,
              padding: 16,
              gap: 10,
            }}
          >
            <Teks style={{ fontSize: 20, fontWeight: "bold" }}>
              Kota Tersimpan
            </Teks>

            {kotaTersimpan.map((k) => (
              <ItemKotaTersimpan
                key={k.kunci}
                nama={k.nama}
                onPilih={() =>
                  pilihKota({
                    id: k.id,
                    name: k.nama,
                    latitude: k.latitude,
                    longitude: k.longitude,
                    country: "",
                  })
                }
                onHapus={() => konfirmasiHapusCache(k)}
              />
            ))}
          </View>
        )}

        {sedangMemuat && <ActivityIndicator color={warna.aksen} />}

        {pesanError && (
          <View style={{ gap: 8 }}>
            <Teks accessibilityLabel={pesanError}>{pesanError}</Teks>

            <TombolAksi
              judul="Coba Lagi"
              ikon="refresh"
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
            />
          </View>
        )}

        {/* ===== Hasil cuaca ===== */}
        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />

            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(
                hasil.kualitasUdara.indeksAQI
              )}
              kodeCuaca={hasil.cuaca.saatIni.kodeCuaca}
              kondisi={labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}
              kecepatanAngin={hasil.cuaca.saatIni.kecepatanAngin}
            />

            <TombolAksi
              judul="Perbarui Sekarang"
              ikon="refresh"
              onPress={() => pilihKota(kotaTerpilih, true)}
            />

            <TombolAksi
              judul="Tambahkan ke Favorit"
              ikon="add-circle"
              onPress={() =>
                router.push({
                  pathname: "/tambah-favorit",
                  params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
            />
          </>
        )}

        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}