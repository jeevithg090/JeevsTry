import Link from "next/link"
import { ArrowRight, Briefcase, Calendar, CheckCircle2, MessageCircle, UserPlus, Users, Zap } from "lucide-react"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FEATURES = [
  {
    icon: Briefcase,
    title: "Freelancing marketplace",
    description: "Post projects or find your next gig, then manage proposals in one place.",
    accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60",
    points: ["Browse and save projects", "Submit proposals with milestones", "Freelancer profile & portfolio"],
  },
  {
    icon: Calendar,
    title: "Events, end to end",
    description: "Discover hackathons, meetups and workshops, or host your own.",
    accent: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60",
    points: ["Register in a couple of clicks", "Create events with ticket types", "Attendee list & check-in views"],
  },
  {
    icon: MessageCircle,
    title: "Community chat",
    description: "Talk shop in topic groups or one-to-one with other members.",
    accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60",
    points: ["Public & private groups", "Direct messages and reactions", "Group moderation settings"],
  },
] as const

const STEPS = [
  { icon: UserPlus, title: "Pick your role", description: "Join as a freelancer, client or startup." },
  { icon: Zap, title: "Get a tailored dashboard", description: "Navigation and actions adapt to how you work." },
  { icon: Users, title: "Collaborate", description: "Hire, get hired, meet people and keep talking." },
] as const

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/80 via-background to-background dark:from-blue-950/30">
      <Header />

      <main id="main-content">
        {/* Hero */}
        <section className="container pb-8 pt-16 sm:pb-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              Freelancing · Events · Community
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl dark:from-blue-400 dark:to-purple-400">
              Connect. Collaborate. Create.
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              One workspace where freelancers find gigs, communities stay in touch and tech events come together, so you
              can stop juggling a handful of tools.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/auth/signup">
                  Get started free <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="features-heading" className="container py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 id="features-heading" className="mb-3 text-3xl font-bold tracking-tight">
              Everything in one place
            </h2>
            <p className="text-muted-foreground">Three tools that usually live apart, built to work together.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description, accent, points }) => (
              <Card key={title} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${accent}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <CardDescription className="text-base">{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading" className="container py-16">
          <h2 id="how-heading" className="mb-12 text-center text-3xl font-bold tracking-tight">
            How it works
          </h2>
          <ol className="grid gap-8 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">Step {index + 1}</p>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
          <div className="container text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Ready to try it?</h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-white/90">
              Create an account in under a minute and explore the full dashboard.
            </p>
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base" asChild>
              <Link href="/auth/signup">
                Create your account <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-12 text-gray-300">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xl font-bold text-white">TechCollab</p>
              <p>Freelancing, events and community for people who build with technology.</p>
            </div>
            <nav aria-label="Footer">
              <h2 className="mb-3 font-semibold text-white">Platform</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard/freelancing" className="hover:text-white">
                    Freelancing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/events" className="hover:text-white">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/community" className="hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <p className="mt-10 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} TechCollab
          </p>
        </div>
      </footer>
    </div>
  )
}
