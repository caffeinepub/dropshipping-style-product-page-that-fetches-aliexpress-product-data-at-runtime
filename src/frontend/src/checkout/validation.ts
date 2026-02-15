export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export function validateCheckoutForm(data: CheckoutFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters';
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City is required';
  }

  if (!data.postalCode || data.postalCode.trim().length < 3) {
    errors.postalCode = 'Postal code is required';
  }

  if (!data.country || data.country.trim().length < 2) {
    errors.country = 'Country is required';
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
