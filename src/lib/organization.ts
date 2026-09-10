// Single source of truth for the foundation's public details.
// These were previously duplicated across the receipt, certificate, ID card,
// appointment letter and contact section, and had drifted apart.
export const ORG = {
  name: 'Prakriti Foundation',
  legalName: 'PRAKRITI FOUNDATION',
  tagline: 'For a kinder world',

  address: {
    line1: 'Plot No. 52-A, Sheetal Nagar,',
    line2: 'Near Bombay Hospital, Vijay Nagar,',
    line3: 'Indore, Madhya Pradesh - 452010',
  },
  addressOneLine:
    'Plot No. 52-A, Sheetal Nagar, Near Bombay Hospital, Vijay Nagar, Indore, Madhya Pradesh - 452010',

  // TODO: real number still pending from the client — it was masked as
  // "+91 989xxxxxxx" in the reference receipt. Change it here and it updates
  // everywhere it is shown.
  phone: '+91 9876543210',
  email: 'prakritifoundation@gmail.com',
  website: 'www.prakritifoundation.org',

  pan: 'AAQCP1436Q',
  urn80G: 'AAQCP1436QF20251',
} as const;
