import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { SearchInput } from '@/components/ui/search-input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Header } from '@/components/ui/header';
import { ReIcon } from '@/components/icons/re-icon';
import { BrokersFilterSheet } from '@/components/profile/brokers-filter-sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  useCreateBrokerEmployeeMutation,
  useSearchBrokerEmployees,
} from '@/hooks/api/use-broker-employees';
import { EMAIL_REGEX, FULL_NAME_REGEX } from '@/lib/auth-validation';
import { BrokerEmployeePosition, BrokerEmployeeStatus } from '@/types/brokers';

const NEUTRAL_900 = '#1B1B1B';
const NEUTRAL_950 = '#111111';
const MAIN_500 = '#087443';
const SHADOW_COLOR = '#000000';

export default function BrokersManagementScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userInfo } = useAuth();
  const insets = useSafeAreaInsets();

  const isBrokerCompanyManager = userInfo?.roles?.includes('broker-company-manager');

  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [positionsFilter, setPositionsFilter] = useState<BrokerEmployeePosition[]>([]);
  const [statusFilter, setStatusFilter] = useState<BrokerEmployeeStatus[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleApplyFilters = useCallback(
    (positions: BrokerEmployeePosition[], status: BrokerEmployeeStatus[]) => {
      setPositionsFilter(positions);
      setStatusFilter(status);
      setFiltersOpen(false);
      setPage(1);
    },
    []
  );

  const activeFilter = useMemo(() => {
    const filter: any = {};
    if (debouncedSearch) {
      if (debouncedSearch.includes('@')) {
        filter.email = debouncedSearch;
      } else {
        filter.fullName = debouncedSearch;
      }
    }
    if (positionsFilter.length > 0) {
      filter.positions = positionsFilter;
    }
    if (statusFilter.length > 0) {
      filter.status = statusFilter;
    }
    return filter;
  }, [debouncedSearch, positionsFilter, statusFilter]);

  // Animations config
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
      backdropAnim.setValue(0);
    }
  }, [modalVisible, slideAnim, backdropAnim, SCREEN_HEIGHT]);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [positionIdx, setPositionIdx] = useState(1); // 0 = MANAGER, 1 = AGENT (default)

  // Validation States
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const isFormValid = useMemo(() => {
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 80) return false;
    if (!FULL_NAME_REGEX.test(trimmedName)) return false;
    const words = trimmedName.split(/\s+/);
    if (words.length < 2 || words.some((w) => w.length === 0)) return false;

    const emailTrimmed = email.trim();
    if (!emailTrimmed || !EMAIL_REGEX.test(emailTrimmed)) return false;

    const rawNumber = phone.startsWith('+998') ? phone.slice(4) : phone;
    const phoneDigits = rawNumber.replace(/\D/g, '');
    if (!phone || phoneDigits.length !== 9) return false;

    return true;
  }, [fullName, email, phone]);

  // Fetch employees
  const { data, isLoading, refetch } = useSearchBrokerEmployees(
    isBrokerCompanyManager ? userInfo?.companyId : undefined,
    page,
    10,
    activeFilter
  );

  const createEmployeeMutation = useCreateBrokerEmployeeMutation();

  // If not authorized, display Access Denied Screen
  if (!isBrokerCompanyManager) {
    return (
      <ThemedView className="flex-1 bg-white">
        <Header
          headerTitle={t('brokers_management.title', 'Brokers management')}
          isStepProgressVisible={false}
        />

        <View style={styles.accessDeniedContainer}>
          <View style={styles.lockIconContainer}>
            <Ionicons name="alert-circle-outline" size={80} color="#FF7070" />
          </View>
          <ThemedText type="subtitle" style={styles.accessDeniedTitle}>
            {t('brokers_management.access_denied.title', 'Access Denied')}
          </ThemedText>
          <ThemedText style={styles.accessDeniedMessage}>
            {t(
              'brokers_management.access_denied.message',
              'This page is only accessible to Broker company managers.'
            )}
          </ThemedText>
          <Button variant="primary" style={styles.goBackButton} onPress={() => router.back()}>
            {t('common.go_back', 'Go back')}
          </Button>
        </View>
      </ThemedView>
    );
  }

  const handleOpenAddModal = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPositionIdx(1); // Default to Agent
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setModalVisible(true);
  };

  const handleCreateEmployee = async () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPhoneError('');

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setNameError(t('brokers_management.validation.full_name_required', 'Full name is required'));
      isValid = false;
    } else if (trimmedName.length < 2) {
      setNameError(t('validation.full_name_min_length', 'Must be at least 2 characters'));
      isValid = false;
    } else if (trimmedName.length > 80) {
      setNameError(t('validation.full_name_max_length', 'Must be no more than 80 characters'));
      isValid = false;
    } else if (!FULL_NAME_REGEX.test(trimmedName)) {
      const hasNumbers = /\d/.test(trimmedName);
      const hasInvalidSymbols = /[^a-zA-ZА-Яа-яЁёЎўҚқҒғҲҳ'\u2018\u2019\-\s]/.test(trimmedName);

      if (hasNumbers || hasInvalidSymbols) {
        setNameError(
          t(
            'validation.full_name_invalid_chars',
            'Full name may contain only letters, hyphens, and apostrophes'
          )
        );
      } else {
        setNameError(
          t(
            'validation.full_name_allowed_alphabets',
            'Only Latin (A-Z), Cyrillic Russian (A-Ya), and Uzbek letters are allowed'
          )
        );
      }
      isValid = false;
    } else {
      const words = trimmedName.split(/\s+/);
      if (words.length < 2 || words.some((w) => w.length === 0)) {
        setNameError(t('validation.full_name_two_words', 'Please enter both first and last name'));
        isValid = false;
      }
    }

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setEmailError(t('validation.email_required', 'Email is required'));
      isValid = false;
    } else if (!EMAIL_REGEX.test(emailTrimmed)) {
      setEmailError(
        t('brokers_management.validation.email_invalid', 'Please enter a valid email address')
      );
      isValid = false;
    }

    // Phone format: "+998" prefix followed by exactly 9 digits, e.g. "+998901211323"
    const rawNumber = phone.startsWith('+998') ? phone.slice(4) : phone;
    const phoneDigits = rawNumber.replace(/\D/g, '');
    if (!phone || phoneDigits.length === 0) {
      setPhoneError(t('brokers_management.validation.phone_required', 'Mobile number is required'));
      isValid = false;
    } else if (phoneDigits.length !== 9) {
      setPhoneError(
        t('brokers_management.validation.phone_invalid', 'Please enter a valid mobile number')
      );
      isValid = false;
    }

    if (!isValid) return;

    try {
      const position =
        positionIdx === 0 ? BrokerEmployeePosition.MANAGER : BrokerEmployeePosition.AGENT;

      await createEmployeeMutation.mutateAsync({
        companyId: userInfo!.companyId!,
        email: emailTrimmed.toLowerCase(),
        fullName: trimmedName,
        phoneNumber: phone.trim(),
        position,
      });

      Alert.alert(
        t('common.success', 'Success'),
        t(
          'brokers_management.add_dialog.success',
          'Broker added successfully. A registration email has been sent.'
        )
      );
      setModalVisible(false);
      refetch();
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        t('brokers_management.add_dialog.error', 'Failed to add broker. Please try again.');
      Alert.alert(t('common.error', 'Error'), errorMessage);
    }
  };

  const getPositionText = (pos: BrokerEmployeePosition) => {
    if (pos === BrokerEmployeePosition.MANAGER) {
      return t('brokers_management.position.manager', 'Broker company manager');
    }
    return t('brokers_management.position.employee', 'Broker company employee');
  };

  const getStatusText = (status: BrokerEmployeeStatus) => {
    if (status === BrokerEmployeeStatus.ACTIVE) {
      return t('brokers_management.status.active', 'Active');
    }
    return t('brokers_management.status.registration_initiated', 'Registration initiated');
  };

  return (
    <ThemedView className="flex-1 bg-white">
      {/* Header */}
      <Header
        headerTitle={t('brokers_management.title', 'Brokers management')}
        isStepProgressVisible={false}
        rightComponent={
          <Pressable
            className="h-10 w-10 items-center justify-center"
            accessibilityRole="button"
            onPress={handleOpenAddModal}
            hitSlop={8}>
            <Ionicons name="person-add-outline" size={24} color={MAIN_500} />
          </Pressable>
        }
      />

      {/* Search and Filters */}
      <View className="flex-row items-center gap-3 border-b border-neutral-100 bg-white px-4 pb-4 pt-4">
        <View className="flex-1">
          <SearchInput
            placeholder={t('brokers_management.search_placeholder', 'Search by name or email')}
            value={searchInput}
            onChangeText={setSearchInput}
            returnKeyType="search"
          />
        </View>
        <Pressable
          onPress={() => setFiltersOpen(true)}
          className={cn(
            'h-[48px] w-[48px] items-center justify-center rounded-[10px]',
            positionsFilter.length > 0 || statusFilter.length > 0 ? 'bg-primary/10' : 'bg-white'
          )}
          hitSlop={8}>
          <ReIcon
            name="settings"
            size={24}
            color={positionsFilter.length > 0 || statusFilter.length > 0 ? '#087443' : '#a1a1a1'}
          />
        </Pressable>
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={MAIN_500} />
        </View>
      ) : !data?.content || data.content.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="people-outline" size={64} color="#A3A3A3" />
          </View>
          <ThemedText style={styles.emptyText}>
            {t('brokers_management.table.no_employees', 'No employees found')}
          </ThemedText>
          <Button
            variant="secondary"
            style={styles.addFirstButton}
            fullWidth={false}
            onPress={handleOpenAddModal}>
            {t('brokers_management.add_broker', 'Add broker')}
          </Button>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.employeeList}>
            {data.content.map((employee) => (
              <View key={employee.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  {employee.avatarInfo?.thumbnailUrl || employee.avatarInfo?.url ? (
                    <Image
                      source={{ uri: employee.avatarInfo.thumbnailUrl || employee.avatarInfo.url }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <ThemedText style={styles.avatarText}>
                        {employee.fullName.charAt(0).toUpperCase()}
                      </ThemedText>
                    </View>
                  )}
                  <View style={styles.employeeMainInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.fullName}>
                      {employee.fullName}
                    </ThemedText>
                    <ThemedText style={styles.positionText}>
                      {getPositionText(employee.position)}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.contactInfoRow}>
                  <Ionicons name="mail-outline" size={16} color="#737373" />
                  <ThemedText style={styles.contactText}>{employee.email}</ThemedText>
                </View>
                <View style={styles.contactInfoRow}>
                  <Ionicons name="call-outline" size={16} color="#737373" />
                  <ThemedText style={styles.contactText}>{employee.phoneNumber}</ThemedText>
                </View>

                <View style={styles.cardFooter}>
                  <View
                    style={[
                      styles.statusBadge,
                      employee.status === BrokerEmployeeStatus.ACTIVE
                        ? styles.statusActive
                        : styles.statusPending,
                    ]}>
                    <ThemedText
                      style={[
                        styles.statusBadgeText,
                        employee.status === BrokerEmployeeStatus.ACTIVE
                          ? styles.statusActiveText
                          : styles.statusPendingText,
                      ]}>
                      {getStatusText(employee.status)}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <Pressable
                disabled={page === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={page === 1 ? '#ABABAB' : NEUTRAL_950}
                />
              </Pressable>
              <ThemedText style={styles.pageIndicator}>
                {t('common.page_indicator', 'Page {{current}} of {{total}}', {
                  current: page,
                  total: data.totalPages,
                })}
              </ThemedText>
              <Pressable
                disabled={page === data.totalPages}
                onPress={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                style={[styles.pageButton, page === data.totalPages && styles.pageButtonDisabled]}>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={page === data.totalPages ? '#ABABAB' : NEUTRAL_950}
                />
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}

      {/* Add Employee Modal */}
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: 'rgba(0,0,0,0.4)', opacity: backdropAnim },
              ]}>
              <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
            </Animated.View>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: slideAnim }],
                  paddingBottom: 0,
                },
              ]}>
              <View style={styles.modalHeader}>
                <ThemedText type="subtitle" style={styles.modalTitle}>
                  {t('brokers_management.add_dialog.title', 'Add Broker')}
                </ThemedText>
                <Pressable onPress={() => setModalVisible(false)} hitSlop={12}>
                  <Ionicons name="close" size={24} color={NEUTRAL_900} />
                </Pressable>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalForm}
                keyboardShouldPersistTaps="handled">
                <Input
                  label={t('brokers_management.add_dialog.full_name', 'Full Name')}
                  placeholder={t(
                    'brokers_management.add_dialog.full_name_placeholder',
                    'Enter full name'
                  )}
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    if (nameError) setNameError('');
                  }}
                  error={nameError}
                  containerClassName="mb-4"
                />

                <Input
                  label={t('brokers_management.add_dialog.email', 'Email')}
                  placeholder={t(
                    'brokers_management.add_dialog.email_placeholder',
                    'Enter email address'
                  )}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (emailError) setEmailError('');
                  }}
                  error={emailError}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  containerClassName="mb-4"
                />

                <PhoneInput
                  label={t('brokers_management.add_dialog.mobile_number', 'Mobile Number')}
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (phoneError) setPhoneError('');
                  }}
                  error={phoneError}
                  containerClassName="mb-6"
                />

                <View style={styles.segmentedContainer}>
                  <ThemedText style={styles.segmentedLabel}>
                    {t('brokers_management.add_dialog.position', 'Position')}
                  </ThemedText>
                  <SegmentedControl
                    segments={[
                      t('brokers_management.position.manager', 'Manager'),
                      t('brokers_management.position.employee', 'Employee'),
                    ]}
                    selectedIndex={positionIdx}
                    onSelect={setPositionIdx}
                  />
                </View>
              </ScrollView>

              <View
                style={[styles.modalFooter, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
                <Button
                  variant="primary"
                  style={styles.submitButton}
                  onPress={handleCreateEmployee}
                  disabled={!isFormValid || createEmployeeMutation.isPending}>
                  {createEmployeeMutation.isPending
                    ? t('common.submitting', 'Submitting...')
                    : t('brokers_management.add_dialog.create', 'Create')}
                </Button>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <BrokersFilterSheet
        visible={filtersOpen}
        initialPositions={positionsFilter}
        initialStatus={statusFilter}
        onApply={handleApplyFilters}
        onClose={() => setFiltersOpen(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  employeeList: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: MAIN_500,
  },
  employeeMainInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 16,
    color: NEUTRAL_900,
  },
  positionText: {
    fontSize: 13,
    color: '#737373',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F3F3',
    marginVertical: 12,
  },
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#404040',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#E6F4EA',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusActiveText: {
    color: MAIN_500,
  },
  statusPendingText: {
    color: '#D97706',
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#737373',
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    alignSelf: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pageButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E2E2E2',
  },
  pageIndicator: {
    fontSize: 14,
    fontWeight: '500',
    color: '#404040',
  },
  accessDeniedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  lockIconContainer: {
    marginBottom: 8,
  },
  accessDeniedTitle: {
    textAlign: 'center',
    color: NEUTRAL_900,
  },
  accessDeniedMessage: {
    fontSize: 15,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  goBackButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
  },
  modalTitle: {
    fontSize: 18,
    color: NEUTRAL_900,
  },
  modalForm: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  segmentedContainer: {
    marginBottom: 24,
    gap: 8,
  },
  segmentedLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#404040',
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F3F3',
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    width: '100%',
  },
});
