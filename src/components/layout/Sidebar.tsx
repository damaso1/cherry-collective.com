import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Users,
  ShoppingBasket,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Target,
  History,
} from 'lucide-react';
import { CherryPairIcon } from '../icons';
import { useState } from 'react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
  { label: 'Leads', icon: <Target className="w-5 h-5" />, path: '/leads' },
  { label: 'Basket', icon: <ShoppingBasket className="w-5 h-5" />, path: '/basket', badge: 3 },
  { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/analytics' },
  { label: 'Activity', icon: <History className="w-5 h-5" />, path: '/activity' },
];

const secondaryNavItems: NavItem[] = [
  { label: 'Team', icon: <Users className="w-5 h-5" />, path: '/team' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  { label: 'Help', icon: <HelpCircle className="w-5 h-5" />, path: '/help' },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ isCollapsed = false, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

    return (
      <NavLink
        to={item.path}
        className="block relative"
        onMouseEnter={() => setHoveredItem(item.path)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <motion.div
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg
            transition-colors duration-200 relative
            ${isActive
              ? 'bg-cherry-ripe/20 text-cherry-light'
              : 'text-white/70 hover:text-white hover:bg-white/5'
            }
          `}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Active indicator */}
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cherry-ripe rounded-r-full"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}

          {/* Icon */}
          <span className={`flex-shrink-0 ${isActive ? 'text-cherry-light' : ''}`}>
            {item.icon}
          </span>

          {/* Label */}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Badge */}
          {item.badge && !isCollapsed && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto px-2 py-0.5 text-xs font-bold bg-cherry-ripe text-white rounded-full"
            >
              {item.badge}
            </motion.span>
          )}
        </motion.div>

        {/* Tooltip for collapsed state */}
        {isCollapsed && hoveredItem === item.path && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50"
          >
            <div className="px-3 py-1.5 bg-bark-dark border border-cherry-ripe/30 rounded-lg shadow-lg">
              <span className="text-sm font-medium text-white whitespace-nowrap">
                {item.label}
              </span>
              {item.badge && (
                <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-cherry-ripe text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </NavLink>
    );
  };

  return (
    <motion.aside
      className={`
        fixed left-0 top-0 h-screen
        bg-bark-dark/95 backdrop-blur-sm
        border-r border-cherry-ripe/10
        flex flex-col z-40
        transition-all duration-300
      `}
      animate={{ width: isCollapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-cherry-ripe/10">
        <CherryPairIcon size={40} animate />
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="font-display font-bold text-xl text-white whitespace-nowrap">
                Cherry<span className="text-cherry-ripe">picker</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick actions */}
      <div className="px-3 py-4 border-b border-cherry-ripe/10">
        <motion.button
          className={`
            w-full flex items-center justify-center gap-2
            py-2.5 rounded-lg
            bg-cherry-gradient text-white font-semibold
            shadow-cherry hover:shadow-cherry-lg
            transition-shadow duration-200
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="w-4 h-4" />
          {!isCollapsed && <span>Quick Pick</span>}
        </motion.button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavItemComponent key={item.path} item={item} />
        ))}

        {/* Divider */}
        <div className="my-4 border-t border-cherry-ripe/10" />

        {secondaryNavItems.map((item) => (
          <NavItemComponent key={item.path} item={item} />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-4 border-t border-cherry-ripe/10">
        <motion.button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
            text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
