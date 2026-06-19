// ---- Generate OTP ----
export let generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ---- Sleep helper ----
export let sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
