import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import claimsData from '@/data/claims.json';
import holdersData from '@/data/holders.json';
import schemesData from '@/data/schemes.json';
import complaintsData from '@/data/complaints.json';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaUser, FaMapMarkerAlt, FaCheckCircle, FaClock, FaExclamationTriangle, FaPhone, FaUsers, FaRupeeSign, FaBriefcase, FaFilePdf, FaFileAlt } from 'react-icons/fa';
// useNavigate already imported above

const statusColors = {
  granted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Granted', icon: <FaCheckCircle className="w-4 h-4 text-green-500" /> },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: <FaClock className="w-4 h-4 text-yellow-500" /> },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected', icon: <FaExclamationTriangle className="w-4 h-4 text-red-500" /> },
};

const getTypeDescription = (type: string) => {
  switch (type) {
    case 'IFR': return 'Individual Forest Rights';
    case 'CFR': return 'Community Forest Resources';
    case 'CR': return 'Community Rights';
    default: return type;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const timelineStages = [
  { label: 'Claim Submitted', date: '2024-01-01', description: 'Claim application submitted by holder.' },
  { label: 'Verification', date: '2024-01-10', description: 'Documents and land details verified by officials.' },
  { label: 'Committee Review', date: '2024-01-20', description: 'Committee reviews claim and supporting documents.' },
  { label: 'Approval', date: '2024-02-01', description: 'Claim approved by authorities.' },
  { label: 'Patta granted', date: '2024-02-10', description: 'Patta issued to holder.' },
];

const staticDocuments = [
  { name: 'Aadhaar Card', link: '#' },
  { name: 'Caste Certificate', link: '#' },
  { name: 'Land Ownership Proof', link: '#' },
  { name: 'Application Form', link: '#' },
];

const PattaHolderProfilePage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  // Find claim
  const claim = claimsData.claims.find(c => c.id === claimId);
  // Find holder
  let holder = null;
  if (claim) {
    holder = holdersData.holders.find(h => h.claim_id === claim.id || h.name === claim.holder_name);
  }
  // Find schemes
  let schemes = [];
  if (holder && holder.schemes_linked) {
    schemes = holder.schemes_linked.map((schemeName) => schemesData.schemes.find(s => s.name === schemeName)).filter(Boolean);
  }
  // Find complaints
  let complaints = [];
  if (holder) {
    complaints = complaintsData.complaints.filter(c => c.user === holder.name);
  }
  // Fallback dummy data if not found
  let isDummy = false;
  let fallbackClaim = claim;
  let fallbackHolder = holder;
  if (!claim || !holder) {
    isDummy = true;
    fallbackClaim = claim || {
      id: claimId,
      holder_name: 'Demo Holder',
      type: 'IFR',
      status: 'pending',
      area: '2.5 acres',
      village: 'Demo Village',
      district: 'Demo District',
      state: 'Madhya Pradesh',
      coords: [78.771272, 22.308604],
      submission_date: '2024-01-01',
      approval_date: '',
      shape_file: {
        boundaries: [
          [78.771272, 22.308604],
          [78.771272, 22.309604],
          [78.772272, 22.309604],
          [78.772272, 22.308604],
          [78.771272, 22.308604]
        ],
        survey_number: 'DemoSurvey001',
        total_area_sqm: 10117,
        land_classification: 'Agricultural',
        soil_type: 'Black'
      },
      rejection_reason: ''
    };
    fallbackHolder = holder || {
      id: 'H000',
      name: fallbackClaim.holder_name,
      tribe: 'Demo Tribe',
      gender: 'Male',
      claim_id: fallbackClaim.id,
      family_members: 4,
      annual_income: 75000,
      land_size: '2.5 acres',
    //   contact: '+91-9999999999',
    //   occupation: 'Demo Occupation',
      schemes_linked: ['MGNREGA', 'PM-KISAN']
    };
  }
  const status = fallbackClaim ? (statusColors[fallbackClaim.status] || statusColors['pending']) : statusColors['pending'];
  return (
    <div className="min-h-[calc(100vh-32px)] bg-white py-4 px-0 flex justify-center items-center">
      <div className="w-full max-w-5xl mx-auto px-0">
        <button onClick={() => navigate(-1)} className="mb-4 text-blue-700 hover:underline font-semibold">← Back</button>
        <Card className="w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-0 overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 px-10 py-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-300">
                <FaUser className="w-10 h-10 text-blue-700" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl md:text-3xl font-bold text-blue-900">{fallbackHolder.name}</span>
                  {/* <Badge className={`${status.bg} ${status.text} ml-2 flex items-center space-x-1 text-base px-3 py-1`}>{status.icon}<span>{status.label}</span></Badge> */}
                </div>
                {/* <div className="text-slate-600 font-medium text-lg mt-1">{fallbackHolder.tribe} Tribe • {fallbackHolder.gender}</div> */}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-slate-700 text-sm md:text-base">
              {/* <div><span className="font-semibold">Land Size:</span> {fallbackHolder.land_size}</div> */}
            </div>
          </div>
          <CardContent className="px-10 py-8">
            {/* Claim Details Section */}
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-slate-700">Claim Details</h3>
                <div className="space-y-2 text-slate-800">
                  <div><span className="font-semibold">Claim ID:</span> {fallbackClaim.id}</div>
                  <div><span className="font-semibold">Claimant Name:</span> {fallbackClaim.holder_name}</div>
                  <div><span className="font-semibold">Type:</span> {fallbackClaim.type} <span className="text-xs text-slate-500">({getTypeDescription(fallbackClaim.type)})</span></div>
                  <div><span className="font-semibold">Status:</span> <Badge className={`${status.bg} ${status.text} ml-2 flex items-center space-x-1 text-base px-3 py-1`}>{status.icon}<span>{status.label}</span></Badge></div>
                  <div><span className="font-semibold">Area:</span> {fallbackClaim.area}</div>
                  <div><span className="font-semibold">Location:</span> {fallbackClaim.village}, {fallbackClaim.district}, {fallbackClaim.state}</div>
                  <div><span className="font-semibold">Submitted:</span> {fallbackClaim.submission_date}</div>
                </div>
              </div>
              {/* Timeline - vertical */}
              <div>
                <h3 className="font-semibold text-lg mb-2 text-slate-700">FRA Claim Process Timeline</h3>
                <div className="flex flex-col gap-0 w-full">
                  {timelineStages.map((stage, idx) => (
                    <div key={idx} className="flex items-start gap-4 mb-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full ${idx === timelineStages.length-1 ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center text-white font-bold`}>{idx+1}</div>
                        {idx < timelineStages.length-1 && <div className="w-1 h-10 bg-blue-200 mt-1" />}
                      </div>
                      <div>
                        <span className="font-medium text-slate-800 text-base">{stage.label}</span>
                        <span className="ml-2 text-xs text-slate-500">{stage.date}</span>
                        <div className="text-xs text-slate-600 mt-1">{stage.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Documents */}
            <div className="">
              <h3 className="font-semibold text-xl mb-4 text-slate-700">Submitted Documents</h3>
              <div className="flex flex-wrap gap-4">
                {staticDocuments.map((doc, idx) => (
                  <a key={idx} href={doc.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 hover:bg-blue-100 shadow-sm">
                    <FaFilePdf className="w-5 h-5 text-blue-700" />
                    <span className="font-semibold text-base">{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PattaHolderProfilePage;
