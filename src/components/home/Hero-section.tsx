"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import Image from "next/image";
import Link from "next/link";
import { accessUser } from "@/lib/auth/accessUser";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Support Great Ideas",
    heading: "Turn Dreams Into Reality",
    description:
      "Help creators bring innovative projects to life through community powered crowdfunding.",
    image:
      "https://enventyspartners.com/wp-content/uploads/2016/09/crowdfunding-marketing-team.jpg",
  },
  {
    id: 2,
    title: "Create Your Campaign",
    heading: "Launch Your Next Big Project",
    description:
      "Share your vision, collect contributions and build something meaningful.",
    image:
      "https://ideabuddy.com/wp-content/uploads/2023/05/startup-business-plan.jpg",
  },
  {
    id: 3,
    title: "Together We Grow",
    heading: "A Community That Supports Innovation",
    description:
      "Connect with supporters and make a positive impact around the world.",
    image:
      "https://static.vecteezy.com/system/resources/previews/077/825/897/large_2x/friends-hands-and-star-together-outdoor-for-unity-community-or-teamwork-support-below-nature-and-group-with-sign-shape-for-solidarity-connection-and-partnership-with-interaction-or-collaboration-photo.jpg",
  },
];

export default function HeroSection() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await accessUser();
      setUser(currentUser);
    };

    getUser();
  }, []);


  return (
    <section className="relative h-[90vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation
        loop
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.heading}
                fill
                priority
                className="
                object-cover
                "
              />

              {/* Gradient Overlay */}
              <div
                className="
                absolute
                inset-0
                bg-gradient-to-r
                from-black/80
                via-black/60
                to-black/40
                "
              />

              {/* Content */}
              <div
                className="
                relative
                z-10
                h-full
                flex
                items-center
                "
              >
                <div
                  className="
                  max-w-7xl
                  mx-auto
                  px-5
                  w-full
                  "
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 60,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.9,
                    }}
                    className="
                    max-w-3xl
                    text-white
                    "
                  >
                    <p
                      className="
                      text-red-400
                      uppercase
                      font-semibold
                      tracking-[4px]
                      mb-5
                      text-sm
                      "
                    >
                      {slide.title}
                    </p>

                    <h1
                      className="
                      text-4xl
                      sm:text-5xl
                      md:text-7xl
                      font-bold
                      leading-tight
                      "
                    >
                      {slide.heading}
                    </h1>

                    <p
                      className="
                      mt-6
                      text-gray-200
                      text-lg
                      md:text-xl
                      max-w-2xl
                      "
                    >
                      {slide.description}
                    </p>

                    <div
                      className="
                      mt-8
                      flex
                      gap-4
                      flex-wrap
                      "
                    >
                      <Link
                        href="/campaigns"
                        className="
                        px-8
                        py-3
                        rounded-full
                        bg-red-500
                        hover:bg-red-600
                        transition
                        font-semibold
                        shadow-lg
                        "
                      >
                        Explore Campaigns
                      </Link>

                      {user == null && (
                        <Link
                          href="/auth/signup"
                          className="
                        px-8
                        py-3
                        rounded-full
                        border
                        border-white
                        hover:bg-white
                        hover:text-black
                        transition
                        font-semibold
                        "
                        >
                          Start Campaign
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
