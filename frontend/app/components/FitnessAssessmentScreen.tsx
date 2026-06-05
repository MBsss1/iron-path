"use client";

import { useMemo, useState } from "react";
import type { Profile } from "../hooks/useProfile";
import {
  assessFitness,
  type AssessmentInput,
  type AssessmentResult,
  type CardioAccess,
  type CardioPreference,
  type CardioTestType,
  type FitnessLevel,
  type Limitation,
} from "../data/fitnessAssessment";
import { parseProfileGoal, type FitnessGoal } from "../data/fitnessGoals";
import { useTranslation } from "../i18n/useTranslation";
import ScreenShell from "./ScreenShell";
import IronButton from "./IronButton";
import CompletionMoment from "./ui/CompletionMoment";
import AssessmentTimer from "./AssessmentTimer";

type Props = {
  profile: Profile;
  onComplete: (input: AssessmentInput, result: AssessmentResult) => void;
  onCancel: () => void;
};

type StepId =
  | "equipment"
  | "cardio"
  | "pullups"
  | "pushups"
  | "squats"
  | "plank"
  | "endurance"
  | "limitations";

type RunPreset = "under5" | "5to10" | "10to20" | "over20";

const CARDIO_ACCESS: CardioAccess[] = [
  "outdoor",
  "treadmill",
  "limited",
  "none",
];
const CARDIO_PREF: CardioPreference[] = ["enjoy", "neutral", "dislike"];
const LIMITATIONS: Limitation[] = [
  "knees",
  "back",
  "shoulders",
  "overweight",
  "none",
];

function parseGoal(goal: string | undefined): FitnessGoal {
  return parseProfileGoal(goal);
}

function parseProfileNumbers(profile: Profile) {
  const age = Math.min(100, Math.max(13, parseInt(profile.age, 10) || 25));
  const height = Math.min(250, Math.max(100, parseInt(profile.height, 10) || 175));
  const weight = Math.min(250, Math.max(30, parseInt(profile.weight, 10) || 75));
  return { age, height, weight };
}

export default function FitnessAssessmentScreen({
  profile,
  onComplete,
  onCancel,
}: Props) {
  const { t, locale } = useTranslation();
  const [phase, setPhase] = useState<"intro" | "wizard" | "results">("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [hasBar, setHasBar] = useState<boolean | null>(null);
  const [cardioAccess, setCardioAccess] = useState<CardioAccess | null>(null);
  const [cardioPreference, setCardioPreference] =
    useState<CardioPreference | null>(null);
  const [maxPullUps, setMaxPullUps] = useState("0");
  const [maxPushUps, setMaxPushUps] = useState("");
  const [squatReps, setSquatReps] = useState("");
  const [plankSeconds, setPlankSeconds] = useState("");
  const [cardioTestType, setCardioTestType] = useState<CardioTestType | null>(
    null
  );
  const [runMinutes, setRunMinutes] = useState("");
  const [walkMinutes, setWalkMinutes] = useState("");
  const [runPreset, setRunPreset] = useState<RunPreset | null>(null);
  const [limitations, setLimitations] = useState<Limitation[]>([]);
  const [previewResult, setPreviewResult] = useState<AssessmentResult | null>(
    null
  );

  const steps = useMemo((): StepId[] => {
    const list: StepId[] = ["equipment", "cardio"];
    if (hasBar) list.push("pullups");
    list.push("pushups", "squats", "plank", "endurance", "limitations");
    return list;
  }, [hasBar]);

  const { weight: profileWeight } = parseProfileNumbers(profile);
  const suggestWalkDefault =
    profileWeight >= 100 || cardioAccess === "none";

  const currentStep = steps[stepIndex] ?? "equipment";
  const totalSteps = steps.length;

  const optionClass = (selected: boolean) =>
    `w-full text-left border border-iron-border p-3 font-semibold rounded-sm iron-interactive ${
      selected
        ? "bg-iron-accent-dim text-iron-bg border-iron-accent"
        : "iron-card-raised text-iron-text"
    }`;

  const toggleLimitation = (id: Limitation) => {
    if (id === "none") {
      setLimitations(["none"]);
      return;
    }
    setLimitations((prev) => {
      const withoutNone = prev.filter((l) => l !== "none");
      if (withoutNone.includes(id)) {
        const next = withoutNone.filter((l) => l !== id);
        return next.length ? next : ["none"];
      }
      return [...withoutNone, id];
    });
  };

  const buildInput = (): AssessmentInput | null => {
    if (
      hasBar === null ||
      cardioAccess === null ||
      cardioPreference === null ||
      !maxPushUps.trim() ||
      !squatReps.trim() ||
      !plankSeconds.trim() ||
      cardioTestType === null
    ) {
      return null;
    }
    const push = parseInt(maxPushUps, 10);
    const squats = parseInt(squatReps, 10);
    const plank = parseInt(plankSeconds, 10);
    if (
      Number.isNaN(push) ||
      Number.isNaN(squats) ||
      Number.isNaN(plank) ||
      push < 0 ||
      squats < 0 ||
      plank < 0
    ) {
      return null;
    }
    const pull = hasBar ? parseInt(maxPullUps, 10) || 0 : 0;
    const { age, height, weight } = parseProfileNumbers(profile);
    const limits =
      limitations.length > 0 ? limitations : (["none"] as Limitation[]);

    const input: AssessmentInput = {
      age,
      height,
      weight,
      goal: parseGoal(profile.goal),
      maxPullUps: pull,
      maxPushUps: push,
      squatReps2Min: squats,
      plankSeconds: plank,
      equipment: hasBar ? ["pull_up_bar"] : [],
      limitations: limits,
      cardioAccess,
      cardioPreference,
    };

    if (cardioTestType) {
      input.cardioTestType = cardioTestType;
      if (cardioTestType === "run") {
        const mins = parseInt(runMinutes, 10);
        if (!Number.isNaN(mins) && mins >= 0) input.runMinutes = mins;
      }
      if (cardioTestType === "walk") {
        const mins = parseInt(walkMinutes, 10);
        if (!Number.isNaN(mins) && mins >= 0) input.walkMinutes = mins;
      }
    }

    return input;
  };

  const canAdvance = (): boolean => {
    switch (currentStep) {
      case "equipment":
        return hasBar !== null;
      case "cardio":
        return cardioAccess !== null && cardioPreference !== null;
      case "pullups": {
        const n = parseInt(maxPullUps, 10);
        return !Number.isNaN(n) && n >= 0 && n <= 50;
      }
      case "pushups": {
        const n = parseInt(maxPushUps, 10);
        return !Number.isNaN(n) && n >= 0 && n <= 150;
      }
      case "squats": {
        const n = parseInt(squatReps, 10);
        return !Number.isNaN(n) && n >= 0 && n <= 200;
      }
      case "plank": {
        const n = parseInt(plankSeconds, 10);
        return !Number.isNaN(n) && n >= 0 && n <= 600;
      }
      case "endurance": {
        if (!cardioTestType) return false;
        if (cardioTestType === "skipped") return true;
        if (cardioTestType === "run") {
          const n = parseInt(runMinutes, 10);
          return !Number.isNaN(n) && n >= 0 && n <= 180;
        }
        if (cardioTestType === "walk") {
          const n = parseInt(walkMinutes, 10);
          return !Number.isNaN(n) && n >= 1 && n <= 180;
        }
        return false;
      }
      case "limitations":
        return limitations.length > 0;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (!canAdvance()) return;
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    const input = buildInput();
    if (!input) return;
    setPreviewResult(assessFitness(input));
    setPhase("results");
  };

  const goBack = () => {
    if (phase === "results") {
      setPhase("wizard");
      return;
    }
    if (phase === "wizard") {
      if (stepIndex > 0) {
        setStepIndex((i) => i - 1);
        return;
      }
      setPhase("intro");
    }
  };

  const handleFinish = () => {
    const input = buildInput();
    if (!input || !previewResult) return;
    onComplete(input, previewResult);
  };

  const levelLabel = (level: FitnessLevel) => t(`assessment.level.${level}`);

  const patternRow = (
    labelKey: string,
    level: FitnessLevel
  ) => (
    <div
      key={labelKey}
      className="flex justify-between items-center border-b border-iron-border py-3 last:border-0"
    >
      <span className="font-semibold text-iron-text">{t(labelKey)}</span>
      <span className="text-iron-accent font-semibold">{levelLabel(level)}</span>
    </div>
  );

  if (phase === "intro") {
    return (
      <ScreenShell
        eyebrow={t("assessment.intro.eyebrow")}
        title={t("assessment.intro.title")}
        subtitle={t("assessment.intro.duration")}
        onBack={onCancel}
      >
        <p className="text-sm text-iron-text">{t("assessment.intro.checkTitle")}</p>
        <ul className="mt-3 space-y-2 text-sm text-iron-muted list-disc pl-5">
          <li>{t("assessment.intro.checkPull")}</li>
          <li>{t("assessment.intro.checkPush")}</li>
          <li>{t("assessment.intro.checkLegs")}</li>
          <li>{t("assessment.intro.checkCore")}</li>
          <li>{t("assessment.intro.checkCardio")}</li>
        </ul>
        <p className="mt-4 text-sm text-iron-text leading-relaxed">
          {t("assessment.intro.outro")}
        </p>
        <IronButton className="mt-6" onClick={() => setPhase("wizard")}>
          {t("assessment.intro.start")}
        </IronButton>
      </ScreenShell>
    );
  }

  if (phase === "results" && previewResult) {
    const lang = locale === "ru" ? "ru" : "en";
    const strengths = previewResult.notes[lang].slice(0, 2);
    const cardioLine = previewResult.cardioSummary[lang];
    const previewInput = buildInput();

    return (
      <ScreenShell
        eyebrow={t("assessment.results.eyebrow")}
        title={t("assessment.results.title")}
        subtitle={t("assessment.results.subtitle")}
      >
        <CompletionMoment message={t("completion.assessment")} className="mb-4" />
        <div className="iron-card-panel p-4 mb-4">
          <p className="iron-label">{t("assessment.results.overall")}</p>
          <p className="iron-heading text-xl mt-1">
            {levelLabel(previewResult.overallLevel)}
          </p>
        </div>

        <div className="iron-card-panel p-4 mb-4">
          {patternRow("assessment.results.pull", previewResult.upperPullLevel)}
          {patternRow("assessment.results.push", previewResult.upperPushLevel)}
          {patternRow("assessment.results.legs", previewResult.legsLevel)}
          {patternRow("assessment.results.core", previewResult.coreLevel)}
          {patternRow("assessment.results.cardioLevel", previewResult.cardioLevel)}
        </div>

        <div className="iron-card-panel p-4 mb-4">
          <p className="iron-label">{t("assessment.results.cardioBlock")}</p>
          <p className="mt-2 text-sm text-iron-text">{cardioLine}</p>
          {previewInput?.cardioTestType === "run" && (
            <p className="mt-2 text-sm text-iron-text">
              {t("coaching.debrief.metricRun")}:{" "}
              <span className="font-semibold">
                {previewInput.runMinutes ?? 0}{" "}
                {t("coaching.milestone.unitMinutes")}
              </span>
            </p>
          )}
          {previewInput?.cardioTestType === "walk" && (
            <p className="mt-2 text-sm text-iron-text">
              {t("coaching.debrief.metricWalk")}:{" "}
              <span className="font-semibold">
                {previewInput.walkMinutes ?? 0}{" "}
                {t("coaching.milestone.unitMinutes")}
              </span>
            </p>
          )}
          {previewInput?.cardioTestType === "skipped" && (
            <p className="mt-2 text-sm text-iron-muted">
              {t("coaching.debrief.cardioSkippedNote")}
            </p>
          )}
        </div>

        {strengths.length > 0 && (
          <div className="iron-card-panel p-4 mb-4">
            <p className="iron-label">{t("assessment.results.planNotes")}</p>
            <ul className="mt-2 space-y-1.5 text-sm text-iron-muted list-disc pl-4">
              {strengths.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        <IronButton onClick={handleFinish}>
          {t("assessment.results.buildPath")}
        </IronButton>
        <button
          type="button"
          onClick={goBack}
          className="w-full mt-3 text-sm text-iron-muted hover:text-iron-text iron-interactive"
        >
          {t("assessment.results.editAnswers")}
        </button>
      </ScreenShell>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "equipment":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={optionClass(hasBar === true)}
              onClick={() => setHasBar(true)}
            >
              {t("assessment.equipment.yes")}
            </button>
            <button
              type="button"
              className={optionClass(hasBar === false)}
              onClick={() => setHasBar(false)}
            >
              {t("assessment.equipment.no")}
            </button>
          </div>
        );
      case "cardio":
        return (
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-iron-text">
                {t("assessment.cardio.accessQuestion")}
              </p>
              <div className="grid grid-cols-1 gap-2 mt-3">
                {CARDIO_ACCESS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={optionClass(cardioAccess === value)}
                    onClick={() => setCardioAccess(value)}
                  >
                    {t(`assessment.cardio.access.${value}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-iron-text">
                {t("assessment.cardio.preferenceQuestion")}
              </p>
              <div className="grid grid-cols-1 gap-2 mt-3">
                {CARDIO_PREF.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={optionClass(cardioPreference === value)}
                    onClick={() => setCardioPreference(value)}
                  >
                    {t(`assessment.cardio.preference.${value}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "pullups":
        return (
          <input
            type="text"
            inputMode="numeric"
            value={maxPullUps}
            onChange={(e) => setMaxPullUps(e.target.value)}
            placeholder={t("assessment.pullups.placeholder")}
            className="w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] rounded-sm"
          />
        );
      case "pushups":
        return (
          <div className="space-y-4">
            <AssessmentTimer
              key="pushups"
              timerKey="pushups"
              durationSeconds={120}
              label={t("assessment.timer.startTest")}
            />
            <div>
              <p className="text-xs text-iron-muted mb-2">
                {t("assessment.timer.manualEntry")}
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={maxPushUps}
                onChange={(e) => setMaxPushUps(e.target.value)}
                placeholder={t("assessment.pushups.placeholder")}
                className="w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] rounded-sm"
              />
            </div>
          </div>
        );
      case "squats":
        return (
          <div className="space-y-4">
            <AssessmentTimer
              key="squats"
              timerKey="squats"
              durationSeconds={120}
              label={t("assessment.timer.startTest")}
            />
            <div>
              <p className="text-xs text-iron-muted mb-2">
                {t("assessment.timer.manualEntry")}
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={squatReps}
                onChange={(e) => setSquatReps(e.target.value)}
                placeholder={t("assessment.squats.placeholder")}
                className="w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] rounded-sm"
              />
            </div>
          </div>
        );
      case "plank":
        return (
          <div className="space-y-4">
            <AssessmentTimer
              key="plank"
              timerKey="plank"
              countUp
              label={t("assessment.timer.start")}
              onStop={(elapsed) => setPlankSeconds(String(elapsed))}
            />
            <div>
              <p className="text-xs text-iron-muted mb-2">
                {t("assessment.timer.manualEntry")}
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={plankSeconds}
                onChange={(e) => setPlankSeconds(e.target.value)}
                placeholder={t("assessment.plank.placeholder")}
                className="w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] rounded-sm"
              />
            </div>
          </div>
        );
      case "endurance": {
        const presetClass = (selected: boolean) =>
          `text-left border border-iron-border p-2.5 text-sm font-semibold rounded-sm iron-interactive ${
            selected
              ? "bg-iron-accent-dim text-iron-bg border-iron-accent"
              : "iron-card-raised text-iron-text"
          }`;

        const applyPreset = (preset: RunPreset) => {
          setRunPreset(preset);
          const values: Record<RunPreset, string> = {
            under5: "3",
            "5to10": "7",
            "10to20": "15",
            over20: "25",
          };
          setRunMinutes(values[preset]);
        };

        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                className={optionClass(cardioTestType === "run")}
                onClick={() => {
                  setCardioTestType("run");
                  setWalkMinutes("");
                }}
              >
                {t("assessment.endurance.modeRun")}
              </button>
              <button
                type="button"
                className={optionClass(cardioTestType === "walk")}
                onClick={() => {
                  setCardioTestType("walk");
                  setRunMinutes("");
                  setRunPreset(null);
                }}
              >
                {t("assessment.endurance.modeWalk")}
              </button>
              <button
                type="button"
                className={optionClass(cardioTestType === "skipped")}
                onClick={() => {
                  setCardioTestType("skipped");
                  setRunMinutes("");
                  setWalkMinutes("");
                  setRunPreset(null);
                }}
              >
                {t("assessment.endurance.modeSkip")}
              </button>
            </div>

            {suggestWalkDefault && cardioTestType === null && (
              <p className="text-sm text-iron-accent border border-iron-accent-dim/40 rounded-sm p-3">
                {t("assessment.endurance.safetySuggestWalk")}
              </p>
            )}

            {cardioTestType === "run" && (
              <div className="space-y-4">
                <p className="font-semibold text-iron-text">
                  {t("assessment.endurance.runQuestion")}
                </p>
                <p className="text-xs text-iron-muted">
                  {t("assessment.endurance.runHint")}
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={runMinutes}
                  onChange={(e) => {
                    setRunMinutes(e.target.value);
                    setRunPreset(null);
                  }}
                  placeholder={t("assessment.endurance.minutesPlaceholder")}
                  className="w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] rounded-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["under5", "assessment.endurance.presetUnder5"],
                      ["5to10", "assessment.endurance.preset5to10"],
                      ["10to20", "assessment.endurance.preset10to20"],
                      ["over20", "assessment.endurance.presetOver20"],
                    ] as const
                  ).map(([preset, labelKey]) => (
                    <button
                      key={preset}
                      type="button"
                      className={presetClass(runPreset === preset)}
                      onClick={() => applyPreset(preset)}
                    >
                      {t(labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cardioTestType === "walk" && (
              <div className="space-y-4">
                <p className="font-semibold text-iron-text">
                  {t("assessment.endurance.walkQuestion")}
                </p>
                <p className="text-xs text-iron-muted">
                  {t("assessment.endurance.walkHint")}
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={walkMinutes}
                  onChange={(e) => setWalkMinutes(e.target.value)}
                  placeholder={t("assessment.endurance.minutesPlaceholder")}
                  className="w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] rounded-sm"
                />
              </div>
            )}
          </div>
        );
      }
      case "limitations":
        return (
          <div className="space-y-3">
            <p className="text-sm text-iron-muted leading-relaxed">
              {t("assessment.limitations.subtitle")}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {LIMITATIONS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`w-full text-left border p-3 rounded-sm iron-interactive ${
                    limitations.includes(id)
                      ? "border-iron-accent bg-iron-accent-dim/20"
                      : "border-iron-border iron-card-raised"
                  }`}
                  onClick={() => toggleLimitation(id)}
                >
                  <p className="font-semibold text-sm text-iron-text">
                    {t(`assessment.limitations.${id}.title`)}
                  </p>
                  <p className="text-xs text-iron-muted mt-1 leading-relaxed">
                    {t(`assessment.limitations.${id}.description`)}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-xs text-iron-muted leading-relaxed border border-iron-border/60 rounded-sm p-3">
              {t("assessment.limitations.disclaimer")}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const stepTitleKey = `assessment.${currentStep}.title` as const;
  const stepExplainKey = `assessment.${currentStep}.explain` as const;
  const stepTipKey = `assessment.${currentStep}.tip` as const;
  const stepWarnKey = `assessment.${currentStep}.warn` as const;
  const isLimitationsStep = currentStep === "limitations";
  const isEnduranceStep = currentStep === "endurance";

  return (
    <ScreenShell
      transitionKey={currentStep}
      eyebrow={t("assessment.eyebrow", {
        current: stepIndex + 1,
        total: totalSteps,
      })}
      title={
        isLimitationsStep
          ? t("assessment.limitations.title")
          : t(stepTitleKey)
      }
      subtitle={
        isLimitationsStep ? undefined : t(stepExplainKey)
      }
      onBack={goBack}
    >
      {renderStepContent()}

      {!isLimitationsStep && (
        <>
          <p className="mt-4 text-sm text-iron-muted">
            <span className="text-iron-accent font-semibold">ⓘ </span>
            {t(stepTipKey)}
          </p>
          {(isEnduranceStep || t(stepWarnKey)) && (
            <p className="mt-2 text-sm text-iron-danger/90">
              {isEnduranceStep
                ? t("assessment.endurance.warn")
                : t(stepWarnKey)}
            </p>
          )}
        </>
      )}

      <IronButton
        className="mt-6"
        onClick={goNext}
        disabled={!canAdvance()}
      >
        {stepIndex < totalSteps - 1
          ? t("assessment.next")
          : t("assessment.seeResults")}
      </IronButton>
    </ScreenShell>
  );
}
