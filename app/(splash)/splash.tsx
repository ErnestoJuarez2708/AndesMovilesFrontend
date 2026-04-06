import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';

const colors = {
  amber700: '#b45309',
  stone900: '#1c1917',
};

export default function SplashScreen() {
  const router = useRouter();
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Animación del logo giratorio
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 30000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  useEffect(() => {
    // Redirección al catálogo después de 2.5 segundos
    const timer = setTimeout(() => {
      router.replace('/(main)/catalog');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // SOLO UN RETURN AQUÍ
  return (
    <View style={styles.container}>
      <View style={styles.gradient} />
      <View style={styles.content}>
        <Animated.Image
          source={require('@/assets/images/splash-logo.png')}
          style={[
            styles.logo,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        />
        <View style={styles.loaderContainer}>
          {/* Nota: animationDelay no funciona así en StyleSheet de RN nativo, 
              pero no romperá el código, solo se verán estáticos */}
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
} // <--- Aquí termina la función correctamente

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: 'rgba(180, 83, 9, 0.2)',
  },
  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.amber700,
  },
});