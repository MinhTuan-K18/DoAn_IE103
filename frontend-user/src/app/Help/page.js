"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Users,
  BarChart2,
  Mail,
  Github,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <main className="pt-16 bg-[#F9FDFF] flex flex-1">
        <section className="bg-gray-50 py-16 px-4 rounded-2xl md:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto text-center"
          >
            <div className="mt-8">
              <div className="flex flex-col md:flex-row justify-around items-center mb-8">
                <div className="mb-4 md:mb-0">
                  <span className="text-4xl">🌟</span>
                  <h3 className="text-xl font-semibold">
                    Subscribe To Our Site
                  </h3>
                  <p className="text-gray-600">
                    Answer a few questions to facilitate a good possible
                    matching and adoptable pets.
                  </p>
                </div>
                <div className="mb-4 md:mb-0">
                  <span className="text-4xl">🔍</span>
                  <h3 className="text-xl font-semibold">Find Your Pet</h3>
                  <p className="text-gray-600">
                    Filter among thousands of preferences, available free to
                    adopt.
                  </p>
                </div>
                <div>
                  <span className="text-4xl">📅</span>
                  <h3 className="text-xl font-semibold">Have A Meeting</h3>
                  <p className="text-gray-600">
                    Schedule up to three times to meet the company of your
                    future pet.
                  </p>
                </div>
              </div>
              <Link href="/About">
                <button className="bg-yellow-400 text-white px-6 py-3 rounded-full hover:bg-yellow-500 transition">
                  See All
                </button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default page;
