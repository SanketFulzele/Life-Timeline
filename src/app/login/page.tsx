import { Suspense } from "react";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { CursorGlow } from "@/components/cursor-glow";
import { DotBackground } from "@/components/dot-background";
import { HeroAurora } from "@/components/hero-aurora";
import { GoogleIcon, LockIcon, PhotoIcon, PulseIcon, TimelineIcon } from "@/components/icons";
import BlurText from "@/components/reactbits/BlurText";
import CountUp from "@/components/reactbits/CountUp";
import GradientText from "@/components/reactbits/GradientText";
import ShinyText from "@/components/reactbits/ShinyText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import StarBorder from "@/components/reactbits/StarBorder";
import { getViewer } from "@/lib/access";
import { birthDate } from "@/lib/config";


const FEATURES = [
  {
    icon: TimelineIcon,
    title: "Year by year",
    text: "Every year from birth to today on one line. Zoom into any year, month or day.",
    color: "rgba(139, 123, 255, 0.25)",
  },
  {
    icon: PulseIcon,
    title: "Highs and lows",
    text: "Milestones, good days and hard ones, each with a mood so the shape of life shows.",
    color: "rgba(52, 211, 153, 0.22)",
  },
  {
    icon: PhotoIcon,
    title: "Photo memories",
    text: "Link straight to albums in any of your Google Photos accounts.",
    color: "rgba(34, 211, 238, 0.22)",
  },
];

export default function LoginPage(props: PageProps<"/login">) {
  const startYear = birthDate().slice(0, 4);

  return (
    <main className="relative isolate flex-1 overflow-hidden">
      <DotBackground />
      <HeroAurora height="h-[680px]" opacity={0.7} />
      <CursorGlow />

      <section data-safe-x className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-20 text-center sm:pt-28">
        <span className="rise inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs backdrop-blur">
          <LockIcon className="size-3.5 text-zinc-400" />
          <ShinyText text={`Private journal · ${startYear} → today`} color="#a1a1aa" shineColor="#ffffff" speed={3} />
        </span>

        <div
          role="heading"
          aria-level={1}
          className="mt-7 text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-6xl"
        >
          <BlurText text="Life Timeline" trigger="load" animateBy="words" delay={90} className="justify-center" />
          {/* Still by default; a single soft violet sheen crosses the line on hover. */}
          <span className="rise mt-1 block [animation-delay:250ms]">
            <ShinyText
              text="one moment at a time."
              trigger="hover"
              color="#ffffff"
              shineColor="#a99cff"
              speed={1.4}
              shineWidth={30}
            />
          </span>
        </div>

        {/* Still by default; a single soft white sheen crosses the sentence on hover. */}
        <p className="rise mt-6 max-w-xl text-base leading-relaxed sm:text-lg [animation-delay:350ms]">
          <ShinyText
            text="A personal timeline of milestones, highs, lows and everyday moments, with links to the photos that go with them."
            trigger="hover"
            color="#a1a1aa"
            shineColor="#f4f4f5"
            speed={1.8}
            shineWidth={25}
          />
        </p>

        <Suspense fallback={<div className="mt-9 h-[52px]" />}>
          <SignIn searchParams={props.searchParams} />
        </Suspense>
      </section>

      {/* What the app is about */}
      <section data-safe-x className="mx-auto mt-20 w-full max-w-5xl px-4 sm:mt-24">
        <div className="panel rise relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[#8b7bff]/10 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1.15fr_1fr] md:items-center">
            <div>
              <p className="eyebrow">What this is</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                <GradientText colors={["#8b7bff", "#22d3ee", "#8b7bff"]} animationSpeed={7}>
                  Your life, on one line.
                </GradientText>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                Life Timeline is a private journal for the moments that made you — the big milestones, the hard
                days, and the ordinary Tuesdays worth remembering. Every year gets a row, every memory a dot,
                with photos linked straight from your albums.
              </p>
              <p className="mt-3 text-xs text-zinc-500">Only you can see it. Only you can add to it.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AboutStat value={<CountUp to={365} trigger="view" duration={1.5} />} label="days in a year" />
              <AboutStat value={<CountUp to={12} trigger="view" duration={1.2} />} label="months per year" />
              <AboutStat value={<CountUp to={4} trigger="view" duration={1} />} label="kinds of memories" />
              <AboutStat value={<CountUp to={100} suffix="%" trigger="view" duration={1.4} />} label="yours alone" />
            </div>
          </div>
        </div>
      </section>

      <section data-safe-x className="mx-auto mt-8 grid w-full max-w-5xl gap-4 px-4 pb-20 sm:mt-10 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text, color }, i) => (
          <SpotlightCard
            key={title}
            spotlightColor={color}
            className="rise !rounded-2xl !p-6 text-left"
            style={{ animationDelay: `${500 + i * 120}ms`, "--spotlight-card-surface": "rgba(17,17,20,0.75)" } as React.CSSProperties}
          >
            <span className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200">
              <Icon />
            </span>
            <h2 className="mt-4 font-medium text-zinc-100">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{text}</p>
          </SpotlightCard>
        ))}
      </section>
    </main>
  );
}

async function SignIn({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const [{ error }, viewer] = await Promise.all([searchParams, getViewer()]);
  if (viewer.isOwner) redirect("/");

  return (
    <div className="rise mt-9 flex flex-col items-center [animation-delay:500ms]">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <StarBorder
          type="submit"
          color="#8b7bff"
          trailColor="#22d3ee"
          duration={5}
          radius={14}
          glow={0.8}
          className="!px-7 text-sm"
        >
          <GoogleIcon />
          Continue with Google
        </StarBorder>
      </form>
      <p className="mt-3 text-xs text-zinc-500">Only the owner&apos;s Google account can sign in.</p>
      {error && (
        <p className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
          That Google account isn&apos;t allowed to sign in here.
        </p>
      )}
    </div>
  );
}

function AboutStat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <div className="text-3xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{label}</div>
    </div>
  );
}
