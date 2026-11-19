import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  SIMULATOR_SCENARIOS,
  buildSimulationSteps,
  getScenarioCodeLines,
} from '../../data/lotr-curriculum.data';
import { SimulatorScenarioId } from '../../models/learning.models';

interface IsoTileCoord {
  index: number;
  value: string;
  x: number;
  y: number;
  floors: number;
}

@Component({
  selector: 'app-simulator-module',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Scenario Selector Bar -->
      <div class="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#121824] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-1">
          <div class="text-xs text-slate-400">Módulo 2 · Execução em Tempo Real</div>
          <h2 class="font-display text-xl font-bold text-amber-100 sm:text-2xl">
            Simulador Passo a Passo
          </h2>
          <p class="text-xs text-slate-300 sm:text-sm">
            {{ activeScenarioMeta().subtitle }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          @for (scenario of scenarios; track scenario.id) {
            <button
              type="button"
              (click)="selectScenario(scenario.id)"
              class="whitespace-nowrap shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-amber-400"
              [class]="
                selectedScenarioId() === scenario.id
                  ? 'border-amber-400 bg-amber-400 text-slate-950'
                  : 'border-slate-700 bg-[#0B0F17] text-slate-300 hover:border-slate-600 hover:text-white'
              "
            >
              {{ scenario.title }}
            </button>
          }
        </div>
      </div>

      <!-- Two-Zone Sandbox -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <!-- Left Zone: Visual Stage (Isometric City + Memory + Console) -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Isometric Middle-earth Stage -->
          <div class="rounded-2xl border border-slate-800 bg-[#121824] p-5 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="text-xs font-medium text-slate-300">
                Cenário Isométrico · Índice ativo:
                <span class="font-mono-code font-semibold text-sky-300 tabular-nums">
                  {{ currentStep().activeIndex !== null ? '[' + currentStep().activeIndex + ']' : 'nenhum' }}
                </span>
              </div>
              <div class="text-xs text-slate-400 tabular-nums">
                Passo {{ stepIndex() + 1 }} de {{ steps().length }}
              </div>
            </div>

            <div class="rounded-xl border border-slate-800/90 bg-[#0B0F17] p-3">
              <svg
                viewBox="0 0 640 270"
                class="w-full"
                role="img"
                aria-label="Visualização isométrica do array sendo percorrido pelo loop"
              >
                <!-- Subtle isometric grid backdrop -->
                <polygon
                  points="320,26 608,145 320,256 32,145"
                  fill="#0E1522"
                  stroke="#1E293B"
                  stroke-width="1.5"
                />
                <line x1="176" y1="85" x2="464" y2="200" stroke="#162032" stroke-width="1" />
                <line x1="464" y1="85" x2="176" y2="200" stroke="#162032" stroke-width="1" />

                <!-- Connecting path between tiles -->
                @if (isoTiles().length > 1) {
                  <polyline
                    [attr.points]="journeyPolyline()"
                    fill="none"
                    stroke="#334155"
                    stroke-width="3"
                    stroke-dasharray="6 5"
                  />
                }

                <!-- Isometric Tiles & Structures -->
                @for (tile of isoTiles(); track tile.index) {
                  <g [attr.transform]="'translate(' + tile.x + ', ' + tile.y + ')'">
                    <!-- Base Isometric Tile -->
                    <polygon
                      points="0,-24 48,0 0,24 -48,0"
                      [attr.fill]="
                        isTileActive(tile.index)
                          ? '#0C4A6E'
                          : isTileVisited(tile.index)
                            ? '#1E293B'
                            : '#111827'
                      "
                      [attr.stroke]="
                        isTileActive(tile.index)
                          ? '#38BDF8'
                          : isTileVisited(tile.index)
                            ? '#F59E0B'
                            : '#334155'
                      "
                      stroke-width="2"
                    />
                    <polygon
                      points="-48,0 0,24 0,38 -48,14"
                      fill="#090D16"
                      stroke="#1E293B"
                      stroke-width="1"
                    />
                    <polygon
                      points="48,0 0,24 0,38 48,14"
                      fill="#111827"
                      stroke="#1E293B"
                      stroke-width="1"
                    />

                    <!-- Theme 1: Beacons of Gondor -->
                    @if (activeScenarioMeta().visualTheme === 'beacons') {
                      <!-- Stone beacon plinth -->
                      <polygon points="0,-32 16,-24 0,-16 -16,-24" fill="#475569" stroke="#64748B" />
                      <polygon points="-16,-24 0,-16 0,2 -16,-6" fill="#1E293B" />
                      <polygon points="16,-24 0,-16 0,2 16,-6" fill="#334155" />

                      @if (isTileVisited(tile.index)) {
                        <!-- Lit golden flame -->
                        <path
                          d="M0,-58 C9,-46 11,-34 0,-27 C-11,-34 -9,-46 0,-58 Z"
                          fill="#F59E0B"
                        />
                        <path
                          d="M0,-50 C5,-43 6,-36 0,-31 C-6,-36 -5,-43 0,-50 Z"
                          fill="#FEF08A"
                        />
                      } @else {
                        <!-- Unlit brazier -->
                        <ellipse cx="0" cy="-26" rx="9" ry="4" fill="#0F172A" />
                      }
                    }

                    <!-- Theme 2: Citadel Towers (stacked isometric floors) -->
                    @if (activeScenarioMeta().visualTheme === 'towers') {
                      @if (isTileVisited(tile.index)) {
                        @for (floorIdx of getFloorRange(tile.floors); track floorIdx) {
                          <g [attr.transform]="'translate(0, ' + (-floorIdx * 13) + ')'">
                            <polygon
                              points="0,-24 18,-15 0,-6 -18,-15"
                              fill="#CBD5E1"
                              stroke="#94A3B8"
                              stroke-width="1"
                            />
                            <polygon
                              points="-18,-15 0,-6 0,6 -18,-3"
                              fill="#64748B"
                              stroke="#475569"
                              stroke-width="0.8"
                            />
                            <polygon
                              points="18,-15 0,-6 0,6 18,-3"
                              fill="#94A3B8"
                              stroke="#475569"
                              stroke-width="0.8"
                            />
                          </g>
                        }
                        <!-- Gold spire cap -->
                        <g [attr.transform]="'translate(0, ' + (-tile.floors * 13 - 10) + ')'">
                          <polygon points="0,-22 10,-12 -10,-12" fill="#F59E0B" />
                        </g>
                      } @else {
                        <!-- Blueprint foundation -->
                        <polygon
                          points="0,-16 18,-7 0,2 -18,-7"
                          fill="none"
                          stroke="#475569"
                          stroke-width="1.4"
                          stroke-dasharray="3 2"
                        />
                      }
                    }

                    <!-- Theme 3: Journey through Middle-earth -->
                    @if (activeScenarioMeta().visualTheme === 'journey') {
                      @if (isTileActive(tile.index)) {
                        <!-- Hero marker -->
                        <circle cx="0" cy="-24" r="11" fill="#10B981" stroke="#A7F3D0" stroke-width="2" />
                        <circle cx="0" cy="-24" r="4" fill="#ECFDF5" />
                      } @else if (isTileVisited(tile.index)) {
                        <!-- Visited checkpoint flag -->
                        <line x1="0" y1="-4" x2="0" y2="-32" stroke="#FBBF24" stroke-width="2" />
                        <polygon points="0,-32 16,-26 0,-20" fill="#F59E0B" />
                      } @else {
                        <circle cx="0" cy="-4" r="5" fill="#334155" />
                      }
                    }

                    <!-- Index & Value Caption -->
                    <text
                      x="0"
                      y="54"
                      text-anchor="middle"
                      class="font-mono-code text-[11px] font-semibold"
                      [attr.fill]="isTileActive(tile.index) ? '#7DD3FC' : '#94A3B8'"
                    >
                      [{{ tile.index }}] {{ tile.value }}
                    </text>
                  </g>
                }
              </svg>
            </div>
          </div>

          <!-- Memory Slots Array Strip -->
          <div class="rounded-2xl border border-slate-800 bg-[#121824] p-5 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h3 class="text-sm font-semibold text-slate-200">
                Array na Memória:
                <code class="font-mono-code text-amber-300">{{ activeScenarioMeta().arrayName }}</code>
              </h3>
              <span class="font-mono-code text-xs text-slate-400 tabular-nums">
                .length = {{ currentItems().length }}
              </span>
            </div>

            <div class="flex flex-wrap gap-2.5">
              @for (item of currentItems(); track $index) {
                <div
                  class="min-w-[84px] flex-1 rounded-xl border px-3 py-2.5 transition-all duration-150"
                  [class]="
                    currentStep().activeIndex === $index
                      ? 'border-sky-400 bg-sky-500/15'
                      : isTileVisited($index)
                        ? 'border-amber-500/45 bg-amber-500/10'
                        : 'border-slate-800 bg-[#0B0F17]'
                  "
                >
                  <div class="flex items-center justify-between text-[11px]">
                    <span
                      class="font-mono-code font-semibold tabular-nums"
                      [class]="
                        currentStep().activeIndex === $index ? 'text-sky-300' : 'text-slate-400'
                      "
                    >
                      [{{ $index }}]
                    </span>
                    @if (currentStep().activeIndex === $index) {
                      <span class="font-semibold text-sky-300">Lendo</span>
                    } @else if (isTileVisited($index)) {
                      <span class="text-amber-300">Lido</span>
                    }
                  </div>
                  <div class="font-mono-code mt-1 truncate text-sm font-semibold text-slate-100">
                    {{ activeScenarioMeta().itemKind === 'text' ? '"' + item + '"' : item }}
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Simulated Console Output -->
          <div class="rounded-2xl border border-slate-800 bg-[#090D14] p-5 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <mat-icon class="!text-[16px] !h-[16px] !w-[16px] text-emerald-400">terminal</mat-icon>
                <span>Console Simulado (saída do programa)</span>
              </div>
              <span class="text-xs text-slate-500 tabular-nums">
                {{ currentStep().consoleLines.length }} linha(s)
              </span>
            </div>

            <div class="font-mono-code min-h-[108px] space-y-1.5 text-xs sm:text-sm">
              @if (currentStep().consoleLines.length === 0) {
                <div class="text-slate-500 italic">
                  Nenhuma saída impressa ainda. Clique em "Próximo Passo" para avançar.
                </div>
              } @else {
                @for (line of currentStep().consoleLines; track $index) {
                  <div class="flex items-start gap-2 text-emerald-300">
                    <span class="select-none text-slate-600 tabular-nums">&gt;</span>
                    <span>{{ line }}</span>
                  </div>
                }
              }
            </div>
          </div>
        </div>

        <!-- Right Zone: Controls, Live Code & Variables -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Playback Controls -->
          <div class="rounded-2xl border border-slate-800 bg-[#121824] p-5 space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                (click)="prevStep()"
                [disabled]="stepIndex() === 0"
                class="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-slate-700 bg-[#0B0F17] px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <mat-icon class="!text-[16px] !h-[16px] !w-[16px]">arrow_back</mat-icon>
                <span>Voltar</span>
              </button>

              <button
                type="button"
                (click)="nextStep()"
                [disabled]="isLastStep()"
                class="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span>{{ isLastStep() ? 'Concluído' : 'Próximo Passo' }}</span>
                <mat-icon class="!text-[16px] !h-[16px] !w-[16px]">arrow_forward</mat-icon>
              </button>

              <button
                type="button"
                (click)="toggleAutoPlay()"
                class="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors"
                [class]="
                  isAutoPlaying()
                    ? 'border-sky-400 bg-sky-500/20 text-sky-200'
                    : 'border-slate-700 bg-[#0B0F17] text-slate-200 hover:border-slate-500'
                "
              >
                <mat-icon class="!text-[16px] !h-[16px] !w-[16px]">
                  {{ isAutoPlaying() ? 'pause' : 'play_arrow' }}
                </mat-icon>
                <span>{{ isAutoPlaying() ? 'Pausar' : 'Auto' }}</span>
              </button>

              <button
                type="button"
                (click)="resetSimulation()"
                class="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-slate-700 bg-[#0B0F17] px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
              >
                <mat-icon class="!text-[16px] !h-[16px] !w-[16px]">restart_alt</mat-icon>
                <span>Reiniciar</span>
              </button>
            </div>

            <!-- Live Explanation Box -->
            <div class="rounded-xl border border-slate-800 bg-[#0B0F17] p-4 space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-semibold text-amber-300">
                  {{ currentStep().phaseLabel }}
                </span>
                @if (currentStep().conditionCheck) {
                  <span
                    class="font-mono-code text-xs font-semibold"
                    [class]="currentStep().conditionPassed ? 'text-emerald-300' : 'text-rose-300'"
                  >
                    {{ currentStep().conditionCheck }}
                  </span>
                }
              </div>
              <p class="text-sm leading-relaxed text-slate-200">
                {{ currentStep().explanation }}
              </p>
            </div>
          </div>

          <!-- Highlighted JavaScript Code -->
          <div class="rounded-2xl border border-slate-800 bg-[#121824] p-5 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-slate-200">Código JavaScript</h3>
              <span class="text-xs text-slate-400">Linha em execução destacada</span>
            </div>

            <div class="font-mono-code overflow-x-auto rounded-xl border border-slate-800 bg-[#090D14] p-3 text-xs leading-6 sm:text-[13px]">
              @for (line of codeLines(); track $index) {
                <div
                  class="flex items-center gap-3 rounded-md px-2 py-0.5 transition-colors"
                  [class]="
                    currentStep().activeLine === $index
                      ? 'bg-sky-500/20 text-white'
                      : 'text-slate-400'
                  "
                >
                  <span class="w-4 select-none text-right text-[11px] text-slate-600 tabular-nums">
                    {{ $index + 1 }}
                  </span>
                  <span class="whitespace-pre">{{ line }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Variable Inspector & Array Customizer -->
          <div class="rounded-2xl border border-slate-800 bg-[#121824] p-5 space-y-4">
            <h3 class="text-sm font-semibold text-slate-200">Variáveis na Memória</h3>
            <div class="grid grid-cols-3 gap-2.5">
              @for (variable of currentStep().variables; track variable.name) {
                <div
                  class="rounded-xl border p-3"
                  [class]="
                    variable.highlight
                      ? 'border-amber-400/60 bg-amber-500/10'
                      : 'border-slate-800 bg-[#0B0F17]'
                  "
                >
                  <div class="font-mono-code truncate text-[11px] text-slate-400">
                    {{ variable.name }}
                  </div>
                  <div class="font-mono-code mt-1 truncate text-sm font-semibold text-slate-100 tabular-nums">
                    {{ variable.value }}
                  </div>
                </div>
              }
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4">
              <span class="text-xs text-slate-400">Testar tamanho do array:</span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="removeItem()"
                  [disabled]="currentItems().length <= 2"
                  class="inline-flex items-center gap-1 whitespace-nowrap shrink-0 rounded-lg border border-slate-700 bg-[#0B0F17] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 disabled:opacity-40"
                >
                  <mat-icon class="!text-[15px] !h-[15px] !w-[15px]">remove</mat-icon>
                  <span>Remover item</span>
                </button>
                <button
                  type="button"
                  (click)="addItem()"
                  [disabled]="currentItems().length >= 5"
                  class="inline-flex items-center gap-1 whitespace-nowrap shrink-0 rounded-lg border border-slate-700 bg-[#0B0F17] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 disabled:opacity-40"
                >
                  <mat-icon class="!text-[15px] !h-[15px] !w-[15px]">add</mat-icon>
                  <span>Adicionar item</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SimulatorModule {
  private readonly destroyRef = inject(DestroyRef);
  private autoTimer: ReturnType<typeof setInterval> | null = null;

  readonly scenarios = SIMULATOR_SCENARIOS;
  readonly selectedScenarioId = signal<SimulatorScenarioId>('for-beacons');
  readonly customItemsMap = signal<Record<SimulatorScenarioId, string[]>>({
    'for-beacons': [...SIMULATOR_SCENARIOS[0].defaultItems],
    'for-citadel': [...SIMULATOR_SCENARIOS[1].defaultItems],
    'while-journey': [...SIMULATOR_SCENARIOS[2].defaultItems],
  });
  readonly stepIndex = signal<number>(0);
  readonly isAutoPlaying = signal<boolean>(false);

  private readonly extraPoolText = ['Halifirien', 'Valfenda', 'Rohan', 'Edoras', 'Ithilien'];
  private readonly extraPoolNums = ['3', '5', '2', '4', '6'];

  constructor() {
    this.destroyRef.onDestroy(() => this.stopAutoPlay());
  }

  readonly activeScenarioMeta = computed(() => {
    const id = this.selectedScenarioId();
    return this.scenarios.find((s) => s.id === id) ?? this.scenarios[0];
  });

  readonly currentItems = computed(() => {
    const id = this.selectedScenarioId();
    return this.customItemsMap()[id];
  });

  readonly codeLines = computed(() =>
    getScenarioCodeLines(this.selectedScenarioId(), this.currentItems())
  );

  readonly steps = computed(() =>
    buildSimulationSteps(this.selectedScenarioId(), this.currentItems())
  );

  readonly currentStep = computed(() => {
    const all = this.steps();
    const idx = Math.min(this.stepIndex(), all.length - 1);
    return all[idx] ?? all[0];
  });

  readonly isLastStep = computed(
    () => this.stepIndex() >= this.steps().length - 1
  );

  readonly isoTiles = computed<IsoTileCoord[]>(() => {
    const items = this.currentItems();
    const count = items.length;
    const spacingX = 96;
    const spacingY = 26;
    const startX = 320 - ((count - 1) * spacingX) / 2;
    const startY = 148 - ((count - 1) * spacingY) / 2;

    return items.map((value, index) => ({
      index,
      value,
      x: startX + index * spacingX,
      y: startY + index * spacingY,
      floors: Math.max(1, Math.min(6, Number(value) || 2)),
    }));
  });

  readonly journeyPolyline = computed(() =>
    this.isoTiles()
      .map((t) => `${t.x},${t.y}`)
      .join(' ')
  );

  selectScenario(id: SimulatorScenarioId): void {
    this.stopAutoPlay();
    this.selectedScenarioId.set(id);
    this.stepIndex.set(0);
  }

  nextStep(): void {
    if (this.stepIndex() < this.steps().length - 1) {
      this.stepIndex.update((v) => v + 1);
    } else {
      this.stopAutoPlay();
    }
  }

  prevStep(): void {
    this.stopAutoPlay();
    if (this.stepIndex() > 0) {
      this.stepIndex.update((v) => v - 1);
    }
  }

  resetSimulation(): void {
    this.stopAutoPlay();
    this.stepIndex.set(0);
  }

  toggleAutoPlay(): void {
    if (this.isAutoPlaying()) {
      this.stopAutoPlay();
      return;
    }

    if (this.isLastStep()) {
      this.stepIndex.set(0);
    }

    this.isAutoPlaying.set(true);
    this.autoTimer = setInterval(() => {
      if (this.stepIndex() < this.steps().length - 1) {
        this.stepIndex.update((v) => v + 1);
      } else {
        this.stopAutoPlay();
      }
    }, 1050);
  }

  addItem(): void {
    this.stopAutoPlay();
    const id = this.selectedScenarioId();
    const meta = this.activeScenarioMeta();
    const list = this.currentItems();
    if (list.length >= 5) return;

    const nextVal =
      meta.itemKind === 'number'
        ? this.extraPoolNums[list.length % this.extraPoolNums.length]
        : this.extraPoolText[list.length % this.extraPoolText.length];

    this.customItemsMap.update((prev) => ({
      ...prev,
      [id]: [...prev[id], nextVal],
    }));
    this.stepIndex.set(0);
  }

  removeItem(): void {
    this.stopAutoPlay();
    const id = this.selectedScenarioId();
    const list = this.currentItems();
    if (list.length <= 2) return;

    this.customItemsMap.update((prev) => ({
      ...prev,
      [id]: prev[id].slice(0, -1),
    }));
    this.stepIndex.set(0);
  }

  isTileActive(index: number): boolean {
    return this.currentStep().activeIndex === index;
  }

  isTileVisited(index: number): boolean {
    return this.currentStep().visitedIndices.includes(index);
  }

  getFloorRange(count: number): number[] {
    return Array.from({ length: count }, (_, idx) => idx);
  }

  private stopAutoPlay(): void {
    if (this.autoTimer !== null) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
    this.isAutoPlaying.set(false);
  }
}
