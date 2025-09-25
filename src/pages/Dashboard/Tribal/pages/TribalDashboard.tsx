import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { FiFileText, FiUser, FiCreditCard, FiMapPin, FiMessageCircle, FiUsers, FiTrendingUp, FiClock, FiGlobe } from 'react-icons/fi';

interface UserData {
  id: string;
  name: string;
  tribe: string;
  village: string;
  district: string;
  state: string;
  phone: string;
  active_complaints: number;
  eligible_schemes: number;
  linked_land_parcels: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [complaints, setComplaints] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [language, setLanguage] = useState('english');

  const translations = {
    english: {
      welcome: 'Welcome back',
      activeComplaints: 'Active Complaints',
      eligibleSchemes: 'Eligible Schemes', 
      linkedLand: 'Linked Land Parcels',
      fileComplaint: 'File Complaint',
      myComplaints: 'My Complaints',
      applySchemes: 'Apply for Schemes',
      mySchemes: 'My Schemes',
      myLand: 'My Land & Claims',
      whatsappBot: 'WhatsApp Bot',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions'
    },
    hindi: {
      welcome: 'वापसी पर स्वागत है',
      activeComplaints: 'सक्रिय शिकायतें',
      eligibleSchemes: 'योग्य योजनाएं',
      linkedLand: 'जुड़े भूमि पार्सल',
      fileComplaint: 'शिकायत दर्ज करें',
      myComplaints: 'मेरी शिकायतें',
      applySchemes: 'योजनाओं के लिए आवेदन',
      mySchemes: 'मेरी योजनाएं',
      myLand: 'मेरी भूमि और दावे',
      whatsappBot: 'व्हाट्सऐप बॉट',
      recentActivity: 'हालिया गतिविधि',
      quickActions: 'त्वरित कार्य'
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Load user data
    fetch('/dataTribal/holders.json')
      .then(res => res.json())
      .then(data => {
        const user = data.users.find((u: any) => u.id === 'user_001');
        setUserData(user);
      });

    // Load complaints
    fetch('/dataTribal/complaints.json')
      .then(res => res.json())
      .then(data => {
        setComplaints(data.complaints.filter(c => c.user_id === 'user_001'));
      });

    // Load schemes
    fetch('/dataTribal/schemes.json')
      .then(res => res.json())
      .then(data => {
        setSchemes(data.schemes);
      });
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-3 py-4">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
            className="flex items-center space-x-2"
          >
            <FiGlobe className="w-4 h-4" />
            <span>{language === 'english' ? 'हिं' : 'EN'}</span>
          </Button>
        </div>

        {/* User Profile Header */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <FiUser className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t.welcome}, {userData.name}!</h1>
              <p className="text-sm text-muted-foreground">{userData.tribe} • {userData.village}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="p-3">
            <CardContent className="p-0">
              <div className="text-center">
                <div className="bg-primary/10 p-2 rounded-full w-fit mx-auto mb-2">
                  <FiFileText className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{complaints.length}</h3>
                <p className="text-xs text-muted-foreground">{t.activeComplaints}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardContent className="p-0">
              <div className="text-center">
                <div className="bg-success/10 p-2 rounded-full w-fit mx-auto mb-2">
                  <FiCreditCard className="w-4 h-4 text-success" />
                </div>
                <h3 className="text-lg font-bold text-foreground">3</h3>
                <p className="text-xs text-muted-foreground">{t.eligibleSchemes}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardContent className="p-0">
              <div className="text-center">
                <div className="bg-warning/10 p-2 rounded-full w-fit mx-auto mb-2">
                  <FiMapPin className="w-4 h-4 text-warning" />
                </div>
                <h3 className="text-lg font-bold text-foreground">1</h3>
                <p className="text-xs text-muted-foreground">{t.linkedLand}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground mb-3">{t.quickActions}</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => navigate('/dashboard/tribal/complaints/new')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 h-auto flex-col space-y-1"
            >
              <FiFileText className="w-5 h-5" />
              <span className="text-xs font-medium">{t.fileComplaint}</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard/tribal/complaints')}
              className="p-4 h-auto flex-col space-y-1"
            >
              <FiFileText className="w-5 h-5" />
              <span className="text-xs font-medium">{t.myComplaints}</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard/tribal/schemes')}
              className="p-4 h-auto flex-col space-y-1"
            >
              <FiCreditCard className="w-5 h-5" />
              <span className="text-xs font-medium">{t.applySchemes}</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard/tribal/my-schemes')}
              className="p-4 h-auto flex-col space-y-1"
            >
              <FiTrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium">{t.mySchemes}</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard/tribal/land')}
              className="p-4 h-auto flex-col space-y-1"
            >
              <FiMapPin className="w-5 h-5" />
              <span className="text-xs font-medium">{t.myLand}</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard/tribal/bot')}
              className="p-4 h-auto flex-col space-y-1"
            >
              <FiMessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">{t.whatsappBot}</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">{t.recentActivity}</h2>
          <div className="space-y-2">
            {complaints.slice(0, 2).map((complaint) => (
              <Card key={complaint.id} className="border-l-4 border-l-primary">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {complaint.category}
                        </Badge>
                        <Badge 
                          variant={complaint.status === 'Resolved' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {complaint.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-foreground text-sm">{complaint.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Filed on {new Date(complaint.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <FiClock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}

            {complaints.length === 0 && (
              <Card>
                <CardContent className="p-4 text-center">
                  <FiTrendingUp className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent activity to show</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;