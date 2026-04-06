import { Stack } from 'expo-router';

export default function SplashLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="splash" 
        options={{ 
          headerShown: false,
          animationEnabled: false 
        }} 
      />
    </Stack>
  );
}
