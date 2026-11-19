export type ModuleTab = 'conceito' | 'simulador' | 'exemplos' | 'desafios';

export interface ArrayConceptItem {
  index: number;
  value: string;
  landmark: string;
  role: string;
}

export interface LoopStage {
  id: string;
  label: string;
  codeFragment: string;
  explanation: string;
  nextHint: string;
}

export type SimulatorScenarioId = 'for-beacons' | 'for-citadel' | 'while-journey';

export interface SimulatorVariable {
  name: string;
  value: string;
  highlight?: boolean;
}

export interface SimulationStep {
  stepNumber: number;
  activeLine: number;
  activeIndex: number | null;
  visitedIndices: number[];
  phaseLabel: string;
  explanation: string;
  conditionCheck: string | null;
  conditionPassed: boolean | null;
  variables: SimulatorVariable[];
  consoleLines: string[];
  finished: boolean;
}

export interface SimulatorScenarioMeta {
  id: SimulatorScenarioId;
  title: string;
  loopType: 'for' | 'while';
  subtitle: string;
  arrayName: string;
  defaultItems: string[];
  itemKind: 'text' | 'number';
  visualTheme: 'beacons' | 'towers' | 'journey';
}

export interface CommentedCodeLine {
  lineNumber: number;
  code: string;
  comment: string;
  detail: string;
}

export interface PracticalExample {
  id: string;
  title: string;
  tag: string;
  goal: string;
  arrayPreview: string;
  lines: CommentedCodeLine[];
  defaultInputLabel: string;
  defaultInputValue: string;
  presets: { label: string; value: string }[];
}

export interface ChallengeOption {
  id: string;
  label: string;
  codePreview?: string;
}

export interface ChallengeQuestion {
  id: string;
  number: number;
  title: string;
  landmarkName: string;
  type: 'multiple-choice' | 'gap-fill';
  contextText: string;
  codeLines: string[];
  /** Used for gap-fill: token in codeLines like '___1___' */
  gaps?: {
    placeholder: string;
    label: string;
    choices: string[];
    correctChoice: string;
  }[];
  options?: ChallengeOption[];
  correctOptionId?: string;
  hint: string;
  commentedAnswerKey: string;
}
