import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SignInFooter } from '@/components/auth/sign-in-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { IMAGE_DIMENSIONS } from '@/constants/auth';
import { useLogin } from '@/hooks/api/use-auth';
import { useGoogleOAuth } from '@/hooks/use-google-oauth';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useTheme } from '@/hooks/use-theme';
import { AuthScope } from '@/lib/api/auth';
import { validateEmail } from '@/lib/auth-validation';
import type { AccountRole } from '@/types/auth';

const ROLE_TO_SCOPE: Record<string, AuthScope> = {
  individual: AuthScope.USUAL,
  company: AuthScope.CONSTRUCTION,
  broker: AuthScope.BROKER,
  broker_company: AuthScope.BROKER,
};

export default function LoginFormScreen() {
  const { t } = useTranslation();
  const { role } = useLocalSearchParams<{ role: AccountRole }>();
  const scope = ROLE_TO_SCOPE[role ?? ''] ?? AuthScope.USUAL;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  const { login, isLoading, reset: resetLoginError } = useLogin();
  const { startGoogleAuth, isLoading: isGoogleLoading } = useGoogleOAuth({ scope });
  const { tokens: theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { horizontalStyle } = useScreenEdgePadding();
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);

  React.useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvt, () => setKeyboardOpen(true));
    const hideSub = Keyboard.addListener(hideEvt, () => setKeyboardOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const canContinue = email.length > 0 && password.length > 0 && !isLoading && !isGoogleLoading;

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError(null);
    setFormError(null);
    resetLoginError();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(null);
    setFormError(null);
    resetLoginError();
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError(t('validation.email_required'));
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(t('validation.email_invalid'));
      isValid = false;
    }

    if (!password) {
      setPasswordError(t('validation.required'));
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(email.trim(), password, scope);
    } catch {
      setFormError(t('login.failed_message'));
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleGoogleSignIn = () => {
    startGoogleAuth();
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple sign in
  };

  const passwordFieldError = passwordError || formError || undefined;
  const credentialError = Boolean(formError);

  return (
    <ThemedView
      className="flex-1"
      style={[
        {
          paddingTop: insets.top,
          // Bottom inset stacks above the keyboard and reads as a white gap; drop it while keyboard is open
          paddingBottom: keyboardOpen ? 0 : insets.bottom,
        },
      ]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          {
            paddingTop: 8,
            paddingBottom: 24,
          },
          horizontalStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        contentInsetAdjustmentBehavior="automatic">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="w-full items-center">
            <Image
              style={IMAGE_DIMENSIONS.LOGIN_ILLUSTRATION}
              source={require('@/assets/images/login-illustration.svg')}
              contentFit="contain"
            />

            <ThemedText type="title" className="mt-6 text-center">
              {t('login.title')}
            </ThemedText>

            <View className="mt-8 w-full">
              <Input
                label={t('auth.email')}
                value={email}
                onChangeText={handleEmailChange}
                placeholder=""
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                placeholderTextColor={theme.placeholder}
                error={emailError || undefined}
                invalid={credentialError}
                editable={!isLoading}
              />
            </View>

            <View className="mt-6 w-full">
              <Input
                label={t('auth.password')}
                value={password}
                onChangeText={handlePasswordChange}
                placeholder=""
                secureTextEntry
                showPasswordToggle
                autoComplete="password"
                textContentType="password"
                placeholderTextColor={theme.placeholder}
                error={passwordFieldError}
                editable={!isLoading}
                afterField={
                  <View className="mt-1 w-full items-end">
                    <Pressable onPress={handleForgotPassword} disabled={isLoading} hitSlop={8}>
                      <ThemedText
                        className="text-[16px] font-normal leading-[24px]"
                        style={{ color: theme.link }}>
                        {t('login.forgot_password')}
                      </ThemedText>
                    </Pressable>
                  </View>
                }
              />
            </View>

            <Pressable
              disabled={!canContinue}
              onPress={handleLogin}
              className={`mt-6 h-[50px] w-full items-center justify-center rounded-[12px] ${
                canContinue ? 'bg-primary' : 'bg-input'
              }`}
              style={({ pressed }) => (pressed && canContinue ? { opacity: 0.9 } : undefined)}>
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <ThemedText className="text-[16px] font-medium text-white">
                  {t('common.continue')}
                </ThemedText>
              )}
            </Pressable>

            <View className="w-full">
              <SignInFooter
                onGooglePress={role === 'individual' ? handleGoogleSignIn : undefined}
                onApplePress={handleAppleSignIn}
                onSignInPress={() => router.push('/(auth)/signup')}
                showSignInLink
                signInLabel={t('auth.dont_have_account')}
                signInActionLabel={t('auth.sign_up')}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </ThemedView>
  );
}
