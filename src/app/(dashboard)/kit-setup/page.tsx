// src/app/(dashboard)/kit-setup/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
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

// Kit Request with additional fields for team view
interface KitRequest {
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

// Team Type for simplified view
interface Team {
  id: string;
  name: string;
  playerCount: number;
  kitRequestCount: number;
  pendingCount: number;
}

export default function KitSetupPage() {
  const { user } = useAuth();
  const [kitRequests, setKitRequests] = useState<KitRequest[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'teams' | 'requests'>('requests');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // Fetch kit requests
        const requestsResponse = await fetch(
          `/api/kit-setup?view=requests${user?.clubId ? `&clubId=${user.clubId}` : ''}`,
        );
        const requestsData = await requestsResponse.json();
        setKitRequests(requestsData);

        // Fetch teams
        const teamsResponse = await fetch(
          `/api/kit-setup?view=teams${user?.clubId ? `&clubId=${user.clubId}` : ''}`,
        );
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching kit data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filter kit requests based on search
  const filteredKitRequests = kitRequests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.teamName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter teams based on search
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get status badge
  const getStatusBadge = (status: AgreementStatus) => {
    switch (status) {
      case AgreementStatus.Pending:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" /> Not Started
          </span>
        );
      case AgreementStatus.Active:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" /> Ready to Start
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
    if (kitRequests.length === 0) return 0;

    const totalPlayers = kitRequests.reduce((total, a) => total + a.playerCount, 0);
    const totalCompleted = kitRequests.reduce((total, a) => total + a.completedCount, 0);

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
          <h1 className="text-2xl font-semibold text-gray-800">Team Kit Setup</h1>
          <p className="text-gray-500 text-sm mt-1">
            Complete kit details for players in {clubName}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentView('requests')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentView === 'requests'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Kit Requests
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
            <h2 className="text-lg font-medium text-gray-800">Overall Progress</h2>
            <p className="text-sm text-gray-500 mt-1">
              {overallProgress === 100
                ? 'All player kit details are complete!'
                : `Complete kit details for all your teams.`}
            </p>
          </div>

          <div className="flex items-center">
            <div className="mr-4 text-sm font-medium">
              <span className="text-primary">{overallProgress}%</span> Complete
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
          placeholder={`Search ${currentView === 'requests' ? 'kit requests' : 'teams'}...`}
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-primary focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {currentView === 'requests' ? (
        // Kit Requests View (previously Agreements View)
        <>
          {filteredKitRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Shirt size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">No Kit Requests Found</h2>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'There are no kit requests requiring your attention.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredKitRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded mr-2">
                            {request.id}
                          </div>
                          {getStatusBadge(request.status)}
                          {request.isRequired && (
                            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded">
                              Required
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-1">{request.name}</h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Users size={14} className="mr-1.5 text-gray-400" />
                            Team: {request.teamName}
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1.5 text-gray-400" />
                            Due: {request.dueDate}
                          </div>
                          <div className="flex items-center">
                            <Shirt size={14} className="mr-1.5 text-gray-400" />
                            {request.completedCount} of {request.playerCount} players completed
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          Progress: <span className="font-medium ml-1">{request.progress}%</span>
                        </div>
                        <div className="w-full md:w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              request.progress === 100
                                ? 'bg-green-500'
                                : request.progress > 0
                                ? 'bg-primary'
                                : 'bg-gray-300'
                            }`}
                            style={{ width: `${request.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {request.status === AgreementStatus.Completed ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle size={14} className="mr-1.5" /> Completed
                        </span>
                      ) : request.status === AgreementStatus.Pending ? (
                        <span className="flex items-center text-yellow-600">
                          <Clock size={14} className="mr-1.5" /> Not started yet
                        </span>
                      ) : request.status === AgreementStatus.InProgress ? (
                        <span className="flex items-center text-blue-600">
                          <CalendarCheck size={14} className="mr-1.5" />
                          {request.dueDate < new Date().toISOString().split('T')[0]
                            ? 'Overdue'
                            : `Due ${request.dueDate}`}
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-600">
                          <CalendarCheck size={14} className="mr-1.5" /> Ready to start
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/player-kit-details/${request.id}`}
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      {request.progress === 100 ? 'View Details' : 'Complete Kit Details'}
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
                      <span className="text-gray-600">Active Kit Requests:</span>
                      <span className="font-medium text-gray-900">{team.kitRequestCount}</span>
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
                    href="/player-roster"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    View Players
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
        <h2 className="text-lg font-medium text-gray-800 mb-4">How Kit Setup Works</h2>

        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
              1
            </span>
            <div>
              <p className="font-medium text-gray-800">Update Your Player Roster</p>
              <p>
                Make sure your player roster is complete and up-to-date before setting up kit
                details.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
              2
            </span>
            <div>
              <p className="font-medium text-gray-800">Select Players for Kit Setup</p>
              <p>
                For each kit request, select which players need equipment and complete their
                details.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="inline-block bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
              3
            </span>
            <div>
              <p className="font-medium text-gray-800">Submit and Track</p>
              <p>
                Once all player details are complete, submit your kit request and track the order
                status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
