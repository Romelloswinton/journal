// app/components/Footer.tsx
import { Flower, Heart, Github, Twitter } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border py-6 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          {/* Logo and copyright */}
          <div className="flex items-center mb-4 md:mb-0">
            <Flower className="h-5 w-5 text-pink-500" />
            <span className="ml-2 text-sm text-muted-foreground">
              © {currentYear} Rosebud. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground justify-center">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors duration-200"
            >
              Terms
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors duration-200"
            >
              Blog
            </Link>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Link>
            <span className="text-xs text-muted-foreground flex items-center">
              Made with <Heart className="h-3 w-3 text-pink-500 mx-1" /> by
              Rosebud Team
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
