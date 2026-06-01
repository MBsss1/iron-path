"use client";

import { useState } from "react";
import WeightProgressScreen from "./WeightProgressScreen";

export default function NutritionScreen() {
  const [view, setView] = useState<"nutrition" | "weight">("nutrition");

  if (view === "weight") {
    return (
      <div className="mt-8 sm:mt-10 border-4 border-black p-5 sm:p-6 bg-[#f5ead0] shadow-2xl mb-24">
        <div className="text-center">
          <p className="uppercase tracking-[0.2em] text-sm font-bold">
            Body Composition
          </p>

          <h2 className="text-4xl font-black uppercase mt-2">
            Weight Progress
          </h2>

          <p className="mt-2 uppercase text-sm">
            Track weight changes and goals
          </p>
        </div>

        <WeightProgressScreen />

        <button
          className="w-full mt-6 bg-[#333] text-[#efe3c2] border-4 border-black py-4 uppercase font-black tracking-widest hover:bg-black"
          onClick={() => setView("nutrition")}
        >
          Back to Nutrition
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10 border-4 border-black p-5 sm:p-6 bg-[#f5ead0] shadow-2xl mb-24">
      <div className="text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold">
          Mass Gain
        </p>

        <h2 className="text-4xl font-black uppercase mt-2">
          Nutrition
        </h2>

        <p className="mt-2 uppercase text-sm">
          Build the body. Feed the body.
        </p>
      </div>

      <div className="mt-8 border-2 border-black p-4 bg-black text-[#efe3c2]">
        <div className="flex justify-between uppercase font-bold">
          <span>Calories</span>
          <span>2450 / 3400</span>
        </div>

        <div className="w-full h-4 border-2 border-[#efe3c2] mt-2">
          <div className="h-full bg-[#b22222] w-[72%]"></div>
        </div>

        <div className="flex justify-between uppercase font-bold mt-6">
          <span>Protein</span>
          <span>112 / 170g</span>
        </div>

        <div className="w-full h-4 border-2 border-[#efe3c2] mt-2">
          <div className="h-full bg-[#b22222] w-[65%]"></div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="border-2 border-black p-4 bg-[#e8d8b0] text-center">
          <p className="uppercase text-xs font-bold">Water</p>
          <p className="text-3xl font-black">2.1L</p>
        </div>

        <div className="border-2 border-black p-4 bg-[#e8d8b0] text-center">
          <p className="uppercase text-xs font-bold">Meals</p>
          <p className="text-3xl font-black">3 / 5</p>
        </div>
      </div>

      <div className="mt-6 border-2 border-black p-4 bg-[#e8d8b0]">
        <h3 className="text-xl font-black uppercase">
          Coach Note
        </h3>

        <p className="mt-3 text-sm uppercase leading-relaxed">
          You are short about 950 kcal and 58g protein. Add rice, meat,
          milk, banana or cottage cheese before the day ends.
        </p>
      </div>

      <button className="w-full mt-6 bg-[#b22222] text-[#efe3c2] border-4 border-black py-4 uppercase font-black tracking-widest">
        Add Meal
      </button>

      <button
        className="w-full mt-3 bg-[#333] text-[#efe3c2] border-4 border-black py-4 uppercase font-black tracking-widest hover:bg-black"
        onClick={() => setView("weight")}
      >
        View Weight Progress
      </button>
    </div>
  );
}