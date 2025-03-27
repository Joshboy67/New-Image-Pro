import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ImageIcon, ZapIcon, ShieldIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Transform your images with AI
                </h1>
                <p className="text-lg text-gray-500 md:text-xl">
                  Professional-grade image editing made simple. Remove backgrounds, upscale, enhance, and more with our AI-powered tools.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-blue-100"></div>
              <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-blue-200"></div>
              <div className="relative mx-auto aspect-square overflow-hidden rounded-lg border shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-24 w-24 text-white opacity-75" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Transform Your Images Instantly</h2>
            <p className="mt-4 text-lg text-gray-500">
              Our AI-powered tools make professional image editing accessible to everyone.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium">{feature.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-600 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your images?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Get started today and experience the power of AI image processing.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/dashboard">Start Editing Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'Background Remover',
    description: 'Remove backgrounds from images with a single click. Perfect for product photos and portraits.',
    icon: ImageIcon,
  },
  {
    name: 'Image Upscaler',
    description: 'Enhance low-resolution images without losing quality. Increase size up to 4x.',
    icon: ZapIcon,
  },
  {
    name: 'Object Removal',
    description: 'Remove unwanted objects from your photos. Our AI fills in the background seamlessly.',
    icon: ShieldIcon,
  },
  {
    name: 'Image Enhancement',
    description: 'Automatic color correction, contrast enhancement, and noise reduction.',
    icon: ImageIcon,
  },
];
