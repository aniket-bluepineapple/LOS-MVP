// Send OTP to phone
export const sendPhoneOTP = async (phoneNumber: string) => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Store OTP in localStorage (⚠️ Ideally, store this securely in a backend DB)
  window.localStorage.setItem("phoneOTP", otp);
  window.localStorage.setItem("phoneNumber", phoneNumber);
  console.log("Your Phone OTP:", otp);
  return "OTP sent to your phone!";
};

// Verify phone OTP
export const verifyPhoneOTP = async (userOTP: string) => {
  const storedOTP = window.localStorage.getItem("phoneOTP");
  const storedPhone = window.localStorage.getItem("phoneNumber");

  if (!storedOTP || !storedPhone) {
    return "No OTP request found. Please request a new OTP.";
  }

  if (storedOTP !== userOTP) {
    return "Invalid OTP. Please try again.";
  }

  // Clear stored OTP after successful verification
  window.localStorage.removeItem("phoneOTP");
  window.localStorage.removeItem("phoneNumber");

  console.log("Phone OTP Verified Successfully!");
  return "Phone Verified!";
};

export const sendEmailOTP = async (email: string) => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  window.localStorage.setItem("emailOTP", otp);
  window.localStorage.setItem("emailForOTP", email);
  console.log("Your Email OTP:", otp);
  return "OTP sent to your email!";
};

// Verify Email OTP
export const verifyEmailOTP = async (email: string, userOTP: string) => {
  const storedOTP = window.localStorage.getItem("emailOTP");
  const storedEmail = window.localStorage.getItem("emailForOTP");
  if (storedEmail !== email || storedOTP !== userOTP) {
    return "Invalid OTP. Please try again.";
  }
  console.log("Email OTP Verified Successfully!");
  // Clear stored OTP
  window.localStorage.removeItem("emailOTP");
  window.localStorage.removeItem("emailForOTP");

  return "Email Verified!";
};
