import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChallengesModule } from './components/challenges-module/challenges-module';
import { ConceptModule } from './components/concept-module/concept-module';
import { ExamplesModule } from './components/examples-module/examples-module';
import { SimulatorModule } from './components/simulator-module/simulator-module';
import { ModuleTab } from './models/learning.models';

interface NavTabItem {
  id: ModuleTab;
  label: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    MatIconModule,
    ConceptModule,
    SimulatorModule,
    ExamplesModule,
    ChallengesModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly activeTab = signal<ModuleTab>('conceito');
  readonly solvedChallengeIds = signal<string[]>([]);

  readonly navTabs: NavTabItem[] = [
    { id: 'conceito', label: 'Conceito Visual' },
    { id: 'simulador', label: 'Simulador' },
    { id: 'exemplos', label: 'Exemplos' },
    { id: 'desafios', label: 'Desafios' },
  ];

  selectTab(tab: ModuleTab): void {
    this.activeTab.set(tab);
  }

  onSolvedIdsChange(ids: string[]): void {
    this.solvedChallengeIds.set(ids);
  }

  handlePrimaryAction(): void {
    if (this.activeTab() === 'desafios') {
      this.activeTab.set('simulador');
    } else {
      this.activeTab.set('desafios');
    }
  }
}
