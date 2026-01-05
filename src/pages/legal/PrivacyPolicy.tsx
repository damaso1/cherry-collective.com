import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Mail } from 'lucide-react';
import { CherryPairIcon } from '../../components/icons';
import { MagneticElement } from '../../components/effects/MagneticElement';
import { useNavigateWithTransition } from '../../core/transitions';

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}> = ({ title, icon, children, delay = 0 }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="mb-10"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-cherry-ripe/20 rounded-lg text-cherry-light">
        {icon}
      </div>
      <h2 className="text-xl font-display font-bold text-white">{title}</h2>
    </div>
    <div className="text-white/70 leading-relaxed space-y-4 pl-12">
      {children}
    </div>
  </motion.section>
);

const PrivacyPolicy: React.FC = () => {
  const { navigateWithTransition } = useNavigateWithTransition();

  return (
    <div className="min-h-screen bg-bark-dark">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cherry-ripe/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cherry-dark/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-bark-dark/80 backdrop-blur-xl border-b border-cherry-ripe/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <MagneticElement strength={0.2}>
            <button
              onClick={() => navigateWithTransition('/')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </MagneticElement>

          <MagneticElement strength={0.2}>
            <button
              onClick={() => navigateWithTransition('/')}
              className="flex items-center gap-2"
            >
              <CherryPairIcon size={28} animate />
              <span className="font-display font-bold text-white">
                Cherry<span className="text-cherry-ripe">picker</span>
              </span>
            </button>
          </MagneticElement>
        </div>
      </header>

      {/* Content */}
      <main className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cherry-ripe/10 rounded-full text-cherry-light text-sm mb-4">
            <Shield className="w-4 h-4" />
            Privacy Document
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/50">
            Last Updated: January 6, 2026 | Effective Date: January 1, 2026
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-bark-medium/30 backdrop-blur-sm rounded-2xl p-6 border border-cherry-ripe/10 mb-10"
        >
          <p className="text-white/80 leading-relaxed">
            Cherry Enterprise ("Company," "we," "our," or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our Cherrypicker platform and related services.
          </p>
          <p className="text-white/80 leading-relaxed mt-4">
            <strong className="text-white">ABN:</strong> 89 767 167 506 |
            <strong className="text-white ml-2">NCAGE:</strong> Z1ME7
          </p>
        </motion.div>

        {/* Sections */}
        <Section title="1. Information We Collect" icon={<Database className="w-5 h-5" />} delay={0.3}>
          <p>
            <strong className="text-white">1.1 Information You Provide.</strong> We collect information
            you voluntarily provide when you:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Create an account (name, email, company information)</li>
            <li>Subscribe to our services (billing and payment details)</li>
            <li>Contact us for support (communication records)</li>
            <li>Use our lead intelligence features (search queries, saved leads)</li>
          </ul>
          <p className="mt-4">
            <strong className="text-white">1.2 Automatically Collected Information.</strong> When you
            access our Services, we automatically collect:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Device information (browser type, operating system, device identifiers)</li>
            <li>Usage data (pages visited, features used, time spent)</li>
            <li>Log data (IP address, access times, referring URLs)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information" icon={<Eye className="w-5 h-5" />} delay={0.4}>
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Provide, maintain, and improve our Services</li>
            <li>Process transactions and send related information</li>
            <li>Send administrative messages, updates, and security alerts</li>
            <li>Respond to your comments, questions, and support requests</li>
            <li>Analyze usage patterns to improve user experience</li>
            <li>Detect, prevent, and address fraud and security issues</li>
            <li>Comply with legal obligations and enforce our policies</li>
          </ul>
        </Section>

        <Section title="3. Information Sharing" icon={<Globe className="w-5 h-5" />} delay={0.5}>
          <p>
            <strong className="text-white">3.1 Third-Party Service Providers.</strong> We may share
            your information with trusted third-party service providers who assist us in:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Payment processing (Stripe)</li>
            <li>Cloud hosting and infrastructure (AWS, Google Cloud)</li>
            <li>Analytics and performance monitoring</li>
            <li>Customer support services</li>
          </ul>
          <p className="mt-4">
            <strong className="text-white">3.2 Legal Requirements.</strong> We may disclose your
            information if required to do so by law or in response to valid requests by public
            authorities (e.g., court orders, government requests).
          </p>
          <p className="mt-4">
            <strong className="text-white">3.3 Business Transfers.</strong> In the event of a merger,
            acquisition, or sale of assets, your information may be transferred as part of that
            transaction.
          </p>
        </Section>

        <Section title="4. Data Security" icon={<Lock className="w-5 h-5" />} delay={0.6}>
          <p>
            We implement industry-standard security measures to protect your information, including:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Encryption of data in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>Regular security audits and penetration testing</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Secure data centers with physical security measures</li>
            <li>Employee training on data protection practices</li>
          </ul>
          <p className="mt-4">
            While we strive to use commercially acceptable means to protect your personal information,
            no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </Section>

        <Section title="5. Your Privacy Rights" icon={<Shield className="w-5 h-5" />} delay={0.7}>
          <p>
            Depending on your location, you may have certain rights regarding your personal
            information, including:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
            <li><strong className="text-white">Correction:</strong> Request correction of inaccurate data</li>
            <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data</li>
            <li><strong className="text-white">Portability:</strong> Request transfer of your data</li>
            <li><strong className="text-white">Objection:</strong> Object to certain processing activities</li>
            <li><strong className="text-white">Withdrawal:</strong> Withdraw consent at any time</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at privacy@cherry-collective.com.
          </p>
        </Section>

        <Section title="6. Cookies & Tracking" icon={<Eye className="w-5 h-5" />} delay={0.8}>
          <p>
            We use cookies and similar tracking technologies to collect and track information about
            your use of our Services. Types of cookies we use:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li><strong className="text-white">Essential Cookies:</strong> Required for basic site functionality</li>
            <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how visitors interact</li>
            <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences</li>
          </ul>
          <p className="mt-4">
            You can control cookies through your browser settings. Note that disabling certain cookies
            may affect the functionality of our Services.
          </p>
        </Section>

        <Section title="7. Data Retention" icon={<Database className="w-5 h-5" />} delay={0.9}>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes
            outlined in this Privacy Policy, unless a longer retention period is required or
            permitted by law. Retention periods vary based on:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Account data: Duration of account plus 7 years</li>
            <li>Transaction records: 7 years (legal requirements)</li>
            <li>Usage analytics: 2 years</li>
            <li>Support communications: 3 years</li>
          </ul>
        </Section>

        <Section title="8. International Transfers" icon={<Globe className="w-5 h-5" />} delay={1.0}>
          <p>
            Your information may be transferred to and processed in countries other than Australia.
            When we transfer data internationally, we ensure appropriate safeguards are in place,
            including:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Standard contractual clauses approved by relevant authorities</li>
            <li>Adequacy decisions by data protection authorities</li>
            <li>Binding corporate rules for intra-group transfers</li>
          </ul>
        </Section>

        <Section title="9. Children's Privacy" icon={<Shield className="w-5 h-5" />} delay={1.1}>
          <p>
            Our Services are not intended for individuals under the age of 18. We do not knowingly
            collect personal information from children. If we become aware that we have collected
            personal information from a child, we will take steps to delete such information.
          </p>
        </Section>

        <Section title="10. Contact Us" icon={<Mail className="w-5 h-5" />} delay={1.2}>
          <p>
            For questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="mt-4 bg-bark-dark/50 rounded-lg p-4 border border-cherry-ripe/10">
            <p><strong className="text-white">Cherry Enterprise</strong></p>
            <p>ABN: 89 767 167 506</p>
            <p>Privacy Officer: privacy@cherry-collective.com</p>
            <p>General Inquiries: support@cherry-collective.com</p>
          </div>
        </Section>

        {/* Footer notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-16 pt-8 border-t border-cherry-ripe/10 text-center"
        >
          <p className="text-white/40 text-sm">
            © 2026 Cherry Enterprise. All Rights Reserved.
            <br />
            Your privacy is protected under Australian Privacy Principles (APPs).
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
