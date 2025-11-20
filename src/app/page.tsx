import Link from 'next/link';
import { Mail, Shield, Database, Zap, ArrowRight, Check, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">Email Client</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">How It Works</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">FAQ</a>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Self-Hosted • Privacy-First • Free Forever
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Your Email, Your Control
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            A modern, self-hosted email client that connects to Gmail. Store emails locally with MongoDB while maintaining full Gmail integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 h-14 shadow-lg hover:shadow-xl transition-all">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link
             href="https://github.com/pratham-prog861/self-host-gmail"
             target="_blank"
             rel="noopener noreferrer"
             >
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
              <Github className="mr-2 w-5 h-5" />
              View on GitHub
            </Button>            
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-white dark:bg-gray-900 rounded-3xl my-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need for email management</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Mail className="w-8 h-8" />,
              title: 'Gmail Integration',
              description: 'Connect via IMAP/SMTP for free. No API costs.',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: <Database className="w-8 h-8" />,
              title: 'Local Storage',
              description: 'Store emails in your own MongoDB database.',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: 'Privacy First',
              description: 'Your data stays on your machine. Complete control.',
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'Lightning Fast',
              description: 'Built with Next.js 15 and modern tech stack.',
              color: 'from-yellow-500 to-orange-500',
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Get started in 3 simple steps</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              step: '01',
              title: 'Sign In with Google',
              description: 'Authenticate securely using your Google account. No passwords to remember.',
            },
            {
              step: '02',
              title: 'Configure Gmail Access',
              description: 'Set up Gmail App Password for IMAP/SMTP access. We guide you through it.',
            },
            {
              step: '03',
              title: 'Start Managing Emails',
              description: 'Sync, read, compose, and send emails. All stored locally in MongoDB.',
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="text-5xl font-bold text-transparent bg-linear-to-br from-blue-500 to-purple-600 bg-clip-text">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl my-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Free forever. No hidden costs.</p>
        </div>
        <div className="max-w-lg mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-blue-500 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Self-Hosted</h3>
              <div className="text-5xl font-bold mb-2">$0</div>
              <p className="text-gray-600 dark:text-gray-400">Forever free</p>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                'Unlimited emails',
                'Local MongoDB storage',
                'Gmail IMAP/SMTP integration',
                'Modern UI with dark mode',
                'Full source code access',
                'No API costs',
                'Complete privacy',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/login">
              <Button className="w-full h-12 text-lg">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to know</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Is this really free?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                Yes! This is a self-hosted solution. You run it on your own machine with your own MongoDB database. There are no subscription fees or API costs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Do I need a Gmail account?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                Yes, you need a Gmail account to use this email client. We connect to Gmail via IMAP for receiving emails and SMTP for sending emails.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Is my data secure?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                Absolutely! All your emails are stored locally on your machine in MongoDB. We don't send your data to any third-party servers. You have complete control over your data.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                What is MongoDB and do I need it?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                MongoDB is a database that stores your emails locally. Yes, you need MongoDB running on your machine. You can install MongoDB Community Edition or use MongoDB Compass (which includes a local server).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Can I use this for commercial purposes?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                Yes! This project is licensed under the MIT License, which allows commercial use. You can modify and distribute it as you wish.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">Email Client</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Self-hosted Gmail client with local storage and complete privacy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#features" className="hover:text-gray-900 dark:hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white transition">How It Works</a></li>
                <li><a href="#faq" className="hover:text-gray-900 dark:hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">GitHub</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">License</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 Email Client. Built with ❤️ using Next.js, MongoDB, and Gmail.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
