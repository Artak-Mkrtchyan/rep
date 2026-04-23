import React from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { InputError } from '@/components/ui/input/error';
import { InputLabel } from '@/components/ui/input/label';
import { cn } from '@/lib/utils';

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

type SelectProps<T extends string = string> = {
  label?: string;
  placeholder?: string;
  value?: T;
  onChange?: (value: T) => void;
  options: SelectOption<T>[];
  disabled?: boolean;
  error?: string;
  containerClassName?: string;
};

const OPTION_HEIGHT = 40;
const DROPDOWN_PADDING = 16;
const DROPDOWN_GAP = 4;
const MAX_VISIBLE_OPTIONS = 5;

type TriggerRect = { x: number; y: number; width: number; height: number };

export function Select<T extends string = string>({
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled,
  error,
  containerClassName,
}: SelectProps<T>) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [triggerRect, setTriggerRect] = React.useState<TriggerRect | null>(null);
  const triggerRef = React.useRef<View>(null);
  const selected = options.find((o) => o.value === value);

  const dropdownHeight =
    Math.min(options.length, MAX_VISIBLE_OPTIONS) * OPTION_HEIGHT + DROPDOWN_PADDING;

  const handleToggle = () => {
    if (disabled) return;
    if (!open) {
      Keyboard.dismiss();
      triggerRef.current?.measureInWindow((x, y, width, height) =>
        setTriggerRect({ x, y, width, height })
      );
    }
    setOpen((prev) => !prev);
  };

  const handleClose = () => setOpen(false);

  const handleSelect = (val: T) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <View className={cn('w-full gap-1', containerClassName)}>
      {label ? <InputLabel>{label}</InputLabel> : null}

      <Pressable
        ref={triggerRef}
        onPress={handleToggle}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityState={{ disabled, expanded: open }}
        className={cn(
          'h-12 flex-row items-center justify-between rounded-[12px] border px-3',
          'bg-card',
          disabled && 'opacity-50',
          error && 'border-destructive',
          !error && (open ? 'border-primary' : 'border-default')
        )}>
        <Text
          className={cn(
            'font-regular text-[16px]',
            selected ? 'text-foreground' : 'text-muted-foreground'
          )}>
          {selected ? selected.label : (placeholder ?? t('common.select_placeholder'))}
        </Text>
        <Svg
          width={12}
          height={7}
          viewBox="0 0 12 7"
          fill="none"
          style={{ transform: [{ rotate: open ? '0deg' : '180deg' }] }}>
          <Path
            d="M11 6L6 1L1 6"
            stroke={value && value !== 'undefined' ? '#111111' : '#C6C6C6'}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>

      <Modal
        transparent
        visible={open && triggerRect !== null}
        animationType="none"
        onRequestClose={handleClose}>
        <Pressable style={{ flex: 1 }} onPress={handleClose}>
          {triggerRect ? (
            <View
              style={{
                position: 'absolute',
                top: triggerRect.y + triggerRect.height + DROPDOWN_GAP,
                left: triggerRect.x,
                width: triggerRect.width,
                height: dropdownHeight,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 20,
              }}
              className="rounded-[12px] border border-default bg-card p-2">
              <ScrollView
                style={{ maxHeight: MAX_VISIBLE_OPTIONS * OPTION_HEIGHT }}
                showsVerticalScrollIndicator
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled">
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => handleSelect(opt.value)}
                      accessibilityRole="menuitem"
                      accessibilityState={{ selected: isSelected }}
                      className={cn(
                        'h-10 w-full justify-center rounded-[8px] px-3',
                        isSelected ? 'bg-primary/10' : 'bg-transparent'
                      )}>
                      <Text
                        className={cn(
                          'text-[14px]',
                          isSelected ? 'text-primary' : 'text-foreground'
                        )}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
        </Pressable>
      </Modal>

      {error ? <InputError>{error}</InputError> : null}
    </View>
  );
}
