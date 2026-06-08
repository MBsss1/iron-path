"use client";

import { useMemo, useState } from "react";
import {
  assessMassGainAnswers,
  MASS_GAIN_QUESTION_IDS,
  type MassGainAssessmentAnswers,
  type MassGainDiagnosisId,
  type MassGainQuestionId,
  type NutritionAnswerScore,
  type NutritionAssessmentGoal,
} from "../data/nutritionAssessment";
import {
  assessWeightLossAnswers,
  WEIGHT_LOSS_QUESTION_IDS,
  type WeightLossAssessmentAnswers,
  type WeightLossDiagnosisId,
  type WeightLossQuestionId,
} from "../data/nutritionWeightLossAssessment";
import ScreenShell from "./ScreenShell";
import IronButton from "./IronButton";
import { useTranslation } from "../i18n/useTranslation";
import StepTransition from "../animations/StepTransition";

const MASS_GAIN_INFO_URL = "https://t.me/+8hucRbt1aLVhMGNi";
const WEIGHT_LOSS_INFO_URL = "https://t.me/+LIUoCz3TJbY5NGFi";

type Props = {
  variant: NutritionAssessmentGoal;
  onComplete: (
    answers: MassGainAssessmentAnswers | WeightLossAssessmentAnswers
  ) => void;
};

type Phase = "wizard" | "result";

const OPTION_LETTERS: { score: NutritionAnswerScore; key: "a" | "b" | "c" | "d" }[] =
  [
    { score: 1, key: "a" },
    { score: 2, key: "b" },
    { score: 3, key: "c" },
    { score: 4, key: "d" },
  ];

type AssessmentCopyPrefix = "nutritionAssessment" | "nutritionWeightLossAssessment";

function getQuestionIds(variant: NutritionAssessmentGoal) {
  return variant === "mass_gain"
    ? MASS_GAIN_QUESTION_IDS
    : WEIGHT_LOSS_QUESTION_IDS;
}

function getCopyPrefix(variant: NutritionAssessmentGoal): AssessmentCopyPrefix {
  return variant === "mass_gain"
    ? "nutritionAssessment"
    : "nutritionWeightLossAssessment";
}

function getInfoUrl(variant: NutritionAssessmentGoal) {
  return variant === "mass_gain" ? MASS_GAIN_INFO_URL : WEIGHT_LOSS_INFO_URL;
}

export default function NutritionAssessmentScreen({ variant, onComplete }: Props) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("wizard");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Partial<MassGainAssessmentAnswers & WeightLossAssessmentAnswers>
  >({});

  const questionIds = getQuestionIds(variant);
  const copyPrefix = getCopyPrefix(variant);
  const currentQuestionId = questionIds[stepIndex] as
    | MassGainQuestionId
    | WeightLossQuestionId
    | undefined;
  const totalSteps = questionIds.length;
  const currentAnswer = currentQuestionId ? answers[currentQuestionId] : undefined;
  const isLastStep = stepIndex >= totalSteps - 1;

  const resultDiagnosis = useMemo(() => {
    const allAnswered = questionIds.every((id) => answers[id] !== undefined);
    if (!allAnswered) return null;

    if (variant === "mass_gain") {
      return assessMassGainAnswers(answers as MassGainAssessmentAnswers).diagnosis;
    }

    return assessWeightLossAnswers(answers as WeightLossAssessmentAnswers).diagnosis;
  }, [answers, questionIds, variant]);

  const handleSelect = (score: NutritionAnswerScore) => {
    if (!currentQuestionId) return;

    const nextAnswers = { ...answers, [currentQuestionId]: score };
    setAnswers(nextAnswers);

    if (isLastStep) {
      setPhase("result");
      return;
    }

    setStepIndex((index) => index + 1);
  };

  const handleBack = () => {
    if (phase === "result") {
      setPhase("wizard");
      return;
    }
    if (stepIndex > 0) {
      setStepIndex((index) => index - 1);
    }
  };

  const wizardTitle = currentQuestionId
    ? t(`${copyPrefix}.questions.${currentQuestionId}.title`)
    : "";

  if (phase === "result" && resultDiagnosis) {
    const diagnosisKey = resultDiagnosis as MassGainDiagnosisId | WeightLossDiagnosisId;

    return (
      <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24">
        <ScreenShell
          eyebrow={t(`${copyPrefix}.resultEyebrow`)}
          title={t(`${copyPrefix}.diagnoses.${diagnosisKey}.title`)}
        >
          <div className="iron-quest-card iron-quest-card-main p-4 sm:p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-iron-muted">
                {t(`${copyPrefix}.resultPrimaryIssue`)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-iron-text">
                {t(`${copyPrefix}.diagnoses.${diagnosisKey}.primaryIssue`)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-iron-muted">
                {t(`${copyPrefix}.resultRecommendedActions`)}
              </p>
              <ul className="mt-3 space-y-2.5">
                {(["action1", "action2", "action3"] as const).map((actionKey) => (
                  <li
                    key={actionKey}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-iron-text"
                  >
                    <span className="text-iron-accent shrink-0" aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      {t(`${copyPrefix}.diagnoses.${diagnosisKey}.actions.${actionKey}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center px-1 space-y-1">
            <p className="text-sm text-iron-muted">
              {t(`${copyPrefix}.resultGuidance`)}
            </p>
            <a
              href={getInfoUrl(variant)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] text-sm text-iron-accent font-semibold underline underline-offset-[5px] decoration-iron-accent-dim hover:text-iron-text hover:decoration-iron-accent transition-colors"
            >
              {t(`${copyPrefix}.resultInfoLink`)}
            </a>
          </div>

          <IronButton
            type="button"
            variant="primary"
            className="w-full"
            onClick={() => {
              if (variant === "mass_gain") {
                onComplete(answers as MassGainAssessmentAnswers);
                return;
              }
              onComplete(answers as WeightLossAssessmentAnswers);
            }}
          >
            {t(`${copyPrefix}.resultContinue`)}
          </IronButton>

          <button
            type="button"
            onClick={handleBack}
            className="iron-interactive w-full mt-2 py-3 text-sm font-semibold text-iron-muted hover:text-iron-text"
          >
            {t("common.back")}
          </button>
        </ScreenShell>
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24">
      <ScreenShell
        eyebrow={t(`${copyPrefix}.eyebrow`)}
        title={t(`${copyPrefix}.title`)}
        subtitle={t(`${copyPrefix}.subtitle`)}
        transitionKey={currentQuestionId}
      >
        <p className="text-xs text-iron-muted text-center">
          {t(`${copyPrefix}.progress`, {
            current: stepIndex + 1,
            total: totalSteps,
          })}
        </p>

        <StepTransition stepKey={currentQuestionId ?? "question"}>
          <h3 className="iron-heading text-lg text-center leading-snug">
            {wizardTitle}
          </h3>

          <div className="space-y-2.5">
            {OPTION_LETTERS.map(({ score, key }) => {
              const selected = currentAnswer === score;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelect(score)}
                  className={[
                    "iron-quest-card iron-interactive w-full text-left p-4 min-h-[52px] transition-colors",
                    selected
                      ? "border-iron-accent bg-iron-accent/10 text-iron-text"
                      : "iron-quest-card-interactive border-iron-border",
                  ].join(" ")}
                >
                  <span className="text-sm leading-relaxed">
                    {t(
                      `${copyPrefix}.questions.${currentQuestionId}.options.${key}`
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </StepTransition>

        {stepIndex > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="iron-interactive w-full mt-2 py-3 text-sm font-semibold text-iron-muted hover:text-iron-text"
          >
            {t("common.back")}
          </button>
        )}
      </ScreenShell>
    </div>
  );
}
