import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';

type EditFieldSheetProps = {
  visible: boolean;
  label: string;
  value: string;
  placeholder?: string;
  type?: 'text' | 'phone';
  keyboardType?: 'default' | 'phone-pad' | 'numeric';
  onSave: (value: string) => void;
  onClose: () => void;
};

export const EditFieldSheet: React.FC<EditFieldSheetProps> = ({
  visible,
  label,
  value,
  placeholder,
  type = 'text',
  keyboardType = 'default',
  onSave,
  onClose,
}) => {
  const { t } = useTranslation();
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    if (visible) setEditValue(value);
  }, [visible, value]);

  const handleSave = useCallback(() => {
    onSave(editValue.trim());
  }, [editValue, onSave]);

  const handleClear = useCallback(() => {
    setEditValue('');
  }, []);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          <View style={styles.sheetBody}>
            <ThemedText className="mb-2 text-[12px] font-bold text-[#111111]">{label}</ThemedText>

            {type === 'phone' ? (
              <PhoneInput value={editValue} onChangeText={setEditValue} variant="rep" autoFocus />
            ) : (
              <Input
                value={editValue}
                onChangeText={setEditValue}
                placeholder={placeholder}
                keyboardType={keyboardType}
                autoFocus
                rightIcon={
                  editValue ? (
                    <Pressable onPress={handleClear}>
                      <Ionicons name="close" size={18} color="#ABABAB" />
                    </Pressable>
                  ) : undefined
                }
              />
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.actions}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <ThemedText className="text-[16px] font-semibold text-[#0E9457]">
                  {t('common.close', 'Close')}
                </ThemedText>
              </Pressable>
              <Pressable onPress={handleSave} style={styles.saveButton}>
                <ThemedText className="text-[16px] font-semibold text-white">
                  {t('common.save', 'Save')}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    shadowColor: '#2B2B2B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  handleWrap: {
    paddingTop: 5,
    alignItems: 'center',
  },
  handle: {
    width: 45,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E2E2',
  },
  sheetBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  closeButton: {
    flex: 1,
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
  },
  saveButton: {
    flex: 1,
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#0E9457',
  },
});
