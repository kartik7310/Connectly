import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, ArrowRight, Shield, UserPlus, MessageCircle,
  ThumbsUp, ThumbsDown, Users, CheckCircle2
} from 'lucide-react';

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                  C
                </div>
                Connexto
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</Link>
              <Link to="/signup" className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-sm">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-900 p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#features" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Features</a>
              <a href="#pricing" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Pricing</a>
              <Link to="/login" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Log in</Link>
              <Link
                to="/signup"
                className="block w-full text-center bg-primary-600 text-white px-3 py-3 mt-4 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary-600"></span>
              The new way to connect
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-tight">
              Build your network with <span className="text-primary-600">intention</span>.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Verify profiles, find the right people, and communicate securely. Connexto is the professional platform designed for meaningful relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                Create your account <ArrowRight size={18} />
              </Link>
              <a href="#features" className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-3.5 rounded-lg font-medium flex items-center justify-center transition-all">
                Explore features
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">Free to join. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
              Everything you need to connect
            </h2>
            <p className="text-lg text-gray-600">
              Powerful tools designed to keep your professional network clean, relevant, and secure.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Secure Auth */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6 text-primary-600">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Profiles</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Connect with confidence. Our secure authentication ensures you are talking to real professionals.
              </p>
            </div>

            {/* Send Connection Requests */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6 text-primary-600">
                <UserPlus size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Grow Intelligently</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Discover relevant people in your industry and build your network with intentional requests.
              </p>
            </div>

            {/* Feed: Interest / Ignore */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6 text-primary-600">
                <ThumbsUp size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Curated Feed</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Express interest or pass on profiles to train your feed to show only what matters to you.
              </p>
            </div>

            {/* Accept / Reject + Chat */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6 text-primary-600">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Private Messaging</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Real-time, secure chat unlocks only after a mutual connection is established. No spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600">Start for free and upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic</h3>
              <p className="text-gray-500 mb-6 text-sm">Perfect for getting started</p>
              <div className="mb-6 pb-6 border-b border-gray-100">
                <span className="text-4xl font-bold text-gray-900">₹0</span>
                <span className="text-gray-500 font-medium">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-600 text-sm">
                  <CheckCircle2 size={18} className="text-primary-500 flex-shrink-0" />
                  <span>30 connection requests / day</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600 text-sm">
                  <CheckCircle2 size={18} className="text-primary-500 flex-shrink-0" />
                  <span>Curated matching feed</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600 text-sm">
                  <CheckCircle2 size={18} className="text-primary-500 flex-shrink-0" />
                  <span>Secure private messaging</span>
                </li>
              </ul>
              <Link
                to="/signup"
                className="w-full inline-block text-center bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium py-3 rounded-xl transition-colors border border-gray-200"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gray-900 rounded-3xl p-8 shadow-xl relative border border-gray-800">
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Most Popular</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium</h3>
              <p className="text-gray-400 mb-6 text-sm">For serious networkers</p>
              <div className="mb-6 pb-6 border-b border-gray-800">
                <span className="text-4xl font-bold text-white">₹300</span>
                <span className="text-gray-400 font-medium">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-primary-400 flex-shrink-0" />
                  <span>Unlimited connection requests</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-primary-400 flex-shrink-0" />
                  <span>See who viewed your profile</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-primary-400 flex-shrink-0" />
                  <span>Priority feed placement</span>
                </li>
              </ul>
              <Link
                to="/premium"
                className="w-full inline-block text-center bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-6">Ready to expand your network?</h2>
          <p className="text-lg text-gray-600 mb-10">
            Join thousands of professionals already using Connexto to build meaningful relationships.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
          >
            Create your free account <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
