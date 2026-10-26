// src/app/_layout.tsx (root layout)
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TemaProvider, useTema } from "../context/TemaContext";

function NavigasiRoot() {
  const { warna, gelap } = useTema();

  return (
    <>
      <StatusBar style={gelap ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: warna.header },
          headerTintColor: warna.teks,
          contentStyle: { backgroundColor: warna.latar },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail/[kota]" options={{ title: "Detail Cuaca" }} />
        <Stack.Screen
          name="tambah-favorit"
          options={{ presentation: "modal", title: "Tambah Favorit" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <TemaProvider>
      <NavigasiRoot />
    </TemaProvider>
  );
}