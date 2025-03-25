import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Professional Image Editing
          <span className="text-primary"> Powered by AI</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
          Transform your images with our powerful AI tools. Remove backgrounds, upscale images, and more with just a few clicks.
        </p>
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Get Started
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Powerful Features for Your Images
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Background Removal */}
            <div className="rounded-lg border bg-card p-6 text-center">
              <h3 className="mb-4 text-xl font-semibold">Background Removal</h3>
              <p className="text-muted-foreground">
                Remove backgrounds from images instantly with our advanced AI technology.
              </p>
            </div>

            {/* Image Upscaling */}
            <div className="rounded-lg border bg-card p-6 text-center">
              <h3 className="mb-4 text-xl font-semibold">Image Upscaling</h3>
              <p className="text-muted-foreground">
                Enhance image quality and resolution without losing details.
              </p>
            </div>

            {/* Object Removal */}
            <div className="rounded-lg border bg-card p-6 text-center">
              <h3 className="mb-4 text-xl font-semibold">Object Removal</h3>
              <p className="text-muted-foreground">
                Remove unwanted objects from your images seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Transform Your Images?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of users who trust ImagePro for their image editing needs.
          </p>
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start Editing Now
          </Link>
        </div>
      </section>
    </div>
  )
}
