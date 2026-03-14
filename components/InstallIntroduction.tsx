"use client";

import {
  BookOpen,
  Crown,
  Download,
  Home,
  Plus,
  Share,
  Smartphone,
  Swords,
  Users,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: BookOpen,
    title: "Explore Courses",
    description: "Browse vocabulary courses across multiple topics and levels.",
  },
  {
    icon: Swords,
    title: "Quiz Battles",
    description: "Challenge yourself with engaging vocabulary quizzes.",
  },
  {
    icon: Users,
    title: "Multiplayer",
    description: "Join rooms and compete with friends in real-time.",
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    description: "Install the app and learn anytime, anywhere.",
  },
];

const screenshots = [
  { src: "/images/home_screenshot.jpg", alt: "Home screen" },
  { src: "/images/join_screenshot.jpg", alt: "Join a room" },
  { src: "/images/lobby_screenshot.jpg", alt: "Game lobby" },
];

export default function InstallIntroduction() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#0a305a] to-[#0f4c81] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-blue-300/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <Image
            src="/images/icon.png"
            alt="King of English"
            width={512}
            height={512}
            className="w-28 h-28 md:w-36 md:h-36 rounded-3xl shadow-2xl ring-4 ring-white/20"
            priority
          />

          <h1 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">
            King of English
          </h1>

          <p className="mt-3 text-base md:text-lg text-blue-100 text-center max-w-md">
            Test your vocabulary skills with this engaging quiz app. Learn,
            compete, and become the king!
          </p>

        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-12">
            Why King of English?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-4 md:p-6 rounded-2xl bg-slate-50"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0a305a] text-white flex items-center justify-center mb-3">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs md:text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="bg-slate-50 px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-12">
            See It in Action
          </h2>

          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:justify-center">
            {screenshots.map((screenshot) => (
              <div
                key={screenshot.src}
                className="flex-shrink-0 w-44 md:w-56 snap-center"
              >
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={591}
                    height={1280}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Bottom CTA */}
      <section className="bg-[#0a305a] text-white px-6 py-12 md:py-16">
        <div className="max-w-md mx-auto flex flex-col items-center text-center">
          <Crown size={40} className="text-amber-400 mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold">Ready to Begin?</h2>
          <p className="mt-2 text-blue-200 text-sm md:text-base">
            Install the app for the best experience.
          </p>
        </div>
      </section>
    </div>
  );
}
