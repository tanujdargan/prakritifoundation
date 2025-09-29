import React, { useState } from 'react';
import { Award, X, Send, User, Calendar, Clock, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VolunteerCertificateProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CertificateData {
  volunteerName: string;
  email: string;
  phone: string;
  volunteerType: string;
  hoursContributed: number;
  startDate: string;
  endDate: string;
  achievements: string;
  supervisorName: string;
  certificateType: string;
}

const VolunteerCertificate: React.FC<VolunteerCertificateProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CertificateData>({
    volunteerName: '',
    email: '',
    phone: '',
    volunteerType: 'Animal Care',
    hoursContributed: 0,
    startDate: '',
    endDate: '',
    achievements: '',
    supervisorName: 'Prakriti Foundation Admin',
    certificateType: 'Volunteer Appreciation'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const volunteerTypes = [
    'Animal Care',
    'Rescue Operations',
    'Medical Assistance',
    'Adoption Coordination',
    'Community Outreach',
    'Administrative Support',
    'Fundraising',
    'Social Media Management'
  ];

  const certificateTypes = [
    'Volunteer Appreciation',
    'Outstanding Service',
    'Long-term Commitment',
    'Special Recognition',
    'Leadership Excellence'
  ];

  const generateCertificateNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteer_certificates')
        .select('certificate_no')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastCertNo = data[0].certificate_no;
        const lastNumber = parseInt(lastCertNo.replace('VC-', ''));
        nextNumber = lastNumber + 1;
      }

      return `VC-${nextNumber.toString().padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating certificate number:', error);
      return `VC-${Date.now().toString().slice(-6)}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const certificateNo = await generateCertificateNumber();
      const certificateData = { ...formData, certificateNo };

      // Save to database
      const { error: dbError } = await supabase
        .from('volunteer_certificates')
        .insert({
          certificate_no: certificateNo,
          volunteer_name: certificateData.volunteerName,
          email: certificateData.email,
          phone: certificateData.phone,
          volunteer_type: certificateData.volunteerType,
          hours_contributed: certificateData.hoursContributed,
          start_date: certificateData.startDate,
          end_date: certificateData.endDate,
          achievements: certificateData.achievements,
          supervisor_name: certificateData.supervisorName,
          certificate_type: certificateData.certificateType,
          status: 'generated'
        });

      if (dbError) throw dbError;

      setCertificateGenerated(true);
      alert(`Certificate ${certificateNo} has been generated and saved! You can now generate the PDF from the admin dashboard.`);

    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      volunteerName: '',
      email: '',
      phone: '',
      volunteerType: 'Animal Care',
      hoursContributed: 0,
      startDate: '',
      endDate: '',
      achievements: '',
      supervisorName: 'Prakriti Foundation Admin',
      certificateType: 'Volunteer Appreciation'
    });
    setCertificateGenerated(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Award className="h-6 w-6 mr-2 text-blue-600" />
            Volunteer Certificate Generator
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!certificateGenerated ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Volunteer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.volunteerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, volunteerName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter volunteer's full name"
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
                  placeholder="volunteer@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volunteer Type *
                </label>
                <select
                  required
                  value={formData.volunteerType}
                  onChange={(e) => setFormData(prev => ({ ...prev, volunteerType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {volunteerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Hours Contributed *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.hoursContributed || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, hoursContributed: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Total hours volunteered"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Type *
                </label>
                <select
                  required
                  value={formData.certificateType}
                  onChange={(e) => setFormData(prev => ({ ...prev, certificateType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {certificateTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supervisor Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.supervisorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, supervisorName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Name of supervising staff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Achievements & Contributions
              </label>
              <textarea
                rows={4}
                value={formData.achievements}
                onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe the volunteer's key achievements, contributions, and impact..."
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Certificate Generation</h3>
              <p className="text-sm text-blue-700">
                This will save the certificate information to the database. 
                You can then generate and download the PDF certificate from the admin dashboard.
              </p>
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 mr-2" />
                    Save Certificate Data
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificate Generated Successfully!</h3>
            <p className="text-gray-600 mb-6">
              The volunteer certificate has been generated and sent via Certopus to the provided email address.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Another Certificate
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerCertificate;