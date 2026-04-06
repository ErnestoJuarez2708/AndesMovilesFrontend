/**
 * Dialog Component
 * Modal-like component for displaying content in a focused layer
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  type ViewProps,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants';
import { ThemedText } from '../themed-text';

export interface DialogProps extends ViewProps {
  /** Whether dialog is visible */
  visible: boolean;
  /** Dialog title */
  title?: string;
  /** Dialog content/message */
  content?: string;
  /** Primary action button label */
  actionLabel?: string;
  /** Secondary action button label (cancel) */
  cancelLabel?: string;
  /** Callback when primary action is triggered */
  onAction?: () => void;
  /** Callback when dialog is closed/cancelled */
  onClose: () => void;
  /** Custom content to render instead of text content */
  children?: React.ReactNode;
}

export const Dialog = React.forwardRef<View, DialogProps>(
  (
    {
      visible,
      title,
      content,
      actionLabel = 'Confirm',
      cancelLabel = 'Cancel',
      onAction,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        {/* Backdrop */}
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />

        {/* Dialog Container */}
        <View
          ref={ref}
          style={styles.centerContainer}
          {...props}
        >
          <View
            style={[
              styles.dialog,
              {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 8,
              },
            ]}
          >
            {/* Header */}
            {title && (
              <View style={styles.header}>
                <ThemedText style={styles.title}>
                  {title}
                </ThemedText>
              </View>
            )}

            {/* Content */}
            <View style={styles.content}>
              {content && (
                <ThemedText style={styles.message}>
                  {content}
                </ThemedText>
              )}
              {children}
            </View>

            {/* Footer / Actions */}
            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.button,
                  styles.cancelButton,
                ]}
                onPress={onClose}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    { color: Colors.TEXT },
                  ]}
                >
                  {cancelLabel}
                </ThemedText>
              </Pressable>

              <Pressable
                style={[
                  styles.button,
                  styles.actionButton,
                ]}
                onPress={() => {
                  onAction?.();
                  onClose();
                }}
              >
                <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
                  {actionLabel}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

Dialog.displayName = 'Dialog';

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.STONE_50,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.TEXT,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  message: {
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.STONE_200,
  },
  actionButton: {
    backgroundColor: Colors.PRIMARY,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
