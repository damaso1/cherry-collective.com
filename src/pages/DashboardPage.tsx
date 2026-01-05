import React from 'react';
import { motion } from 'framer-motion';
import { ImmersiveHeader } from '../components/layout/ImmersiveHeader';
import { ImmersiveStats } from '../components/dashboard/ImmersiveStats';
import { ImmersiveLeads } from '../components/dashboard/ImmersiveLeads';
import { ImmersiveAgents } from '../components/dashboard/ImmersiveAgents';
import { ImmersiveActivity } from '../components/dashboard/ImmersiveActivity';
import { useNavigateWithTransition } from '../core/transitions';

const DashboardPage: React.FC = () => {
  const { navigateWithTransition } = useNavigateWithTransition();

  return (
    <div className="min-h-screen relative">
      {/* Ambient background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cherry-ripe/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stem-light/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <ImmersiveHeader
        title="Dashboard"
        subtitle="Welcome back! Your orchard is growing."
      />

      {/* Content */}
      <div className="relative px-6 pb-12 space-y-8">
        {/* Stats Overview - Floating cherry bubble cluster */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ImmersiveStats />
        </motion.section>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Leads - spans 2 columns on large screens */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="xl:col-span-2"
          >
            <ImmersiveLeads
              onRowClick={(lead) => {
                navigateWithTransition(`/leads/${lead.id}`);
              }}
            />
          </motion.section>

          {/* Right sidebar - Agents and Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Agent Status */}
            <ImmersiveAgents />

            {/* Activity Feed */}
            <ImmersiveActivity />
          </motion.div>
        </div>

        {/* Decorative floating cherry particles in background */}
        <FloatingCherries />
      </div>
    </div>
  );
};

// Decorative floating cherry particles
const FloatingCherries: React.FC = () => {
  const cherries = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
    size: 8 + Math.random() * 12,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {cherries.map((cherry) => (
        <motion.div
          key={cherry.id}
          className="absolute opacity-10"
          style={{ left: `${cherry.x}%` }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{
            y: '-10vh',
            rotate: 360,
          }}
          transition={{
            duration: cherry.duration,
            delay: cherry.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg
            width={cherry.size}
            height={cherry.size * 1.2}
            viewBox="0 0 20 24"
            fill="none"
          >
            {/* Stem */}
            <path
              d="M10 0 Q 12 4, 10 8"
              stroke="#4a7c59"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Cherry */}
            <circle cx="10" cy="14" r="8" fill="#C41E3A" />
            <circle cx="7" cy="12" r="2" fill="rgba(255,255,255,0.3)" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardPage;
