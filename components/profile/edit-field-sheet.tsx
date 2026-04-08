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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <ThemedText className="mb-2 text-[14px] font-medium text-[#333]">{label}</ThemedText>

          {type === 'phone' ? (
            <PhoneInput value={editValue} onChangeText={setEditValue} />
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

          <View className="mt-4 flex-row gap-3">
            <Pressable onPress={onClose} style={styles.closeButton}>
              <ThemedText className="text-[16px] font-semibold text-[#087443]">
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
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#087443',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#087443',
  },
});
