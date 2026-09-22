import React, { useState, useRef } from 'react';
import { Download, Receipt, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ORG } from '../lib/organization';
import { numberToWords } from '../utils/numberToWords';
import { formatDateIN, todayLocalISO } from '../utils/date';
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
  donorAddress: string;
  amount: number;
  amountInWords: string;
  panNumber: string;
  aadharNumber: string;
  transactionId: string;
  receivedBy: string;
}

const DonationReceipt: React.FC<DonationReceiptProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ReceiptData>({
    receiptNo: '',
    date: todayLocalISO(),
    paymentMethod: 'UPI',
    donatorName: '',
    donorAddress: '',
    amount: 0,
    amountInWords: '',
    panNumber: '',
    aadharNumber: '',
    transactionId: '',
    receivedBy: 'Prakriti Foundation Admin'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);


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
      // Goes through a SECURITY DEFINER function rather than a table insert.
      // A donor is anonymous, and anonymous callers deliberately have no access
      // to donation_receipts at all - they must not be able to read other
      // people's names, PAN numbers or amounts. The function creates the row and
      // returns only the new receipt number, taken from a sequence so two people
      // submitting at once cannot collide.
      //
      // donorAddress and transactionId are display-only until a migration adds
      // matching columns; they are not sent.
      const { data, error } = await supabase.rpc('create_donation_receipt', {
        p_date: formData.date,
        p_payment_method: formData.paymentMethod,
        p_donator_name: formData.donatorName,
        p_amount: formData.amount,
        p_amount_in_words: formData.amountInWords,
        p_received_by: formData.receivedBy,
        p_pan_number: formData.panNumber || null,
        p_aadhar_number: formData.aadharNumber || null
      });

      if (error) throw error;
      if (!data) throw new Error('No receipt number was returned.');

      setFormData(prev => ({ ...prev, receiptNo: data as string }));
      setShowPreview(true);
    } catch (error) {
      console.error('Error saving receipt:', error);
      alert(
        'Sorry, the receipt could not be generated. Please try again, or contact us and we will issue it manually.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donor's Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.donorAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, donorAddress: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter donor's full address"
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
                  Transaction / Cheque / UTR Number
                </label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter transaction / cheque / UTR number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Number *
                </label>
                <input
                  type="text"
                  required
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

            <div className="overflow-x-auto">
              <div
                ref={receiptRef}
                className="bg-white border border-gray-300 mx-auto"
                style={{ width: '800px', padding: '32px' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b-4 border-green-700 pb-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Receipt className="h-7 w-7 text-green-700" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-green-800 tracking-wide leading-tight">PRAKRITI FOUNDATION</h1>
                      <p className="text-xs text-green-700 italic">For a kinder world</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-700 leading-relaxed">
                    <p>{ORG.address.line1}</p>
                    <p>{ORG.address.line2}</p>
                    <p>{ORG.address.line3}</p>
                    <p>Phone: {ORG.phone}</p>
                    <p>Email: {ORG.email}</p>
                    <p>Website: {ORG.website}</p>
                  </div>
                </div>

                {/* Title band */}
                <div className="bg-green-700 text-white text-center py-2 mb-4">
                  <h2 className="text-lg font-bold tracking-widest">DONATION RECEIPT</h2>
                </div>

                {/* Receipt No. and Date */}
                <div className="flex justify-between text-sm mb-4">
                  <p><span className="font-semibold text-gray-700">Receipt No.:</span> <span className="text-gray-900">{formData.receiptNo}</span></p>
                  <p><span className="font-semibold text-gray-700">Date:</span> <span className="text-gray-900">{formatDateIN(formData.date)}</span></p>
                </div>

                {/* Received with thanks from */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-green-800 border-b border-green-200 pb-1 mb-2">Received with thanks from</p>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-2 font-medium text-gray-700 w-1/3 align-top">Name of Donor</td>
                        <td className="py-1 text-gray-900">{formData.donatorName}</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 font-medium text-gray-700 align-top">Address</td>
                        <td className="py-1 text-gray-900 whitespace-pre-line">{formData.donorAddress}</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 font-medium text-gray-700 align-top">PAN</td>
                        <td className="py-1 text-gray-900">{formData.panNumber}</td>
                      </tr>
                      {formData.aadharNumber && (
                        <tr>
                          <td className="py-1 pr-2 font-medium text-gray-700 align-top">Aadhaar No.</td>
                          <td className="py-1 text-gray-900">{formData.aadharNumber}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Donation details */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-green-800 border-b border-green-200 pb-1 mb-2">Donation Details</p>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-2 font-medium text-gray-700 w-1/3 align-top">Amount Received (₹, in figures)</td>
                        <td className="py-1 text-gray-900 font-bold">₹{formData.amount.toLocaleString('en-IN')}/-</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 font-medium text-gray-700 align-top">Amount in Words</td>
                        <td className="py-1 text-gray-900">{formData.amountInWords}</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 font-medium text-gray-700 align-top">Mode of Payment</td>
                        <td className="py-1 text-gray-900">{formData.paymentMethod}</td>
                      </tr>
                      {formData.transactionId && (
                        <tr>
                          <td className="py-1 pr-2 font-medium text-gray-700 align-top">Transaction / Cheque / UTR No.</td>
                          <td className="py-1 text-gray-900">{formData.transactionId}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-1 pr-2 font-medium text-gray-700 align-top">Date of Transaction</td>
                        <td className="py-1 text-gray-900">{formatDateIN(formData.date)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Purpose of donation */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-green-800 border-b border-green-200 pb-1 mb-2">Purpose of Donation</p>
                  <p className="text-sm text-gray-900">For the charitable and animal welfare activities of PRAKRITI FOUNDATION.</p>
                </div>

                {/* 80G Tax Exemption Details */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-green-800 mb-2">80G Tax Exemption Details</p>
                  <p className="text-xs text-gray-700 mb-2">
                    This donation is eligible for deduction under Section 80G of the Income Tax Act, 1961, subject to the
                    applicable provisions of the Income Tax Act and fulfilment of the conditions prescribed thereunder.
                  </p>
                  <table className="w-full text-sm border border-gray-400">
                    <tbody>
                      <tr className="border-b border-gray-400">
                        <td className="py-2 px-3 font-medium text-gray-700 border-r border-gray-400 w-1/2">Name of Institution</td>
                        <td className="py-2 px-3 text-gray-900">PRAKRITI FOUNDATION</td>
                      </tr>
                      <tr className="border-b border-gray-400">
                        <td className="py-2 px-3 font-medium text-gray-700 border-r border-gray-400">PAN</td>
                        <td className="py-2 px-3 text-gray-900">{ORG.pan}</td>
                      </tr>
                      <tr className="border-b border-gray-400">
                        <td className="py-2 px-3 font-medium text-gray-700 border-r border-gray-400">80G Unique Registration Number (URN)</td>
                        <td className="py-2 px-3 text-gray-900">{ORG.urn80G}</td>
                      </tr>
                      <tr className="border-b border-gray-400">
                        <td className="py-2 px-3 font-medium text-gray-700 border-r border-gray-400">Nature of Approval</td>
                        <td className="py-2 px-3 text-gray-900">Provisional approval under Section 80G</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-700 border-r border-gray-400">Validity</td>
                        <td className="py-2 px-3 text-gray-900">Assessment Year 2026–27 to Assessment Year 2028–29</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Thank you note */}
                <div className="mb-6">
                  <p className="text-sm text-gray-900">
                    We sincerely thank you for your generous contribution towards our charitable activities and animal
                    welfare initiatives.
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end pt-6 border-t border-gray-400 mb-4">
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900 mb-8">For PRAKRITI FOUNDATION</p>
                    <div className="border-t border-gray-500 w-56 pt-1">
                      <p className="text-xs text-gray-700">Authorized Signatory</p>
                      <p className="text-xs text-gray-700 mt-1">Name: ____________________</p>
                      <p className="text-xs text-gray-700 mt-1">Designation: ____________________</p>
                    </div>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="w-28 h-20 border border-gray-400 flex items-center justify-center mb-1">
                      <p className="text-xs text-gray-500">Official Seal</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="text-[10px] text-gray-600 leading-relaxed border-t border-gray-300 pt-2">
                  <p>Note: Please retain this receipt for your records. Tax deduction, if any, is subject to the applicable provisions of the Income Tax Act, 1961.</p>
                  <p>Donations made in cash exceeding ₹2,000 are not eligible for deduction under Section 80G.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationReceipt;
