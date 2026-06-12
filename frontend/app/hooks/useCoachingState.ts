"use client";

import { useCallback, useEffect, useState } from "react";
import {
  dismissReassessmentPrompt,
  loadCoachingState,
  markStartDebriefSeen,
  recordAssessmentCompletion,
  type CoachingState,
} from "../utils/coachingStorage";

export function useCoachingState() {
  const [state, setState] = useState<CoachingState | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setState(loadCoachingState());
      setLoaded(true);
    });
  }, []);

  const markDebriefSeen = useCallback(() => {
    const next = markStartDebriefSeen();
    setState(next);
  }, []);

  const onAssessmentCompleted = useCallback(() => {
    const next = recordAssessmentCompletion();
    setState(next);
  }, []);

  const dismissReassessment = useCallback((programWeek: number) => {
    const next = dismissReassessmentPrompt(programWeek);
    setState(next);
  }, []);

  return {
    loaded,
    state,
    startDebriefSeen: state?.startDebriefSeen ?? false,
    markDebriefSeen,
    onAssessmentCompleted,
    dismissReassessment,
  };
}
