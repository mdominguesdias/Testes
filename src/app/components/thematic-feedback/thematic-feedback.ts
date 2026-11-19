import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-thematic-feedback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (status() === 'correct') {
      <div
        role="status"
        aria-live="polite"
        class="rounded-xl border border-emerald-500/35 bg-emerald-950/35 p-4 transition-all duration-200"
      >
        <div class="flex items-start gap-4">
          <!-- Luz de Eärendil SVG -->
          <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
            <span
              aria-hidden="true"
              class="animate-earendil absolute inset-0 rounded-full bg-radial from-emerald-300/35 via-sky-300/15 to-transparent blur-[2px]"
            ></span>
            <svg
              viewBox="0 0 64 64"
              class="relative h-11 w-11"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="earendilCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ECFDF5" />
                  <stop offset="45%" stop-color="#6EE7B7" />
                  <stop offset="100%" stop-color="#0EA5E9" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="26" fill="url(#earendilCore)" opacity="0.55" />
              <!-- Crystal Phial Outline -->
              <path
                d="M27 10 H37 L35 16 L43 26 C45 30 45 41 40 48 C37 52 27 52 24 48 C19 41 19 30 21 26 L29 16 Z"
                fill="#064E3B"
                fill-opacity="0.55"
                stroke="#A7F3D0"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
              <!-- Star of Eärendil -->
              <path
                d="M32 21 L34.6 30.4 L44 33 L34.6 35.6 L32 45 L29.4 35.6 L20 33 L29.4 30.4 Z"
                fill="#ECFDF5"
              />
              <circle cx="32" cy="33" r="2.4" fill="#34D399" />
            </svg>
          </div>

          <div class="min-w-0 flex-1 space-y-1">
            <div class="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <mat-icon class="!text-[18px] !h-[18px] !w-[18px]">check_circle</mat-icon>
              <span>Luz de Eärendil · Acertou!</span>
            </div>
            <p class="text-sm leading-relaxed text-emerald-100/90">
              {{ message() }}
            </p>
          </div>
        </div>
      </div>
    } @else if (status() === 'incorrect') {
      <div
        role="status"
        aria-live="polite"
        class="rounded-xl border border-rose-500/35 bg-rose-950/30 p-4 transition-all duration-200"
      >
        <div class="flex items-start gap-4">
          <!-- Olho de Sauron SVG (discreto e estilizado, não assustador) -->
          <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
            <span
              aria-hidden="true"
              class="animate-sauron absolute inset-0 rounded-full bg-radial from-amber-500/25 via-rose-500/15 to-transparent blur-[2px]"
            ></span>
            <svg
              viewBox="0 0 64 64"
              class="relative h-11 w-11"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="sauronEmber" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#FDE047" />
                  <stop offset="55%" stop-color="#F97316" />
                  <stop offset="100%" stop-color="#BE123C" stop-opacity="0.2" />
                </radialGradient>
              </defs>
              <!-- Subtle Tower Spire Brackets -->
              <path
                d="M17 48 L22 24 L26 28 M47 48 L42 24 L38 28"
                fill="none"
                stroke="#FDA4AF"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.7"
              />
              <!-- Gentle Almond Eye -->
              <path
                d="M12 30 C19 20 45 20 52 30 C45 40 19 40 12 30 Z"
                fill="#1F1215"
                stroke="#FB7185"
                stroke-width="1.8"
              />
              <circle cx="32" cy="30" r="8" fill="url(#sauronEmber)" />
              <!-- Stylized Vertical Pupil -->
              <ellipse cx="32" cy="30" rx="2.1" ry="6.2" fill="#18181B" />
            </svg>
          </div>

          <div class="min-w-0 flex-1 space-y-1">
            <div class="flex items-center gap-2 text-sm font-semibold text-rose-300">
              <mat-icon class="!text-[18px] !h-[18px] !w-[18px]">error_outline</mat-icon>
              <span>Olho de Sauron · Quase lá!</span>
            </div>
            <p class="text-sm leading-relaxed text-rose-100/90">
              {{ message() }}
            </p>
            @if (constructiveTip()) {
              <p class="pt-1 text-xs leading-relaxed text-amber-200/90">
                Dica do Mestre: {{ constructiveTip() }}
              </p>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class ThematicFeedback {
  readonly status = input.required<'idle' | 'correct' | 'incorrect'>();
  readonly message = input<string>('');
  readonly constructiveTip = input<string>('');
}
