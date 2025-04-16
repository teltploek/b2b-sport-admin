// src/app/(dashboard)/team-management/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  CalendarClock,
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronRight,
  Shirt,
  Users,
  CalendarCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { getClubById, AgreementStatus } from '@/lib/data/mock-data';

// Agreement with additional fields for team view
interface TeamAgreement {
  id: string;
  name: string;
  teamName: string;
  status: AgreementStatus;
  dueDate: string;
  progress: number;
  playerCount: number;
  completedCount: number;
  isRequired: boolean;
}

// Mock team agreements
const mockTeamAgreements: TeamAgreement[] = [
  {
    id: 'AGR-001244',
    name: 'First Team 2025 Season Kit',
    teamName: 'First Team',
    status: AgreementStatus.InProgress,
    dueDate: 'Apr 25, 2025',
    progress: 50,
    playerCount: 16,
    completedCount: 8,
    isRequired: true,
  },
  {
    id: 'AGR-001245',
    name: 'Youth Team Training Kit',
    teamName: 'Youth Team',
    status: AgreementStatus.Pending,
    dueDate: 'May 05, 2025',
    progress: 0,
    playerCount: 12,
    completedCount: 0,
    isRequired: true,
  },
  {
    id: 'AGR-001246',
    name: "Women's Team Goalkeeper Kit",
    teamName: "Women's Team",
    status: AgreementStatus.Active,
    dueDate: 'Apr 20, 2025',
    progress: 100,
    playerCount: 2,
    completedCount: 2,
    isRequired: true,
  },
  {
    id: 'AGR-001247',
    name: 'Club Staff Apparel',
    teamName: 'Staff',
    status: AgreementStatus.Active,
    dueDate: 'Apr 30, 2025',
    progress: 75,
    playerCount: 4,
    completedCount: 3,
    isRequired: false,
  },
];

// Team Type for simplified view
interface Team {
  id: string;
  name: string;
  playerCount: number;
  agreementCount: number;
  pendingCount: number;
}

// Mock teams data
const mockTeams: Team[] = [
  {
    id: 'team-001',
    name: 'First Team',
    playerCount: 16,
    agreementCount: 1,
    pendingCount: 1,
  },
  {
    id: 'team-002',
    name: 'Youth Team',
    playerCount: 12,
    agreementCount: 1,
    pendingCount: 1,
  },
  {
    id: 'team-003',
    name: "Women's Team",
    playerCount: 14,
    agreementCount: 1,
    pendingCount: 0,
  },
  {
    id: 'team-004',
    name: 'Staff',
    playerCount: 4,
    agreementCount: 1,
    pendingCount: 0,
  },
];

export default function TeamManagementPage() {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState<TeamAgreement[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'teams' | 'agreements'>('agreements');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // For demo, we'll use mock data
        setAgreements(mockTeamAgreements);
        setTeams(mockTeams);
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter agreements based on search
  const filteredAgreements = agreements.filter(
    (agreement) =>
      agreement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.teamName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter teams based on search
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get agreement status badge
  const getStatusBadge = (status: AgreementStatus) => {
    switch (status) {
      case AgreementStatus.Pending:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" /> Pending
          </span>
        );
      case AgreementStatus.Active:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" /> Active
          </span>
        );
      case AgreementStatus.InProgress:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock size={12} className="mr-1" /> In Progress
          </span>
        );
      case AgreementStatus.Completed:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <CheckCircle size={12} className="mr-1" /> Completed
          </span>
        );
      case AgreementStatus.Canceled:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertTriangle size={12} className="mr-1" /> Canceled
          </span>
        );
      default:
        return null;
    }
  };

  const clubName = user?.clubId ? getClubById(user.clubId)?.name : 'Your Club';

  // Calculate overall progress
  const calculateOverallProgress = (): number => {
    if (agreements.length === 0) return 0;

    const totalPlayers = agreements.reduce((total, a) => total + a.playerCount, 0);
    const totalCompleted = agreements.reduce((total, a) => total + a.completedCount, 0);

    return totalPlayers > 0 ? Math.round((totalCompleted / totalPlayers) * 100) : 0;
  };

  const overallProgress = calculateOverallProgress();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Team Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage team details and kit information for {clubName}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentView('agreements')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentView === 'agreements'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Agreements
          </button>
          <button
            onClick={() => setCurrentView('teams')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentView === 'teams'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Teams
          </button>
        </div>
      </div>

      {/* Progress overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-800">Kit Details Progress</h2>
            <p className="text-sm text-gray-500 mt-1">
              {overallProgress === 100
                ? 'All player details are complete!'
                : `Complete player kit details for all agreements.`}
            </p>
          </div>

          <div className="flex items-center">
            <div className="mr-4 text-sm font-medium">
              Overall Progress: <span className="text-primary">{overallProgress}%</span>
            </div>
            <div className="relative h-4 w-32 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={`Search ${currentView === 'agreements' ? 'agreements' : 'teams'}...`}
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-primary focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {currentView === 'agreements' ? (
        // Agreements View
        <>
          {filteredAgreements.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">No Agreements Found</h2>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'There are no active agreements requiring your attention.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAgreements.map((agreement) => (
                <div
                  key={agreement.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded mr-2">
                            {agreement.id}
                          </div>
                          {getStatusBadge(agreement.status)}
                          {agreement.isRequired && (
                            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded">
                              Required
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-1">{agreement.name}</h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Users size={14} className="mr-1.5 text-gray-400" />
                            Team: {agreement.teamName}
                          </div>
                          <div className="flex items-center">
                            <CalendarClock size={14} className="mr-1.5 text-gray-400" />
                            Due: {agreement.dueDate}
                          </div>
                          <div className="flex items-center">
                            <Shirt size={14} className="mr-1.5 text-gray-400" />
                            {agreement.completedCount} of {agreement.playerCount} players completed
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          Progress: <span className="font-medium ml-1">{agreement.progress}%</span>
                        </div>
                        <div className="w-full md:w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              agreement.progress === 100
                                ? 'bg-green-500'
                                : agreement.progress > 0
                                ? 'bg-primary'
                                : 'bg-gray-300'
                            }`}
                            style={{ width: `${agreement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {agreement.status === AgreementStatus.Completed ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle size={14} className="mr-1.5" /> Completed
                        </span>
                      ) : agreement.status === AgreementStatus.Pending ? (
                        <span className="flex items-center text-yellow-600">
                          <Clock size={14} className="mr-1.5" /> Waiting to start
                        </span>
                      ) : agreement.status === AgreementStatus.InProgress ? (
                        <span className="flex items-center text-blue-600">
                          <CalendarCheck size={14} className="mr-1.5" />
                          {agreement.dueDate < new Date().toISOString().split('T')[0]
                            ? 'Overdue'
                            : `Due ${agreement.dueDate}`}
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-600">
                          <CalendarCheck size={14} className="mr-1.5" /> Active
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/agreement-mapping/${agreement.id}`}
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      {agreement.progress === 100 ? 'View Details' : 'Complete Kit Details'}
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // Teams View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">No Teams Found</h2>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search' : 'There are no teams to display.'}
              </p>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.playerCount} Players</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Agreements:</span>
                      <span className="font-medium text-gray-900">{team.agreementCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending Tasks:</span>
                      <span className="font-medium text-gray-900">{team.pendingCount}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {team.pendingCount > 0 ? (
                      <span className="flex items-center text-yellow-600">
                        <AlertTriangle size={14} className="mr-1.5" />
                        {team.pendingCount} pending {team.pendingCount === 1 ? 'task' : 'tasks'}
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600">
                        <CheckCircle size={14} className="mr-1.5" /> All tasks complete
                      </span>
                    )}
                  </div>

                  <Link
                    href="/roster-management"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    Manage Roster
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Instructions Card */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Getting Started</h2>

        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
              1
            </span>
            <div>
              <p className="font-medium text-gray-800">Manage Your Roster</p>
              <p>
                Keep your player roster up to date with current player information in the Roster
                Management section.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
              2
            </span>
            <div>
              <p className="font-medium text-gray-800">Complete Agreement Tasks</p>
              <p>
                Fill in kit details for each player assigned to an agreement, including jersey
                numbers, sizes, and customization.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
              3
            </span>
            <div>
              <p className="font-medium text-gray-800">Track Order Status</p>
              <p>
                Once youve submitted player details, you can track the status of your orders in the
                Order Status section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
