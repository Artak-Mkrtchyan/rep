import { useState, useCallback } from 'react';

import { useCountdown } from './use-countdown';

interface UseOtpResendOptions {
  countdownSeconds: number;
  resendFn: () => Promise<void>;
}

export function useOtpResend({ countdownSeconds, resendFn }: UseOtpResendOptions) {
  const { secondsLeft, restart, formatTime } = useCountdown(countdownSeconds);
  const [isResending, setIsResending] = useState(false);

  const resend = useCallback(async () => {
    if (secondsLeft > 0 || isResending) return;
    setIsResending(true);

    try {
      await resendFn();
      restart();
    } finally {
      setIsResending(false);
    }
  }, [secondsLeft, isResending, resendFn, restart]);

  const canResend = secondsLeft <= 0 && !isResending;

  return { secondsLeft, isResending, canResend, resend, formatTime };
}
