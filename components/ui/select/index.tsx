import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

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

export function Select<T extends string = string>({
  label,
  placeholder = 'Select…',
  value,
  onChange,
  options,
  disabled,
  error,
  containerClassName,
}: SelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  const handleOpen = () => {
    if (disabled) return;
    setOpen(true);
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
        onPress={handleOpen}
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
        <Text className={cn('text-[16px]', selected ? 'text-foreground' : 'text-muted-foreground')}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text className="text-[16px] text-muted-foreground">▾</Text>
      </Pressable>

      {error ? <InputError>{error}</InputError> : null}

      <Modal transparent animationType="fade" visible={open} onRequestClose={handleClose}>
        <Pressable
          onPress={handleClose}
          className="flex-1 items-center justify-center bg-black/40 px-6">
          <Pressable
            onPress={() => {}}
            accessibilityLabel="Select options"
            className="border-default max-h-[60%] w-full rounded-[14px] border bg-card p-2">
            <ScrollView>
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => handleSelect(opt.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    className={cn(
                      'h-10 w-full flex-row items-center rounded-[8px] px-2',
                      isSelected ? 'bg-primary/10' : 'bg-transparent'
                    )}>
                    <View className="border-default mr-2 h-4 w-4 items-center justify-center rounded-full border">
                      <View
                        className={cn(
                          'h-2 w-2 rounded-full',
                          isSelected ? 'bg-primary' : 'bg-transparent'
                        )}
                      />
                    </View>
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
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
