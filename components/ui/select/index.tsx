import React from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Modal, Platform, Pressable, Text, View } from 'react-native';
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
  const [triggerLayout, setTriggerLayout] = React.useState({ x: 0, y: 0, width: 0, height: 0 });
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const triggerRef = React.useRef<View>(null);
  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const dropdownHeight = options.length * OPTION_HEIGHT + DROPDOWN_PADDING;

  const handleToggle = () => {
    if (disabled) return;
    if (open) {
      setOpen(false);
      return;
    }
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
      setOpen(true);
    });
  };

  const handleClose = () => setOpen(false);

  const handleSelect = (val: T) => {
    onChange?.(val);
    setOpen(false);
  };

  const dropdownTop = keyboardVisible
    ? triggerLayout.y - dropdownHeight - DROPDOWN_GAP
    : triggerLayout.y + triggerLayout.height + DROPDOWN_GAP;

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
      {error ? <InputError>{error}</InputError> : null}

      <Modal transparent visible={open} onRequestClose={handleClose} animationType="none">
        <Pressable style={{ flex: 1 }} onPress={handleClose} accessible={false}>
          <View
            style={{
              position: 'absolute',
              top: dropdownTop,
              left: triggerLayout.x,
              width: triggerLayout.width,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
            className="rounded-[12px] border border-default bg-card p-2">
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
                    className={cn('text-[14px]', isSelected ? 'text-primary' : 'text-foreground')}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
