import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Award, Copyright, AlertTriangle, Briefcase, Scale } from 'lucide-react';
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

const IntellectualProperty: React.FC = () => {
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
            <Copyright className="w-4 h-4" />
            Intellectual Property
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            IP & Trademark Policy
          </h1>
          <p className="text-white/50">
            Last Updated: January 6, 2026 | Effective Date: January 1, 2026
          </p>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-cherry-ripe/10 backdrop-blur-sm rounded-2xl p-6 border border-cherry-ripe/30 mb-10"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-cherry-ripe flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Legal Notice</h3>
              <p className="text-white/80 leading-relaxed">
                All intellectual property rights in the Cherrypicker platform, including the "Immersive
                Orchard" interface, are owned exclusively by Cherry Enterprise (ABN: 89 767 167 506).
                Unauthorized reproduction, distribution, or use of our proprietary materials may result
                in civil and criminal penalties.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <Section title="1. Trademarks & Brand Assets" icon={<Award className="w-5 h-5" />} delay={0.3}>
          <p>
            <strong className="text-white">1.1 Registered Marks.</strong> The following are registered
            or pending trademarks of Cherry Enterprise:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li><strong className="text-cherry-light">"Cherrypicker"</strong> - Word mark for AI-powered lead intelligence services</li>
            <li><strong className="text-cherry-light">"Cherry Enterprise"</strong> - Corporate identity</li>
            <li><strong className="text-cherry-light">"Immersive Orchard"</strong> - 3D user interface trademark</li>
            <li><strong className="text-cherry-light">"Pick the Ripest Leads"</strong> - Slogan trademark</li>
            <li><strong className="text-cherry-light">Cherry Pair Logo</strong> - Figurative mark</li>
          </ul>
          <p className="mt-4">
            <strong className="text-white">1.2 Usage Guidelines.</strong> You may not use our trademarks
            without prior written permission, except as necessary to refer to our Services in a
            non-commercial, informational context.
          </p>
        </Section>

        <Section title="2. Proprietary Interface Design" icon={<Shield className="w-5 h-5" />} delay={0.4}>
          <p>
            <strong className="text-white">2.1 The Immersive Orchard.</strong> Our three-dimensional
            "Immersive Orchard" user interface represents significant creative and technical investment
            and is protected as:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Trade dress under Australian and international trademark law</li>
            <li>Original artistic work under the Copyright Act 1968 (Cth)</li>
            <li>Proprietary trade secrets and confidential information</li>
          </ul>
          <p className="mt-4">
            <strong className="text-white">2.2 Protected Elements.</strong> The following design
            elements are expressly protected:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Glass cherry metaphor for navigation and data visualization</li>
            <li>3D cherry tree hero component with interactive cherries</li>
            <li>Cherry particle transition effects and animations</li>
            <li>Magnetic cursor interactions and petal trail effects</li>
            <li>Color palette: bark-dark (#1A0A0A), cherry-ripe (#C41E3A), cherry-light (#FFB7C5)</li>
            <li>Custom WebGL shaders and procedural generation algorithms</li>
          </ul>
        </Section>

        <Section title="3. Software & Source Code" icon={<Briefcase className="w-5 h-5" />} delay={0.5}>
          <p>
            <strong className="text-white">3.1 Proprietary Code.</strong> All source code, algorithms,
            and technical implementations of the Cherrypicker platform are proprietary and confidential:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>AI/ML models for lead scoring and analysis</li>
            <li>Three.js/React Three Fiber implementations</li>
            <li>Custom shaders (GLSL) for visual effects</li>
            <li>Backend API architecture and business logic</li>
            <li>Database schemas and data structures</li>
          </ul>
          <p className="mt-4">
            <strong className="text-white">3.2 Anti-Reverse Engineering.</strong> You are expressly
            prohibited from:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Decompiling, disassembling, or reverse engineering any software</li>
            <li>Extracting design assets, 3D models, or textures</li>
            <li>Copying UI/UX patterns or interaction designs</li>
            <li>Scraping or automated data collection</li>
            <li>Creating derivative works or competitive imitations</li>
          </ul>
        </Section>

        <Section title="4. Content & Data" icon={<Copyright className="w-5 h-5" />} delay={0.6}>
          <p>
            <strong className="text-white">4.1 Company Content.</strong> All content provided through
            our Services, including but not limited to text, graphics, logos, images, audio clips,
            and software, is owned by Cherry Enterprise or its licensors and protected by copyright.
          </p>
          <p className="mt-4">
            <strong className="text-white">4.2 User Content.</strong> You retain ownership of content
            you submit to our Services. By submitting content, you grant Cherry Enterprise a
            non-exclusive, worldwide, royalty-free license to use, reproduce, and display such
            content solely for operating the Services.
          </p>
        </Section>

        <Section title="5. Enforcement & Remedies" icon={<Scale className="w-5 h-5" />} delay={0.7}>
          <p>
            <strong className="text-white">5.1 Monitoring.</strong> We actively monitor for
            unauthorized use of our intellectual property through:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Automated design similarity detection systems</li>
            <li>Brand monitoring services</li>
            <li>User and community reporting</li>
          </ul>
          <p className="mt-4">
            <strong className="text-white">5.2 Remedies.</strong> Violations may result in:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Immediate termination of account access</li>
            <li>Civil litigation seeking injunctive relief and damages</li>
            <li>Criminal referral for willful infringement</li>
            <li>Recovery of attorney's fees and costs</li>
            <li>Statutory damages under applicable copyright and trademark laws</li>
          </ul>
        </Section>

        <Section title="6. DMCA / Copyright Takedown" icon={<AlertTriangle className="w-5 h-5" />} delay={0.8}>
          <p>
            If you believe your copyrighted work has been infringed, please send a notice to our
            designated agent with:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Identification of the copyrighted work</li>
            <li>Identification of the infringing material and its location</li>
            <li>Your contact information</li>
            <li>A statement of good faith belief</li>
            <li>A statement of accuracy under penalty of perjury</li>
            <li>Your physical or electronic signature</li>
          </ul>
          <div className="mt-4 bg-bark-dark/50 rounded-lg p-4 border border-cherry-ripe/10">
            <p><strong className="text-white">DMCA Agent</strong></p>
            <p>Cherry Enterprise Legal Department</p>
            <p>Email: legal@cherry-collective.com</p>
          </div>
        </Section>

        <Section title="7. Licensing Inquiries" icon={<Briefcase className="w-5 h-5" />} delay={0.9}>
          <p>
            For licensing inquiries regarding any Cherry Enterprise intellectual property, including
            API access, white-label solutions, or partnership opportunities:
          </p>
          <div className="mt-4 bg-bark-dark/50 rounded-lg p-4 border border-cherry-ripe/10">
            <p><strong className="text-white">Business Development</strong></p>
            <p>Cherry Enterprise</p>
            <p>ABN: 89 767 167 506</p>
            <p>Email: partnerships@cherry-collective.com</p>
          </div>
        </Section>

        {/* Footer notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-16 pt-8 border-t border-cherry-ripe/10 text-center"
        >
          <p className="text-white/40 text-sm">
            © 2026 Cherry Enterprise. All Rights Reserved.
            <br />
            Protected by Australian Copyright Act 1968 and International Treaties.
            <br />
            Unauthorized reproduction is strictly prohibited.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default IntellectualProperty;
