const ones = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const tens = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

const scales = ['', 'thousand', 'lakh', 'crore'];

function convertHundreds(num: number): string {
  let result = '';
  
  if (num > 99) {
    result += ones[Math.floor(num / 100)] + ' hundred ';
    num %= 100;
  }
  
  if (num > 19) {
    result += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  
  if (num > 0) {
    result += ones[num] + ' ';
  }
  
  return result;
}

export function numberToWords(amount: number): string {
  if (amount === 0) return 'zero rupees only';
  
  let rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  
  let result = '';
  
  if (rupees > 0) {
    // Handle crores
    if (rupees >= 10000000) {
      const crores = Math.floor(rupees / 10000000);
      result += convertHundreds(crores) + 'crore ';
      rupees %= 10000000;
    }
    
    // Handle lakhs
    if (rupees >= 100000) {
      const lakhs = Math.floor(rupees / 100000);
      result += convertHundreds(lakhs) + 'lakh ';
      rupees %= 100000;
    }
    
    // Handle thousands
    if (rupees >= 1000) {
      const thousands = Math.floor(rupees / 1000);
      result += convertHundreds(thousands) + 'thousand ';
      rupees %= 1000;
    }
    
    // Handle hundreds, tens, and ones
    if (rupees > 0) {
      result += convertHundreds(rupees);
    }
    
    result += 'rupees ';
  }
  
  if (paise > 0) {
    result += 'and ' + convertHundreds(paise) + 'paise ';
  }
  
  result += 'only';
  
  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1).trim();
}