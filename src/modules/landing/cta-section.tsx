"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Check,
  Brain,
  Mail,
  Sparkles,
  Linkedin,
  Phone,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const ctaFeatures = [
    "Complete employee lifecycle management",
    "AI-powered automation and insights",
    "Advanced payroll and attendance tracking",
    "Document management with AI chat",
    "Role-based access and permissions",
    "Real-time analytics and reporting",
  ];

  return (
    <section className="relative overflow-hidden px-6 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      {/* Background */}
      <div className="from-primary/3 via-background to-muted/10 absolute inset-0 bg-gradient-to-br" />

      {/* Floating Elements - Simplified */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-8 hidden opacity-40 xl:block"
      >
        <div className="bg-primary/15 flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-sm">
          <Sparkles className="text-primary h-4 w-4" />
        </div>
      </motion.div>

      <div className="relative mx-auto max-w-7xl">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <Card className="from-background to-muted/20 border-primary/10 relative overflow-hidden border bg-gradient-to-br shadow-xl backdrop-blur-sm">
            <CardContent className="p-6 text-center sm:p-8 lg:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-4 sm:mb-6"
              >
                <Badge
                  variant="secondary"
                  className="border-primary/20 bg-primary/5 border px-4 py-2"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Your Internal HRMS
                </Badge>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-foreground mb-3 text-xl leading-tight font-bold sm:mb-4 sm:text-2xl lg:text-3xl"
              >
                Simplifi-IQ HR{" "}
                <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-transparent">
                  Management Portal
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground mx-auto mb-6 max-w-xl text-sm leading-relaxed sm:mb-8 sm:text-base lg:text-lg"
              >
                Access the AI-powered HRMS built exclusively for Simplifi-IQ.
                Sign in to manage employees, attendance, payroll, and more.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mx-auto mb-6 hidden max-w-xl gap-3 text-left sm:mb-8 sm:grid sm:grid-cols-2 lg:gap-4"
              >
                {ctaFeatures.map((feature) => (
                  <div key={feature} className="flex items-start">
                    <Check className="text-primary mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      className="h-11 w-full px-6 text-sm font-semibold shadow-lg sm:h-12 sm:w-auto sm:px-8 sm:text-base"
                    >
                      Sign In to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <a
                    href="https://www.simplifiiq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-primary/20 hover:border-primary/50 h-11 w-full border-2 px-6 text-sm font-semibold sm:h-12 sm:w-auto sm:px-8 sm:text-base"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Simplifi-IQ
                    </Button>
                  </a>
                </motion.div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground mt-4 text-xs sm:mt-6 sm:text-sm"
              >
                Invitation-only access • Contact HR for onboarding
              </motion.p>
            </CardContent>

            {/* Decorative Elements - Simplified */}
            <div className="bg-primary/8 absolute -top-8 -right-8 h-16 w-16 rounded-full blur-2xl" />
            <div className="bg-primary/5 absolute -bottom-8 -left-8 h-20 w-20 rounded-full blur-2xl" />
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center sm:mt-12"
        >
          <p className="text-muted-foreground mb-3 text-sm sm:mb-4">
            For inquiries or support, reach out to the Simplifi-IQ team.
          </p>
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-6">
            <div className="text-muted-foreground flex items-center text-sm">
              <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <a
                href="mailto:contact@simplifiiq.com"
                className="text-muted-foreground hover:text-primary transition-colors hover:underline"
              >
                contact@simplifiiq.com
              </a>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <Phone className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <a
                href="tel:+971504767628"
                className="text-muted-foreground hover:text-primary transition-colors hover:underline"
              >
                +971 50 4767628
              </a>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <Linkedin className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <a
                href="https://www.linkedin.com/company/simplifiiq/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors hover:underline"
              >
                Simplifi-IQ
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-muted-foreground absolute bottom-2 left-1/2 w-full -translate-x-1/2 transform text-center text-xs sm:bottom-4 sm:text-sm">
        {"© "}{new Date().getFullYear()}{" "}
        <a
          href="https://www.simplifiiq.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary"
        >
          Simplifi-IQ
        </a>
        {". All rights reserved."}
      </p>
    </section>
  );
}
