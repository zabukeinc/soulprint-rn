import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '@/src/lib/theme';
import { captureAppException } from '@/src/lib/observability';

type AppErrorBoundaryState = {
  error: Error | null;
};

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    captureAppException(error, { componentStack: info.componentStack ?? null });
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) return <AppErrorBoundaryFallback resetError={this.reset} />;
    return this.props.children;
  }
}

export function AppErrorBoundaryFallback({ resetError }: { resetError: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Something slipped</Text>
        <Text style={styles.title}>Astrovy needs a refresh.</Text>
        <Text style={styles.body}>
          The issue was logged for review. Try again, and if it keeps happening we will have enough detail to trace it.
        </Text>
        <TouchableOpacity activeOpacity={0.85} onPress={resetError} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 28,
    padding: 22,
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(31,33,48,0.08)',
    ...theme.shadows.warmSoft,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 0,
    textTransform: 'uppercase',
    fontWeight: '800',
    color: theme.colors.muted,
  },
  title: {
    marginTop: 8,
    fontFamily: theme.fonts.serif,
    fontSize: 26,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  body: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
  button: {
    marginTop: 18,
    minHeight: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ink,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
