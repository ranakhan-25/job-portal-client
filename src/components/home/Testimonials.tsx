"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Quote } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const testimonials = [
  {
    name: "Rahim Ahmed",
    role: "CEO, Tech Corp",
    quote:
      "This platform transformed the way we handle our daily operations. Absolutely seamless experience!",
    img: "https://i.ibb.co.com/MkhNWGB7/images-2.jpg",
  },
  {
    name: "Sarah Khan",
    role: "Product Manager",
    quote:
      "The best SaaS tool I've used in years. The dashboard is incredibly intuitive and fast.",
    img: "https://i.ibb.co.com/MkhNWGB7/images-2.jpg",
  },
  {
    name: "John Doe",
    role: "Developer",
    quote:
      "Scaling our infrastructure was never this easy. Highly recommended for growing teams.",
    img: "https://i.ibb.co.com/MkhNWGB7/images-2.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold uppercase tracking-widest">
            Testimonials
          </span>

          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Trusted by Professionals
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear what our customers have to say about their experience with our
            platform.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          className="pb-14"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-12 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <Quote className="mx-auto mb-6 h-12 w-12 text-primary/70" />

                <p className="text-lg md:text-xl italic leading-8 text-gray-600 dark:text-gray-300 text-center">
                  "{t.quote}"
                </p>

                <div className="mt-10 flex items-center justify-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary bg-gray-200 dark:bg-slate-700">
                    {t.img ? (
                      <Image
                        src={t.img}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xl font-bold text-gray-700 dark:text-white">
                        {t.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t.name}
                    </h4>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}