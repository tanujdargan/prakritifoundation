import React, { useState, useRef } from 'react';
import { Download, Receipt, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { numberToWords } from '../utils/numberToWords';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DonationReceiptProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReceiptData {
  receiptNo: string;
  date: string;
  paymentMethod: string;
  donatorName: string;
  amount: number;
  amountInWords: string;
  panNumber: string;
  aadharNumber: string;
  receivedBy: string;
}

const DonationReceipt: React.FC<DonationReceiptProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ReceiptData>({
    receiptNo: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    donatorName: '',
    amount: 0,
    amountInWords: '',
    panNumber: '',
    aadharNumber: '',
    receivedBy: 'Prakriti Foundation Admin'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const generateReceiptNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('donation_receipts')
        .select('receipt_no')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastReceiptNo = data[0].receipt_no;
        const lastNumber = parseInt(lastReceiptNo.replace('CC-', ''));
        nextNumber = lastNumber + 1;
      }

      return `CC-${nextNumber.toString().padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating receipt number:', error);
      return `CC-${Date.now().toString().slice(-6)}`;
    }
  };

  const handleAmountChange = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      amount,
      amountInWords: numberToWords(amount)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const receiptNo = await generateReceiptNumber();
      const updatedFormData = { ...formData, receiptNo };
      setFormData(updatedFormData);

      // Save to database
      const { error } = await supabase
        .from('donation_receipts')
        .insert({
          receipt_no: receiptNo,
          date: updatedFormData.date,
          payment_method: updatedFormData.paymentMethod,
          donator_name: updatedFormData.donatorName,
          amount: updatedFormData.amount,
          amount_in_words: updatedFormData.amountInWords,
          pan_number: updatedFormData.panNumber || null,
          aadhar_number: updatedFormData.aadharNumber || null,
          received_by: updatedFormData.receivedBy
        });

      if (error) throw error;

      setShowPreview(true);
    } catch (error) {
      console.error('Error saving receipt:', error);
      alert('Error generating receipt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`donation-receipt-${formData.receiptNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Receipt className="h-6 w-6 mr-2 text-blue-600" />
            Donation Receipt Generator
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!showPreview ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donator's Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.donatorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, donatorName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter donator's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.amount || ''}
                  onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  required
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Number
                </label>
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ABCDE1234F"
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  value={formData.aadharNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, aadharNumber: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234 5678 9012"
                  pattern="[0-9]{4}\s[0-9]{4}\s[0-9]{4}"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Received By *
                </label>
                <input
                  type="text"
                  required
                  value={formData.receivedBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, receivedBy: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Staff member name"
                />
              </div>
            </div>

            {formData.amount > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount in Words
                </label>
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                  {formData.amountInWords}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Receipt'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="flex justify-end mb-4 space-x-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit Details
              </button>
              <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>

            <div ref={receiptRef} className="bg-white p-8 border border-gray-300">
              {/* Receipt Header */}
              <div className="text-center mb-8 border-b-2 border-blue-600 pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Receipt className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Prakriti Foundation</h1>
                    <p className="text-sm text-gray-600">Humanitarian NGO</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>123 Compassion Street, Animal Welfare District</p>
                  <p>Mumbai - 400001, Maharashtra, India</p>
                  <p>Phone: +91 9876543210 | Email: info@Prakriti Foundation.org</p>
                </div>
              </div>

              {/* Receipt Title */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">DONATION RECEIPT</h2>
                <p className="text-sm text-gray-600">Receipt No: {formData.receiptNo}</p>
              </div>

              {/* Receipt Details */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date:</label>
                    <p className="text-gray-900">{new Date(formData.date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Donator's Name:</label>
                    <p className="text-gray-900 font-medium">{formData.donatorName}</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Payment Method:</label>
                    <p className="text-gray-900">{formData.paymentMethod}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Amount:</label>
                    <p className="text-2xl font-bold text-green-600">₹{formData.amount.toLocaleString('en-IN')}</p>
                  </div>
                  {formData.panNumber && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">PAN Number:</label>
                      <p className="text-gray-900">{formData.panNumber}</p>
                    </div>
                  )}
                  {formData.aadharNumber && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Aadhar Number:</label>
                      <p className="text-gray-900">{formData.aadharNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount in Words */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount in Words:</label>
                <p className="text-gray-900 font-medium">{formData.amountInWords}</p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end pt-8 border-t border-gray-300">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Received by:</p>
                  <p className="text-gray-900 font-medium">{formData.receivedBy}</p>
                  <div className="mt-8 border-t border-gray-400 w-32">
                    <p className="text-xs text-gray-500 mt-1">Signature</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center mb-2">
                    <p className="text-xs text-gray-500">Official Seal</p>
                  </div>
                  <p className="text-xs text-gray-500">Prakriti Foundation</p>
                </div>
              </div>

              {/* Thank You Note */}
              <div className="mt-8 text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Thank you for your generous donation! Your contribution helps us continue our mission 
                  of rescuing and caring for animals in need.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationReceipt;