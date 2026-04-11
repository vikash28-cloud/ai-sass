import Link from "next/link";
import {
  ArrowRight,
  Code2,
  ImageIcon,
  MessageSquareText,
  Music4,
  Sparkles,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Chat Assistant",
    description: "Ask questions, brainstorm, and generate responses in a clean workspace.",
    icon: MessageSquareText,
  },
  {
    title: "Code Generation",
    description: "Turn prompts into code snippets quickly for experiments and prototypes.",
    icon: Code2,
  },
  {
    title: "Image Creation",
    description: "Generate images directly in the browser with the built-in image workspace.",
    icon: ImageIcon,
  },
  {
    title: "Music Generation",
    description: "Create music ideas and audio-focused outputs from the same dashboard.",
    icon: Music4,
  },
  {
    title: "Video Generation",
    description: "Use the platform as a launch point for prompt-based video generation workflows.",
    icon: Video,
  },
];

const LandingPage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.2),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_45%,_#ffffff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-white">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-900">Vikash AI</p>
              <p className="text-xs text-slate-500">Chat, code, and image generation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-slate-700">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </header>

        <section className="flex flex-1 items-center py-14 lg:py-20">
          <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm text-sky-700 shadow-sm">
                One platform with multiple AI tools
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
                  One AI platform for chat, code, images, music, and video workflows.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                  Launch into a single workspace where multiple AI experiences live together.
                  Use conversation tools, code generation, image creation, music workflows,
                  and video-focused generation from one dashboard. Sign in to continue your
                  work, or create an account and start fresh.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Link href="/sign-up">
                    Get Started
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/sign-in">Login to Dashboard</Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur"
                    >
                      <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <Icon className="size-5" />
                      </div>
                      <h2 className="text-base font-semibold text-slate-900">{feature.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-8 h-32 w-32 rounded-full bg-sky-200/60 blur-3xl" />
              <div className="absolute -right-8 bottom-6 h-40 w-40 rounded-full bg-orange-200/60 blur-3xl" />

              <div className="relative rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">Workspace Preview</p>
                      <p className="text-xs text-slate-400">Sign in or create an account to continue</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="size-3 rounded-full bg-rose-400" />
                      <span className="size-3 rounded-full bg-amber-400" />
                      <span className="size-3 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Conversation</p>
                      <p className="mt-2 text-sm text-slate-200">
                        Draft responses, ask questions, and iterate quickly.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/20 to-cyan-400/10 p-4">
                        <p className="text-sm font-medium text-white">Code</p>
                        <p className="mt-2 text-sm text-slate-300">
                          Generate snippets and experiment inside the app.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-400/20 to-pink-300/10 p-4">
                        <p className="text-sm font-medium text-white">Images</p>
                        <p className="mt-2 text-sm text-slate-300">
                          Create multiple images directly from prompts.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/20 to-lime-300/10 p-4">
                        <p className="text-sm font-medium text-white">Music</p>
                        <p className="mt-2 text-sm text-slate-300">
                          Explore music generation inside the same product.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-400/20 to-violet-300/10 p-4">
                        <p className="text-sm font-medium text-white">Video</p>
                        <p className="mt-2 text-sm text-slate-300">
                          Extend prompts into video generation workflows.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-dashed border-white/15 p-4 text-sm text-slate-400">
                      Protected routes unlock the full multi-AI workspace after authentication.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;
