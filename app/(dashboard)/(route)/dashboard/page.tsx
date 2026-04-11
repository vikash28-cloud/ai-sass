"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  AudioWaveform,
  Bot,
  Code,
  Image,
  MessageSquare,
  Music,
  Sparkles,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Conversation",
    description: "Brainstorm, ask questions, and generate polished responses.",
    icon: MessageSquare,
    color: "text-violet-600",
    iconBg: "bg-violet-500/15",
    panelClass: "from-violet-500/15 via-fuchsia-500/10 to-transparent",
    href: "/conversation",
  },
  {
    label: "Code Generation",
    description: "Turn prompts into code snippets and implementation ideas.",
    icon: Code,
    color: "text-emerald-600",
    iconBg: "bg-emerald-500/15",
    panelClass: "from-emerald-500/15 via-lime-500/10 to-transparent",
    href: "/code",
  },
  {
    label: "Image Generation",
    description: "Create prompt-based visuals directly inside the platform.",
    icon: Image,
    color: "text-pink-600",
    iconBg: "bg-pink-500/15",
    panelClass: "from-pink-500/15 via-rose-500/10 to-transparent",
    href: "/image",
  },
  {
    label: "Music Generation",
    description: "Explore music workflows and audio-first generation tools.",
    icon: Music,
    color: "text-cyan-600",
    iconBg: "bg-cyan-500/15",
    panelClass: "from-cyan-500/15 via-sky-500/10 to-transparent",
    href: "/music",
  },
  {
    label: "Video Generation",
    description: "Move from prompt to video concepts and generation flows.",
    icon: Video,
    color: "text-amber-600",
    iconBg: "bg-amber-500/15",
    panelClass: "from-amber-500/15 via-orange-500/10 to-transparent",
    href: "/video",
  },
];

const overview = [
  {
    label: "AI Workspaces",
    value: "5",
    icon: Bot,
  },
  {
    label: "Creative Modes",
    value: "Image, Music, Video",
    icon: Sparkles,
  },
  {
    label: "Build Tools",
    value: "Chat + Code",
    icon: AudioWaveform,
  },
];

const DashboardPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.14),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_38%,_#ffffff_100%)] px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_90px_-40px_rgba(15,23,42,0.9)] md:px-10 md:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.18),_transparent_22%)]" />
          <div className="absolute -right-12 top-8 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-pink-400/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur">
                One AI platform with multiple creative and productivity tools
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-3xl font-semibold leading-tight md:text-5xl">
                  Build, create, and explore from one modern AI dashboard.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  Access conversation, code, image, music, and video workflows from a
                  single interface. Pick a tool, move fast, and keep your work inside one
                  platform instead of switching between AI sites.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/conversation")}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Start With Chat
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/image")}
                  className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Generate Images
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {overview.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur"
                  >
                    <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="size-5 text-white" />
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <Card
              key={tool.href}
              onClick={() => router.push(tool.href)}
              className="group relative overflow-hidden rounded-[1.75rem] border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-30px_rgba(15,23,42,0.4)]"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-100 transition duration-300",
                  tool.panelClass
                )}
              />

              <div className="relative space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className={cn("rounded-2xl p-3", tool.iconBg)}>
                    <tool.icon className={cn("h-7 w-7", tool.color)} />
                  </div>
                  <div className="rounded-full border border-slate-200 bg-white/80 p-2 text-slate-500 transition group-hover:border-slate-300 group-hover:text-slate-900">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-slate-950">{tool.label}</h2>
                  <p className="text-sm leading-6 text-slate-600">{tool.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 text-sm">
                  <span className="text-slate-500">Open workspace</span>
                  <span className="font-medium text-slate-900">Launch</span>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
