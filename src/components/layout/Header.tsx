import { motion } from 'framer-motion';
import { Bell, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { CherryIcon } from '../icons';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'info' | 'warning';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Lead Picked',
    message: 'TechCorp Inc. scored 92% ripeness',
    time: '2 min ago',
    read: false,
    type: 'success',
  },
  {
    id: '2',
    title: 'Basket Updated',
    message: '3 leads added to your basket',
    time: '15 min ago',
    read: false,
    type: 'info',
  },
  {
    id: '3',
    title: 'Score Alert',
    message: 'CloudSync Ltd ripeness dropped to 45%',
    time: '1 hour ago',
    read: true,
    type: 'warning',
  },
];

export const Header = ({
  title,
  subtitle,
  showSearch = true,
  onSearch,
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-bark-dark/80 backdrop-blur-md border-b border-cherry-ripe/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title section */}
        <div>
          {title && (
            <h1 className="text-2xl font-display font-bold text-white">{title}</h1>
          )}
          {subtitle && (
            <p className="text-sm text-white/60 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search leads..."
                className="w-64 pl-10 pr-4 py-2 bg-bark-medium border border-cherry-ripe/20 rounded-lg text-sm
                  focus:border-cherry-ripe/50 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5 text-white/70" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center
                  text-xs font-bold bg-cherry-ripe text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-bark-dark border border-cherry-ripe/20 rounded-xl shadow-cherry-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-cherry-ripe/10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-cherry-light">{unreadCount} new</span>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      className={`
                        px-4 py-3 border-b border-cherry-ripe/5 cursor-pointer
                        hover:bg-cherry-ripe/5 transition-colors
                        ${!notif.read ? 'bg-cherry-ripe/10' : ''}
                      `}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-2 h-2 rounded-full mt-2 flex-shrink-0
                          ${notif.type === 'success' ? 'bg-stem-light' : ''}
                          ${notif.type === 'info' ? 'bg-blue-400' : ''}
                          ${notif.type === 'warning' ? 'bg-amber-400' : ''}
                        `} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm">{notif.title}</p>
                          <p className="text-xs text-white/60 truncate">{notif.message}</p>
                          <p className="text-xs text-white/40 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="px-4 py-2 bg-bark-medium/50">
                  <button className="w-full text-center text-sm text-cherry-light hover:text-cherry-bright transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <motion.button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-full bg-cherry-ripe/20 border border-cherry-ripe/30 flex items-center justify-center">
                <CherryIcon size={20} ripe animate={false} />
              </div>
              <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Profile dropdown */}
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-bark-dark border border-cherry-ripe/20 rounded-xl shadow-cherry-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-cherry-ripe/10">
                  <p className="font-semibold text-white">Alec Damaso</p>
                  <p className="text-xs text-white/60">ecocherry4u@gmail.com</p>
                </div>

                <div className="py-2">
                  <button className="w-full px-4 py-2 flex items-center gap-3 text-white/80 hover:bg-cherry-ripe/10 hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 flex items-center gap-3 text-white/80 hover:bg-cherry-ripe/10 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                </div>

                <div className="py-2 border-t border-cherry-ripe/10">
                  <button className="w-full px-4 py-2 flex items-center gap-3 text-cherry-light hover:bg-cherry-ripe/10 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
