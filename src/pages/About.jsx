// src/pages/About.jsx

import React from "react";
import { FiAward, FiUsers, FiTrendingUp, FiShield } from "react-icons/fi";
import { assets } from "../assets/assets";

const About = () => {

  const features = [
    {
      icon: <FiAward className="text-3xl" />,
      title: "Premium Quality",
      description:
        "We source the finest materials to ensure every product meets our high standards."
    },
    {
      icon: <FiUsers className="text-3xl" />,
      title: "Customer Focused",
      description:
        "Our community is at the heart of everything we do."
    },
    {
      icon: <FiTrendingUp className="text-3xl" />,
      title: "Always Evolving",
      description:
        "We stay ahead with the latest trends and timeless designs."
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "Secure Shopping",
      description:
        "Your data and privacy are protected with industry-leading security."
    }
  ];

  return (
    <div className="bg-slate-900 text-white min-h-screen">

      {/* Hero Section */}
      <div className="relative h-96 flex items-center justify-center overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 z-10"></div>

        <img
          src={assets.hero_img}
          alt="About Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        <div className="relative z-20 text-center px-4">

          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            About{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Us
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Discover our story, our passion, and our commitment to bringing you the best fashion.
          </p>

        </div>
      </div>

      {/* Main Section */}

      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">

          {/* Text */}

          <div>

            <h2 className="text-4xl font-bold mb-4">Our Mission</h2>

            <p className="text-white/70 mb-4">
              Founded on a passion for style and quality, our mission is to empower
              individuals through fashion. What you wear is an extension of who
              you are.
            </p>

            <p className="text-white/70">
              We carefully curate our collections blending modern trends with
              timeless classics so every customer finds something perfect.
            </p>

          </div>

          {/* Image */}

          <div className="relative">

            <img
              src={assets.support_img}
              alt="Mission"
              className="rounded-2xl shadow-2xl w-full"
            />

            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-40"></div>

          </div>

        </div>


        {/* Features Section */}

        <h2 className="text-4xl font-bold text-center mb-12">
          What We Stand For
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (

            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition"
            >

              <div className="flex justify-center items-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>

              <p className="text-white/60 text-sm">
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default About;