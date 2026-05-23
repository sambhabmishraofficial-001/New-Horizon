"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { sitePath } from "@/lib/sitePath";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { Linkedin, Mail, MapPin } from "lucide-react";
import { useState } from "react";

const teamMembers = [
  {
    name: "Sambhab Mishra",
    role: "Co-founder",
    image: sitePath("/images/about/sambhab-mishra-avatar.png"),
    location: "United Kingdom",
    skills: ["Strategy", "Research", "Leadership"],
    gradient: "from-[#2563eb]/10 via-[#2563eb]/5 to-transparent",
  },
  {
    name: "Anonymous",
    role: "Co-founder",
    image: "https://api.dicebear.com/7.x/notionists/svg?seed=NHCTO",
    location: "Remote",
    skills: ["Architecture", "AI Systems", "Infrastructure"],
    gradient: "from-ink-900/8 via-ink-900/4 to-transparent",
  },
  {
    name: "Anonymous",
    role: "Co-founder",
    image: "https://api.dicebear.com/7.x/notionists/svg?seed=NHCMO",
    location: "Remote",
    skills: ["Brand", "Growth", "Community"],
    gradient: "from-beacon-500/10 via-beacon-500/5 to-transparent",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

const socialIcons = [
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Mail, label: "Email" },
] as const;

function TeamMemberCard({ member }: { member: (typeof teamMembers)[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left - width / 2) / (width / 2);
    const y = (e.clientY - rect.top - height / 2) / (height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div variants={itemVariants} className="[perspective:1000px]">
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group relative"
      >
        <Card className="relative overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-lift transition-shadow duration-500 group-hover:shadow-editorial">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            animate={
              isHovered
                ? { opacity: 1 }
                : { opacity: shouldReduceMotion ? 0.05 : 0 }
            }
          />

          <div className="relative z-10 p-6">
            <div className="mb-4 flex justify-center">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="absolute -inset-2 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(37,99,235,0))",
                  }}
                  animate={
                    isHovered
                      ? {
                          rotate: shouldReduceMotion ? 0 : 360,
                          scale: shouldReduceMotion ? 1 : [1, 1.08, 1],
                        }
                      : { rotate: 0, scale: 1 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.6 : 3,
                    repeat: shouldReduceMotion ? 0 : Infinity,
                    ease: "linear",
                  }}
                />
                <div className="relative h-28 w-28 overflow-hidden rounded-full border border-ink-900/10 bg-parchment-50 p-1">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </div>

            <div className="text-center">
              <motion.h3
                className="mb-1 font-editorial text-xl tracking-tight text-ink-900"
                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {member.name}
              </motion.h3>
              <Badge
                variant="secondary"
                className="mb-2 text-[10px] uppercase tracking-[0.22em] text-ink-500"
              >
                {member.role}
              </Badge>

              <motion.div
                className="mb-3 flex items-center justify-center gap-1 text-xs text-ink-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <MapPin className="h-3 w-3" aria-hidden />
                <span>{member.location}</span>
              </motion.div>

              <motion.div
                className="mb-4 flex flex-wrap justify-center gap-1.5"
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isHovered ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 0 }
                }
                transition={{ duration: 0.3 }}
              >
                {member.skills.map((skill, idx) => (
                  <motion.div
                    key={skill}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * idx, type: "spring" }}
                  >
                    <Badge
                      variant="outline"
                      className="text-xs text-ink-600 transition-colors hover:bg-ink-50"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex justify-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {socialIcons.map((social, idx) => (
                  <motion.div
                    key={social.label}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={
                      isHovered
                        ? { scale: 1, rotate: 0 }
                        : { scale: 0.85, rotate: 0 }
                    }
                    transition={{
                      delay: isHovered ? 0.1 * idx : 0,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <span
                      aria-hidden
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/10 text-ink-500"
                    >
                      <social.icon className="h-4 w-4" />
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function TeamSectionBlock() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="team-section-heading"
      className="relative w-full overflow-hidden px-4 py-20 sm:px-6 lg:px-10"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: shouldReduceMotion ? 1 : [1, 1.18, 1],
            rotate: shouldReduceMotion ? 0 : [0, 90, 0],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{
            duration: shouldReduceMotion ? 0.6 : 18,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#2563eb]/20 blur-[180px]"
        />
        <motion.div
          animate={{
            scale: shouldReduceMotion ? 1 : [1.1, 1, 1.1],
            rotate: shouldReduceMotion ? 0 : [0, -90, 0],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: shouldReduceMotion ? 0.6 : 16,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-beacon-300/20 blur-[180px]"
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="mb-16 text-center"
        >
          <motion.h2
            id="team-section-heading"
            className="home-section-subtitle mb-6 font-editorial text-ink-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Team
          </motion.h2>

          <motion.p
            className="mx-auto max-w-2xl !font-light font-marketing text-lg leading-[1.65] tracking-[-0.012em] text-ink-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            We are building the conditions under which human scientists -
            curious, creative, intuitive, irreplaceable - can work at a scale
            and speed that was previously impossible.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {teamMembers.map((member) => (
            <TeamMemberCard key={`${member.name}-${member.role}`} member={member} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="inline-flex flex-col items-center gap-6 rounded-3xl border border-ink-900/10 bg-white px-10 py-8 shadow-editorial">
            <h3 className="font-editorial text-2xl text-ink-900">
              Join the mission
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-ink-600">
              We&apos;re building the Novum Organum for the 21st century. If
              Human-AI Co-Science is your calling, we want to hear from you.
            </p>
            <a
              href="mailto:contact@newhorizon.dev"
              className="group relative inline-flex items-center overflow-hidden rounded-full bg-ink-900 px-10 py-3.5 text-[14px] font-medium text-parchment-50 shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:bg-ink-800"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                animate={
                  shouldReduceMotion ? undefined : { x: ["-120%", "120%"] }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { repeat: Infinity, duration: 2, ease: "linear" }
                }
              />
              <span className="relative font-medium">Request access</span>
              <motion.span
                className="relative ml-2"
                animate={shouldReduceMotion ? undefined : { x: [0, 5, 0] }}
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { repeat: Infinity, duration: 1.5 }
                }
              >
                →
              </motion.span>
            </a>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
