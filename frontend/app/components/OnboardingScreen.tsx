"use client";

import { useState } from "react";
import { STORAGE_KEYS } from "../utils/storageKeys";

type Props = {
  onFinish: () => void;
};

export default function OnboardingScreen({ onFinish }: Props) {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [goal, setGoal] = useState("mass_gain");
  const [experience, setExperience] = useState("returning");
  const [watchType, setWatchType] = useState("none");

  const saveProfile = () => {
    localStorage.setItem(
      STORAGE_KEYS.profile,
      JSON.stringify({
        age,
        height,
        weight,
        goal,
        experience,
        watchType,
      })
    );

    onFinish();
  };

  return (
    <div className="mt-10 border-4 border-black p-6 bg-[#f5ead0] shadow-2xl mb-24">
      <h2 className="text-4xl font-black uppercase text-center">
        Welcome
      </h2>

      <p className="text-center uppercase text-sm mt-2">
        Build your iron path
      </p>

      <div className="mt-8 space-y-4">
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="w-full border-2 border-black p-3 bg-white"
        />

        <input
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height"
          className="w-full border-2 border-black p-3 bg-white"
        />

        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
          className="w-full border-2 border-black p-3 bg-white"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-black uppercase">Goal</h3>

        <div className="grid grid-cols-2 gap-3 mt-3">
          {[
            ["mass_gain", "Mass Gain"],
            ["athletic", "Athletic"],
            ["runner", "Runner"],
            ["fat_loss", "Fat Loss"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setGoal(value)}
              className={`border-2 border-black p-3 uppercase font-black ${
                goal === value
                  ? "bg-[#b22222] text-[#efe3c2]"
                  : "bg-[#e8d8b0]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-black uppercase">Experience</h3>

        <div className="grid grid-cols-1 gap-3 mt-3">
          {[
            ["beginner", "Beginner"],
            ["returning", "Returning After Break"],
            ["trained", "Training Regularly"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setExperience(value)}
              className={`border-2 border-black p-3 uppercase font-black ${
                experience === value
                  ? "bg-black text-[#efe3c2]"
                  : "bg-[#e8d8b0]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-black uppercase">Smartwatch</h3>

        <div className="grid grid-cols-1 gap-3 mt-3">
          {[
            ["apple_watch", "Apple Watch"],
            ["android_watch", "Android Watch"],
            ["none", "No Watch"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setWatchType(value)}
              className={`border-2 border-black p-3 uppercase font-black ${
                watchType === value
                  ? "bg-black text-[#efe3c2]"
                  : "bg-[#e8d8b0]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={saveProfile}
        className="w-full mt-8 bg-[#b22222] text-[#efe3c2] border-4 border-black py-4 uppercase font-black"
      >
        Begin Journey
      </button>
    </div>
  );
}