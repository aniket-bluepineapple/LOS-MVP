export const validateFile = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, PNG, and JPEG files are allowed.";
    }
    if (file.size > maxSize) {
      return "File size must be less than 1MB.";
    }
    return "";
};