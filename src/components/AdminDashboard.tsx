import React, { useState, useRef, useEffect } from 'react';
import { Award, Download, User, Calendar, Clock, FileText, X, CreditCard, Users, Receipt, PawPrint, LogOut } from 'lucide-react';
import { Heart, Home } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ORG } from '../lib/organization';
import { formatDateIN } from '../utils/date';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import MemberIDCard from './MemberIDCard';
import AppointmentLetter from './AppointmentLetter';
import MemberManagement from './MemberManagement';
import DonationReceipt from './DonationReceipt';
import ContentManager from './ContentManager';
import AdminLogin from './AdminLogin';

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
  certificateNo: string;
}

const AdminDashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [showMemberIDForm, setShowMemberIDForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showDonationReceipt, setShowDonationReceipt] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
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
    certificateType: 'Volunteer Appreciation',
    certificateNo: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
      const updatedFormData = { ...formData, certificateNo };
      setFormData(updatedFormData);

      // Save to database
      const { error } = await supabase
        .from('volunteer_certificates')
        .insert({
          certificate_no: certificateNo,
          volunteer_name: updatedFormData.volunteerName,
          email: updatedFormData.email,
          phone: updatedFormData.phone,
          volunteer_type: updatedFormData.volunteerType,
          hours_contributed: updatedFormData.hoursContributed,
          start_date: updatedFormData.startDate,
          end_date: updatedFormData.endDate,
          achievements: updatedFormData.achievements,
          supervisor_name: updatedFormData.supervisorName,
          certificate_type: updatedFormData.certificateType,
          status: 'generated'
        });

      if (error) throw error;

      setShowPreview(true);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for certificate
      
      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`volunteer-certificate-${formData.certificateNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error downloading PDF. Please try again.');
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
      certificateType: 'Volunteer Appreciation',
      certificateNo: ''
    });
    setShowPreview(false);
    setShowCertificateForm(false);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-pf-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span
            className="h-8 w-8 rounded-full border-2 border-pf-border border-t-pf-forest animate-spin"
            aria-hidden="true"
          />
          <p className="text-sm text-pf-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-pf-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Logo */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-3 text-pf-forest transition-colors hover:text-pf-moss cursor-pointer"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pf-sage">
              <Heart className="h-6 w-6 text-pf-forest" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-2xl font-semibold leading-tight">{ORG.name}</span>
              <span className="flex items-center gap-1 text-sm text-pf-muted">
                <Home className="h-3 w-3" aria-hidden="true" />
                Back to Website
              </span>
            </span>
          </a>

          <div className="flex items-center gap-4">
            {session.user.email && (
              <span className="text-sm text-pf-muted">{session.user.email}</span>
            )}
            <span className="hidden h-6 w-px bg-pf-border sm:block" aria-hidden="true" />
            <button
              onClick={handleSignOut}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-md border border-pf-border px-4 text-sm font-medium text-pf-muted transition-colors hover:border-pf-moss hover:text-pf-forest"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-pf-border bg-white">
          {/* Navigation Tabs */}
          <div className="border-b border-pf-border">
            <nav className="flex gap-8 px-8 pt-6" aria-label="Admin sections">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`cursor-pointer border-b-2 pb-4 text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-pf-forest font-semibold text-pf-forest'
                    : 'border-transparent font-medium text-pf-muted hover:text-pf-forest'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`cursor-pointer border-b-2 pb-4 text-sm transition-colors ${
                  activeTab === 'members'
                    ? 'border-pf-forest font-semibold text-pf-forest'
                    : 'border-transparent font-medium text-pf-muted hover:text-pf-forest'
                }`}
              >
                Member Management
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`cursor-pointer border-b-2 pb-4 text-sm transition-colors ${
                  activeTab === 'content'
                    ? 'border-pf-forest font-semibold text-pf-forest'
                    : 'border-transparent font-medium text-pf-muted hover:text-pf-forest'
                }`}
              >
                Content
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'dashboard' && (
              <>
                <h2 className="text-3xl font-semibold text-pf-forest mb-8">Admin Dashboard</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="rounded-lg border border-pf-border bg-white p-6 transition-colors hover:border-pf-moss">
                    <Award className="h-10 w-10 text-pf-moss mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-pf-ink mb-2">Certificate Generator</h3>
                    <p className="text-sm text-pf-muted mb-4">Generate and download volunteer certificates</p>
                    <button
                      onClick={() => setShowCertificateForm(true)}
                      className="inline-flex h-11 cursor-pointer items-center rounded-md bg-pf-forest px-4 text-sm font-medium text-white transition-colors hover:bg-pf-moss"
                    >
                      Generate Certificate
                    </button>
                  </div>

                  <div className="rounded-lg border border-pf-border bg-white p-6 transition-colors hover:border-pf-moss">
                    <CreditCard className="h-10 w-10 text-pf-moss mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-pf-ink mb-2">Member ID Cards</h3>
                    <p className="text-sm text-pf-muted mb-4">Issue member ID cards with QR codes</p>
                    <button
                      onClick={() => setShowMemberIDForm(true)}
                      className="inline-flex h-11 cursor-pointer items-center rounded-md bg-pf-forest px-4 text-sm font-medium text-white transition-colors hover:bg-pf-moss"
                    >
                      Generate ID Card
                    </button>
                  </div>

                  <div className="rounded-lg border border-pf-border bg-white p-6 transition-colors hover:border-pf-moss">
                    <FileText className="h-10 w-10 text-pf-moss mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-pf-ink mb-2">Appointment Letters</h3>
                    <p className="text-sm text-pf-muted mb-4">Issue appointment letters with QR codes</p>
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="inline-flex h-11 cursor-pointer items-center rounded-md bg-pf-forest px-4 text-sm font-medium text-white transition-colors hover:bg-pf-moss"
                    >
                      Generate Letter
                    </button>
                  </div>

                  <div className="rounded-lg border border-pf-border bg-white p-6 transition-colors hover:border-pf-moss">
                    <Receipt className="h-10 w-10 text-pf-moss mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-pf-ink mb-2">Donation Receipts</h3>
                    <p className="text-sm text-pf-muted mb-4">Generate donation receipts for donors</p>
                    <button
                      onClick={() => setShowDonationReceipt(true)}
                      className="inline-flex h-11 cursor-pointer items-center rounded-md bg-pf-forest px-4 text-sm font-medium text-white transition-colors hover:bg-pf-moss"
                    >
                      Generate Receipt
                    </button>
                  </div>

                  <div className="rounded-lg border border-pf-border bg-white p-6 transition-colors hover:border-pf-moss">
                    <Users className="h-10 w-10 text-pf-moss mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-pf-ink mb-2">Member Management</h3>
                    <p className="text-sm text-pf-muted mb-4">Manage members, block/unblock accounts</p>
                    <button
                      onClick={() => setActiveTab('members')}
                      className="inline-flex h-11 cursor-pointer items-center rounded-md bg-pf-forest px-4 text-sm font-medium text-white transition-colors hover:bg-pf-moss"
                    >
                      Manage Members
                    </button>
                  </div>

                  <div className="rounded-lg border border-pf-border bg-white p-6 transition-colors hover:border-pf-moss">
                    <PawPrint className="h-10 w-10 text-pf-moss mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-pf-ink mb-2">Content Manager</h3>
                    <p className="text-sm text-pf-muted mb-4">Manage adoptable animals and success stories</p>
                    <button
                      onClick={() => setActiveTab('content')}
                      className="inline-flex h-11 cursor-pointer items-center rounded-md bg-pf-forest px-4 text-sm font-medium text-white transition-colors hover:bg-pf-moss"
                    >
                      Manage Content
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'members' && <MemberManagement />}
            {activeTab === 'content' && <ContentManager />}
          </div>
        </div>

        {/* Modals */}
        <MemberIDCard 
          isOpen={showMemberIDForm} 
          onClose={() => setShowMemberIDForm(false)} 
        />
        
        <AppointmentLetter 
          isOpen={showAppointmentForm} 
          onClose={() => setShowAppointmentForm(false)} 
        />
        
        <DonationReceipt 
          isOpen={showDonationReceipt} 
          onClose={() => setShowDonationReceipt(false)} 
        />

          {showCertificateForm && (
            <div className="fixed inset-0 bg-pf-ink/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg border border-pf-border max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-pf-border">
                  <h2 className="text-2xl font-semibold text-pf-forest flex items-center">
                    <Award className="h-6 w-6 mr-2 text-pf-moss" aria-hidden="true" />
                    Certificate Generator
                  </h2>
                  <button
                    onClick={resetForm}
                    aria-label="Close certificate generator"
                    className="cursor-pointer text-pf-muted hover:text-pf-forest transition-colors"
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {!showPreview ? (
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="volunteerName" className="block text-sm font-medium text-pf-ink mb-2 flex items-center">
                          <User className="h-4 w-4 inline mr-1" aria-hidden="true" />
                          Volunteer Name *
                        </label>
                        <input
                          id="volunteerName"
                          type="text"
                          required
                          value={formData.volunteerName}
                          onChange={(e) => setFormData(prev => ({ ...prev, volunteerName: e.target.value }))}
                          className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                          placeholder="Enter volunteer's full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="volunteerEmail" className="block text-sm font-medium text-pf-ink mb-2">
                          Email Address *
                        </label>
                        <input
                          id="volunteerEmail"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                          placeholder="volunteer@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="volunteerPhone" className="block text-sm font-medium text-pf-ink mb-2">
                          Phone Number
                        </label>
                        <input
                          id="volunteerPhone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div>
                        <label htmlFor="volunteerType" className="block text-sm font-medium text-pf-ink mb-2">
                          Volunteer Type *
                        </label>
                        <select
                          id="volunteerType"
                          required
                          value={formData.volunteerType}
                          onChange={(e) => setFormData(prev => ({ ...prev, volunteerType: e.target.value }))}
                          className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                        >
                          {volunteerTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="hoursContributed" className="block text-sm font-medium text-pf-ink mb-2 flex items-center">
                          <Clock className="h-4 w-4 inline mr-1" aria-hidden="true" />
                          Hours Contributed *
                        </label>
                        <input
                          id="hoursContributed"
                          type="number"
                          required
                          min="1"
                          value={formData.hoursContributed || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, hoursContributed: parseInt(e.target.value) || 0 }))}
                          className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                          placeholder="Total hours volunteered"
                        />
                      </div>

                      <div>
                        <label htmlFor="certificateType" className="block text-sm font-medium text-pf-ink mb-2">
                          Certificate Type *
                        </label>
                        <select
                          id="certificateType"
                          required
                          value={formData.certificateType}
                          onChange={(e) => setFormData(prev => ({ ...prev, certificateType: e.target.value }))}
                          className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                        >
                          {certificateTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-pf-ink mb-2 flex items-center">
                          <Calendar className="h-4 w-4 inline mr-1" aria-hidden="true" />
                          Start Date *
                        </label>
                        <input
                          id="startDate"
                          type="date"
                          required
                          value={formData.startDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                        />
                      </div>

                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-pf-ink mb-2 flex items-center">
                          <Calendar className="h-4 w-4 inline mr-1" aria-hidden="true" />
                          End Date *
                        </label>
                        <input
                          id="endDate"
                          type="date"
                          required
                          value={formData.endDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                        />
                      </div>

                      <div>
                        <label htmlFor="supervisorName" className="block text-sm font-medium text-pf-ink mb-2">
                          Supervisor Name *
                        </label>
                        <input
                          id="supervisorName"
                          type="text"
                          required
                          value={formData.supervisorName}
                          onChange={(e) => setFormData(prev => ({ ...prev, supervisorName: e.target.value }))}
                          className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                          placeholder="Name of supervising staff"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="achievements" className="block text-sm font-medium text-pf-ink mb-2 flex items-center">
                        <FileText className="h-4 w-4 inline mr-1" aria-hidden="true" />
                        Achievements & Contributions
                      </label>
                      <textarea
                        id="achievements"
                        rows={4}
                        value={formData.achievements}
                        onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                        className="w-full px-4 py-2 border border-pf-border rounded-md text-pf-ink resize-none"
                        placeholder="Describe the volunteer's key achievements, contributions, and impact..."
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 h-11 border border-pf-border rounded-md text-pf-ink hover:bg-pf-sage/40 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isGenerating}
                        className="px-6 h-11 bg-pf-forest text-white rounded-md hover:bg-pf-moss transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isGenerating ? 'Generating...' : 'Generate Certificate'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-6">
                    <div className="flex justify-end mb-4 space-x-4">
                      <button
                        onClick={() => setShowPreview(false)}
                        className="px-4 h-11 border border-pf-border rounded-md text-pf-ink hover:bg-pf-sage/40 transition-colors cursor-pointer"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={downloadPDF}
                        className="px-4 h-11 bg-pf-marigold text-white rounded-md hover:bg-pf-marigold/90 transition-colors flex items-center cursor-pointer"
                      >
                        <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                        Download PDF
                      </button>
                    </div>

                    {/* Certificate Design */}
                    <div ref={certificateRef} className="bg-white p-12 border-8 border-blue-600" style={{ width: '1122px', height: '794px', margin: '0 auto' }}>
                      {/* Certificate Header */}
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-6">
                          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-6">
                            <Award className="h-12 w-12 text-blue-600" />
                          </div>
                          <div>
                            <h1 className="text-4xl font-bold text-blue-600 mb-2">{ORG.name}</h1>
                            <p className="text-lg text-gray-600">Humanitarian NGO</p>
                          </div>
                        </div>
                        <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto mb-6"></div>
                      </div>

                      {/* Certificate Title */}
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">CERTIFICATE OF {formData.certificateType.toUpperCase()}</h2>
                        <p className="text-lg text-gray-600">This is to certify that</p>
                      </div>

                      {/* Volunteer Name */}
                      <div className="text-center mb-8">
                        <h3 className="text-4xl font-bold text-blue-600 border-b-2 border-blue-300 pb-2 inline-block">
                          {formData.volunteerName}
                        </h3>
                      </div>

                      {/* Certificate Body */}
                      <div className="text-center mb-8 px-8">
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                          has successfully completed <strong>{formData.hoursContributed} hours</strong> of volunteer service 
                          in <strong>{formData.volunteerType}</strong> from{' '}
                          <strong>{formatDateIN(formData.startDate)}</strong> to{' '}
                          <strong>{formatDateIN(formData.endDate)}</strong>.
                        </p>
                        
                        {formData.achievements && (
                          <p className="text-base text-gray-600 italic mb-4">
                            "{formData.achievements}"
                          </p>
                        )}
                        
                        <p className="text-lg text-gray-700">
                          We appreciate their dedication and commitment to our mission of creating a more compassionate world.
                        </p>
                      </div>

                      {/* Certificate Footer */}
                      <div className="flex justify-between items-end mt-12">
                        <div className="text-center">
                          <div className="w-48 border-t-2 border-gray-400 mb-2"></div>
                          <p className="text-sm text-gray-600">Date of Issue</p>
                          <p className="font-semibold">{new Date().toLocaleDateString('en-IN')}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Certificate No.</p>
                          <p className="font-bold text-blue-600">{formData.certificateNo}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-48 border-t-2 border-gray-400 mb-2"></div>
                          <p className="text-sm text-gray-600">Authorized Signature</p>
                          <p className="font-semibold">{formData.supervisorName}</p>
                        </div>
                      </div>

                      {/* Organization Details */}
                      <div className="text-center mt-8 pt-4 border-t border-gray-300">
                        <p className="text-xs text-gray-500">
                          {ORG.name} | {ORG.addressOneLine} | {ORG.phone} | {ORG.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AdminDashboard;
