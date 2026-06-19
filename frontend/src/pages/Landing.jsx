import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const Landing = () => {
  return (
    <div className="bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-16 px-gutter bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
          </div>
          <span className="text-headline-md font-bold tracking-tight">CloudVault</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a className="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#features">Features</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#pricing">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-on-surface-variant hover:text-primary text-label-md transition-colors">Sign In</Link>
          <Link to="/register" className="bg-primary text-on-primary px-6 py-2 rounded-full text-label-md hover:shadow-[0_0_20px_rgba(173,198,255,0.3)] transition-all active:scale-95">Get Started</Link>
        </div>
      </nav>

      <main className="relative pt-16 overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center px-gutter pt-20 pb-32">
          <div className="hero-glow absolute inset-0 -z-10" />
          <motion.div
            className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-stack-lg items-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <div className="space-y-stack-lg text-center lg:text-left">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary-container/20 border border-secondary/20 text-secondary text-label-md">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Trusted by 2,000+ teams worldwide
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-display-lg leading-tight lg:max-w-xl">
                Secure Cloud Storage for <span className="text-primary">Modern Teams</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-body-lg text-on-surface-variant max-w-lg mx-auto lg:mx-0">
                The premium workspace experience designed for speed, safety, and seamless collaboration. Scale your storage with military-grade encryption.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="bg-primary text-on-primary px-8 py-4 rounded-xl text-label-md font-bold hover:shadow-[0_0_30px_rgba(173,198,255,0.4)] transition-all flex items-center justify-center gap-2 group">
                  Get Started Free
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
                <button className="glass-card text-on-surface px-8 py-4 rounded-xl text-label-md font-bold hover:bg-surface-variant/40 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">play_circle</span>
                  View Demo
                </button>
              </motion.div>
              <motion.div variants={fadeUp} className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="font-bold text-headline-md italic">TECHCORP</span>
                <span className="font-bold text-headline-md italic">Lumina</span>
                <span className="font-bold text-headline-md italic">NEXUS</span>
              </motion.div>
            </div>
            <motion.div variants={fadeUp} className="relative hidden lg:block">
              <div className="relative z-10 animate-float">
                <div className="glass-card p-4 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="w-full h-[500px] bg-gradient-to-br from-primary/20 via-surface-container to-secondary/20 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[120px] text-primary/30" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-tertiary/10 rounded-full blur-3xl" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="px-gutter py-stack-lg max-w-7xl mx-auto">
          <motion.div className="text-center mb-stack-lg" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-headline-lg mb-4">The Storage of Tomorrow</h2>
            <p className="text-on-surface-variant">Everything you need to manage your digital assets at scale.</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="md:col-span-2 glass-card p-glass-padding rounded-3xl hover:bg-surface-variant/30 transition-all cursor-default group border border-outline-variant/30">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
              </div>
              <h3 className="text-headline-md mb-2">File Storage</h3>
              <p className="text-on-surface-variant mb-6">Unlimited space for your team's creativity. High-performance access from anywhere.</p>
              <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-secondary to-primary" />
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="md:col-span-2 glass-card p-glass-padding rounded-3xl hover:bg-surface-variant/30 transition-all cursor-default group border border-outline-variant/30">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>share</span>
              </div>
              <h3 className="text-headline-md mb-2">Instant Sharing</h3>
              <p className="text-on-surface-variant mb-6">Collaborate in real-time with granular permissions and password-protected links.</p>
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-slate-500" />
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-blue-500" />
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-purple-500" />
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container flex items-center justify-center text-xs">+12</div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-1 glass-card p-glass-padding rounded-3xl hover:bg-surface-variant/30 transition-all border border-outline-variant/30">
              <div className="w-12 h-12 rounded-2xl bg-tertiary/20 flex items-center justify-center mb-6 text-tertiary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>backup</span>
              </div>
              <h3 className="text-headline-md mb-2">Auto Backup</h3>
              <p className="text-on-surface-variant text-body-sm">Sync your folders across devices automatically with zero latency.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-3 glass-card p-glass-padding rounded-3xl hover:bg-surface-variant/30 transition-all flex flex-col md:flex-row gap-6 items-center border border-outline-variant/30">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-2xl bg-on-secondary-container/20 flex items-center justify-center mb-6 text-secondary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                </div>
                <h3 className="text-headline-md mb-2">Advanced Analytics</h3>
                <p className="text-on-surface-variant text-body-sm">Track file interactions and team productivity with built-in insights.</p>
              </div>
              <div className="w-full md:w-64 h-32 bg-surface-container rounded-2xl p-4 flex items-end gap-2">
                <div className="w-full bg-primary h-1/2 rounded-t-sm" />
                <div className="w-full bg-secondary h-3/4 rounded-t-sm" />
                <div className="w-full bg-primary h-1/3 rounded-t-sm" />
                <div className="w-full bg-secondary h-full rounded-t-sm" />
                <div className="w-full bg-primary h-2/3 rounded-t-sm" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-gutter py-32 max-w-7xl mx-auto">
          <motion.div className="text-center mb-stack-lg" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-headline-lg mb-4">Choose Your Plan</h2>
            <p className="text-on-surface-variant">Simple pricing that scales with your growth.</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {/* Personal */}
            <motion.div variants={fadeUp} className="glass-card p-glass-padding rounded-3xl flex flex-col h-full border border-outline-variant/30">
              <div className="mb-8">
                <span className="text-label-md text-on-surface-variant uppercase tracking-widest">Personal</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-on-surface-variant">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {['10GB Cloud Storage', '1 Team Member', 'Basic Support'].map(f => (
                  <li key={f} className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span>{f}</li>
                ))}
              </ul>
              <Link to="/register" className="w-full py-3 rounded-xl border border-outline text-on-surface hover:bg-surface-variant transition-colors font-bold text-center block">Get Started</Link>
            </motion.div>
            {/* Business */}
            <motion.div variants={fadeUp} className="glass-card p-glass-padding rounded-3xl flex flex-col h-full border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-label-md">Most Popular</div>
              <div className="mb-8">
                <span className="text-label-md text-primary uppercase tracking-widest">Business</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$24</span>
                  <span className="text-on-surface-variant">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {['2TB Cloud Storage', 'Up to 15 Members', 'Priority Support', 'Advanced Analytics'].map(f => (
                  <li key={f} className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">check_circle</span>{f}</li>
                ))}
              </ul>
              <Link to="/register" className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:opacity-90 transition-opacity text-center block">Go Pro</Link>
            </motion.div>
            {/* Enterprise */}
            <motion.div variants={fadeUp} className="glass-card p-glass-padding rounded-3xl flex flex-col h-full border border-outline-variant/30">
              <div className="mb-8">
                <span className="text-label-md text-on-surface-variant uppercase tracking-widest">Enterprise</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {['Unlimited Storage', 'Unlimited Members', 'Dedicated Account Manager', 'SSO & Advanced Security'].map(f => (
                  <li key={f} className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span>{f}</li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border border-outline text-on-surface hover:bg-surface-variant transition-colors font-bold">Contact Sales</button>
            </motion.div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="px-gutter py-32">
          <motion.div
            className="max-w-5xl mx-auto glass-card p-stack-lg rounded-[3rem] text-center relative overflow-hidden"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            <h2 className="text-headline-lg-mobile md:text-display-lg mb-8 relative z-10">Ready to secure your future?</h2>
            <p className="text-on-surface-variant text-body-lg mb-12 max-w-2xl mx-auto relative z-10">Join thousands of teams who trust CloudVault for their mission-critical data storage.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/register" className="bg-primary text-on-primary px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(173,198,255,0.4)] transition-all active:scale-95">Get Started Now</Link>
              <button className="bg-surface-variant/30 text-on-surface px-12 py-4 rounded-2xl font-bold text-lg border border-outline-variant hover:bg-surface-variant/50 transition-all">Schedule Demo</button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface pt-20 pb-10 border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
              </div>
              <span className="text-headline-md font-bold tracking-tight">CloudVault</span>
            </div>
            <p className="text-on-surface-variant text-body-sm max-w-xs mb-6">Redefining data storage for the digital age. Secure, fast, and remarkably simple.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Enterprise'] },
            { title: 'Company', links: ['About', 'Careers', 'Contact', 'Blog'] },
            { title: 'Resources', links: ['Documentation', 'API Status', 'Security', 'Help Center'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-bold text-on-surface mb-6">{col.title}</h4>
              <ul className="space-y-4 text-on-surface-variant text-body-sm">
                {col.links.map(l => <li key={l}><a className="hover:text-primary transition-colors" href="#">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-6 py-10 border-t border-outline-variant/30 text-on-surface-variant text-label-md">
          <p>© 2024 CloudVault Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" />Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
