import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Scale } from 'lucide-react';
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

const TermsOfService: React.FC = () => {
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
            <FileText className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Terms of Service
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
            Welcome to Cherry Enterprise ("Company," "we," "our," or "us"). These Terms of Service
            ("Terms") govern your access to and use of the Cherrypicker platform, including our
            proprietary Immersive Orchard user interface, AI-powered lead intelligence services,
            and all related software, applications, and services (collectively, the "Services").
          </p>
          <p className="text-white/80 leading-relaxed mt-4">
            <strong className="text-white">ABN:</strong> 89 767 167 506 |
            <strong className="text-white ml-2">NCAGE:</strong> Z1ME7
          </p>
        </motion.div>

        {/* Sections */}
        <Section title="1. Acceptance of Terms" icon={<Scale className="w-5 h-5" />} delay={0.3}>
          <p>
            By accessing or using our Services, you agree to be bound by these Terms. If you do not
            agree to these Terms, you may not access or use the Services. We reserve the right to
            modify these Terms at any time, and such modifications will be effective immediately
            upon posting.
          </p>
        </Section>

        <Section title="2. Proprietary Rights & Intellectual Property" icon={<Shield className="w-5 h-5" />} delay={0.4}>
          <p>
            <strong className="text-white">2.1 Ownership.</strong> Cherry Enterprise owns all rights,
            title, and interest in and to the Services, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>The "Immersive Orchard" three-dimensional user interface design and metaphor</li>
            <li>All custom 3D assets, including but not limited to the Cherry Tree, Glass Cherries,
                and Cherry Particle System</li>
            <li>The proprietary lead scoring algorithms and AI models</li>
            <li>All source code, software, and technical implementations</li>
            <li>The Cherry Enterprise name, logo, and all related trademarks</li>
          </ul>
          <p className="mt-4">
            <strong className="text-white">2.2 License Restrictions.</strong> You may not, directly
            or indirectly:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Copy, reproduce, or clone any aspect of the Immersive Orchard interface</li>
            <li>Reverse engineer, decompile, or disassemble any software or algorithms</li>
            <li>Remove, alter, or obscure any copyright or proprietary notices</li>
            <li>Use automated systems to scrape, harvest, or extract data or designs</li>
            <li>Create derivative works based on our proprietary 3D assets or UI designs</li>
          </ul>
        </Section>

        <Section title="3. Acceptable Use Policy" icon={<FileText className="w-5 h-5" />} delay={0.5}>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Use the Services for any unlawful purpose or in violation of any applicable laws</li>
            <li>Attempt to gain unauthorized access to any part of the Services</li>
            <li>Interfere with or disrupt the integrity or performance of the Services</li>
            <li>Use any robot, spider, scraper, or other automated means to access the Services</li>
            <li>Transmit any viruses, malware, or other harmful code</li>
            <li>Impersonate any person or entity or misrepresent your affiliation</li>
          </ul>
        </Section>

        <Section title="4. User Accounts & Security" icon={<Shield className="w-5 h-5" />} delay={0.6}>
          <p>
            <strong className="text-white">4.1 Account Creation.</strong> To access certain features
            of the Services, you must create an account. You agree to provide accurate, current, and
            complete information and to update such information as necessary.
          </p>
          <p className="mt-4">
            <strong className="text-white">4.2 Security.</strong> You are responsible for maintaining
            the confidentiality of your account credentials and for all activities that occur under
            your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </Section>

        <Section title="5. Payment Terms" icon={<Scale className="w-5 h-5" />} delay={0.7}>
          <p>
            <strong className="text-white">5.1 Fees.</strong> Certain Services may require payment
            of fees. All fees are quoted in Australian Dollars (AUD) unless otherwise specified.
          </p>
          <p className="mt-4">
            <strong className="text-white">5.2 Billing.</strong> Subscription fees are billed in
            advance on a monthly or annual basis. Credit-based services are charged at the time
            of purchase.
          </p>
          <p className="mt-4">
            <strong className="text-white">5.3 Refunds.</strong> Subscription fees are non-refundable
            except as required by law or as expressly stated in these Terms.
          </p>
        </Section>

        <Section title="6. Limitation of Liability" icon={<Scale className="w-5 h-5" />} delay={0.8}>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHERRY ENTERPRISE SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
            PROFITS, REVENUE, DATA, OR USE, ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES.
          </p>
          <p className="mt-4">
            OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO US IN THE TWELVE (12)
            MONTHS PRECEDING THE CLAIM.
          </p>
        </Section>

        <Section title="7. Indemnification" icon={<Shield className="w-5 h-5" />} delay={0.9}>
          <p>
            You agree to indemnify, defend, and hold harmless Cherry Enterprise and its officers,
            directors, employees, and agents from and against any claims, liabilities, damages,
            losses, and expenses arising out of or related to your use of the Services or violation
            of these Terms.
          </p>
        </Section>

        <Section title="8. Termination" icon={<FileText className="w-5 h-5" />} delay={1.0}>
          <p>
            We may terminate or suspend your access to the Services at any time, with or without
            cause, and with or without notice. Upon termination, your right to use the Services
            will immediately cease.
          </p>
        </Section>

        <Section title="9. Governing Law & Dispute Resolution" icon={<Scale className="w-5 h-5" />} delay={1.1}>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Australia.
            Any disputes arising under these Terms shall be resolved through binding arbitration in
            accordance with the rules of the Australian Centre for International Commercial Arbitration.
          </p>
        </Section>

        <Section title="10. Contact Information" icon={<FileText className="w-5 h-5" />} delay={1.2}>
          <p>
            For questions about these Terms, please contact us at:
          </p>
          <div className="mt-4 bg-bark-dark/50 rounded-lg p-4 border border-cherry-ripe/10">
            <p><strong className="text-white">Cherry Enterprise</strong></p>
            <p>ABN: 89 767 167 506</p>
            <p>Email: legal@cherry-collective.com</p>
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
            Protected by International Copyright Law.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsOfService;
