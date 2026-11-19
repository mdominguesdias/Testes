import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PRACTICAL_EXAMPLES } from '../../data/lotr-curriculum.data';

@Component({
  selector: 'app-examples-module',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header & Example Selector -->
      <div class="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#121824] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-1">
          <div class="text-xs text-slate-400">Módulo 3 · Código Comentado Linha a Linha</div>
          <h2 class="font-display text-xl font-bold text-amber-100 sm:text-2xl">
            Exemplos Práticos em JavaScript Puro
          </h2>
          <p class="text-xs text-slate-300 sm:text-sm">
            Clique em qualquer linha do código para ler a explicação e teste com valores diferentes no console.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          @for (example of examples; track example.id; let idx = $index) {
            <button
              type="button"
              (click)="selectExample(idx)"
              class="whitespace-nowrap shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors"
              [class]="
                selectedExampleIndex() === idx
                  ? 'border-amber-400 bg-amber-400 text-slate-950'
                  : 'border-slate-700 bg-[#0B0F17] text-slate-300 hover:border-slate-500 hover:text-white'
              "
            >
              Exemplo {{ idx + 1 }}
            </button>
          }
        </div>
      </div>

      <!-- Main Split Layout -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <!-- Left: Commented Code Viewer -->
        <div class="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#121824] p-5 sm:p-6 space-y-5">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2 text-xs text-amber-300">
              <span>{{ activeExample().tag }}</span>
              <span aria-hidden="true">·</span>
              <span class="text-slate-400">JavaScript ES6+</span>
            </div>
            <h3 class="text-lg font-semibold text-slate-100 sm:text-xl">
              {{ activeExample().title }}
            </h3>
            <p class="text-sm leading-relaxed text-slate-300">
              {{ activeExample().goal }}
            </p>
          </div>

          <div class="space-y-1 rounded-xl border border-slate-800 bg-[#090D14] p-3">
            @for (line of activeExample().lines; track line.lineNumber) {
              <button
                type="button"
                (click)="selectLine(line.lineNumber)"
                class="flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-left transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                [class]="
                  selectedLineNumber() === line.lineNumber
                    ? 'bg-sky-500/15 text-white'
                    : 'hover:bg-slate-900/80 text-slate-300'
                "
              >
                <div class="font-mono-code flex items-center gap-3 text-xs sm:text-[13px] min-w-0">
                  <span class="w-4 shrink-0 select-none text-right text-[11px] text-slate-600 tabular-nums">
                    {{ line.lineNumber }}
                  </span>
                  <span class="whitespace-pre overflow-x-auto">{{ line.code }}</span>
                </div>
                <span
                  class="text-[11px] sm:text-xs sm:text-right shrink-0"
                  [class]="
                    selectedLineNumber() === line.lineNumber ? 'text-sky-300' : 'text-slate-500'
                  "
                >
                  {{ line.comment }}
                </span>
              </button>
            }
          </div>
        </div>

        <!-- Right: Line Explainer + Live Runner -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Line-by-Line Explanation -->
          <div class="rounded-2xl border border-slate-800 bg-[#121824] p-5 space-y-3">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>Explicação da linha selecionada</span>
              <span class="font-mono-code text-sky-300 tabular-nums">
                Linha {{ activeLine().lineNumber }}
              </span>
            </div>
            <div class="font-mono-code rounded-lg border border-slate-800 bg-[#090D14] px-3 py-2 text-xs text-amber-200">
              {{ activeLine().code.trim() }}
            </div>
            <p class="text-sm leading-relaxed text-slate-200">
              {{ activeLine().detail }}
            </p>
          </div>

          <!-- Interactive Test Runner -->
          <div class="rounded-2xl border border-slate-800 bg-[#121824] p-5 space-y-4">
            <div class="space-y-1">
              <h4 class="text-sm font-semibold text-slate-100">Testar na Prática</h4>
              <p class="text-xs text-slate-400">
                Altere os valores abaixo ou escolha um conjunto pronto e execute no console.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              @for (preset of activeExample().presets; track preset.label) {
                <button
                  type="button"
                  (click)="applyPreset(preset.value)"
                  class="whitespace-nowrap shrink-0 rounded-lg border border-slate-700 bg-[#0B0F17] px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-amber-400/60 hover:text-amber-200"
                >
                  {{ preset.label }}
                </button>
              }
            </div>

            <div class="space-y-1.5">
              <label
                for="exampleInputField"
                class="block text-xs font-medium text-slate-300"
              >
                {{ activeExample().defaultInputLabel }}
              </label>
              <div class="flex gap-2">
                <input
                  id="exampleInputField"
                  type="text"
                  [formControl]="testInputControl"
                  class="font-mono-code min-w-0 flex-1 rounded-lg border border-slate-700 bg-[#090D14] px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  (click)="runExample()"
                  class="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-400"
                >
                  <mat-icon class="!text-[16px] !h-[16px] !w-[16px]">play_arrow</mat-icon>
                  <span>Executar</span>
                </button>
              </div>
            </div>

            <div class="rounded-xl border border-slate-800 bg-[#090D14] p-3.5 space-y-2">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <mat-icon class="!text-[16px] !h-[16px] !w-[16px] text-emerald-400">terminal</mat-icon>
                <span>Saída do Console</span>
              </div>
              <div class="font-mono-code space-y-1 text-xs">
                @for (outLine of consoleOutput(); track $index) {
                  <div class="flex items-start gap-2 text-emerald-300">
                    <span class="select-none text-slate-600">&gt;</span>
                    <span>{{ outLine }}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ExamplesModule {
  readonly examples = PRACTICAL_EXAMPLES;
  readonly selectedExampleIndex = signal<number>(0);
  readonly selectedLineNumber = signal<number>(1);
  readonly consoleOutput = signal<string[]>([]);
  readonly testInputControl = new FormControl(PRACTICAL_EXAMPLES[0].defaultInputValue, {
    nonNullable: true,
  });

  readonly activeExample = computed(
    () => this.examples[this.selectedExampleIndex()] ?? this.examples[0]
  );

  readonly activeLine = computed(() => {
    const ex = this.activeExample();
    const num = this.selectedLineNumber();
    return ex.lines.find((l) => l.lineNumber === num) ?? ex.lines[0];
  });

  constructor() {
    this.runExample();
  }

  selectExample(index: number): void {
    this.selectedExampleIndex.set(index);
    const ex = this.examples[index] ?? this.examples[0];
    this.selectedLineNumber.set(1);
    this.testInputControl.setValue(ex.defaultInputValue);
    this.runExample();
  }

  selectLine(lineNumber: number): void {
    this.selectedLineNumber.set(lineNumber);
  }

  applyPreset(value: string): void {
    this.testInputControl.setValue(value);
    this.runExample();
  }

  runExample(): void {
    const ex = this.activeExample();
    const raw = this.testInputControl.value;
    const logs: string[] = [];

    if (ex.id === 'sum-power') {
      const nums = raw
        .split(',')
        .map((part) => Number(part.trim()))
        .filter((n) => !Number.isNaN(n));
      const forcas = nums.length > 0 ? nums : [85, 70, 95, 90];
      let soma = 0;
      for (let i = 0; i < forcas.length; i++) {
        soma = soma + forcas[i];
        logs.push(`Passo i=${i}: somou ${forcas[i]} → parcial = ${soma}`);
      }
      const media = (soma / forcas.length).toFixed(1);
      logs.push(`Soma: ${soma} | Média: ${media}`);
      this.consoleOutput.set(logs);
      return;
    }

    if (ex.id === 'filter-even') {
      const nums = raw
        .split(',')
        .map((part) => Number(part.trim()))
        .filter((n) => !Number.isNaN(n));
      const escudos = nums.length > 0 ? nums : [11, 24, 37, 42, 58, 63];
      const pares: number[] = [];
      for (let i = 0; i < escudos.length; i++) {
        if (escudos[i] % 2 === 0) {
          pares.push(escudos[i]);
          logs.push(`escudos[${i}] = ${escudos[i]} → é par! Adicionado.`);
        }
      }
      logs.push(`Escudos pares: [${pares.join(', ')}]`);
      this.consoleOutput.set(logs);
      return;
    }

    // search-item
    const mochila = ['Capa', 'Corda', 'Ferroada', 'Lembas'];
    const alvo = raw.trim() || 'Ferroada';
    let i = 0;
    let encontrado = false;
    while (i < mochila.length && !encontrado) {
      logs.push(`Verificando mochila[${i}]: "${mochila[i]}"`);
      if (mochila[i].toLowerCase() === alvo.toLowerCase()) {
        encontrado = true;
        logs.push(`Achou "${mochila[i]}" na posição: ${i}`);
      }
      i++;
    }
    if (!encontrado) {
      logs.push(`Item "${alvo}" não encontrado na mochila.`);
    }
    this.consoleOutput.set(logs);
  }
}
