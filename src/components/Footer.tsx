"use client";

import Link from "next/link";
import { Mail, Heart,} from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Logo & Description */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight"
            >
              Crowd<span className="text-primary">Fund</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Empowering ideas through community-driven crowdfunding.
              Discover inspiring projects, support creators, and bring
              innovation to life together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-primary"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/campaigns"
                  className="transition hover:text-primary"
                >
                  All Campaigns
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition hover:text-primary"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Connect With Me
            </h3>

            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/your-github"
                target="_blank"
                className="rounded-full border p-3 transition hover:bg-primary hover:text-primary-foreground"
              >
                <FaGithub size={20} />
              </Link>

              <Link
                href="https://linkedin.com/in/your-linkedin"
                target="_blank"
                className="rounded-full border p-3 transition hover:bg-primary hover:text-primary-foreground"
              >
                <FaLinkedin size={20} />
              </Link>

              <Link
                href="https://facebook.com/your-facebook"
                target="_blank"
                className="rounded-full border p-3 transition hover:bg-primary hover:text-primary-foreground"
              >
                <FaFacebook size={20} />
              </Link>

              <Link
                href="mailto:your@email.com"
                className="rounded-full border p-3 transition hover:bg-primary hover:text-primary-foreground"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {year} CrowdFund. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            by Rana Khan
          </p>
        </div>
      </div>
    </footer>
  );
}