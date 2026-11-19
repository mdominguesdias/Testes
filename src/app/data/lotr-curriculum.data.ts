import {
  ArrayConceptItem,
  ChallengeQuestion,
  LoopStage,
  PracticalExample,
  SimulationStep,
  SimulatorScenarioId,
  SimulatorScenarioMeta,
} from '../models/learning.models';

export const CONCEPT_ARRAY_ITEMS: ArrayConceptItem[] = [
  {
    index: 0,
    value: '"Frodo"',
    landmark: 'Bolsa do Condado',
    role: 'Primeiro elemento sempre mora no índice 0.',
  },
  {
    index: 1,
    value: '"Sam"',
    landmark: 'Jardim do Condado',
    role: 'Segundo elemento está na posição 1.',
  },
  {
    index: 2,
    value: '"Gandalf"',
    landmark: 'Torre de Valfenda',
    role: 'Terceiro elemento ocupa o índice 2.',
  },
  {
    index: 3,
    value: '"Aragorn"',
    landmark: 'Portões de Gondor',
    role: 'Último elemento aqui está no índice 3 (length - 1).',
  },
];

export const FOR_STAGES: LoopStage[] = [
  {
    id: 'init',
    label: '1. Início (let i = 0)',
    codeFragment: 'let i = 0',
    explanation:
      'Acontece uma única vez antes da primeira volta. Cria a variável contadora "i" começando em 0, que é o primeiro índice do array.',
    nextHint: 'Depois de criar i = 0, o JavaScript vai verificar a condição.',
  },
  {
    id: 'condition',
    label: '2. Condição (i < lista.length)',
    codeFragment: 'i < lista.length',
    explanation:
      'Antes de cada volta, o programa pergunta: "i ainda é menor que o tamanho da lista?". Se for verdadeiro, entra no bloco; se for falso, o loop termina.',
    nextHint: 'Quando verdadeira, executa o código dentro das chaves { ... }.',
  },
  {
    id: 'body',
    label: '3. Bloco de Código',
    codeFragment: 'console.log(lista[i]);',
    explanation:
      'Executa a ação usando a posição atual "i". Na primeira volta lê lista[0], na segunda lê lista[1], e assim por diante.',
    nextHint: 'Ao terminar as instruções do bloco, o loop vai para o incremento.',
  },
  {
    id: 'increment',
    label: '4. Incremento (i++)',
    codeFragment: 'i++',
    explanation:
      'Soma 1 ao valor de "i" (é o mesmo que i = i + 1). Em seguida, volta imediatamente para testar a condição de novo!',
    nextHint: 'Retorna ao passo 2 (Condição) com o novo valor de i.',
  },
];

export const WHILE_STAGES: LoopStage[] = [
  {
    id: 'init',
    label: '1. Preparar Contador Antes',
    codeFragment: 'let i = 0;',
    explanation:
      'No "while", você declara a variável de controle fora e antes da estrutura de repetição.',
    nextHint: 'Com o contador criado, chegamos à verificação do while.',
  },
  {
    id: 'condition',
    label: '2. Condição (while)',
    codeFragment: 'while (i < lista.length)',
    explanation:
      'Enquanto a condição dentro dos parênteses for verdadeira, o bloco continuará repetindo. Se já começar falsa, não executa nenhuma vez.',
    nextHint: 'Condição verdadeira: entra no bloco de instruções.',
  },
  {
    id: 'body',
    label: '3. Ação + Atualização',
    codeFragment: 'console.log(lista[i]);\ni++;',
    explanation:
      'Faz o trabalho com lista[i] e, muito importante: atualiza o "i" dentro do bloco! Sem o i++, o loop fica preso para sempre (loop infinito).',
    nextHint: 'Volta para o topo do while para testar a condição novamente.',
  },
];

export const SIMULATOR_SCENARIOS: SimulatorScenarioMeta[] = [
  {
    id: 'for-beacons',
    title: 'Faróis de Gondor (for)',
    loopType: 'for',
    subtitle: 'Percorre um array de textos acendendo cada torre isométrica na ordem dos índices.',
    arrayName: 'farois',
    defaultItems: ['Amon Dîn', 'Eilenach', 'Nardol', 'Calenhad'],
    itemKind: 'text',
    visualTheme: 'beacons',
  },
  {
    id: 'for-citadel',
    title: 'Construir Torres da Vila (for + soma)',
    loopType: 'for',
    subtitle: 'Lê números de um array para erguer andares isométricos e somar o total de pedras.',
    arrayName: 'andares',
    defaultItems: ['2', '4', '3', '5'],
    itemKind: 'number',
    visualTheme: 'towers',
  },
  {
    id: 'while-journey',
    title: 'Rota da Comitiva (while)',
    loopType: 'while',
    subtitle: 'Usa while com contador manual para avançar passo a passo pelos territórios.',
    arrayName: 'territorios',
    defaultItems: ['Condado', 'Valfenda', 'Moria', 'Gondor'],
    itemKind: 'text',
    visualTheme: 'journey',
  },
];

export function getScenarioCodeLines(
  scenarioId: SimulatorScenarioId,
  items: string[]
): string[] {
  if (scenarioId === 'for-beacons') {
    const formatted = items.map((item) => `"${item}"`).join(', ');
    return [
      `const farois = [${formatted}];`,
      `for (let i = 0; i < farois.length; i++) {`,
      `  const nome = farois[i];`,
      `  console.log("Farol [" + i + "]: " + nome + " aceso!");`,
      `}`,
      `console.log("Todos os " + farois.length + " faróis acesos!");`,
    ];
  }

  if (scenarioId === 'for-citadel') {
    const formatted = items.map((item) => String(Number(item) || 1)).join(', ');
    return [
      `const andares = [${formatted}];`,
      `let totalPedras = 0;`,
      `for (let i = 0; i < andares.length; i++) {`,
      `  totalPedras = totalPedras + andares[i];`,
      `  console.log("Torre " + i + ": +" + andares[i] + " andares");`,
      `}`,
      `console.log("Total construído: " + totalPedras + " andares");`,
    ];
  }

  const formatted = items.map((item) => `"${item}"`).join(', ');
  return [
    `const territorios = [${formatted}];`,
    `let passo = 0;`,
    `while (passo < territorios.length) {`,
    `  console.log("Visitando [" + passo + "]: " + territorios[passo]);`,
    `  passo = passo + 1;`,
    `}`,
    `console.log("Jornada concluída!");`,
  ];
}

export function buildSimulationSteps(
  scenarioId: SimulatorScenarioId,
  rawItems: string[]
): SimulationStep[] {
  const items = rawItems.length > 0 ? rawItems : ['Condado'];
  const steps: SimulationStep[] = [];
  const consoleLines: string[] = [];
  const visited: number[] = [];

  if (scenarioId === 'for-beacons') {
    steps.push({
      stepNumber: 0,
      activeLine: 0,
      activeIndex: null,
      visitedIndices: [],
      phaseLabel: 'Criação do Array',
      explanation: `Criamos o array "farois" com ${items.length} posições (índices de 0 até ${items.length - 1}).`,
      conditionCheck: null,
      conditionPassed: null,
      variables: [
        { name: 'farois.length', value: String(items.length) },
        { name: 'i', value: '—' },
        { name: 'nome', value: '—' },
      ],
      consoleLines: [],
      finished: false,
    });

    for (let i = 0; i < items.length; i++) {
      const condText = `${i} < ${items.length} → verdadeiro`;
      steps.push({
        stepNumber: steps.length,
        activeLine: 1,
        activeIndex: i,
        visitedIndices: [...visited],
        phaseLabel: i === 0 ? 'Início e Teste do for' : 'Incremento e Teste do for',
        explanation:
          i === 0
            ? `Inicializamos i = 0 e testamos: ${i} é menor que ${items.length}? Sim! Entramos no loop.`
            : `O i++ aumentou i para ${i}. Testamos: ${i} é menor que ${items.length}? Sim! Continuamos.`,
        conditionCheck: condText,
        conditionPassed: true,
        variables: [
          { name: 'farois.length', value: String(items.length) },
          { name: 'i', value: String(i), highlight: true },
          { name: 'nome', value: '—' },
        ],
        consoleLines: [...consoleLines],
        finished: false,
      });

      steps.push({
        stepNumber: steps.length,
        activeLine: 2,
        activeIndex: i,
        visitedIndices: [...visited],
        phaseLabel: `Lendo índice [${i}]`,
        explanation: `Lemos farois[${i}] na memória e guardamos "${items[i]}" na constante nome.`,
        conditionCheck: condText,
        conditionPassed: true,
        variables: [
          { name: 'farois.length', value: String(items.length) },
          { name: 'i', value: String(i) },
          { name: 'nome', value: `"${items[i]}"`, highlight: true },
        ],
        consoleLines: [...consoleLines],
        finished: false,
      });

      visited.push(i);
      consoleLines.push(`Farol [${i}]: ${items[i]} aceso!`);
      steps.push({
        stepNumber: steps.length,
        activeLine: 3,
        activeIndex: i,
        visitedIndices: [...visited],
        phaseLabel: 'Saída no Console e Ação',
        explanation: `O console exibe o resultado e o farol isométrico "${items[i]}" acende na colina.`,
        conditionCheck: condText,
        conditionPassed: true,
        variables: [
          { name: 'farois.length', value: String(items.length) },
          { name: 'i', value: String(i) },
          { name: 'nome', value: `"${items[i]}"` },
        ],
        consoleLines: [...consoleLines],
        finished: false,
      });
    }

    steps.push({
      stepNumber: steps.length,
      activeLine: 1,
      activeIndex: null,
      visitedIndices: [...visited],
      phaseLabel: 'Condição Falsa (Fim do Loop)',
      explanation: `Agora i vale ${items.length}. Como ${items.length} < ${items.length} é FALSO, o loop "for" encerra!`,
      conditionCheck: `${items.length} < ${items.length} → falso`,
      conditionPassed: false,
      variables: [
        { name: 'farois.length', value: String(items.length) },
        { name: 'i', value: String(items.length), highlight: true },
        { name: 'nome', value: '—' },
      ],
      consoleLines: [...consoleLines],
      finished: false,
    });

    consoleLines.push(`Todos os ${items.length} faróis acesos!`);
    steps.push({
      stepNumber: steps.length,
      activeLine: 5,
      activeIndex: null,
      visitedIndices: [...visited],
      phaseLabel: 'Execução Concluída',
      explanation: `O programa seguiu para a linha após o bloco "}" e imprimiu a mensagem final.`,
      conditionCheck: null,
      conditionPassed: null,
      variables: [
        { name: 'farois.length', value: String(items.length) },
        { name: 'i', value: '(fim do escopo)' },
        { name: 'nome', value: '—' },
      ],
      consoleLines: [...consoleLines],
      finished: true,
    });

    return steps;
  }

  if (scenarioId === 'for-citadel') {
    const nums = items.map((x) => Math.max(1, Math.min(8, Number(x) || 1)));
    let total = 0;

    steps.push({
      stepNumber: 0,
      activeLine: 0,
      activeIndex: null,
      visitedIndices: [],
      phaseLabel: 'Array de Alturas',
      explanation: `Criamos o array "andares" com as alturas de ${nums.length} torres isométricas.`,
      conditionCheck: null,
      conditionPassed: null,
      variables: [
        { name: 'andares.length', value: String(nums.length) },
        { name: 'totalPedras', value: '—' },
        { name: 'i', value: '—' },
      ],
      consoleLines: [],
      finished: false,
    });

    steps.push({
      stepNumber: 1,
      activeLine: 1,
      activeIndex: null,
      visitedIndices: [],
      phaseLabel: 'Variável Acumuladora',
      explanation: `Inicializamos totalPedras = 0 para somar os valores de cada posição do array.`,
      conditionCheck: null,
      conditionPassed: null,
      variables: [
        { name: 'andares.length', value: String(nums.length) },
        { name: 'totalPedras', value: '0', highlight: true },
        { name: 'i', value: '—' },
      ],
      consoleLines: [],
      finished: false,
    });

    for (let i = 0; i < nums.length; i++) {
      const cond = `${i} < ${nums.length} → verdadeiro`;
      steps.push({
        stepNumber: steps.length,
        activeLine: 2,
        activeIndex: i,
        visitedIndices: [...visited],
        phaseLabel: `Teste da Condição (i = ${i})`,
        explanation: `Verificamos se ${i} < ${nums.length}. Como é verdadeiro, vamos processar andares[${i}] = ${nums[i]}.`,
        conditionCheck: cond,
        conditionPassed: true,
        variables: [
          { name: 'andares.length', value: String(nums.length) },
          { name: 'totalPedras', value: String(total) },
          { name: 'i', value: String(i), highlight: true },
        ],
        consoleLines: [...consoleLines],
        finished: false,
      });

      const prevTotal = total;
      total += nums[i];
      visited.push(i);
      steps.push({
        stepNumber: steps.length,
        activeLine: 3,
        activeIndex: i,
        visitedIndices: [...visited],
        phaseLabel: `Somando andares[${i}]`,
        explanation: `Somamos ${prevTotal} + ${nums[i]} e guardamos ${total} em totalPedras. A torre ${i} sobe no mapa!`,
        conditionCheck: cond,
        conditionPassed: true,
        variables: [
          { name: 'andares.length', value: String(nums.length) },
          { name: 'totalPedras', value: String(total), highlight: true },
          { name: 'i', value: String(i) },
        ],
        consoleLines: [...consoleLines],
        finished: false,
      });

      consoleLines.push(`Torre ${i}: +${nums[i]} andares`);
      steps.push({
        stepNumber: steps.length,
        activeLine: 4,
        activeIndex: i,
        visitedIndices: [...visited],
        phaseLabel: 'Registro no Console',
        explanation: `Imprimimos no console quantos andares a torre ${i} recebeu.`,
        conditionCheck: cond,
        conditionPassed: true,
        variables: [
          { name: 'andares.length', value: String(nums.length) },
          { name: 'totalPedras', value: String(total) },
          { name: 'i', value: String(i) },
        ],
        consoleLines: [...consoleLines],
        finished: false,
      });
    }

    steps.push({
      stepNumber: steps.length,
      activeLine: 2,
      activeIndex: null,
      visitedIndices: [...visited],
      phaseLabel: 'Saída do Loop',
      explanation: `Com i = ${nums.length}, a condição ${nums.length} < ${nums.length} falha. O loop termina.`,
      conditionCheck: `${nums.length} < ${nums.length} → falso`,
      conditionPassed: false,
      variables: [
        { name: 'andares.length', value: String(nums.length) },
        { name: 'totalPedras', value: String(total) },
        { name: 'i', value: String(nums.length), highlight: true },
      ],
      consoleLines: [...consoleLines],
      finished: false,
    });

    consoleLines.push(`Total construído: ${total} andares`);
    steps.push({
      stepNumber: steps.length,
      activeLine: 6,
      activeIndex: null,
      visitedIndices: [...visited],
      phaseLabel: 'Soma Finalizada',
      explanation: `Exibimos o valor final acumulado em totalPedras (${total}).`,
      conditionCheck: null,
      conditionPassed: null,
      variables: [
        { name: 'andares.length', value: String(nums.length) },
        { name: 'totalPedras', value: String(total), highlight: true },
        { name: 'i', value: '(fim)' },
      ],
      consoleLines: [...consoleLines],
      finished: true,
    });

    return steps;
  }

  // while-journey
  steps.push({
    stepNumber: 0,
    activeLine: 0,
    activeIndex: null,
    visitedIndices: [],
    phaseLabel: 'Lista de Territórios',
    explanation: `Definimos os ${items.length} territórios que a Comitiva precisa atravessar.`,
    conditionCheck: null,
    conditionPassed: null,
    variables: [
      { name: 'territorios.length', value: String(items.length) },
      { name: 'passo', value: '—' },
    ],
    consoleLines: [],
    finished: false,
  });

  steps.push({
    stepNumber: 1,
    activeLine: 1,
    activeIndex: null,
    visitedIndices: [],
    phaseLabel: 'Inicializar Contador Manual',
    explanation: `Antes do "while", criamos a variável let passo = 0 para marcar onde estamos.`,
    conditionCheck: null,
    conditionPassed: null,
    variables: [
      { name: 'territorios.length', value: String(items.length) },
      { name: 'passo', value: '0', highlight: true },
    ],
    consoleLines: [],
    finished: false,
  });

  for (let p = 0; p < items.length; p++) {
    const cond = `${p} < ${items.length} → verdadeiro`;
    steps.push({
      stepNumber: steps.length,
      activeLine: 2,
      activeIndex: p,
      visitedIndices: [...visited],
      phaseLabel: `Condição do while (passo = ${p})`,
      explanation: `Enquanto ${p} < ${items.length} for verdadeiro, continuamos a viagem.`,
      conditionCheck: cond,
      conditionPassed: true,
      variables: [
        { name: 'territorios.length', value: String(items.length) },
        { name: 'passo', value: String(p) },
      ],
      consoleLines: [...consoleLines],
      finished: false,
    });

    visited.push(p);
    consoleLines.push(`Visitando [${p}]: ${items[p]}`);
    steps.push({
      stepNumber: steps.length,
      activeLine: 3,
      activeIndex: p,
      visitedIndices: [...visited],
      phaseLabel: `Lendo territorios[${p}]`,
      explanation: `Lemos "${items[p]}" no índice ${p} e registramos a chegada no console.`,
      conditionCheck: cond,
      conditionPassed: true,
      variables: [
        { name: 'territorios.length', value: String(items.length) },
        { name: 'passo', value: String(p) },
      ],
      consoleLines: [...consoleLines],
      finished: false,
    });

    steps.push({
      stepNumber: steps.length,
      activeLine: 4,
      activeIndex: p,
      visitedIndices: [...visited],
      phaseLabel: 'Avançando o Contador',
      explanation: `passo = passo + 1 muda passo de ${p} para ${p + 1}. Sem essa linha, o while nunca terminaria!`,
      conditionCheck: cond,
      conditionPassed: true,
      variables: [
        { name: 'territorios.length', value: String(items.length) },
        { name: 'passo', value: String(p + 1), highlight: true },
      ],
      consoleLines: [...consoleLines],
      finished: false,
    });
  }

  steps.push({
    stepNumber: steps.length,
    activeLine: 2,
    activeIndex: null,
    visitedIndices: [...visited],
    phaseLabel: 'Condição Falsa',
    explanation: `Agora passo vale ${items.length}. Como ${items.length} < ${items.length} é FALSO, saímos do while.`,
    conditionCheck: `${items.length} < ${items.length} → falso`,
    conditionPassed: false,
    variables: [
      { name: 'territorios.length', value: String(items.length) },
      { name: 'passo', value: String(items.length), highlight: true },
    ],
    consoleLines: [...consoleLines],
    finished: false,
  });

  consoleLines.push('Jornada concluída!');
  steps.push({
    stepNumber: steps.length,
    activeLine: 6,
    activeIndex: null,
    visitedIndices: [...visited],
    phaseLabel: 'Fim da Viagem',
    explanation: `O programa finaliza após o bloco do while e exibe a mensagem no console.`,
    conditionCheck: null,
    conditionPassed: null,
    variables: [
      { name: 'territorios.length', value: String(items.length) },
      { name: 'passo', value: String(items.length) },
    ],
    consoleLines: [...consoleLines],
    finished: true,
  });

  return steps;
}

export const PRACTICAL_EXAMPLES: PracticalExample[] = [
  {
    id: 'sum-power',
    title: '1. Somar Pontos de Força da Comitiva',
    tag: 'Acumulador + for',
    goal: 'Igual a somar notas de provas em um boletim: percorremos o array inteiro somando cada número em uma variável total.',
    arrayPreview: '[85, 70, 95, 90]',
    defaultInputLabel: 'Lista de pontuações (separadas por vírgula)',
    defaultInputValue: '85, 70, 95, 90',
    presets: [
      { label: 'Comitiva Padrão', value: '85, 70, 95, 90' },
      { label: 'Guardas de Gondor', value: '60, 80, 100, 75' },
      { label: 'Hobbits', value: '40, 55, 45, 50' },
    ],
    lines: [
      {
        lineNumber: 1,
        code: 'const forcas = [85, 70, 95, 90];',
        comment: 'Array com as forças de cada herói',
        detail: 'Guardamos 4 números em sequência. Os índices vão de 0 até 3.',
      },
      {
        lineNumber: 2,
        code: 'let soma = 0;',
        comment: 'Começa o acumulador zerado',
        detail: 'Precisamos criar "soma" ANTES do loop para não zerá-la a cada repetição.',
      },
      {
        lineNumber: 3,
        code: 'for (let i = 0; i < forcas.length; i++) {',
        comment: 'Repete do índice 0 até o último',
        detail: 'forcas.length vale 4. Assim "i" assumirá os valores 0, 1, 2 e 3.',
      },
      {
        lineNumber: 4,
        code: '  soma = soma + forcas[i];',
        comment: 'Adiciona o valor atual ao total',
        detail: 'A cada volta, pegamos forcas[i] e somamos ao que já estava guardado em soma.',
      },
      {
        lineNumber: 5,
        code: '}',
        comment: 'Fim do bloco de repetição',
        detail: 'Volta para o "i++" e testa a condição de novo até percorrer tudo.',
      },
      {
        lineNumber: 6,
        code: 'const media = soma / forcas.length;',
        comment: 'Calcula a média após o loop',
        detail: 'Depois que todos foram somados, dividimos pela quantidade de itens (.length).',
      },
      {
        lineNumber: 7,
        code: 'console.log("Soma:", soma, "| Média:", media);',
        comment: 'Mostra o resultado no console',
        detail: 'Imprime os valores finais no modo console.',
      },
    ],
  },
  {
    id: 'filter-even',
    title: '2. Filtrar Escudos com Números Pares',
    tag: 'Condicional if + .push()',
    goal: 'Combina o "if" que você já conhece com "for" para separar apenas os números pares em um novo array.',
    arrayPreview: '[11, 24, 37, 42, 58, 63]',
    defaultInputLabel: 'Números dos escudos (separados por vírgula)',
    defaultInputValue: '11, 24, 37, 42, 58, 63',
    presets: [
      { label: 'Lote da Batalha', value: '11, 24, 37, 42, 58, 63' },
      { label: 'Todos Pares', value: '10, 20, 30, 40' },
      { label: 'Sem Pares', value: '3, 7, 15, 21' },
    ],
    lines: [
      {
        lineNumber: 1,
        code: 'const escudos = [11, 24, 37, 42, 58, 63];',
        comment: 'Lista original de números',
        detail: 'Temos números ímpares e pares misturados no mesmo array.',
      },
      {
        lineNumber: 2,
        code: 'const pares = [];',
        comment: 'Novo array começa vazio',
        detail: 'Usaremos colchetes vazios [] para guardar apenas os números aprovados no filtro.',
      },
      {
        lineNumber: 3,
        code: 'for (let i = 0; i < escudos.length; i++) {',
        comment: 'Percorre todos os escudos',
        detail: 'O índice "i" vai passar por cada número da lista original.',
      },
      {
        lineNumber: 4,
        code: '  if (escudos[i] % 2 === 0) {',
        comment: 'Testa se o resto da divisão por 2 é 0',
        detail: 'O operador % calcula o resto. Todo número par dividido por 2 deixa resto 0.',
      },
      {
        lineNumber: 5,
        code: '    pares.push(escudos[i]);',
        comment: 'Adiciona no final do array "pares"',
        detail: 'O método .push() coloca um novo item no fim do array.',
      },
      {
        lineNumber: 6,
        code: '  }',
        comment: 'Fecha o if',
        detail: 'Se for ímpar, o if é falso e nada é adicionado.',
      },
      {
        lineNumber: 7,
        code: '}',
        comment: 'Fecha o loop for',
        detail: 'Quando terminar todos os índices, segue para a próxima linha.',
      },
      {
        lineNumber: 8,
        code: 'console.log("Escudos pares:", pares);',
        comment: 'Exibe a nova lista filtrada',
        detail: 'Mostra apenas [24, 42, 58] no console.',
      },
    ],
  },
  {
    id: 'search-item',
    title: '3. Buscar Item na Mochila do Condado',
    tag: 'while + break',
    goal: 'Procura um item específico na lista usando "while" e para assim que encontrar, evitando voltas desnecessárias.',
    arrayPreview: '["Capa", "Corda", "Ferroada", "Lembas"]',
    defaultInputLabel: 'Item procurado na mochila',
    defaultInputValue: 'Ferroada',
    presets: [
      { label: 'Buscar "Ferroada"', value: 'Ferroada' },
      { label: 'Buscar "Lembas"', value: 'Lembas' },
      { label: 'Buscar "Anel" (não tem)', value: 'Anel' },
    ],
    lines: [
      {
        lineNumber: 1,
        code: 'const mochila = ["Capa", "Corda", "Ferroada", "Lembas"];',
        comment: 'Itens dentro da mochila',
        detail: 'Cada texto ocupa uma posição de 0 a 3.',
      },
      {
        lineNumber: 2,
        code: 'const alvo = "Ferroada";',
        comment: 'O que estamos procurando',
        detail: 'Guardamos o nome buscado em uma variável para comparar depois.',
      },
      {
        lineNumber: 3,
        code: 'let i = 0;',
        comment: 'Contador inicial do while',
        detail: 'Começamos a busca pelo primeiro espaço da mochila (índice 0).',
      },
      {
        lineNumber: 4,
        code: 'let encontrado = false;',
        comment: 'Variável sinalizadora (bandeira)',
        detail: 'Começa falsa porque ainda não achamos o item.',
      },
      {
        lineNumber: 5,
        code: 'while (i < mochila.length && !encontrado) {',
        comment: 'Continua enquanto houver itens e não achar',
        detail: 'Para automaticamente se chegar ao fim da lista OU se encontrado virar true.',
      },
      {
        lineNumber: 6,
        code: '  if (mochila[i] === alvo) {',
        comment: 'Compara o item atual com o alvo',
        detail: 'Usa === para conferir se o texto é exatamente igual.',
      },
      {
        lineNumber: 7,
        code: '    encontrado = true;',
        comment: 'Marca que achou!',
        detail: 'Na próxima checagem do while, !encontrado será falso e o loop para.',
      },
      {
        lineNumber: 8,
        code: '    console.log("Achou na posição:", i);',
        comment: 'Informa o índice exato',
        detail: 'Mostra em qual posição o item estava guardado.',
      },
      {
        lineNumber: 9,
        code: '  }',
        comment: 'Fecha o if',
        detail: 'Se não for o alvo, apenas segue para incrementar o i.',
      },
      {
        lineNumber: 10,
        code: '  i++;',
        comment: 'Vai para o próximo índice',
        detail: 'Essencial no while para avançar na lista e evitar loop infinito.',
      },
      {
        lineNumber: 11,
        code: '}',
        comment: 'Fecha o while',
        detail: 'Sai do loop quando terminar a busca.',
      },
      {
        lineNumber: 12,
        code: 'if (!encontrado) { console.log("Item não encontrado."); }',
        comment: 'Aviso caso não exista na mochila',
        detail: 'Se percorreu tudo e encontrado continuou false, avisa o usuário.',
      },
    ],
  },
];

export const CHALLENGES: ChallengeQuestion[] = [
  {
    id: 'challenge-1',
    number: 1,
    title: 'Os Portões do Condado: Índices do Array',
    landmarkName: 'Condado',
    type: 'multiple-choice',
    contextText:
      'Frodo guardou os nomes de seus amigos no array abaixo. Qual será a saída exata exibida no console?',
    codeLines: [
      'const hobbits = ["Frodo", "Sam", "Merry", "Pippin"];',
      'console.log(hobbits[2] + " | Total: " + hobbits.length);',
    ],
    options: [
      { id: 'a', label: '"Sam | Total: 3"' },
      { id: 'b', label: '"Merry | Total: 4"' },
      { id: 'c', label: '"Pippin | Total: 4"' },
      { id: 'd', label: '"Merry | Total: 3"' },
    ],
    correctOptionId: 'b',
    hint: 'Lembre-se: a contagem dos índices começa no 0 ("Frodo" é 0, "Sam" é 1...), mas .length conta a quantidade total de elementos!',
    commentedAnswerKey:
      'Gabarito: B ("Merry | Total: 4"). Em JavaScript, o primeiro índice é sempre 0: hobbits[0] é "Frodo", hobbits[1] é "Sam" e hobbits[2] é "Merry". Já a propriedade hobbits.length conta quantos itens existem no array ao todo, ou seja, 4.',
  },
  {
    id: 'challenge-2',
    number: 2,
    title: 'A Ponte de Valfenda: Complete o Loop for',
    landmarkName: 'Valfenda',
    type: 'gap-fill',
    contextText:
      'Complete as duas lacunas do loop "for" para que ele mostre todos os 3 reinos élficos sem passar do limite do array.',
    codeLines: [
      'const reinos = ["Valfenda", "Lothlórien", "Floresta das Trevas"];',
      'for (let i = 0; ___1___; ___2___) {',
      '  console.log(reinos[i]);',
      '}',
    ],
    gaps: [
      {
        placeholder: '___1___',
        label: 'Lacuna 1 (Condição de parada)',
        choices: ['i <= reinos.length', 'i < reinos.length', 'i > 0'],
        correctChoice: 'i < reinos.length',
      },
      {
        placeholder: '___2___',
        label: 'Lacuna 2 (Avanço do contador)',
        choices: ['i--', 'i = 0', 'i++'],
        correctChoice: 'i++',
      },
    ],
    hint: 'Se reinos.length é 3, os índices válidos são 0, 1 e 2. Se usarmos <=, o loop tentaria ler reinos[3], que não existe (undefined)!',
    commentedAnswerKey:
      'Gabarito: "i < reinos.length" e "i++". Como os índices vão de 0 até (length - 1), usamos estritamente menor (<) para parar antes do índice 3. O i++ soma 1 a cada volta para avançar 0 → 1 → 2.',
  },
  {
    id: 'challenge-3',
    number: 3,
    title: 'A Cidadela de Minas Tirith: Lógica do while',
    landmarkName: 'Minas Tirith',
    type: 'gap-fill',
    contextText:
      'Queremos construir um muro somando blocos até atingir a meta usando "while". Preencha as lacunas para evitar loop infinito e somar o valor certo.',
    codeLines: [
      'const blocos = [3, 5, 4];',
      'let total = 0;',
      'let i = 0;',
      'while (i < blocos.length) {',
      '  total = total + ___1___;',
      '  ___2___;',
      '}',
      'console.log("Muro:", total);',
    ],
    gaps: [
      {
        placeholder: '___1___',
        label: 'Lacuna 1 (Valor do bloco atual)',
        choices: ['blocos[i]', 'i', 'blocos.length'],
        correctChoice: 'blocos[i]',
      },
      {
        placeholder: '___2___',
        label: 'Lacuna 2 (Evita loop infinito)',
        choices: ['total = 0', 'i++', 'blocos.push(1)'],
        correctChoice: 'i++',
      },
    ],
    hint: 'Para acessar o número guardado dentro do array na posição i, usamos colchetes. E todo while precisa atualizar seu contador!',
    commentedAnswerKey:
      'Gabarito: "blocos[i]" e "i++". Se somássemos apenas "i", somaríamos as posições (0+1+2 = 3) em vez dos blocos (3+5+4 = 12). E sem "i++", o valor de i continuaria 0 para sempre, travando o navegador em um loop infinito.',
  },
];
