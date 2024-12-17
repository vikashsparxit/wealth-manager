import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChartLineUp, Shield, Users, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Family Wealth Manager</div>
        <Link to="/login">
          <Button>
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Manage Your Family's Wealth
          <br />
          <span className="text-primary">With Confidence</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A comprehensive solution for tracking, managing, and growing your family's investments across multiple asset classes.
        </p>
        <Link to="/login">
          <Button size="lg" className="text-lg px-8">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-card">
            <ChartLineUp className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Investment Tracking</h3>
            <p className="text-muted-foreground">
              Track investments across multiple asset classes, from stocks and mutual funds to real estate and gold.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Family Management</h3>
            <p className="text-muted-foreground">
              Organize investments by family member and track individual portfolio performance.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-muted-foreground">
              Bank-grade security ensures your family's financial data stays private and protected.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of families who trust us with their wealth management needs.
        </p>
        <Link to="/login">
          <Button size="lg" variant="outline" className="text-lg px-8">
            Create Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Landing;