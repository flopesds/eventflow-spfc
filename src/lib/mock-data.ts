export interface MockSponsor {
  id: string;
  name: string;
}

export interface MockVendor {
  id: string;
  name: string;
  category: string;
  contact: string | null;
}

export interface MockEventVendor {
  id: string;
  eventId: string;
  vendorId: string;
  vendor: MockVendor;
  costEstimated: number | null;
  costReal: number | null;
}

export interface MockChecklistItem {
  id: string;
  eventId: string;
  description: string;
  responsible: string;
  dueDate: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" | "ATRASADO";
  completedAt?: string | null;
}

export interface MockProof {
  id: string;
  eventId: string;
  fileUrl: string;
  status: "PENDENTE" | "ENVIADO" | "VALIDADO";
  submittedAt?: string | null;
  validatedAt?: string | null;
}

export interface MockEvent {
  id: string;
  name: string;
  type: "JOGO" | "ATIVACAO_PATROCINADOR" | "EVENTO_TORCEDOR" | "OUTRO";
  date: string;
  venue: string;
  sponsorId: string | null;
  sponsor?: MockSponsor | null;
  status: "PLANEJADO" | "EM_EXECUCAO" | "CONCLUIDO" | "CANCELADO";
  budgetEstimated: number | null;
  budgetReal: number | null;
  checklistItems: MockChecklistItem[];
  vendors: MockEventVendor[];
  proofs: MockProof[];
}

export const MOCK_SPONSORS: MockSponsor[] = [
  { id: "sp-1", name: "Acme Corporation" },
  { id: "sp-2", name: "Wonka Industries" },
  { id: "sp-3", name: "Wayne Enterprises" },
  { id: "sp-4", name: "Stark Industries" },
  { id: "sp-5", name: "Dunder Mifflin Paper Co." },
  { id: "sp-6", name: "Los Pollos Hermanos" },
  { id: "sp-7", name: "Cyberdyne Systems" },
  { id: "sp-8", name: "Monsters Inc. Entertainment" },
];

export const MOCK_VENDORS: MockVendor[] = [
  {
    id: "ven-1",
    name: "Morumbi Cenografia & Estruturas",
    category: "Cenografia e Montagem",
    contact: "operacoes@morumbicenografia.com.br | (11) 98765-1001",
  },
  {
    id: "ven-2",
    name: "Tricolor Guard Vigilância & Apoio",
    category: "Segurança Privada",
    contact: "escala@tricolorguard.com.br | (11) 98765-1002",
  },
  {
    id: "ven-3",
    name: "Pulse Sound & Light Experience",
    category: "Sonorização e Iluminação",
    contact: "tecnica@pulsesound.com.br | (11) 98765-1003",
  },
  {
    id: "ven-4",
    name: "FastLine Logística & Fretes",
    category: "Transporte e Logística",
    contact: "contato@fastlinelog.com.br | (11) 98765-1004",
  },
  {
    id: "ven-5",
    name: "Gourmet Matchday Catering",
    category: "Alimentos e Bebidas",
    contact: "chef@gourmetmatchday.com.br | (11) 98765-1005",
  },
  {
    id: "ven-6",
    name: "VisualPrint Comunicação Visual",
    category: "Impressão e Banners",
    contact: "producao@visualprint.com.br | (11) 98765-1006",
  },
];

const now = new Date();
const addDays = (d: number, h = 16, m = 0) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + d);
  dt.setHours(h, m, 0, 0);
  return dt.toISOString();
};

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: "ev-1",
    name: "SPFC x Palmeiras - Choque-Rei (Brasileirão)",
    type: "JOGO",
    date: addDays(1, 16, 0),
    venue: "Estádio do MorumBIS",
    sponsorId: "sp-1",
    sponsor: MOCK_SPONSORS[0],
    status: "EM_EXECUCAO",
    budgetEstimated: 85000,
    budgetReal: 79200,
    checklistItems: [
      {
        id: "chk-1",
        eventId: "ev-1",
        description: "Inspeção e teste geral dos painéis de LED do campo",
        responsible: "Equipe Técnica Acme / SPFC",
        dueDate: addDays(0, 10, 0),
        status: "CONCLUIDO",
        completedAt: addDays(0, 11, 30),
      },
      {
        id: "chk-2",
        eventId: "ev-1",
        description: "Montagem do backdrop de coletiva e zona mista",
        responsible: "Morumbi Cenografia",
        dueDate: addDays(0, 14, 0),
        status: "CONCLUIDO",
        completedAt: addDays(0, 15, 0),
      },
      {
        id: "chk-3",
        eventId: "ev-1",
        description: "Distribuição dos 20.000 balões e bandeirinhas no setor popular",
        responsible: "Coordenação de Ativações",
        dueDate: addDays(1, 12, 0),
        status: "EM_ANDAMENTO",
      },
      {
        id: "chk-4",
        eventId: "ev-1",
        description: "Posicionamento do inflável gigante Acme no anel intermediário",
        responsible: "FastLine Logística",
        dueDate: addDays(1, 13, 0),
        status: "EM_ANDAMENTO",
      },
      {
        id: "chk-5",
        eventId: "ev-1",
        description: "Coleta e auditoria do relatório fotográfico pós-partida",
        responsible: "Fotografia & Mídia",
        dueDate: addDays(2, 12, 0),
        status: "PENDENTE",
      },
    ],
    vendors: [
      {
        id: "ev-ven-1",
        eventId: "ev-1",
        vendorId: "ven-1",
        vendor: MOCK_VENDORS[0],
        costEstimated: 35000,
        costReal: 34500,
      },
      {
        id: "ev-ven-2",
        eventId: "ev-1",
        vendorId: "ven-2",
        vendor: MOCK_VENDORS[1],
        costEstimated: 30000,
        costReal: 29200,
      },
      {
        id: "ev-ven-3",
        eventId: "ev-1",
        vendorId: "ven-6",
        vendor: MOCK_VENDORS[5],
        costEstimated: 20000,
        costReal: 15500,
      },
    ],
    proofs: [
      {
        id: "prf-1",
        eventId: "ev-1",
        fileUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
        status: "ENVIADO",
        submittedAt: addDays(0, 18, 0),
      },
    ],
  },
  {
    id: "ev-2",
    name: "Ativação Wonka: O Bilhete Dourado no Camarote MorumBIS",
    type: "ATIVACAO_PATROCINADOR",
    date: addDays(3, 19, 0),
    venue: "MorumBIS - Camarote Stadium",
    sponsorId: "sp-2",
    sponsor: MOCK_SPONSORS[1],
    status: "PLANEJADO",
    budgetEstimated: 45000,
    budgetReal: 41000,
    checklistItems: [
      {
        id: "chk-6",
        eventId: "ev-2",
        description: "Recebimento e conferência das barras Wonka personalizadas",
        responsible: "Almoxarifado SPFC",
        dueDate: addDays(1, 10, 0),
        status: "CONCLUIDO",
        completedAt: addDays(1, 11, 0),
      },
      {
        id: "chk-7",
        eventId: "ev-2",
        description: "Distribuição dos bilhetes dourados nos assentos premium",
        responsible: "Promotores Wonka",
        dueDate: addDays(2, 15, 0),
        status: "EM_ANDAMENTO",
      },
      {
        id: "chk-8",
        eventId: "ev-2",
        description: "Acompanhamento dos 5 vencedores na visita ao gramado",
        responsible: "Marketing de Experiência",
        dueDate: addDays(3, 18, 0),
        status: "PENDENTE",
      },
    ],
    vendors: [
      {
        id: "ev-ven-4",
        eventId: "ev-2",
        vendorId: "ven-5",
        vendor: MOCK_VENDORS[4],
        costEstimated: 25000,
        costReal: 24000,
      },
      {
        id: "ev-ven-5",
        eventId: "ev-2",
        vendorId: "ven-1",
        vendor: MOCK_VENDORS[0],
        costEstimated: 20000,
        costReal: 17000,
      },
    ],
    proofs: [
      {
        id: "prf-2",
        eventId: "ev-2",
        fileUrl: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80",
        status: "PENDENTE",
        submittedAt: null,
      },
    ],
  },
  {
    id: "ev-3",
    name: "SPFC x Flamengo - Decisão Copa do Brasil",
    type: "JOGO",
    date: addDays(7, 21, 30),
    venue: "Estádio do MorumBIS",
    sponsorId: "sp-3",
    sponsor: MOCK_SPONSORS[2],
    status: "PLANEJADO",
    budgetEstimated: 120000,
    budgetReal: 118000,
    checklistItems: [
      {
        id: "chk-9",
        eventId: "ev-3",
        description: "Reunião de alinhamento com Polícia Militar, CET e CBMESP",
        responsible: "Diretoria de Operações",
        dueDate: addDays(-2, 10, 0),
        status: "CONCLUIDO",
        completedAt: addDays(-2, 12, 0),
      },
      {
        id: "chk-10",
        eventId: "ev-3",
        description: "Programação das vinhetas especiais Wayne no anel do estádio",
        responsible: "Pulse Sound & Light",
        dueDate: addDays(4, 14, 0),
        status: "EM_ANDAMENTO",
      },
      {
        id: "chk-11",
        eventId: "ev-3",
        description: "Briefing operacional com os 150 seguranças privados",
        responsible: "Tricolor Guard",
        dueDate: addDays(6, 17, 0),
        status: "PENDENTE",
      },
    ],
    vendors: [
      {
        id: "ev-ven-6",
        eventId: "ev-3",
        vendorId: "ven-2",
        vendor: MOCK_VENDORS[1],
        costEstimated: 60000,
        costReal: 58000,
      },
      {
        id: "ev-ven-7",
        eventId: "ev-3",
        vendorId: "ven-3",
        vendor: MOCK_VENDORS[2],
        costEstimated: 35000,
        costReal: 36000,
      },
      {
        id: "ev-ven-8",
        eventId: "ev-3",
        vendorId: "ven-5",
        vendor: MOCK_VENDORS[4],
        costEstimated: 25000,
        costReal: 24000,
      },
    ],
    proofs: [],
  },
  {
    id: "ev-4",
    name: "Show Tecnológico Stark: Drones & Luzes no Gramado",
    type: "ATIVACAO_PATROCINADOR",
    date: addDays(-3, 20, 0),
    venue: "Gramado do MorumBIS",
    sponsorId: "sp-4",
    sponsor: MOCK_SPONSORS[3],
    status: "CONCLUIDO",
    budgetEstimated: 160000,
    budgetReal: 154200,
    checklistItems: [
      {
        id: "chk-12",
        eventId: "ev-4",
        description: "Autorização de voo junto ao DECEA e Anac",
        responsible: "Engenharia Stark",
        dueDate: addDays(-10, 10, 0),
        status: "CONCLUIDO",
        completedAt: addDays(-9, 14, 0),
      },
      {
        id: "chk-13",
        eventId: "ev-4",
        description: "Calibração dos 200 drones de show sincronizado",
        responsible: "Equipe Stark Tech",
        dueDate: addDays(-4, 18, 0),
        status: "CONCLUIDO",
        completedAt: addDays(-4, 19, 0),
      },
      {
        id: "chk-14",
        eventId: "ev-4",
        description: "Execução do show luminoso antes do apito inicial",
        responsible: "Diretoria de Matchday",
        dueDate: addDays(-3, 19, 45),
        status: "CONCLUIDO",
        completedAt: addDays(-3, 20, 0),
      },
    ],
    vendors: [
      {
        id: "ev-ven-9",
        eventId: "ev-4",
        vendorId: "ven-3",
        vendor: MOCK_VENDORS[2],
        costEstimated: 110000,
        costReal: 106000,
      },
      {
        id: "ev-ven-10",
        eventId: "ev-4",
        vendorId: "ven-2",
        vendor: MOCK_VENDORS[1],
        costEstimated: 50000,
        costReal: 48200,
      },
    ],
    proofs: [
      {
        id: "prf-3",
        eventId: "ev-4",
        fileUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
        status: "VALIDADO",
        submittedAt: addDays(-3, 22, 0),
        validatedAt: addDays(-2, 10, 0),
      },
    ],
  },
  {
    id: "ev-5",
    name: "Festival Gastronômico Los Pollos Hermanos na Praça Roberto Pedrosa",
    type: "EVENTO_TORCEDOR",
    date: addDays(-6, 13, 0),
    venue: "Praça Roberto Gomes Pedrosa (Portão 1)",
    sponsorId: "sp-6",
    sponsor: MOCK_SPONSORS[5],
    status: "CONCLUIDO",
    budgetEstimated: 55000,
    budgetReal: 52400,
    checklistItems: [
      {
        id: "chk-15",
        eventId: "ev-5",
        description: "Liberação do alvará temporário de alimentação na prefeitura",
        responsible: "Jurídico SPFC",
        dueDate: addDays(-15, 10, 0),
        status: "CONCLUIDO",
        completedAt: addDays(-14, 16, 0),
      },
      {
        id: "chk-16",
        eventId: "ev-5",
        description: "Instalação dos food trucks e tendas de atendimento",
        responsible: "Morumbi Cenografia",
        dueDate: addDays(-7, 18, 0),
        status: "CONCLUIDO",
        completedAt: addDays(-7, 20, 0),
      },
      {
        id: "chk-17",
        eventId: "ev-5",
        description: "Controle de filas e distribuição de combos de matchday",
        responsible: "Los Pollos Eventos",
        dueDate: addDays(-6, 12, 0),
        status: "CONCLUIDO",
        completedAt: addDays(-6, 17, 0),
      },
    ],
    vendors: [
      {
        id: "ev-ven-11",
        eventId: "ev-5",
        vendorId: "ven-5",
        vendor: MOCK_VENDORS[4],
        costEstimated: 35000,
        costReal: 33400,
      },
      {
        id: "ev-ven-12",
        eventId: "ev-5",
        vendorId: "ven-1",
        vendor: MOCK_VENDORS[0],
        costEstimated: 20000,
        costReal: 19000,
      },
    ],
    proofs: [
      {
        id: "prf-4",
        eventId: "ev-5",
        fileUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        status: "VALIDADO",
        submittedAt: addDays(-6, 21, 0),
        validatedAt: addDays(-5, 9, 30),
      },
    ],
  },
  {
    id: "ev-6",
    name: "Ação Torcedor Mirim com Santo Paulo (Monsters Inc.)",
    type: "EVENTO_TORCEDOR",
    date: addDays(1, 15, 0),
    venue: "Túnel e Gramado do MorumBIS",
    sponsorId: "sp-8",
    sponsor: MOCK_SPONSORS[7],
    status: "EM_EXECUCAO",
    budgetEstimated: 22000,
    budgetReal: 20800,
    checklistItems: [
      {
        id: "chk-18",
        eventId: "ev-6",
        description: "Triagem e credenciamento das 44 crianças selecionadas",
        responsible: "Comitê Social SPFC",
        dueDate: addDays(-1, 18, 0),
        status: "CONCLUIDO",
        completedAt: addDays(-1, 17, 30),
      },
      {
        id: "chk-19",
        eventId: "ev-6",
        description: "Entrega dos kits infantis temáticos (uniforme + surpresas)",
        responsible: "Produção Monsters Inc.",
        dueDate: addDays(0, 10, 0),
        status: "ATRASADO", // Item atrasado para teste de KPI e badge vermelho
      },
      {
        id: "chk-20",
        eventId: "ev-6",
        description: "Ensaio da entrada em campo com a mascote Santo Paulo",
        responsible: "Cerimonial de Jogo",
        dueDate: addDays(1, 14, 0),
        status: "EM_ANDAMENTO",
      },
    ],
    vendors: [
      {
        id: "ev-ven-13",
        eventId: "ev-6",
        vendorId: "ven-6",
        vendor: MOCK_VENDORS[5],
        costEstimated: 12000,
        costReal: 11000,
      },
      {
        id: "ev-ven-14",
        eventId: "ev-6",
        vendorId: "ven-5",
        vendor: MOCK_VENDORS[4],
        costEstimated: 10000,
        costReal: 9800,
      },
    ],
    proofs: [
      {
        id: "prf-5",
        eventId: "ev-6",
        fileUrl: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80",
        status: "ENVIADO",
        submittedAt: addDays(0, 19, 0),
      },
    ],
  },
  {
    id: "ev-7",
    name: "Modernização das Catracas: Biometria Cyberdyne",
    type: "ATIVACAO_PATROCINADOR",
    date: addDays(14, 9, 0),
    venue: "Portões 1, 2, 4 e 17",
    sponsorId: "sp-7",
    sponsor: MOCK_SPONSORS[6],
    status: "PLANEJADO",
    budgetEstimated: 95000,
    budgetReal: null,
    checklistItems: [
      {
        id: "chk-21",
        eventId: "ev-7",
        description: "Instalação dos leitores biométricos faciais nos torniquetes",
        responsible: "TI Cyberdyne",
        dueDate: addDays(5, 12, 0),
        status: "EM_ANDAMENTO",
      },
      {
        id: "chk-22",
        eventId: "ev-7",
        description: "Treinamento dos orientadores de público para suporte aos torcedores",
        responsible: "RH Operações MorumBIS",
        dueDate: addDays(10, 15, 0),
        status: "PENDENTE",
      },
    ],
    vendors: [
      {
        id: "ev-ven-15",
        eventId: "ev-7",
        vendorId: "ven-4",
        vendor: MOCK_VENDORS[3],
        costEstimated: 25000,
        costReal: null,
      },
      {
        id: "ev-ven-16",
        eventId: "ev-7",
        vendorId: "ven-2",
        vendor: MOCK_VENDORS[1],
        costEstimated: 70000,
        costReal: null,
      },
    ],
    proofs: [],
  },
  {
    id: "ev-8",
    name: "MorumBIS Fest: Chuva de Papel Dunder Mifflin no Portão 5",
    type: "EVENTO_TORCEDOR",
    date: addDays(-12, 16, 0),
    venue: "Setor Sul do MorumBIS",
    sponsorId: "sp-5",
    sponsor: MOCK_SPONSORS[4],
    status: "CONCLUIDO",
    budgetEstimated: 32000,
    budgetReal: 31100,
    checklistItems: [
      {
        id: "chk-23",
        eventId: "ev-8",
        description: "Pesagem e certificação antichamas dos papéis picados",
        responsible: "Bombeiros / Dunder Mifflin",
        dueDate: addDays(-14, 10, 0),
        status: "CONCLUIDO",
        completedAt: addDays(-14, 11, 0),
      },
      {
        id: "chk-24",
        eventId: "ev-8",
        description: "Posicionamento dos 12 canhões pneumáticos de ar comprimido",
        responsible: "Pulse Sound & Light",
        dueDate: addDays(-13, 14, 0),
        status: "CONCLUIDO",
        completedAt: addDays(-13, 15, 30),
      },
    ],
    vendors: [
      {
        id: "ev-ven-17",
        eventId: "ev-8",
        vendorId: "ven-3",
        vendor: MOCK_VENDORS[2],
        costEstimated: 20000,
        costReal: 19500,
      },
      {
        id: "ev-ven-18",
        eventId: "ev-8",
        vendorId: "ven-4",
        vendor: MOCK_VENDORS[3],
        costEstimated: 12000,
        costReal: 11600,
      },
    ],
    proofs: [
      {
        id: "prf-6",
        eventId: "ev-8",
        fileUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1200&q=80",
        status: "VALIDADO",
        submittedAt: addDays(-12, 19, 0),
        validatedAt: addDays(-11, 10, 0),
      },
    ],
  },
  {
    id: "ev-9",
    name: "SPFC x Internacional - Noite de Libertadores",
    type: "JOGO",
    date: addDays(20, 21, 30),
    venue: "Estádio do MorumBIS",
    sponsorId: "sp-3",
    sponsor: MOCK_SPONSORS[2],
    status: "PLANEJADO",
    budgetEstimated: 130000,
    budgetReal: null,
    checklistItems: [
      {
        id: "chk-25",
        eventId: "ev-9",
        description: "Adequação do estádio aos protocolos operacionais da Conmebol",
        responsible: "Gerência Internacional SPFC",
        dueDate: addDays(10, 10, 0),
        status: "PENDENTE",
      },
    ],
    vendors: [],
    proofs: [],
  },
  {
    id: "ev-10",
    name: "Encontro com Ídolos Históricos no Morumbi Concept Hall",
    type: "EVENTO_TORCEDOR",
    date: addDays(-20, 19, 0),
    venue: "Morumbi Concept Hall",
    sponsorId: null,
    sponsor: null,
    status: "CONCLUIDO",
    budgetEstimated: 28000,
    budgetReal: 29400,
    checklistItems: [
      {
        id: "chk-26",
        eventId: "ev-10",
        description: "Confirmação de agenda e traslado dos 3 ídolos convidados",
        responsible: "Assessoria de Comunicação",
        dueDate: addDays(-25, 10, 0),
        status: "CONCLUIDO",
        completedAt: addDays(-24, 16, 0),
      },
    ],
    vendors: [
      {
        id: "ev-ven-19",
        eventId: "ev-10",
        vendorId: "ven-5",
        vendor: MOCK_VENDORS[4],
        costEstimated: 16000,
        costReal: 17200,
      },
    ],
    proofs: [
      {
        id: "prf-7",
        eventId: "ev-10",
        fileUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
        status: "VALIDADO",
        submittedAt: addDays(-20, 22, 0),
        validatedAt: addDays(-19, 10, 0),
      },
    ],
  },
];

export function updateMockEvent(id: string, data: Partial<MockEvent>) {
  const ev = MOCK_EVENTS.find((e) => e.id === id);
  if (ev) {
    Object.assign(ev, data);
  }
}
