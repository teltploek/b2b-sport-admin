// src/app/(dashboard)/team-management/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Save,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
} from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { getClubById } from '@/lib/data/mock-data';

// Team interface
interface Team {
  id: string;
  name: string;
  playerCount: number;
  type: 'First Team' | 'Youth Team' | "Women's Team";
  agreementId?: string;
}

// Player interface
interface Player {
  id: string;
  name: string;
  jerseyNumber?: string;
  nameOnJersey?: string;
  jerseySize?: string;
  status: 'completed' | 'in-progress' | 'not-started';
  shortsSize?: string;
  socksSize?: string;
  additionalGear?: string[];
}

// Mock data for teams
const mockTeams: Team[] = [
  {
    id: 'team-001',
    name: 'First Team',
    playerCount: 16,
    type: 'First Team',
    agreementId: 'AGR-001244',
  },
  {
    id: 'team-002',
    name: 'Youth Team',
    playerCount: 12,
    type: 'Youth Team',
  },
  {
    id: 'team-003',
    name: "Women's Team",
    playerCount: 14,
    type: "Women's Team",
  },
];

// Mock data for players
const mockPlayers: Player[] = [
  {
    id: 'player-001',
    name: 'Alex Johnson',
    jerseyNumber: '10',
    nameOnJersey: 'JOHNSON',
    jerseySize: 'M',
    status: 'completed',
    shortsSize: 'M',
    socksSize: 'M',
    additionalGear: ['Training Jacket', 'Goalkeeper Gloves'],
  },
  {
    id: 'player-002',
    name: 'Sam Lee',
    jerseyNumber: '8',
    nameOnJersey: 'LEE',
    jerseySize: '',
    status: 'in-progress',
    shortsSize: 'M',
    socksSize: 'L',
  },
  {
    id: 'player-003',
    name: 'Taylor Martinez',
    status: 'not-started',
  },
  {
    id: 'player-004',
    name: 'Jordan Smith',
    status: 'not-started',
  },
  {
    id: 'player-005',
    name: 'Morgan Williams',
    status: 'not-started',
  },
  {
    id: 'player-006',
    name: 'Casey Thompson',
    status: 'not-started',
  },
];

export default function TeamManagementPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // In a real app, we would fetch teams and players from an API
    const fetchTeams = async () => {
      try {
        // For demo purposes, we'll use the mock data
        setTeams(mockTeams);
        setPlayers(mockPlayers);

        // Set the first team as selected by default
        if (mockTeams.length > 0) {
          setSelectedTeam(mockTeams[0]);
        }

        // Calculate completed players
        const completed = mockPlayers.filter((p) => p.status === 'completed').length;
        setCompletedCount(completed);
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Filter players based on search term
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate progress percentage
  const progressPercentage =
    players.length > 0 ? Math.round((completedCount / players.length) * 100) : 0;

  // Handle player data update
  const handlePlayerUpdate = (playerId: string, field: string, value: string) => {
    const updatedPlayers = players.map((player) => {
      if (player.id === playerId) {
        // If any field is filled, mark as in-progress
        const updatedPlayer = {
          ...player,
          [field]: value,
          status: value
            ? player.status === 'completed'
              ? 'completed'
              : 'in-progress'
            : player.status,
        };

        // Check if all required fields are filled to mark as completed
        if (
          updatedPlayer.jerseyNumber &&
          updatedPlayer.nameOnJersey &&
          updatedPlayer.jerseySize &&
          updatedPlayer.shortsSize &&
          updatedPlayer.socksSize
        ) {
          updatedPlayer.status = 'completed';
        }

        return updatedPlayer;
      }
      return player;
    });

    setPlayers(updatedPlayers);

    // Update completed count
    const completed = updatedPlayers.filter((p) => p.status === 'completed').length;
    setCompletedCount(completed);
  };

  // Save progress function
  const handleSave = () => {
    // In a real app, this would save to the backend
    alert('Progress saved successfully!');
  };

  // Submit completed form
  const handleSubmit = () => {
    if (completedCount < players.length) {
      const confirm = window.confirm('Not all player details are complete. Submit anyway?');
      if (!confirm) return;
    }

    // In a real app, this would submit to the backend and update the order status
    alert('Kit details submitted successfully! You will be redirected to the order status page.');
    // Redirect to order status page
    window.location.href = '/order-status';
  };

  const clubName = user?.clubId ? getClubById(user.clubId)?.name : 'Your Club';

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
          <p className="text-sm text-gray-500 mb-1">
            Dashboard &gt; Team Management {selectedTeam ? `&gt; ${selectedTeam.name}` : ''}
          </p>
          <h1 className="text-2xl font-semibold text-gray-800">
            {selectedTeam ? `${selectedTeam.name} - Player Kit Details` : 'Team Management'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {selectedTeam
              ? 'Please complete the kit details for all players'
              : `Manage teams for ${clubName}`}
          </p>
        </div>

        {selectedTeam && (
          <div className="relative h-8 w-44 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
              {completedCount}/{players.length} Complete
            </div>
          </div>
        )}
      </div>

      {!selectedTeam ? (
        // Teams listing view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTeam(team)}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-500">{team.playerCount} Players</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{team.type}</span>
                  {team.agreementId ? (
                    <div className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-medium flex items-center">
                      <CheckCircle size={12} className="mr-1" /> Active Agreement
                    </div>
                  ) : (
                    <div className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-xs font-medium flex items-center">
                      <AlertCircle size={12} className="mr-1" /> No Agreement
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex items-center">
                <button className="text-sm text-primary font-medium flex items-center">
                  Manage Team <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Team detail view with player kit details form
        <div>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search players..."
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 flex items-center hover:bg-gray-200"
              onClick={() => setSelectedTeam(null)}
            >
              Back to Teams
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gray-50 grid grid-cols-12 gap-3">
              <div className="col-span-3 font-medium text-gray-700">Player Name</div>
              <div className="col-span-2 font-medium text-gray-700">Jersey #</div>
              <div className="col-span-3 font-medium text-gray-700">Name on Jersey</div>
              <div className="col-span-2 font-medium text-gray-700">Jersey Size</div>
              <div className="col-span-2 font-medium text-gray-700">Status</div>
            </div>

            {/* Player Rows */}
            <div className="divide-y divide-gray-100">
              {filteredPlayers.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No players found matching your search
                </div>
              ) : (
                filteredPlayers.map((player) => (
                  <div key={player.id}>
                    <div className="px-6 py-4 grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-3 font-medium text-gray-800">{player.name}</div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={player.jerseyNumber || ''}
                          onChange={(e) =>
                            handlePlayerUpdate(player.id, 'jerseyNumber', e.target.value)
                          }
                          className="w-16 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          placeholder="#"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={player.nameOnJersey || ''}
                          onChange={(e) =>
                            handlePlayerUpdate(
                              player.id,
                              'nameOnJersey',
                              e.target.value.toUpperCase(),
                            )
                          }
                          className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          placeholder="Last Name"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={player.jerseySize || ''}
                          onChange={(e) =>
                            handlePlayerUpdate(player.id, 'jerseySize', e.target.value)
                          }
                          className="w-20 border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Size</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="2XL">2XL</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        {player.status === 'completed' ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle size={16} className="mr-1.5" /> Complete
                          </div>
                        ) : player.status === 'in-progress' ? (
                          <div className="flex items-center text-yellow-600">
                            <Clock size={16} className="mr-1.5" /> In Progress
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-400">
                            <AlertCircle size={16} className="mr-1.5" /> Not Started
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Player Details */}
                    {expandedPlayer === player.id && (
                      <div className="px-6 py-4 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Shorts Size
                          </label>
                          <select
                            value={player.shortsSize || ''}
                            onChange={(e) =>
                              handlePlayerUpdate(player.id, 'shortsSize', e.target.value)
                            }
                            className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          >
                            <option value="">Select Size</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="2XL">2XL</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Socks Size
                          </label>
                          <select
                            value={player.socksSize || ''}
                            onChange={(e) =>
                              handlePlayerUpdate(player.id, 'socksSize', e.target.value)
                            }
                            className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          >
                            <option value="">Select Size</option>
                            <option value="S">S (3-6)</option>
                            <option value="M">M (7-9)</option>
                            <option value="L">L (10-13)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Equipment
                          </label>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`jacket-${player.id}`}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label
                                htmlFor={`jacket-${player.id}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                Training Jacket
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`pants-${player.id}`}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label
                                htmlFor={`pants-${player.id}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                Training Pants
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`gloves-${player.id}`}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label
                                htmlFor={`gloves-${player.id}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                Goalkeeper Gloves
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Toggle Button */}
                    <div className="px-6 py-2 bg-gray-50 border-t border-gray-100">
                      <button
                        className="text-sm text-primary flex items-center focus:outline-none"
                        onClick={() =>
                          setExpandedPlayer(expandedPlayer === player.id ? null : player.id)
                        }
                      >
                        {expandedPlayer === player.id ? (
                          <>
                            <ChevronDown size={16} className="mr-1" /> Hide Additional Details
                          </>
                        ) : (
                          <>
                            <ChevronRight size={16} className="mr-1" /> Show Additional Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="inline-flex items-center px-4 py-2 border border-primary bg-white text-primary rounded-md hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={() => {}}
            >
              <Plus size={16} className="mr-2" /> Add Player
            </button>

            <div className="flex gap-4">
              <button
                className="inline-flex items-center px-6 py-2 border border-primary bg-white text-primary rounded-md hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={handleSave}
              >
                <Save size={16} className="mr-2" /> Save
              </button>

              <button
                className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-base font-medium text-gray-800 mb-3">Instructions:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="inline-block bg-gray-200 text-gray-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                  1
                </span>
                Enter jersey number, name on jersey, and size for each player
              </li>
              <li className="flex items-start">
                <span className="inline-block bg-gray-200 text-gray-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                  2
                </span>
                Click &quot;Show Additional Details&quot; for additional options (socks, shorts,
                etc.)
              </li>
              <li className="flex items-start">
                <span className="inline-block bg-gray-200 text-gray-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                  3
                </span>
                Save your progress or submit when complete
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
