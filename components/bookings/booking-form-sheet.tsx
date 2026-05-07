import { Ionicons } from '@expo/vector-icons';
import { Formik, type FormikProps } from 'formik';
import type { TFunction } from 'i18next';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { ThemedText } from '@/components/themed-text';
import { AddressInput } from '@/components/ui/address-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getPropertyTypeOptions } from '@/constants/announcement';
import {
  useCreateAssessmentBooking,
  useCreatePhotoShootBooking,
} from '@/hooks/api/use-bookings';
import type { AnnouncementPublicationListResponse } from '@/lib/api/applications';
import { showErrorAlert } from '@/lib/error-handler';
import type { GeoDetailsDto, ListingType, Property } from '@/types/announcement';
import { ServiceType } from '@/types/bookings';

import { ApplicationPickerSheet } from './application-picker-sheet';
import { DateTimeInput } from './datetime-input';
import { formatAddress } from './format';

const FOOTER_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
};

type TimeMode = 'exact' | 'range';

interface BookingFormValues {
  applicationId: string;
  serviceProvider: ServiceType | '';
  listingType: ListingType | '';
  propertyType: Property | '';
  bookingTitle: string;
  geo?: GeoDetailsDto;
  addressText: string;
  timeMode: TimeMode;
  scheduledTime?: string;
  startTime?: string;
  endTime?: string;
  bookingDetails: string;
}

const LISTING_OPTIONS: ListingType[] = ['FOR_RENT', 'FOR_SALE'];

const SERVICE_OPTIONS: ServiceType[] = [ServiceType.PHOTO_SHOOT, ServiceType.ASSESSMENT];

const buildSchema = (t: TFunction) =>
  Yup.object().shape({
    serviceProvider: Yup.string().required(t('booking.validation.service_provider_required')),
    listingType: Yup.string().required(t('booking.validation.listing_type_required')),
    propertyType: Yup.string().required(t('booking.validation.property_type_required')),
    bookingTitle: Yup.string()
      .trim()
      .required(t('booking.validation.booking_title_required'))
      .max(255, t('booking.validation.booking_title_max_length')),
    addressText: Yup.string().trim().required(t('booking.validation.address_required')),
    geo: Yup.mixed().required(t('booking.validation.address_required')),
    timeMode: Yup.string().oneOf(['exact', 'range']).required(),
    scheduledTime: Yup.string().when('timeMode', {
      is: 'exact',
      then: (schema) => schema.required(t('booking.validation.scheduled_time_required')),
      otherwise: (schema) => schema.notRequired(),
    }),
    startTime: Yup.string().when('timeMode', {
      is: 'range',
      then: (schema) => schema.required(t('booking.validation.start_time_required')),
      otherwise: (schema) => schema.notRequired(),
    }),
    endTime: Yup.string().when('timeMode', {
      is: 'range',
      then: (schema) =>
        schema
          .required(t('booking.validation.end_time_required'))
          .test(
            'after-start',
            t('booking.validation.end_time_after_start'),
            function (endTime) {
              const startTime = this.parent.startTime as string | undefined;
              if (!endTime || !startTime) return true;
              return new Date(endTime).getTime() > new Date(startTime).getTime();
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    bookingDetails: Yup.string()
      .trim()
      .required(t('booking.validation.booking_details_required'))
      .max(2000, t('booking.validation.booking_details_max_length')),
  });

const initialValues: BookingFormValues = {
  applicationId: '',
  serviceProvider: '',
  listingType: '',
  propertyType: '',
  bookingTitle: '',
  addressText: '',
  timeMode: 'exact',
  bookingDetails: '',
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

/**
 * Sheet hosting the "Create booking" form (Figma `6124:79400` exact /
 * `12521:120892` time range). Renders the Formik state, then submits via
 * the appropriate mutation depending on the chosen service type.
 */
export const BookingFormSheet: React.FC<Props> = ({ visible, onClose, onCreated }) => {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const formikRef = useRef<FormikProps<BookingFormValues> | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [, setSelectedAppId] = useState<string | undefined>(undefined);

  const assessment = useCreateAssessmentBooking();
  const photoShoot = useCreatePhotoShootBooking();

  const isPending = assessment.isPending || photoShoot.isPending;

  const validationSchema = useMemo(() => buildSchema(t), [t]);

  const minDate = useMemo(() => {
    // Allow scheduling at most a minute from now.
    const d = new Date();
    d.setSeconds(0, 0);
    return d;
  }, []);

  const handleSubmit = useCallback(
    async (values: BookingFormValues) => {
      if (!values.geo) return;

      const minScheduled =
        values.timeMode === 'exact' ? values.scheduledTime! : values.startTime!;
      const maxScheduled =
        values.timeMode === 'exact' ? values.scheduledTime! : values.endTime!;

      const base = {
        applicationId: values.applicationId || undefined,
        details: values.bookingDetails.trim(),
        geo: values.geo,
        listingType: values.listingType as ListingType,
        propertyType: values.propertyType as Property,
        title: values.bookingTitle.trim(),
        minScheduledTime: minScheduled,
        maxScheduledTime: maxScheduled,
      };

      try {
        if (values.serviceProvider === ServiceType.PHOTO_SHOOT) {
          await photoShoot.mutateAsync({ ...base, type: ServiceType.PHOTO_SHOOT });
        } else {
          await assessment.mutateAsync({ ...base, type: ServiceType.ASSESSMENT });
        }
        Alert.alert(t('booking.create.success_title'), t('booking.create.success_body'));
        onCreated?.();
        onClose();
      } catch (error) {
        showErrorAlert(error, { fallback: t('booking.create.error') });
      }
    },
    [assessment, onClose, onCreated, photoShoot, t]
  );

  const handleApplicationSelect = useCallback(
    (application: AnnouncementPublicationListResponse | null) => {
      const formik = formikRef.current;
      if (!formik) return;
      if (!application) {
        setSelectedAppId(undefined);
        void formik.setFieldValue('applicationId', '');
        return;
      }
      setSelectedAppId(application.id);
      void formik.setFieldValue('applicationId', application.id);
      if (application.listingType) {
        void formik.setFieldValue('listingType', application.listingType);
      }
      // Note: the application list response stores `geo.formattedAddress` as
      // a plain string, not the full multi-language DTO required by the
      // booking create payload. We pre-fill the visible address but expect
      // the user to re-select via the address autocomplete so a full
      // GeoDetailsDto can be attached to the form.
      const fa = application.geo?.formattedAddress;
      if (typeof fa === 'string' && fa.trim()) {
        void formik.setFieldValue('addressText', fa.trim());
      }
    },
    []
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 justify-end bg-black/40">
          <Pressable
            className="absolute inset-0"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
          />
          <View className="max-h-[92%] rounded-t-[24px] bg-white">
            <View className="items-center pb-2 pt-2">
              <View className="h-[5px] w-[36px] rounded-full bg-neutral-200" />
            </View>

            <View className="flex-row items-center justify-between px-4 pb-2">
              <View className="w-8" />
              <ThemedText className="text-[18px] font-semibold text-foreground">
                {t('booking.create.title')}
              </ThemedText>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                hitSlop={8}
                className="h-8 w-8 items-center justify-center">
                <Ionicons name="close" size={24} color="#111111" />
              </Pressable>
            </View>

            <Formik<BookingFormValues>
              innerRef={(node) => {
                formikRef.current = node;
              }}
              initialValues={initialValues}
              enableReinitialize={false}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({
                values,
                errors,
                touched,
                isValid,
                handleSubmit: submit,
                setFieldValue,
                setFieldTouched,
              }) => (
                <>
                  <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                    keyboardShouldPersistTaps="handled">
                    <ThemedText className="mb-4 text-center text-[13px] leading-[18px] text-neutral-500">
                      {t('booking.create.description')}
                    </ThemedText>

                    {/* Application ID */}
                    <View className="gap-1">
                      <ThemedText className="text-[14px] font-semibold text-foreground">
                        {t('booking.application_id')}
                      </ThemedText>
                      <Pressable
                        onPress={() => setPickerOpen(true)}
                        accessibilityRole="button"
                        className="h-12 flex-row items-center justify-between rounded-[12px] border border-default bg-card px-3">
                        <ThemedText
                          className={
                            values.applicationId ? 'text-foreground' : 'text-muted-foreground'
                          }
                          numberOfLines={1}>
                          {values.applicationId || t('booking.application_id_placeholder')}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={18} color="#919191" />
                      </Pressable>
                    </View>

                    <View className="mt-4">
                      <Select<ServiceType>
                        label={t('booking.service_provider')}
                        placeholder={t('booking.select_service_provider')}
                        value={(values.serviceProvider || undefined) as ServiceType | undefined}
                        onChange={(v) => setFieldValue('serviceProvider', v)}
                        options={SERVICE_OPTIONS.map((o) => ({
                          value: o,
                          label:
                            o === ServiceType.PHOTO_SHOOT
                              ? t('booking.service_type.photo_shoot')
                              : t('booking.service_type.assessment'),
                        }))}
                        error={
                          touched.serviceProvider && errors.serviceProvider
                            ? errors.serviceProvider
                            : undefined
                        }
                      />
                    </View>

                    <View className="mt-4">
                      <Select<ListingType>
                        label={t('booking.listing_type')}
                        placeholder={t('booking.listing_type')}
                        value={(values.listingType || undefined) as ListingType | undefined}
                        onChange={(v) => setFieldValue('listingType', v)}
                        options={LISTING_OPTIONS.map((o) => ({
                          value: o,
                          label:
                            o === 'FOR_RENT'
                              ? t('property_details.for_rent')
                              : t('property_details.for_sale'),
                        }))}
                        error={
                          touched.listingType && errors.listingType
                            ? (errors.listingType as string)
                            : undefined
                        }
                      />
                    </View>

                    <View className="mt-4">
                      <Select<Property>
                        label={t('booking.property_type')}
                        placeholder={t('booking.property_type')}
                        value={(values.propertyType || undefined) as Property | undefined}
                        onChange={(v) => setFieldValue('propertyType', v)}
                        options={getPropertyTypeOptions(t).map((o) => ({
                          value: o.value as Property,
                          label: o.label,
                        }))}
                        error={
                          touched.propertyType && errors.propertyType
                            ? (errors.propertyType as string)
                            : undefined
                        }
                      />
                    </View>

                    <View className="mt-4">
                      <Input
                        label={t('booking.title')}
                        placeholder={t('booking.title_placeholder')}
                        value={values.bookingTitle}
                        onChangeText={(v) => setFieldValue('bookingTitle', v)}
                        onBlur={() => setFieldTouched('bookingTitle', true)}
                        error={
                          touched.bookingTitle && errors.bookingTitle
                            ? (errors.bookingTitle as string)
                            : undefined
                        }
                      />
                    </View>

                    <View className="mt-4">
                      <AddressInput
                        label={t('booking.address')}
                        value={values.addressText}
                        onChangeText={(v) => setFieldValue('addressText', v)}
                        onSelectAddress={({ address }) => {
                          setFieldValue('geo', address);
                          setFieldValue(
                            'addressText',
                            formatAddress(address, i18n.language) || values.addressText
                          );
                        }}
                        lang={i18n.language}
                        error={
                          (touched.addressText && (errors.addressText as string)) ||
                          (touched.geo && (errors.geo as string)) ||
                          undefined
                        }
                      />
                    </View>

                    {/* Time mode toggle */}
                    <View className="mt-6 rounded-[12px] bg-neutral-50 p-4">
                      <ThemedText className="text-[16px] font-semibold text-foreground">
                        {t('booking.time_selection')}
                      </ThemedText>
                      <View className="mt-3 flex-row items-center gap-3">
                        <ThemedText className="text-[14px] text-foreground">
                          {t('booking.exact_time')}
                        </ThemedText>
                        <Switch
                          value={values.timeMode === 'range'}
                          onValueChange={(checked) => {
                            void setFieldValue('timeMode', checked ? 'range' : 'exact');
                          }}
                          trackColor={{ false: '#D1D5DB', true: '#0F7B3F' }}
                        />
                        <ThemedText className="text-[14px] text-foreground">
                          {t('booking.time_range')}
                        </ThemedText>
                      </View>

                      <View className="mt-4">
                        {values.timeMode === 'exact' ? (
                          <DateTimeInput
                            label={t('booking.scheduled_time')}
                            value={values.scheduledTime}
                            onChange={(iso) => setFieldValue('scheduledTime', iso)}
                            placeholder={t('booking.select_date_time')}
                            minimumDate={minDate}
                            error={
                              touched.scheduledTime && errors.scheduledTime
                                ? (errors.scheduledTime as string)
                                : undefined
                            }
                          />
                        ) : (
                          <View className="gap-3">
                            <DateTimeInput
                              label={t('booking.start_time')}
                              value={values.startTime}
                              onChange={(iso) => setFieldValue('startTime', iso)}
                              placeholder={t('booking.select_start_time')}
                              minimumDate={minDate}
                              error={
                                touched.startTime && errors.startTime
                                  ? (errors.startTime as string)
                                  : undefined
                              }
                            />
                            <DateTimeInput
                              label={t('booking.end_time')}
                              value={values.endTime}
                              onChange={(iso) => setFieldValue('endTime', iso)}
                              placeholder={t('booking.select_end_time')}
                              minimumDate={
                                values.startTime ? new Date(values.startTime) : minDate
                              }
                              error={
                                touched.endTime && errors.endTime
                                  ? (errors.endTime as string)
                                  : undefined
                              }
                            />
                          </View>
                        )}
                      </View>
                    </View>

                    <View className="mt-4">
                      <Input
                        label={t('booking.details')}
                        placeholder={t('booking.details_placeholder')}
                        value={values.bookingDetails}
                        onChangeText={(v) => setFieldValue('bookingDetails', v)}
                        onBlur={() => setFieldTouched('bookingDetails', true)}
                        multiline
                        numberOfLines={4}
                        style={{ height: 100, textAlignVertical: 'top', paddingTop: 12 }}
                        error={
                          touched.bookingDetails && errors.bookingDetails
                            ? (errors.bookingDetails as string)
                            : undefined
                        }
                      />
                    </View>
                  </ScrollView>

                  <View
                    className="border-t border-neutral-50 bg-white px-4 pt-3"
                    style={[FOOTER_SHADOW, { paddingBottom: insets.bottom + 12 }]}>
                    <Button
                      onPress={() => submit()}
                      disabled={!isValid || isPending}
                      accessibilityLabel={t('booking.book_service')}>
                      {isPending ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        t('booking.book_service')
                      )}
                    </Button>
                  </View>

                  <ApplicationPickerSheet
                    visible={pickerOpen}
                    selectedId={values.applicationId || undefined}
                    onClose={() => setPickerOpen(false)}
                    onSelect={handleApplicationSelect}
                  />
                </>
              )}
            </Formik>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
