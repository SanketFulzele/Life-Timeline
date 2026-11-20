import { Suspense } from "react";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { HeroAurora } from "@/components/hero-aurora";
import { GoogleIcon, LockIcon, PhotoIcon, PulseIcon, TimelineIcon } from "@/components/icons";
import BlurText from "@/components/reactbits/BlurText";
import ShinyText from "@/components/reactbits/ShinyText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import StarBorder from "@/components/reactbits/StarBorder";
import { getViewer } from "@/lib/access";
import { birthDate, ownerName } from "@/lib/config";

export const metadata = { title: "Sign in · Life Timeline" };

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
  const name = ownerName();
  const startYear = birthDate().slice(0, 4);
  const headline = name === "My" ? "My life, one moment at a time." : `${name}'s life, one moment at a time.`;

  return (
    <main className="relative isolate flex-1 overflow-hidden">
      <HeroAurora height="h-[680px]" opacity={0.7} />

      <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-20 text-center sm:pt-28">
        <span className="rise inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs backdrop-blur">
          <LockIcon className="size-3.5 text-zinc-400" />
          <ShinyText text={`Private journal · ${startYear} → today`} color="#a1a1aa" shineColor="#ffffff" speed={3} />
        </span>

        <div role="heading" aria-level={1} className="mt-7">
          <BlurText
            text={headline}
            trigger="load"
            animateBy="words"
            delay={90}
            className="justify-center text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl"
          />
        </div>

        <p className="rise mt-5 max-w-xl text-base leading-relaxed text-zinc-400 [animation-delay:350ms] sm:text-lg">
          A personal timeline of milestones, highs, lows and everyday moments, with links to the photos that
          go with them.
        </p>

        <Suspense fallback={<div className="mt-9 h-[52px]" />}>
          <SignIn searchParams={props.searchParams} />
        </Suspense>
      </section>

      <section className="mx-auto mt-20 grid w-full max-w-5xl gap-4 px-4 pb-20 sm:mt-28 md:grid-cols-3">
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
