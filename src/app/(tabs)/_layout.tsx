// src/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../../context/TemaContext";

export default function TabLayout() {
    const { warna } = useTema();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: warna.header },
                headerTintColor: warna.teks,
                tabBarStyle: {
                    backgroundColor: warna.header,
                    borderTopColor: warna.garis,
                },
                tabBarActiveTintColor: warna.aksen,
                tabBarInactiveTintColor: warna.teksSekunder,
                tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Beranda",
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="riwayat"
                options={{
                    title: "Riwayat & Favorit",
                    tabBarLabel: "Riwayat",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "time" : "time-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="pengaturan"
                options={{
                    title: "Pengaturan",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "settings" : "settings-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="tentang"
                options={{
                    title: "Tentang",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "information-circle" : "information-circle-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}