import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CHALLENGES } from '../../data/lotr-curriculum.data';
import { ThematicFeedback } from '../thematic-feedback/thematic-feedback';

interface ChallengeAttemptState {
  selectedOptionId: string;
  gapAnswers: Record<string, string>;
  status: 'idle' | 'correct' | 'incorrect';
  showAnswerKey: boolean;
}

@Component({
  selector: 'app-challenges-module',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ThematicFeedback],
  template: `
    <div class="space-y-6">
      <!-- Top Isometric Progress Builder Header -->
      <section class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch rounded-2xl border border-slate-800 bg-[#121824] p-6">
        <div class="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Módulo 4</span>
              <span aria-hidden="true">·</span>
              <span>Desafios Práticos</span>
              <span aria-hidden="true">·</span>
              <span class="tabular-nums text-amber-300">
                {{ solvedCount() }} de {{ challenges.length }} cidades erguidas
              </span>
            </div>
            <h2 class="font-display text-xl font-bold text-amber-100 sm:text-2xl">
              Desafio &amp; Prática: Reconstrua a Terra-média
            </h2>
            <p class="text-sm leading-relaxed text-slate-300">
              Resolva cada desafio de JavaScript para erguer os três marcos isométricos no mapa ao lado.
              Se errar, o Olho de Sauron aponta onde ajustar; ao acertar, a Luz de Eärendil ilumina sua conquista.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            @for (challenge of challenges; track challenge.id; let idx = $index) {
              <button
                type="button"
                (click)="selectChallenge(idx)"
                class="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors"
                [class]="
                  activeIndex() === idx
                    ? 'border-amber-400 bg-amber-400 text-slate-950'
                    : isSolved(challenge.id)
                      ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-700 bg-[#0B0F17] text-slate-300 hover:border-slate-500'
                "
              >
                <mat-icon class="!text-[16px] !h-[16px] !w-[16px]">
                  {{ isSolved(challenge.id) ? 'check_circle' : 'flag' }}
                </mat-icon>
                <span>Desafio {{ challenge.number }}: {{ challenge.landmarkName }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Isometric City Builder Progress SVG -->
        <div class="lg:col-span-6 flex items-center justify-center rounded-xl border border-slate-800 bg-[#0B0F17] p-4">
          <svg
            viewBox="0 0 540 210"
            class="w-full max-w-[540px]"
            role="img"
            aria-label="Mapa isométrico mostrando o progresso da construção de Condado, Valfenda e Minas Tirith"
          >
            <polygon points="270,18 515,108 270,194 25,108" fill="#0E1522" stroke="#1E293B" stroke-width="1.5" />
            <polyline
              points="135,108 270,140 405,94"
              fill="none"
              stroke="#334155"
              stroke-width="3"
              stroke-dasharray="5 4"
            />

            <!-- Landmark 1: Condado (Hobbit-hole isometric mound) -->
            <g
              transform="translate(135, 108)"
              role="button"
              tabindex="0"
              aria-label="Selecionar Desafio 1: Condado"
              class="cursor-pointer"
              (click)="selectChallenge(0)"
              (keydown.enter)="selectChallenge(0)"
              (keydown.space)="$event.preventDefault(); selectChallenge(0)"
            >
              <polygon
                points="0,-24 52,0 0,24 -52,0"
                [attr.fill]="isSolved('challenge-1') ? '#064E3B' : '#111827'"
                [attr.stroke]="isSolved('challenge-1') ? '#34D399' : '#334155'"
                stroke-width="1.8"
              />
              @if (isSolved('challenge-1')) {
                <!-- Green Shire Hill + Round Yellow Door -->
                <path d="M-30,0 C-26,-30 26,-30 30,0 Z" fill="#10B981" opacity="0.9" />
                <circle cx="0" cy="-10" r="8" fill="#FBBF24" stroke="#FEF08A" stroke-width="1.5" />
              } @else {
                <rect x="-14" y="-12" width="28" height="10" rx="2" fill="none" stroke="#475569" stroke-dasharray="3 2" />
              }
              <text x="0" y="42" text-anchor="middle" fill="#CBD5E1" class="text-[11px] font-semibold">
                1. Condado
              </text>
            </g>

            <!-- Landmark 2: Valfenda (Elven isometric pavilion) -->
            <g
              transform="translate(270, 140)"
              role="button"
              tabindex="0"
              aria-label="Selecionar Desafio 2: Valfenda"
              class="cursor-pointer"
              (click)="selectChallenge(1)"
              (keydown.enter)="selectChallenge(1)"
              (keydown.space)="$event.preventDefault(); selectChallenge(1)"
            >
              <polygon
                points="0,-24 54,0 0,24 -54,0"
                [attr.fill]="isSolved('challenge-2') ? '#0C4A6E' : '#111827'"
                [attr.stroke]="isSolved('challenge-2') ? '#38BDF8' : '#334155'"
                stroke-width="1.8"
              />
              @if (isSolved('challenge-2')) {
                <polygon points="-20,-4 -20,-34 0,-46 20,-34 20,-4" fill="#38BDF8" opacity="0.85" />
                <polygon points="0,-54 24,-34 -24,-34" fill="#E0F2FE" />
                <rect x="-5" y="-22" width="10" height="18" rx="5" fill="#0F172A" />
              } @else {
                <polygon points="0,-16 20,-6 0,4 -20,-6" fill="none" stroke="#475569" stroke-dasharray="3 2" />
              }
              <text x="0" y="42" text-anchor="middle" fill="#CBD5E1" class="text-[11px] font-semibold">
                2. Valfenda
              </text>
            </g>

            <!-- Landmark 3: Minas Tirith (White isometric tiered citadel) -->
            <g
              transform="translate(405, 94)"
              role="button"
              tabindex="0"
              aria-label="Selecionar Desafio 3: Minas Tirith"
              class="cursor-pointer"
              (click)="selectChallenge(2)"
              (keydown.enter)="selectChallenge(2)"
              (keydown.space)="$event.preventDefault(); selectChallenge(2)"
            >
              <polygon
                points="0,-24 56,0 0,24 -56,0"
                [attr.fill]="isSolved('challenge-3') ? '#451A03' : '#111827'"
                [attr.stroke]="isSolved('challenge-3') ? '#FBBF24' : '#334155'"
                stroke-width="1.8"
              />
              @if (isSolved('challenge-3')) {
                <!-- Tier 1 -->
                <polygon points="-24,-4 0,8 24,-4 24,-18 0,-6 -24,-18" fill="#CBD5E1" />
                <polygon points="0,-30 24,-18 0,-6 -24,-18" fill="#F8FAFC" />
                <!-- Spire -->
                <polygon points="-8,-20 -8,-52 8,-52 8,-20" fill="#E2E8F0" />
                <polygon points="0,-68 10,-52 -10,-52" fill="#FBBF24" />
              } @else {
                <polygon points="0,-18 24,-6 0,6 -24,-6" fill="none" stroke="#475569" stroke-dasharray="3 2" />
              }
              <text x="0" y="42" text-anchor="middle" fill="#CBD5E1" class="text-[11px] font-semibold">
                3. Minas Tirith
              </text>
            </g>
          </svg>
        </div>
      </section>

      <!-- Active Challenge Card -->
      <section class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <!-- Left: Problem Statement & Code -->
        <div class="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#121824] p-6 space-y-5">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2 text-xs text-amber-300">
              <span>Desafio {{ currentChallenge().number }} de {{ challenges.length }}</span>
              <span aria-hidden="true">·</span>
              <span>
                {{
                  currentChallenge().type === 'multiple-choice'
                    ? 'Múltipla Escolha'
                    : 'Preenchimento de Lacunas'
                }}
              </span>
            </div>
            <h3 class="text-xl font-semibold text-slate-100">
              {{ currentChallenge().title }}
            </h3>
            <p class="text-sm leading-relaxed text-slate-300">
              {{ currentChallenge().contextText }}
            </p>
          </div>

          <!-- Code Display with Live Filled Gaps -->
          <div class="font-mono-code overflow-x-auto rounded-xl border border-slate-800 bg-[#090D14] p-4 text-xs leading-7 sm:text-sm">
            @for (line of renderedCodeLines(); track $index) {
              <div class="flex items-center gap-3">
                <span class="w-4 shrink-0 select-none text-right text-[11px] text-slate-600 tabular-nums">
                  {{ $index + 1 }}
                </span>
                <span class="whitespace-pre text-slate-100">{{ line }}</span>
              </div>
            }
          </div>

          <!-- Thematic Feedback Area -->
          @if (currentState().status !== 'idle') {
            <app-thematic-feedback
              [status]="currentState().status"
              [message]="feedbackMessage()"
              [constructiveTip]="currentState().status === 'incorrect' ? currentChallenge().hint : ''"
            />
          }

          <!-- Gabarito Comentado -->
          @if (currentState().showAnswerKey) {
            <div class="rounded-xl border border-sky-500/30 bg-sky-950/25 p-4 space-y-2">
              <div class="flex items-center gap-2 text-xs font-semibold text-sky-300">
                <mat-icon class="!text-[18px] !h-[18px] !w-[18px]">menu_book</mat-icon>
                <span>Gabarito Comentado</span>
              </div>
              <p class="text-sm leading-relaxed text-slate-200">
                {{ currentChallenge().commentedAnswerKey }}
              </p>
            </div>
          }
        </div>

        <!-- Right: Answer Controls -->
        <div class="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#121824] p-6 space-y-5">
          @if (currentChallenge().type === 'multiple-choice') {
            <div class="space-y-3">
              <h4 class="text-sm font-semibold text-slate-100">
                Escolha a alternativa correta:
              </h4>
              <div class="space-y-2.5">
                @for (option of currentChallenge().options ?? []; track option.id) {
                  <button
                    type="button"
                    (click)="selectMultipleChoice(option.id)"
                    class="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-amber-400"
                    [class]="
                      currentState().selectedOptionId === option.id
                        ? 'border-amber-400 bg-amber-500/15 text-amber-100'
                        : 'border-slate-800 bg-[#0B0F17] text-slate-300 hover:border-slate-700 hover:text-white'
                    "
                  >
                    <span class="font-mono-code text-xs sm:text-sm">{{ option.label }}</span>
                    <span class="font-mono-code text-xs uppercase text-slate-500">{{ option.id }}</span>
                  </button>
                }
              </div>
            </div>
          } @else {
            <div class="space-y-4">
              <h4 class="text-sm font-semibold text-slate-100">
                Escolha os trechos para preencher o código:
              </h4>
              @for (gap of currentChallenge().gaps ?? []; track gap.placeholder) {
                <div class="space-y-2">
                  <div class="text-xs font-medium text-slate-400">{{ gap.label }}</div>
                  <div class="flex flex-wrap gap-2">
                    @for (choice of gap.choices; track choice) {
                      <button
                        type="button"
                        (click)="selectGapChoice(gap.placeholder, choice)"
                        class="font-mono-code whitespace-nowrap shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
                        [class]="
                          getGapSelection(gap.placeholder) === choice
                            ? 'border-amber-400 bg-amber-400 text-slate-950 font-semibold'
                            : 'border-slate-700 bg-[#0B0F17] text-slate-200 hover:border-slate-500'
                        "
                      >
                        {{ choice }}
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          }

          <div class="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              (click)="verifyCurrentChallenge()"
              [disabled]="!canVerify()"
              class="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <mat-icon class="!text-[17px] !h-[17px] !w-[17px]">task_alt</mat-icon>
              <span>Verificar Resposta</span>
            </button>

            <button
              type="button"
              (click)="toggleAnswerKey()"
              class="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-slate-700 bg-[#0B0F17] px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-sky-400 hover:text-sky-200"
            >
              <mat-icon class="!text-[17px] !h-[17px] !w-[17px]">visibility</mat-icon>
              <span>{{ currentState().showAnswerKey ? 'Ocultar Gabarito' : 'Ver Gabarito' }}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class ChallengesModule {
  readonly solvedIds = input<string[]>([]);
  readonly solvedIdsChange = output<string[]>();

  readonly challenges = CHALLENGES;
  readonly activeIndex = signal<number>(0);

  readonly attempts = signal<Record<string, ChallengeAttemptState>>({
    'challenge-1': {
      selectedOptionId: '',
      gapAnswers: {},
      status: 'idle',
      showAnswerKey: false,
    },
    'challenge-2': {
      selectedOptionId: '',
      gapAnswers: {},
      status: 'idle',
      showAnswerKey: false,
    },
    'challenge-3': {
      selectedOptionId: '',
      gapAnswers: {},
      status: 'idle',
      showAnswerKey: false,
    },
  });

  readonly currentChallenge = computed(
    () => this.challenges[this.activeIndex()] ?? this.challenges[0]
  );

  readonly currentState = computed(() => {
    const id = this.currentChallenge().id;
    return this.attempts()[id];
  });

  readonly solvedCount = computed(() => this.solvedIds().length);

  readonly renderedCodeLines = computed(() => {
    const ch = this.currentChallenge();
    const state = this.currentState();
    if (ch.type !== 'gap-fill' || !ch.gaps) {
      return ch.codeLines;
    }

    return ch.codeLines.map((line) => {
      let updated = line;
      for (const gap of ch.gaps ?? []) {
        const chosen = state.gapAnswers[gap.placeholder];
        updated = updated.split(gap.placeholder).join(chosen ? chosen : '[ ? ]');
      }
      return updated;
    });
  });

  readonly canVerify = computed(() => {
    const ch = this.currentChallenge();
    const state = this.currentState();
    if (ch.type === 'multiple-choice') {
      return state.selectedOptionId.length > 0;
    }
    const gaps = ch.gaps ?? [];
    return gaps.every((g) => Boolean(state.gapAnswers[g.placeholder]));
  });

  readonly feedbackMessage = computed(() => {
    const ch = this.currentChallenge();
    const state = this.currentState();
    if (state.status === 'correct') {
      return `Excelente! Você dominou "${ch.title}" e iluminou ${ch.landmarkName} no mapa da Terra-média.`;
    }
    if (state.status === 'incorrect') {
      return 'Ainda não é a combinação certa. Leia a dica do mestre abaixo, ajuste sua resposta e tente novamente!';
    }
    return '';
  });

  selectChallenge(index: number): void {
    this.activeIndex.set(index);
  }

  isSolved(challengeId: string): boolean {
    return this.solvedIds().includes(challengeId);
  }

  selectMultipleChoice(optionId: string): void {
    const id = this.currentChallenge().id;
    this.attempts.update((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        selectedOptionId: optionId,
        status: 'idle',
      },
    }));
  }

  selectGapChoice(placeholder: string, choice: string): void {
    const id = this.currentChallenge().id;
    this.attempts.update((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        gapAnswers: {
          ...prev[id].gapAnswers,
          [placeholder]: choice,
        },
        status: 'idle',
      },
    }));
  }

  getGapSelection(placeholder: string): string {
    return this.currentState().gapAnswers[placeholder] ?? '';
  }

  verifyCurrentChallenge(): void {
    const ch = this.currentChallenge();
    const state = this.currentState();

    let isCorrect = false;
    if (ch.type === 'multiple-choice') {
      isCorrect = state.selectedOptionId === ch.correctOptionId;
    } else {
      isCorrect = (ch.gaps ?? []).every(
        (g) => state.gapAnswers[g.placeholder] === g.correctChoice
      );
    }

    this.attempts.update((prev) => ({
      ...prev,
      [ch.id]: {
        ...prev[ch.id],
        status: isCorrect ? 'correct' : 'incorrect',
        showAnswerKey: isCorrect ? true : prev[ch.id].showAnswerKey,
      },
    }));

    if (isCorrect && !this.solvedIds().includes(ch.id)) {
      this.solvedIdsChange.emit([...this.solvedIds(), ch.id]);
    }
  }

  toggleAnswerKey(): void {
    const id = this.currentChallenge().id;
    this.attempts.update((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        showAnswerKey: !prev[id].showAnswerKey,
      },
    }));
  }
}
