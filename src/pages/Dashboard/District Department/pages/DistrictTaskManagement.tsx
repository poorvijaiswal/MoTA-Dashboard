import React, { useState, useMemo } from 'react';
import { 
  FaTasks, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUser,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaClipboardList,
  FaDownload
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Mock data for task management
const generateTaskData = () => {
  const taskTypes = [
    'Claim Review', 'Field Verification', 'Document Verification', 'Site Survey',
    'Boundary Marking', 'Community Meeting', 'Report Generation', 'Policy Review',
    'Training Session', 'Compliance Check', 'Data Entry', 'Quality Audit'
  ];
  
  const priorities = ['High', 'Medium', 'Low'];
  const statuses = ['Not Started', 'In Progress', 'Under Review', 'Completed', 'On Hold', 'Cancelled'];
  const departments = ['Forest Department', 'Revenue Department', 'Tribal Affairs', 'Survey Department'];
  
  const mpDistricts = [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani',
    'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara',
    'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior',
    'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni'
  ];

  const officers = [
    'Dr. A.K. Sharma', 'R.P. Singh', 'M.K. Verma', 'S.R. Patel', 'N.K. Jain',
    'P.K. Gupta', 'V.S. Yadav', 'R.K. Tiwari', 'M.P. Dubey', 'S.K. Mishra',
    'A.R. Chandra', 'B.K. Agarwal', 'C.P. Shukla', 'D.S. Rao', 'E.M. Khan'
  ];

  return Array.from({ length: 200 }, (_, index) => ({
    id: `TSK-MP-${(index + 1).toString().padStart(4, '0')}`,
    title: `${taskTypes[Math.floor(Math.random() * taskTypes.length)]} - ${mpDistricts[Math.floor(Math.random() * mpDistricts.length)]}`,
    description: [
      'Review and verify submitted claim documents for compliance',
      'Conduct field survey and GPS mapping of claimed area',
      'Organize community consultation meeting with stakeholders',
      'Prepare comprehensive verification report with recommendations',
      'Update digital records and GIS mapping database',
      'Coordinate with revenue officials for boundary verification',
      'Conduct training session for local officials on new procedures',
      'Audit existing claims for quality and compliance standards'
    ][Math.floor(Math.random() * 8)],
    taskType: taskTypes[Math.floor(Math.random() * taskTypes.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    assignedTo: officers[Math.floor(Math.random() * officers.length)],
    assignedBy: officers[Math.floor(Math.random() * officers.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    district: mpDistricts[Math.floor(Math.random() * mpDistricts.length)],
    createdDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-IN'),
    dueDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-IN'),
    completedDate: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-IN') : null,
    progress: Math.floor(Math.random() * 101),
    relatedClaimId: `FRA-MP-${Math.floor(Math.random() * 1000) + 1}`,
    estimatedHours: Math.floor(Math.random() * 40) + 4,
    actualHours: Math.floor(Math.random() * 50),
    notes: Math.random() > 0.6 ? 'Additional verification required due to boundary disputes' : '',
    attachments: Math.floor(Math.random() * 5) + 1
  }));
};

const TaskManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const taskData = useMemo(() => generateTaskData(), []);

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    return taskData.filter(task => {
      const matchesSearch = searchTerm === '' || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.district.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesDepartment = departmentFilter === 'all' || task.department === departmentFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assignedTo === assigneeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesDepartment && matchesAssignee;
    });
  }, [taskData, searchTerm, statusFilter, priorityFilter, departmentFilter, assigneeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Hold':
        return 'bg-orange-100 text-orange-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <FaFlag className="h-3 w-3 text-red-600" />;
      case 'Medium':
        return <FaFlag className="h-3 w-3 text-yellow-600" />;
      case 'Low':
        return <FaFlag className="h-3 w-3 text-green-600" />;
      default:
        return <FaFlag className="h-3 w-3 text-gray-600" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginationRange = () => {
    const range = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const uniqueOfficers = [...new Set(taskData.map(task => task.assignedTo))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1B365D] mb-2">Task Management</h1>
          <p className="text-gray-600">Manage and track administrative tasks across Madhya Pradesh</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center space-x-2">
            <FaDownload className="h-4 w-4" />
            <span>Export Tasks</span>
          </Button>
          <Button className="bg-[#1B365D] hover:bg-[#0F1B2E] flex items-center space-x-2">
            <FaPlus className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Tasks</p>
                <p className="text-2xl font-bold">{filteredTasks.length}</p>
              </div>
              <FaTasks className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-2xl font-bold">
                  {filteredTasks.filter(t => t.status === 'Completed').length}
                </p>
              </div>
              <FaCheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">In Progress</p>
                <p className="text-2xl font-bold">
                  {filteredTasks.filter(t => t.status === 'In Progress').length}
                </p>
              </div>
              <FaClock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Not Started</p>
                <p className="text-2xl font-bold">
                  {filteredTasks.filter(t => t.status === 'Not Started').length}
                </p>
              </div>
              <FaClipboardList className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">High Priority</p>
                <p className="text-2xl font-bold">
                  {filteredTasks.filter(t => t.priority === 'High').length}
                </p>
              </div>
              <FaExclamationTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks, ID, assignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Forest Department">Forest Department</SelectItem>
                <SelectItem value="Revenue Department">Revenue Department</SelectItem>
                <SelectItem value="Tribal Affairs">Tribal Affairs</SelectItem>
                <SelectItem value="Survey Department">Survey Department</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {uniqueOfficers.slice(0, 10).map(officer => (
                  <SelectItem key={officer} value={officer}>{officer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FaTasks className="h-5 w-5" />
            <span>Task List ({filteredTasks.length} total)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  {/* <TableHead>Priority</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Due Date</TableHead>
                  {/* <TableHead>Progress</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-sm truncate">{task.title}</p>
                        <p className="text-xs text-gray-500 truncate">{task.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{task.taskType}</TableCell>
                    {/* <TableCell>
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(task.priority)}
                        <Badge className={getPriorityBadge(task.priority)} variant="outline">
                          {task.priority}
                        </Badge>
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <Badge className={getStatusBadge(task.status)} variant="outline">
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FaUser className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{task.assignedTo}</span>
                      </div>
                    </TableCell>
                    <TableCell>{task.district}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{task.dueDate}</span>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(task.progress)}`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" title="View Details">
                          <FaEye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit Task">
                          <FaEdit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft className="h-4 w-4" />
              </Button>
              
              {getPaginationRange().map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? "bg-[#1B365D]" : ""}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManagement;