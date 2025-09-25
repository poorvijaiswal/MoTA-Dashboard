import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Paperclip, Clock, User, MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import Navigation from "../components/Navigation";

interface TimelineItem {
  date: string;
  status: string;
  note: string;
}

interface Complaint {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  location: {
    address: string;
  };
  attachments: string[];
  timeline: TimelineItem[];
  officer_feedback: string | null;
}

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const loadComplaint = async () => {
      // Load from static data
      const response = await fetch('/dataTribal/complaints.json');
      const staticData = await response.json();
      
      // Load from localStorage
      const localData = JSON.parse(localStorage.getItem('complaints') || '{"complaints": []}');
      
      // Find complaint
      const allComplaints = [...staticData.complaints, ...localData.complaints];
      const found = allComplaints.find(c => c.id === id);
      setComplaint(found);
    };

    if (id) {
      loadComplaint();
    }
  }, [id]);

  if (!complaint) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <p>Loading complaint details...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-warning-foreground';
      case 'In Progress':
        return 'bg-primary text-primary-foreground';
      case 'Resolved':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{complaint.title}</CardTitle>
                <p className="text-muted-foreground">Complaint ID: {complaint.id}</p>
              </div>
              <Badge className={getStatusColor(complaint.status)}>
                {complaint.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{complaint.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Priority</p>
                <p className="font-medium">{complaint.priority}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Filed On</p>
                <p className="font-medium">
                  {new Date(complaint.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {new Date(complaint.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5" />
              <span>Description</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{complaint.description}</p>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{complaint.location.address}</p>
          </CardContent>
        </Card>

        {/* Attachments */}
        {complaint.attachments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Paperclip className="w-5 h-5" />
                <span>Attachments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {complaint.attachments.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Officer Feedback */}
        {complaint.officer_feedback && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Officer Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{complaint.officer_feedback}</p>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complaint.timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.status}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplaintDetail;