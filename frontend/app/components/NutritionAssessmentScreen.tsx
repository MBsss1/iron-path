"use client";

import { useMemo, useState } from "react";
import {
  assessNutritionAnswers,
  NUTRITION_QUESTION_IDS,
  type NutritionAnswerScore,
  type NutritionAssessmentAnswers,
  type NutritionQuestionId,
} from "../data/nutritionAssessment";
import ScreenShell from "./ScreenShell";
import IronButton from "./IronButton";
import { useTranslation } from "../i18n/useTranslation";
import StepTransition from "../animations/StepTransition";

type Props = {
  onComplete: (answers: NutritionAssessmentAnswers) => void;
};

type Phase = "wizard" | "result";

const OPTION_LETTERS: { score: NutritionAnswerScore; key: "a" | "b" | "c" | "d" }[] =
  [
    { score: 1, key: "a" },
    { score: 2, key: "b" },
    { score: 3, key: "c" },
    { score: 4, key: "d" },
  ];

export default function NutritionAssessmentScreen({ onComplete }: Props) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("wizard");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<NutritionAssessmentAnswers>>({});

  const currentQuestionId: NutritionQuestionId | undefined =
    NUTRITION_QUESTION_IDS[stepIndex];
  const totalSteps = NUTRITION_QUESTION_IDS.length;
  const currentAnswer = currentQuestionId ? answers[currentQuestionId] : undefined;
  const isLastStep = stepIndex >= totalSteps - 1;

  const resultLevel = useMemo(() => {
    const allAnswered = NUTRITION_QUESTION_IDS.every((id) => answers[id] !== undefined);
    if (!allAnswered) return null;
    return assessNutritionAnswers(answers as NutritionAssessmentAnswers).level;
  }, [answers]);

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
    ? t(`nutritionAssessment.questions.${currentQuestionId}.title`)
    : "";

  if (phase === "result" && resultLevel) {
    return (
      <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24">
        <ScreenShell
          eyebrow={t("nutritionAssessment.resultEyebrow")}
          title={t(`nutritionAssessment.levels.${resultLevel}.title`)}
          subtitle={t(`nutritionAssessment.levels.${resultLevel}.description`)}
        >
          <IronButton
            type="button"
            variant="primary"
            className="w-full"
            onClick={() => onComplete(answers as NutritionAssessmentAnswers)}
          >
            {t("nutritionAssessment.resultContinue")}
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
        eyebrow={t("nutritionAssessment.eyebrow")}
        title={t("nutritionAssessment.title")}
        subtitle={t("nutritionAssessment.subtitle")}
        transitionKey={currentQuestionId}
      >
        <p className="text-xs text-iron-muted text-center">
          {t("nutritionAssessment.progress", {
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
                  className={`iron-interactive w-full text-left border rounded-sm p-4 min-h-[52px] transition-colors ${
                    selected
                      ? "border-iron-accent bg-iron-accent/10 text-iron-text"
                      : "border-iron-border iron-card-panel hover:border-iron-accent-dim/50"
                  }`}
                >
                  <span className="text-sm leading-relaxed">
                    {t(
                      `nutritionAssessment.questions.${currentQuestionId}.options.${key}`
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
