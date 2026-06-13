import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-stone-50 px-6">
      <Text className="text-center text-3xl font-bold text-red-700">
        NativeWind is ready
      </Text>
      <Text className="mt-3 text-center text-base text-stone-600">
        Refresh the app and this styled smoke test should stay intact.
      </Text>
    </View>
  );
}
