// src/context/TemaContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { paletGelap, paletTerang, type Warna } from "../constants/warna";

export type ModeTema = "terang" | "gelap" | "sistem";

const KUNCI_TEMA = "mode_tema";

interface NilaiTema {
  mode: ModeTema;
  setMode: (mode: ModeTema) => void;
  gelap: boolean;
  warna: Warna;
}

const TemaContext = createContext<NilaiTema | null>(null);

export function TemaProvider({ children }: { children: ReactNode }) {
  const skemaSistem = useColorScheme();
  const [mode, setModeState] = useState<ModeTema>("sistem");

  // Baca pilihan terakhir pengguna saat aplikasi dibuka
  useEffect(() => {
    AsyncStorage.getItem(KUNCI_TEMA)
      .then((nilai) => {
        if (nilai === "terang" || nilai === "gelap" || nilai === "sistem") {
          setModeState(nilai);
        }
      })
      .catch(() => {});
  }, []);

  function setMode(baru: ModeTema) {
    setModeState(baru);
    AsyncStorage.setItem(KUNCI_TEMA, baru).catch(() => {});
  }

  const gelap = mode === "sistem" ? skemaSistem === "dark" : mode === "gelap";
  const warna = gelap ? paletGelap : paletTerang;

  return (
    <TemaContext.Provider value={{ mode, setMode, gelap, warna }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema(): NilaiTema {
  const nilai = useContext(TemaContext);
  if (!nilai) {
    throw new Error("useTema harus dipakai di dalam TemaProvider");
  }
  return nilai;
}