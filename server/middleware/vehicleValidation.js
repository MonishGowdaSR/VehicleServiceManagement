// Normalize vehicle number
export const normalizeVehicleNumber = (number) => {
  return number.replace(/\s+/g, "").toUpperCase();
};

// Validate Indian vehicle number
export const isValidIndianVehicleNumber = (number) => {
  const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
  return regex.test(number);
};