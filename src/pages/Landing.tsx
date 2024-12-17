import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChartLine, Shield, Users, ArrowRight, Brain, FileSearch, PieChart, Lock } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/Wealth-Manager-Logo.png" 
            alt="Wealth Manager" 
            className="h-10"
          />
        </div>
        <Link to="/login">
          <Button>
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#403E43]">
          Manage Your Family's Wealth
          <br />
          <span className="text-[#0FA0CE]">With Intelligence</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A comprehensive solution powered by AI for tracking, managing, and growing your family's investments across multiple asset classes.
        </p>
        <Link to="/login">
          <Button size="lg" className="text-lg px-8 bg-[#0FA0CE] hover:bg-[#0D8BAF]">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="p-6 rounded-lg border bg-card">
            <ChartLine className="h-12 w-12 text-[#0FA0CE] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#403E43]">Investment Tracking</h3>
            <p className="text-muted-foreground">
              Track investments across multiple asset classes, from stocks and mutual funds to real estate and gold.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <Users className="h-12 w-12 text-[#0FA0CE] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#403E43]">Family Management</h3>
            <p className="text-muted-foreground">
              Organize investments by family member and track individual portfolio performance.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <FileSearch className="h-12 w-12 text-[#0FA0CE] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#403E43]">OCR Processing</h3>
            <p className="text-muted-foreground">
              Extract investment details automatically from documents and receipts using advanced OCR technology.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <Brain className="h-12 w-12 text-[#0FA0CE] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#403E43]">AI Insights</h3>
            <p className="text-muted-foreground">
              Get intelligent insights and recommendations for portfolio optimization and growth.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6">
            <PieChart className="h-12 w-12 text-[#0FA0CE] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#403E43]">Portfolio Diversification</h3>
            <p className="text-muted-foreground">
              Visual insights into your asset allocation and diversification strategies.
            </p>
          </div>
          <div className="p-6">
            <Lock className="h-12 w-12 text-[#0FA0CE] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#403E43]">Secure Sharing</h3>
            <p className="text-muted-foreground">
              Share portfolio insights securely with family members or financial advisors.
            </p>
          </div>
          <div className="p-6">
            <Shield className="h-12 w-12 text-[#0FA0CE] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[#403E43]">Data Security</h3>
            <p className="text-muted-foreground">
              Bank-grade security ensures your family's financial data stays private and protected.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-[#403E43]">Ready to Start?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of families who trust us with their wealth management needs.
        </p>
        <Link to="/login">
          <Button size="lg" variant="outline" className="text-lg px-8 border-[#0FA0CE] text-[#0FA0CE] hover:bg-[#0FA0CE] hover:text-white">
            Create Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Landing;