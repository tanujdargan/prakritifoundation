import React, { useState, useEffect } from 'react';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OrganizationAward {
  id: string;
  title: string;
  description: string;
  awarded_by: string;
  award_date: string;
  certificate_url: string | null;
  image_url: string | null;
}

const OrganizationAwards = () => {
  const [awards, setAwards] = useState<OrganizationAward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_awards')
        .select('*')
        .order('award_date', { ascending: false });

      if (error) {
        console.error('Error fetching awards:', error);
        // Don't throw error, just log it and continue with empty array
        setAwards([]);
        return;
      }
      setAwards(data || []);
    } catch (error) {
      console.error('Error fetching awards:', error);
      setAwards([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section id="awards" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Recognition & Awards
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are honored to be recognized for our dedication to animal welfare and humanitarian work. 
            These awards motivate us to continue our mission with even greater passion.
          </p>
        </div>

        {awards.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Awards Coming Soon</h3>
            <p className="text-gray-500">
              We're working hard to earn recognition for our humanitarian efforts. 
              Check back soon to see our achievements!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award) => (
              <div 
                key={award.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                {award.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={award.image_url}
                      alt={award.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Award className="h-6 w-6 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(award.award_date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {award.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {award.description}
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-3">
                      <strong>Awarded by:</strong> {award.awarded_by}
                    </p>
                    
                    {award.certificate_url && (
                      <a
                        href={award.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sample Awards for Demo */}
        {awards.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Excellence in Animal Welfare",
                description: "Recognized for outstanding dedication to animal rescue and rehabilitation services in the Mumbai region.",
                awardedBy: "Maharashtra Animal Welfare Board",
                date: "2024-01-15",
                image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                title: "Community Service Award",
                description: "Honored for exceptional community service and volunteer coordination in humanitarian activities.",
                awardedBy: "Mumbai Municipal Corporation",
                date: "2023-11-20",
                image: "https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                title: "NGO of the Year",
                description: "Selected as the most impactful NGO for animal welfare and community development initiatives.",
                awardedBy: "National NGO Council",
                date: "2023-08-10",
                image: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400"
              }
            ].map((award, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 opacity-75"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={award.image}
                    alt={award.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Award className="h-6 w-6 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(award.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {award.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {award.description}
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">
                      <strong>Awarded by:</strong> {award.awardedBy}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrganizationAwards;