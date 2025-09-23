import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TreePine, Shield, Users, FileText } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <TreePine className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">VanSampada</h1>
                <p className="text-sm text-muted-foreground">Forest Rights Management Portal</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/state')}
              className="bg-primary hover:bg-primary-hover"
            >
              Officer Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold gov-heading mb-6">
            State Tribal & Forest Department
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-4">
            Government of India
          </h2>
          <p className="text-xl gov-text mb-8 max-w-2xl mx-auto">
            Digital platform for managing Forest Rights Act implementation, 
            tribal welfare schemes, and community forest resource management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard/state')}
              className="bg-primary hover:bg-primary-hover"
            >
              <Shield className="h-5 w-5 mr-2" />
              Officer Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <FileText className="h-5 w-5 mr-2" />
              Submit Complaint
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="gov-card p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold gov-heading mb-2">Scheme Management</h3>
              <p className="gov-subtext">
                Digital tracking and management of tribal welfare schemes and forest rights programs.
              </p>
            </div>

            <div className="gov-card p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold gov-heading mb-2">Beneficiary Tracking</h3>
              <p className="gov-subtext">
                Comprehensive database of patta holders and tribal community beneficiaries.
              </p>
            </div>

            <div className="gov-card p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold gov-heading mb-2">Complaint Redressal</h3>
              <p className="gov-subtext">
                Transparent complaint management system for forest rights and tribal affairs.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              © 2024 Ministry of Tribal Affairs & Forest Department, Government of India
            </p>
            <p className="text-sm">
              Implementing Forest Rights Act 2006 for tribal communities across India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
