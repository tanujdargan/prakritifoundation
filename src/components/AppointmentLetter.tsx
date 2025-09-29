import React, { useState, useRef } from 'react';
import { Download, FileText, X, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface AppointmentLetterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AppointmentData {
  memberName: string;
  memberId: string;
  position: string;
  appointmentDate: string;
  terms: string;
  issuedBy: string;
  letterNo: string;
  qrCodeData: string;
}

const AppointmentLetter: React.FC<AppointmentLetterProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<AppointmentData>({
    memberName: '',
    memberId: '',
    position: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    terms: '',
    issuedBy: 'CompassionCare Admin',
    letterNo: '',
    qrCodeData: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const letterRef = useRef<HTMLDivElement>(null);

  const positions = [
    'Volunteer Coordinator',
    'Animal Care Specialist',
    'Rescue Team Leader',
    'Medical Assistant',
    'Adoption Coordinator',
    'Community Outreach Manager',
    'Fundraising Coordinator',
    'Social Media Manager',
    'Administrative Assistant',
    'Field Supervisor'
  ];

  const generateLetterNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_letters')
        .select('letter_no')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastLetterNo = data[0].letter_no;
        const lastNumber = parseInt(lastLetterNo.replace('CC-AL-', ''));
        nextNumber = lastNumber + 1;
      }

      return `CC-AL-${nextNumber.toString().padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating letter number:', error);
      return `CC-AL-${Date.now().toString().slice(-6)}`;
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
      const letterNo = await generateLetterNumber();
      const qrData = JSON.stringify({
        letterNo,
        memberName: formData.memberName,
        memberId: formData.memberId,
        position: formData.position,
        appointmentDate: formData.appointmentDate,
        issueDate: new Date().toISOString()
      });

      const qrCodeDataURL = await generateQRCode(qrData);
      
      const updatedFormData = { 
        ...formData, 
        letterNo,
        qrCodeData: qrData
      };
      setFormData(updatedFormData);
      setQrCodeUrl(qrCodeDataURL);

      // Save to database
      const { error } = await supabase
        .from('appointment_letters')
        .insert({
          letter_no: letterNo,
          member_id: updatedFormData.memberId,
          position: updatedFormData.position,
          appointment_date: updatedFormData.appointmentDate,
          terms: updatedFormData.terms,
          qr_code_url: qrCodeDataURL,
          issued_by: updatedFormData.issuedBy,
          status: 'active'
        });

      if (error) throw error;

      setShowPreview(true);
    } catch (error) {
      console.error('Error generating appointment letter:', error);
      alert('Error generating appointment letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!letterRef.current) return;

    try {
      const canvas = await html2canvas(letterRef.current, {
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

      pdf.save(`appointment-letter-${formData.letterNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      memberName: '',
      memberId: '',
      position: '',
      appointmentDate: new Date().toISOString().split('T')[0],
      terms: '',
      issuedBy: 'CompassionCare Admin',
      letterNo: '',
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
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            Appointment Letter Generator
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
                  Member ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.memberId}
                  onChange={(e) => setFormData(prev => ({ ...prev, memberId: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CC-M-000001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <select
                  required
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Position</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issued By *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuedBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, issuedBy: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Issuing authority name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms and Conditions
              </label>
              <textarea
                rows={4}
                value={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter specific terms, responsibilities, and conditions for this appointment..."
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
                {isGenerating ? 'Generating...' : 'Generate Letter'}
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

            <div ref={letterRef} className="bg-white p-8 border border-gray-300 max-w-4xl mx-auto">
              {/* Letter Header */}
              <div className="text-center mb-8 border-b-2 border-blue-600 pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">CompassionCare</h1>
                    <p className="text-sm text-gray-600">Humanitarian NGO</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>123 Compassion Street, Animal Welfare District</p>
                  <p>Mumbai - 400001, Maharashtra, India</p>
                  <p>Phone: +91 9876543210 | Email: info@compassioncare.org</p>
                </div>
              </div>

              {/* Letter Details */}
              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">Letter No: <span className="font-semibold">{formData.letterNo}</span></p>
                  <p className="text-sm text-gray-600">Date: <span className="font-semibold">{new Date().toLocaleDateString('en-IN')}</span></p>
                </div>
                {qrCodeUrl && (
                  <div>
                    <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />
                  </div>
                )}
              </div>

              {/* Letter Title */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">APPOINTMENT LETTER</h2>
              </div>

              {/* Letter Body */}
              <div className="space-y-4 mb-8">
                <p className="text-gray-700">
                  <strong>To:</strong> {formData.memberName}
                </p>
                <p className="text-gray-700">
                  <strong>Member ID:</strong> {formData.memberId}
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  We are pleased to inform you that you have been appointed as <strong>{formData.position}</strong> 
                  at CompassionCare, effective from <strong>{new Date(formData.appointmentDate).toLocaleDateString('en-IN')}</strong>.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  This appointment is made in recognition of your dedication to our mission and your commitment 
                  to creating a more compassionate world. We believe that your skills and passion will contribute 
                  significantly to our organization's goals.
                </p>

                {formData.terms && (
                  <div>
                    <p className="text-gray-700 font-semibold mb-2">Terms and Conditions:</p>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {formData.terms}
                    </p>
                  </div>
                )}

                <p className="text-gray-700 leading-relaxed">
                  We look forward to your valuable contributions and wish you success in your new role.
                </p>
              </div>

              {/* Letter Footer */}
              <div className="flex justify-between items-end pt-8 border-t border-gray-300">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Issued by:</p>
                  <p className="text-gray-900 font-medium">{formData.issuedBy}</p>
                  <div className="mt-8 border-t border-gray-400 w-32">
                    <p className="text-xs text-gray-500 mt-1">Signature</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center mb-2">
                    <p className="text-xs text-gray-500">Official Seal</p>
                  </div>
                  <p className="text-xs text-gray-500">CompassionCare</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Another Letter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentLetter;