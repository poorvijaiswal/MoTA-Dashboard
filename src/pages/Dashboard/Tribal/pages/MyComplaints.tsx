import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { FiFileText, FiCalendar, FiAlertCircle, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";

interface Complaint {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const MyComplaints = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const loadComplaints = async () => {
      const response = await fetch('/dataTribal/complaints.json');
      const staticData = await response.json();
      
      const localData = JSON.parse(localStorage.getItem('complaints') || '{"complaints": []}');
      
      const allComplaints = [...staticData.complaints, ...localData.complaints]
        .filter(c => c.user_id === 'user_001')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
      setComplaints(allComplaints);
    };

    loadComplaints();
  }, []);

  const handleDeleteComplaint = (complaintId: string) => {
    setComplaints(prev => prev.filter(c => c.id !== complaintId));
    
    // Also remove from localStorage if it exists there
    const localData = JSON.parse(localStorage.getItem('complaints') || '{"complaints": []}');
    localData.complaints = localData.complaints.filter((c: Complaint) => c.id !== complaintId);
    localStorage.setItem('complaints', JSON.stringify(localData));
    
    toast({
      title: "Complaint Deleted",
      description: "Your complaint has been successfully deleted.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <FiCheckCircle className="w-4 h-4 text-success" />;
      case 'In Progress':
        return <FiAlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <FiCalendar className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-3 py-4">
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <FiFileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">My Complaints</h1>
              <p className="text-sm text-muted-foreground">Track your filed complaints</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {complaint.id}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {complaint.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{complaint.title}</h3>
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                      {complaint.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(complaint.status)}
                    <Badge 
                      variant={
                        complaint.status === 'Resolved' ? 'default' :
                        complaint.status === 'In Progress' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {complaint.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="w-3 h-3" />
                      <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiAlertCircle className="w-3 h-3" />
                      <span>{complaint.priority}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/dashboard/tribal/complaints/${complaint.id}`)}
                      className="text-xs px-2 py-1 h-7"
                    >
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteComplaint(complaint.id)}
                      className="text-xs px-2 py-1 h-7 text-destructive hover:text-destructive"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {complaints.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <FiFileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Complaints Filed</h3>
                <p className="text-sm text-muted-foreground mb-4">You haven't filed any complaints yet.</p>
                <Button onClick={() => navigate('/dashboard/tribal/complaints/new')}>
                  File Your First Complaint
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;