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



  const inputClass =

    "w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px]";



  return (

    <div className="mt-10 iron-shell-card p-6 mb-24">

      <h2 className="text-4xl font-black uppercase text-center text-iron-text">

        Welcome

      </h2>



      <p className="text-center uppercase text-sm mt-2 text-iron-muted">

        Build your iron path

      </p>



      <div className="mt-8 space-y-4">

        <input

          value={age}

          onChange={(e) => setAge(e.target.value)}

          placeholder="Age"

          className={inputClass}

        />



        <input

          value={height}

          onChange={(e) => setHeight(e.target.value)}

          placeholder="Height"

          className={inputClass}

        />



        <input

          value={weight}

          onChange={(e) => setWeight(e.target.value)}

          placeholder="Weight"

          className={inputClass}

        />

      </div>



      <div className="mt-6">

        <h3 className="text-xl font-black uppercase text-iron-text">Goal</h3>



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

              className={`border border-iron-border p-3 uppercase font-black ${

                goal === value

                  ? "bg-iron-accent-dim text-iron-bg border-iron-accent"

                  : "iron-card-raised text-iron-text"

              }`}

            >

              {label}

            </button>

          ))}

        </div>

      </div>



      <div className="mt-6">

        <h3 className="text-xl font-black uppercase text-iron-text">Experience</h3>



        <div className="grid grid-cols-1 gap-3 mt-3">

          {[

            ["beginner", "Beginner"],

            ["returning", "Returning After Break"],

            ["trained", "Training Regularly"],

          ].map(([value, label]) => (

            <button

              key={value}

              onClick={() => setExperience(value)}

              className={`border border-iron-border p-3 uppercase font-black ${

                experience === value

                  ? "bg-iron-panel text-iron-cream border-iron-border-strong"

                  : "iron-card-raised text-iron-text"

              }`}

            >

              {label}

            </button>

          ))}

        </div>

      </div>



      <div className="mt-6">

        <h3 className="text-xl font-black uppercase text-iron-text">Smartwatch</h3>



        <div className="grid grid-cols-1 gap-3 mt-3">

          {[

            ["apple_watch", "Apple Watch"],

            ["android_watch", "Android Watch"],

            ["none", "No Watch"],

          ].map(([value, label]) => (

            <button

              key={value}

              onClick={() => setWatchType(value)}

              className={`border border-iron-border p-3 uppercase font-black ${

                watchType === value

                  ? "bg-iron-panel text-iron-cream border-iron-border-strong"

                  : "iron-card-raised text-iron-text"

              }`}

            >

              {label}

            </button>

          ))}

        </div>

      </div>



      <button

        onClick={saveProfile}

        className="w-full mt-8 iron-interactive iron-btn-primary py-4 text-sm font-semibold rounded-sm"

      >

        Begin Journey

      </button>

    </div>

  );

}

