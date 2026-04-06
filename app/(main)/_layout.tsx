import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="catalog"
        options={{
          headerShown: false,
          animation: 'slide_from_right', 
        }}
      />
      <Stack.Screen
        name="legend-detail"
        options={{
          headerShown: false,
          animation: 'slide_from_right', 
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="comments"
        options={{
          headerShown: false,
          animation: 'slide_from_right', 
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          headerShown: false,
          animation: 'slide_from_right', 
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
