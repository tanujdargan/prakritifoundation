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

  phone: '+91 91366 92937',
  phoneE164: '919136692937',
  email: 'director@prakritifoundation.info',
  website: 'www.prakritifoundation.info',

  instagram: 'https://www.instagram.com/prakritifoundation_',

  // Donations. The QR image lives at /media/upi-qr.png.
  upiId: 'prakritifoundation.82082332@hdfcbank',

  // For cheques and bank transfers. Deliberately excludes the account
  // holder's personal mobile, personal email and home address, which appear
  // on the cheque book but are not needed to pay and should not be published.
  bank: {
    accountName: 'Prakriti Foundation',
    bankName: 'HDFC Bank',
    accountNumber: '50200115061294',
    ifsc: 'HDFC0004506',
    branch: 'Palasia Main Road, Indore - 452001',
  },

  pan: 'AAQCP1436Q',
  urn80G: 'AAQCP1436QF20251',
} as const;
