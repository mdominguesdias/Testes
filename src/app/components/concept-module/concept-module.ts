import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  CONCEPT_ARRAY_ITEMS,
  FOR_STAGES,
  WHILE_STAGES,
} from '../../data/lotr-curriculum.data';

interface WizardTip {
  id: string;
  emoji: string;
  title: string;
  analogy: string;
  codeSnippet: string;
  svgKind: 'fellowship' | 'journey' | 'moria' | 'length';
}

@Component({
  selector: 'app-concept-module',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="space-y-10">
      <!-- Intro Section -->
      <section class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
        <div class="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#121824] p-6 sm:p-8">
          <div class="space-y-4">
            <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Módulo 1</span>
              <span aria-hidden="true">·</span>
              <span>Arrays e Estruturas de Repetição</span>
              <span aria-hidden="true">·</span>
              <span>Fundamentos ES6+</span>
            </div>

            <h2 class="font-display text-2xl font-bold tracking-tight text-amber-100 sm:text-3xl [text-wrap:balance]">
              Guardando listas na memória e repetindo tarefas sem copiar código
            </h2>

            <p class="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Até agora você guardava um dado por vez em cada variável. Com
              <code class="font-mono-code text-amber-300">Arrays</code>, você agrupa vários valores em uma
              única lista numerada. Com os loops
              <code class="font-mono-code text-sky-300">for</code> e
              <code class="font-mono-code text-sky-300">while</code>, o JavaScript percorre essa lista
              automaticamente, passo a passo.
            </p>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-4 border-t border-slate-800/90 pt-5 sm:grid-cols-3">
            <div>
              <div class="text-xs text-slate-400">Índice inicial</div>
              <div class="font-mono-code mt-1 text-lg font-semibold text-amber-300 tabular-nums">[0]</div>
              <div class="mt-0.5 text-xs text-slate-400">Sempre começa no zero</div>
            </div>
            <div>
              <div class="text-xs text-slate-400">Tamanho da lista</div>
              <div class="font-mono-code mt-1 text-lg font-semibold text-sky-300 tabular-nums">.length</div>
              <div class="mt-0.5 text-xs text-slate-400">Conta quantos itens há</div>
            </div>
            <div>
              <div class="text-xs text-slate-400">Último índice</div>
              <div class="font-mono-code mt-1 text-lg font-semibold text-emerald-300 tabular-nums">length - 1</div>
              <div class="mt-0.5 text-xs text-slate-400">Evita ler vazio</div>
            </div>
          </div>
        </div>

        <!-- Mini Isometric City Metaphor Card -->
        <div class="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#121824] p-6">
          <div class="space-y-1">
            <div class="text-xs text-amber-300/90">Construtor Isométrico da Memória</div>
            <h3 class="text-base font-semibold text-slate-100">
              Cada item do array ocupa um lote numerado
            </h3>
          </div>

          <div class="my-4 flex items-center justify-center">
            <svg viewBox="0 0 360 190" class="w-full max-w-[360px]" role="img" aria-label="Diagrama isométrico mostrando quatro lotes de memória numerados de 0 a 3">
              <!-- Isometric base grid -->
              <polygon points="180,22 332,96 180,170 28,96" fill="#0D131E" stroke="#1E293B" stroke-width="1.5" />
              <!-- 4 isometric array pedestals -->
              @for (item of arrayItems; track item.index) {
                <g
                  role="button"
                  tabindex="0"
                  [attr.aria-label]="'Selecionar índice ' + item.index + ': ' + item.value"
                  class="cursor-pointer transition-opacity duration-200 focus-visible:outline-amber-400"
                  (click)="selectArrayIndex(item.index)"
                  (keydown.enter)="selectArrayIndex(item.index)"
                  (keydown.space)="$event.preventDefault(); selectArrayIndex(item.index)"
                  [attr.transform]="'translate(' + (item.index * 56 - 84) + ', ' + (item.index * 26 - 38) + ')'"
                >
                  <!-- Top diamond -->
                  <polygon
                    points="180,68 214,85 180,102 146,85"
                    [attr.fill]="selectedArrayIndex() === item.index ? '#F59E0B' : '#1E293B'"
                    [attr.stroke]="selectedArrayIndex() === item.index ? '#FDE68A' : '#475569'"
                    stroke-width="1.5"
                  />
                  <!-- Left face -->
                  <polygon
                    points="146,85 180,102 180,126 146,109"
                    [attr.fill]="selectedArrayIndex() === item.index ? '#B45309' : '#0F172A'"
                    [attr.stroke]="selectedArrayIndex() === item.index ? '#FDE68A' : '#334155'"
                    stroke-width="1.2"
                  />
                  <!-- Right face -->
                  <polygon
                    points="214,85 180,102 180,126 214,109"
                    [attr.fill]="selectedArrayIndex() === item.index ? '#D97706' : '#162032'"
                    [attr.stroke]="selectedArrayIndex() === item.index ? '#FDE68A' : '#334155'"
                    stroke-width="1.2"
                  />
                  <!-- Index label on top -->
                  <text
                    x="180"
                    y="89"
                    text-anchor="middle"
                    class="font-mono-code text-[11px] font-bold"
                    [attr.fill]="selectedArrayIndex() === item.index ? '#0B0F17' : '#94A3B8'"
                  >
                    [{{ item.index }}]
                  </text>
                </g>
              }
            </svg>
          </div>

          <p class="text-xs leading-relaxed text-slate-400">
            Clique nos blocos isométricos acima ou nos cartões abaixo para inspecionar cada posição na memória.
          </p>
        </div>
      </section>

      <!-- Part A: Interactive Array Explorer -->
      <section class="rounded-2xl border border-slate-800 bg-[#121824] p-6 sm:p-8 space-y-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div class="space-y-1">
            <div class="text-xs text-slate-400">01. Anatomia de um Array</div>
            <h3 class="text-xl font-semibold text-slate-100">
              Explorador de Índices na Memória
            </h3>
          </div>
          <div class="font-mono-code rounded-lg border border-slate-800 bg-[#0B0F17] px-3.5 py-2 text-xs text-slate-200 sm:text-sm">
            const comitiva = [<span class="text-amber-300">"Frodo"</span>, <span class="text-amber-300">"Sam"</span>, <span class="text-amber-300">"Gandalf"</span>, <span class="text-amber-300">"Aragorn"</span>];
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          @for (item of arrayItems; track item.index) {
            <button
              type="button"
              (click)="selectArrayIndex(item.index)"
              class="group flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-amber-400"
              [class]="
                selectedArrayIndex() === item.index
                  ? 'border-amber-400/70 bg-amber-500/10'
                  : 'border-slate-800 bg-[#0D131E] hover:border-slate-700'
              "
            >
              <div class="flex w-full items-center justify-between">
                <span
                  class="font-mono-code text-xs font-semibold tabular-nums"
                  [class]="selectedArrayIndex() === item.index ? 'text-amber-300' : 'text-slate-400'"
                >
                  índice {{ item.index }}
                </span>
                <mat-icon
                  class="!text-[18px] !h-[18px] !w-[18px]"
                  [class]="selectedArrayIndex() === item.index ? 'text-amber-300' : 'text-slate-600'"
                >
                  {{ selectedArrayIndex() === item.index ? 'my_location' : 'crop_square' }}
                </mat-icon>
              </div>
              <div class="font-mono-code mt-3 text-base font-semibold text-slate-100">
                {{ item.value }}
              </div>
              <div class="mt-1 text-xs text-slate-400">{{ item.landmark }}</div>
            </button>
          }
        </div>

        <div class="grid grid-cols-1 gap-4 rounded-xl border border-slate-800 bg-[#0B0F17] p-4 sm:grid-cols-3 sm:items-center">
          <div>
            <div class="text-xs text-slate-400">Como acessar no console</div>
            <div class="font-mono-code mt-1 text-sm font-semibold text-sky-300">
              console.log(comitiva[{{ selectedArrayItem().index }}]);
            </div>
          </div>
          <div>
            <div class="text-xs text-slate-400">Valor retornado</div>
            <div class="font-mono-code mt-1 text-sm font-semibold text-emerald-300">
              {{ selectedArrayItem().value }}
            </div>
          </div>
          <div class="text-xs leading-relaxed text-slate-300">
            {{ selectedArrayItem().role }}
          </div>
        </div>
      </section>

      <!-- Part B: Interactive SVG Flowchart for for & while -->
      <section class="rounded-2xl border border-slate-800 bg-[#121824] p-6 sm:p-8 space-y-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="text-xs text-slate-400">02. Fluxo Lógico de Repetição</div>
            <h3 class="text-xl font-semibold text-slate-100">
              Como o JavaScript lê um Loop passo a passo
            </h3>
          </div>

          <div class="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0B0F17] p-1 self-start">
            <button
              type="button"
              (click)="setFlowMode('for')"
              class="whitespace-nowrap shrink-0 rounded-md px-4 py-1.5 text-xs font-semibold transition-colors"
              [class]="
                flowMode() === 'for'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              "
            >
              Estrutura for
            </button>
            <button
              type="button"
              (click)="setFlowMode('while')"
              class="whitespace-nowrap shrink-0 rounded-md px-4 py-1.5 text-xs font-semibold transition-colors"
              [class]="
                flowMode() === 'while'
                  ? 'bg-sky-400 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              "
            >
              Estrutura while
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <!-- Interactive SVG Flowchart -->
          <div class="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0B0F17] p-4 sm:p-6">
            @if (flowMode() === 'for') {
              <svg viewBox="0 0 620 260" class="w-full" role="img" aria-label="Fluxograma interativo do loop for">
                <defs>
                  <marker id="arrowSky" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#38BDF8" />
                  </marker>
                  <marker id="arrowRose" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#FB7185" />
                  </marker>
                  <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#FBBF24" />
                  </marker>
                </defs>

                <!-- Connectors -->
                <line x1="150" y1="74" x2="215" y2="74" stroke="#38BDF8" stroke-width="2" marker-end="url(#arrowSky)" />
                <line x1="375" y1="74" x2="438" y2="74" stroke="#38BDF8" stroke-width="2" marker-end="url(#arrowSky)" />
                <!-- True label -->
                <text x="405" y="64" text-anchor="middle" fill="#34D399" class="text-[11px] font-semibold">Sim</text>
                <!-- Body down to Increment -->
                <line x1="518" y1="108" x2="518" y2="164" stroke="#FBBF24" stroke-width="2" marker-end="url(#arrowAmber)" />
                <!-- Loop back from Increment to Condition -->
                <path d="M438,196 L295,196 L295,120" fill="none" stroke="#FBBF24" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arrowAmber)" />
                <!-- False exit from Condition -->
                <path d="M295,30 L295,12 L580,12" fill="none" stroke="#FB7185" stroke-width="2" marker-end="url(#arrowRose)" />
                <text x="355" y="25" fill="#FDA4AF" class="text-[11px] font-semibold">Não (sai do loop)</text>

                <!-- Node 1: Init -->
                <g
                  role="button"
                  tabindex="0"
                  aria-label="Etapa 1: Início let i = 0"
                  class="cursor-pointer"
                  (click)="selectFlowStage(0)"
                  (keydown.enter)="selectFlowStage(0)"
                  (keydown.space)="$event.preventDefault(); selectFlowStage(0)"
                >
                  <rect
                    x="18" y="42" width="132" height="64" rx="12"
                    [attr.fill]="selectedStageIndex() === 0 ? '#1E293B' : '#111827'"
                    [attr.stroke]="selectedStageIndex() === 0 ? '#FBBF24' : '#334155'"
                    stroke-width="2"
                  />
                  <text x="84" y="67" text-anchor="middle" fill="#F8FAFC" class="text-[12px] font-semibold">1. Início</text>
                  <text x="84" y="88" text-anchor="middle" fill="#FCD34D" class="font-mono-code text-[11px]">let i = 0</text>
                </g>

                <!-- Node 2: Condition -->
                <g
                  role="button"
                  tabindex="0"
                  aria-label="Etapa 2: Condição i menor que lista.length"
                  class="cursor-pointer"
                  (click)="selectFlowStage(1)"
                  (keydown.enter)="selectFlowStage(1)"
                  (keydown.space)="$event.preventDefault(); selectFlowStage(1)"
                >
                  <rect
                    x="220" y="34" width="150" height="80" rx="14"
                    [attr.fill]="selectedStageIndex() === 1 ? '#1E293B' : '#111827'"
                    [attr.stroke]="selectedStageIndex() === 1 ? '#38BDF8' : '#334155'"
                    stroke-width="2"
                  />
                  <text x="295" y="64" text-anchor="middle" fill="#F8FAFC" class="text-[12px] font-semibold">2. Condição?</text>
                  <text x="295" y="86" text-anchor="middle" fill="#7DD3FC" class="font-mono-code text-[11px]">i &lt; lista.length</text>
                </g>

                <!-- Node 3: Body -->
                <g
                  role="button"
                  tabindex="0"
                  aria-label="Etapa 3: Bloco de código"
                  class="cursor-pointer"
                  (click)="selectFlowStage(2)"
                  (keydown.enter)="selectFlowStage(2)"
                  (keydown.space)="$event.preventDefault(); selectFlowStage(2)"
                >
                  <rect
                    x="442" y="42" width="152" height="64" rx="12"
                    [attr.fill]="selectedStageIndex() === 2 ? '#1E293B' : '#111827'"
                    [attr.stroke]="selectedStageIndex() === 2 ? '#34D399' : '#334155'"
                    stroke-width="2"
                  />
                  <text x="518" y="67" text-anchor="middle" fill="#F8FAFC" class="text-[12px] font-semibold">3. Bloco &#123; ... &#125;</text>
                  <text x="518" y="88" text-anchor="middle" fill="#6EE7B7" class="font-mono-code text-[11px]">lê lista[i]</text>
                </g>

                <!-- Node 4: Increment -->
                <g
                  role="button"
                  tabindex="0"
                  aria-label="Etapa 4: Incremento i++"
                  class="cursor-pointer"
                  (click)="selectFlowStage(3)"
                  (keydown.enter)="selectFlowStage(3)"
                  (keydown.space)="$event.preventDefault(); selectFlowStage(3)"
                >
                  <rect
                    x="442" y="168" width="152" height="58" rx="12"
                    [attr.fill]="selectedStageIndex() === 3 ? '#1E293B' : '#111827'"
                    [attr.stroke]="selectedStageIndex() === 3 ? '#FBBF24' : '#334155'"
                    stroke-width="2"
                  />
                  <text x="518" y="192" text-anchor="middle" fill="#F8FAFC" class="text-[12px] font-semibold">4. Incremento</text>
                  <text x="518" y="211" text-anchor="middle" fill="#FCD34D" class="font-mono-code text-[11px]">i++ (soma 1)</text>
                </g>
              </svg>
            } @else {
              <svg viewBox="0 0 620 260" class="w-full" role="img" aria-label="Fluxograma interativo do loop while">
                <defs>
                  <marker id="wArrowSky" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#38BDF8" />
                  </marker>
                  <marker id="wArrowRose" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#FB7185" />
                  </marker>
                </defs>

                <line x1="168" y1="84" x2="226" y2="84" stroke="#38BDF8" stroke-width="2" marker-end="url(#wArrowSky)" />
                <line x1="386" y1="84" x2="444" y2="84" stroke="#38BDF8" stroke-width="2" marker-end="url(#wArrowSky)" />
                <text x="414" y="72" text-anchor="middle" fill="#34D399" class="text-[11px] font-semibold">Sim</text>
                <path d="M524,132 L524,205 L306,205 L306,136" fill="none" stroke="#38BDF8" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#wArrowSky)" />
                <path d="M306,36 L306,16 L580,16" fill="none" stroke="#FB7185" stroke-width="2" marker-end="url(#wArrowRose)" />
                <text x="370" y="28" fill="#FDA4AF" class="text-[11px] font-semibold">Não (fim do while)</text>

                <!-- Node 1 -->
                <g
                  role="button"
                  tabindex="0"
                  aria-label="Etapa 1: Antes do while"
                  class="cursor-pointer"
                  (click)="selectFlowStage(0)"
                  (keydown.enter)="selectFlowStage(0)"
                  (keydown.space)="$event.preventDefault(); selectFlowStage(0)"
                >
                  <rect
                    x="18" y="48" width="148" height="72" rx="12"
                    [attr.fill]="selectedStageIndex() === 0 ? '#1E293B' : '#111827'"
                    [attr.stroke]="selectedStageIndex() === 0 ? '#FBBF24' : '#334155'"
                    stroke-width="2"
                  />
                  <text x="92" y="76" text-anchor="middle" fill="#F8FAFC" class="text-[12px] font-semibold">1. Antes do while</text>
                  <text x="92" y="98" text-anchor="middle" fill="#FCD34D" class="font-mono-code text-[11px]">let i = 0;</text>
                </g>

                <!-- Node 2 -->
                <g
                  role="button"
                  tabindex="0"
                  aria-label="Etapa 2: Condição do while"
                  class="cursor-pointer"
                  (click)="selectFlowStage(1)"
                  (keydown.enter)="selectFlowStage(1)"
                  (keydown.space)="$event.preventDefault(); selectFlowStage(1)"
                >
                  <rect
                    x="230" y="40" width="154" height="88" rx="14"
                    [attr.fill]="selectedStageIndex() === 1 ? '#1E293B' : '#111827'"
                    [attr.stroke]="selectedStageIndex() === 1 ? '#38BDF8' : '#334155'"
                    stroke-width="2"
                  />
                  <text x="307" y="73" text-anchor="middle" fill="#F8FAFC" class="text-[12px] font-semibold">2. Enquanto?</text>
                  <text x="307" y="97" text-anchor="middle" fill="#7DD3FC" class="font-mono-code text-[11px]">i &lt; lista.length</text>
                </g>

                <!-- Node 3 -->
                <g
                  role="button"
                  tabindex="0"
                  aria-label="Etapa 3: Ação e atualização"
                  class="cursor-pointer"
                  (click)="selectFlowStage(2)"
                  (keydown.enter)="selectFlowStage(2)"
                  (keydown.space)="$event.preventDefault(); selectFlowStage(2)"
                >
                  <rect
                    x="448" y="40" width="154" height="88" rx="12"
                    [attr.fill]="selectedStageIndex() === 2 ? '#1E293B' : '#111827'"
                    [attr.stroke]="selectedStageIndex() === 2 ? '#34D399' : '#334155'"
                    stroke-width="2"
                  />
                  <text x="525" y="70" text-anchor="middle" fill="#F8FAFC" class="text-[12px] font-semibold">3. Ação + i++</text>
                  <text x="525" y="92" text-anchor="middle" fill="#6EE7B7" class="font-mono-code text-[11px]">usa lista[i] e</text>
                  <text x="525" y="109" text-anchor="middle" fill="#6EE7B7" class="font-mono-code text-[11px]">atualiza i++</text>
                </g>
              </svg>
            }
          </div>

          <!-- Stage Selector + Explanation -->
          <div class="lg:col-span-5 space-y-4">
            <div class="flex flex-wrap gap-2">
              @for (stage of currentStages(); track stage.id; let idx = $index) {
                <button
                  type="button"
                  (click)="selectFlowStage(idx)"
                  class="whitespace-nowrap shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                  [class]="
                    selectedStageIndex() === idx
                      ? 'border-sky-400 bg-sky-500/15 text-sky-200'
                      : 'border-slate-800 bg-[#0B0F17] text-slate-400 hover:text-slate-200'
                  "
                >
                  {{ stage.label }}
                </button>
              }
            </div>

            <div class="rounded-xl border border-slate-800 bg-[#0B0F17] p-5 space-y-3">
              <div class="font-mono-code text-sm font-semibold text-amber-300 whitespace-pre-line">
                {{ activeStage().codeFragment }}
              </div>
              <p class="text-sm leading-relaxed text-slate-200">
                {{ activeStage().explanation }}
              </p>
              <div class="flex items-center gap-2 pt-1 text-xs text-sky-300">
                <mat-icon class="!text-[16px] !h-[16px] !w-[16px]">arrow_forward</mat-icon>
                <span>{{ activeStage().nextHint }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Part C: Dicas do Mago -->
      <section class="rounded-2xl border border-amber-500/25 bg-[#121824] p-6 sm:p-8 space-y-6">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div class="space-y-1">
            <div class="text-xs text-amber-300">03. Sabedoria de Gandalf</div>
            <h3 class="font-display text-xl font-bold text-amber-100 sm:text-2xl">
              Dicas do Mago: Analogias da Terra-média
            </h3>
          </div>
          <p class="text-xs text-slate-400 sm:text-sm">
            Guarde estas imagens mentais antes de ir para o Simulador.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          @for (tip of wizardTips; track tip.id) {
            <article class="flex gap-4 rounded-xl border border-slate-800 bg-[#0B0F17] p-5">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-2xl">
                <span aria-hidden="true">{{ tip.emoji }}</span>
              </div>
              <div class="min-w-0 flex-1 space-y-2">
                <h4 class="text-base font-semibold text-slate-100">{{ tip.title }}</h4>
                <p class="text-sm leading-relaxed text-slate-300">{{ tip.analogy }}</p>
                <div class="font-mono-code rounded-lg border border-slate-800/80 bg-[#121824] px-3 py-2 text-xs text-amber-200">
                  {{ tip.codeSnippet }}
                </div>
              </div>
            </article>
          }
        </div>
      </section>
    </div>
  `,
})
export class ConceptModule {
  readonly arrayItems = CONCEPT_ARRAY_ITEMS;
  readonly selectedArrayIndex = signal<number>(0);
  readonly flowMode = signal<'for' | 'while'>('for');
  readonly selectedStageIndex = signal<number>(0);

  readonly selectedArrayItem = computed(() => {
    const idx = this.selectedArrayIndex();
    return this.arrayItems[idx] ?? this.arrayItems[0];
  });

  readonly currentStages = computed(() =>
    this.flowMode() === 'for' ? FOR_STAGES : WHILE_STAGES
  );

  readonly activeStage = computed(() => {
    const stages = this.currentStages();
    const idx = this.selectedStageIndex();
    return stages[idx] ?? stages[0];
  });

  readonly wizardTips: WizardTip[] = [
    {
      id: 'fellowship',
      emoji: '💍',
      title: 'Array é a Sociedade do Anel',
      analogy:
        'Em vez de criar 9 variáveis soltas, reunimos todos os heróis em uma única lista ordenada. Cada membro ocupa uma posição exata.',
      codeSnippet: 'const sociedade = ["Frodo", "Sam", "Gandalf", "Legolas"];',
      svgKind: 'fellowship',
    },
    {
      id: 'journey',
      emoji: '🌋',
      title: 'Loop for é a marcha até Mordor',
      analogy:
        'Frodo não se teletransporta para a Montanha da Perdição: ele avança uma etapa por vez, do passo 0 até o último destino da lista.',
      codeSnippet: 'for (let passo = 0; passo < rota.length; passo++) { ... }',
      svgKind: 'journey',
    },
    {
      id: 'moria',
      emoji: '🕯️',
      title: 'Loop while é atravessar Moria',
      analogy:
        'Você continua andando enquanto a tocha estiver acesa. Mas atenção: lembre-se de avançar o passo (i++), senão fica preso em loop infinito!',
      codeSnippet: 'while (passo < caminho.length) { passo++; }',
      svgKind: 'moria',
    },
    {
      id: 'length',
      emoji: '🗝️',
      title: 'Cuidado com o último degrau',
      analogy:
        'Se a Sociedade tem 4 membros (.length === 4), os assentos são 0, 1, 2 e 3. Por isso sempre usamos menor (<), nunca menor ou igual (<=).',
      codeSnippet: 'sociedade[sociedade.length - 1] // "Legolas"',
      svgKind: 'length',
    },
  ];

  selectArrayIndex(index: number): void {
    this.selectedArrayIndex.set(index);
  }

  setFlowMode(mode: 'for' | 'while'): void {
    this.flowMode.set(mode);
    this.selectedStageIndex.set(0);
  }

  selectFlowStage(index: number): void {
    this.selectedStageIndex.set(index);
  }
}
