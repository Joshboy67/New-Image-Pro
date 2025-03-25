'use client';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support | ImagePro",
  description: "Get help and support for using ImagePro's image processing features",
};

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Help & Support</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* FAQ Section */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">How do I upload an image?</h3>
              <p className="text-muted-foreground">
                Click the "Upload Image" button in the dashboard or drag and drop an image into the upload area. Supported formats include JPG, PNG, and WebP.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">What image formats are supported?</h3>
              <p className="text-muted-foreground">
                We support JPG, PNG, WebP, and GIF formats. Maximum file size is 10MB.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">How do I edit my images?</h3>
              <p className="text-muted-foreground">
                After uploading, use the editing tools in the dashboard to adjust brightness, contrast, apply filters, and more.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Can I process multiple images at once?</h3>
              <p className="text-muted-foreground">
                Yes! Use our batch processing feature to apply the same edits to multiple images simultaneously.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Need more help? Our support team is here for you.
            </p>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                <a href="mailto:support@imagepro.com" className="text-primary hover:underline">
                  support@imagepro.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Hours:</span>
                <span>Monday - Friday, 9am - 5pm EST</span>
              </p>
            </div>
            <div className="mt-6">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Section */}
      <div className="mt-12 bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground mb-4">
            For detailed guides and tutorials, visit our documentation.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="#"
              className="block p-4 rounded-md border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-medium mb-2">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Learn the basics of using ImagePro for your image processing needs.
              </p>
            </a>
            <a
              href="#"
              className="block p-4 rounded-md border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-medium mb-2">Advanced Features</h3>
              <p className="text-sm text-muted-foreground">
                Explore advanced editing tools and batch processing capabilities.
              </p>
            </a>
            <a
              href="#"
              className="block p-4 rounded-md border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-medium mb-2">API Reference</h3>
              <p className="text-sm text-muted-foreground">
                Technical documentation for developers integrating with ImagePro.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 