import React, { useState, useRef } from 'react';
import { Download, CreditCard, X, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface MemberIDCardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MemberData {
  memberName: string;
  email: string;
  phone: string;
  address: string;
  membershipType: string;
  memberId: string;
  qrCodeData: string;
}

const MemberIDCard: React.FC<MemberIDCardProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<MemberData>({
    memberName: '',
    email: '',
    phone: '',
    address: '',
    membershipType: 'Regular',
    memberId: '',
    qrCodeData: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const membershipTypes = [
    'Regular',
    'Premium',
    'Lifetime',
    'Student',
    'Senior Citizen',
    'Corporate'
  ];

  const generateMemberID = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('member_id')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastMemberID = data[0].member_id;
        const lastNumber = parseInt(lastMemberID.replace('CC-M-', ''));
        nextNumber = lastNumber + 1;
      }

      return `CC-M-${nextNumber.toString().padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating member ID:', error);
      return `CC-M-${Date.now().toString().slice(-6)}`;
    }
  };

  const generateQRCode = async (data: string) => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const memberId = await generateMemberID();
      const qrData = JSON.stringify({
        memberId,
        name: formData.memberName,
        email: formData.email,
        membershipType: formData.membershipType,
        issueDate: new Date().toISOString()
      });

      const qrCodeDataURL = await generateQRCode(qrData);
      
      const updatedFormData = { 
        ...formData, 
        memberId,
        qrCodeData: qrData
      };
      setFormData(updatedFormData);
      setQrCodeUrl(qrCodeDataURL);

      // Save to database
      const { error } = await supabase
        .from('members')
        .insert({
          member_id: memberId,
          name: updatedFormData.memberName,
          email: updatedFormData.email,
          phone: updatedFormData.phone,
          address: updatedFormData.address,
          membership_type: updatedFormData.membershipType,
          qr_code_url: qrCodeDataURL,
          status: 'active',
          membership_fee_paid: false
        });

      if (error) throw error;

      setShowPreview(true);
    } catch (error) {
      console.error('Error generating member ID card:', error);
      alert('Error generating member ID card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', [85.6, 53.98]); // Credit card size
      
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
      pdf.save(`member-id-card-${formData.memberId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      memberName: '',
      email: '',
      phone: '',
      address: '',
      membershipType: 'Regular',
      memberId: '',
      qrCodeData: ''
    });
    setShowPreview(false);
    setQrCodeUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
            Member ID Card Generator
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
                  Member Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.memberName}
                  onChange={(e) => setFormData(prev => ({ ...prev, memberName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter member's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="member@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Type *
                </label>
                <select
                  required
                  value={formData.membershipType}
                  onChange={(e) => setFormData(prev => ({ ...prev, membershipType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {membershipTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter complete address"
              />
            </div>

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
                {isGenerating ? 'Generating...' : 'Generate ID Card'}
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

            {/* ID Card Design */}
            <div className="flex justify-center">
              <div 
                ref={cardRef} 
                className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-2xl"
                style={{ width: '340px', height: '215px' }}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Prakriti Foundation</h3>
                      <p className="text-xs opacity-90">Member ID Card</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-90">ID: {formData.memberId}</p>
                    <p className="text-xs opacity-90">{formData.membershipType}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-1">{formData.memberName}</h4>
                    <p className="text-xs opacity-90 mb-1">{formData.email}</p>
                    <p className="text-xs opacity-90 mb-1">{formData.phone}</p>
                    <p className="text-xs opacity-90">Valid: {new Date().getFullYear()}-{new Date().getFullYear() + 1}</p>
                  </div>
                  
                  {qrCodeUrl && (
                    <div className="ml-4">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-16 h-16 bg-white p-1 rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-2 border-t border-blue-400 text-center">
                  <p className="text-xs opacity-75">Authorized Member | Prakriti Foundation NGO</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Another Card
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberIDCard;