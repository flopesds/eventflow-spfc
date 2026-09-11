import { PrismaClient, EventType, EventStatus, ChecklistStatus, ProofStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando o seed do EventFlow SPFC com marcas fictícias...");

  // Limpar registros anteriores em ordem reversa para respeitar FKs
  await prisma.proof.deleteMany({});
  await prisma.eventVendor.deleteMany({});
  await prisma.checklistItem.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.sponsor.deleteMany({});

  // 1. Criar Patrocinadores Fictícios (cultura pop / filmes / séries)
  const sponsorsData = [
    { name: "Acme Corporation" },
    { name: "Wonka Industries" },
    { name: "Wayne Enterprises" },
    { name: "Stark Industries" },
    { name: "Dunder Mifflin Paper Co." },
    { name: "Los Pollos Hermanos" },
    { name: "Cyberdyne Systems" },
    { name: "Monsters Inc. Entertainment" },
  ];

  const createdSponsors = await Promise.all(
    sponsorsData.map((s) => prisma.sponsor.create({ data: s }))
  );

  const sponsorMap = new Map(createdSponsors.map((s) => [s.name, s.id]));

  // 2. Criar Fornecedores Especializados de Matchday
  const vendorsData = [
    {
      name: "Morumbi Cenografia & Estruturas",
      category: "Cenografia e Montagem",
      contact: "operacoes@morumbicenografia.com.br | (11) 98765-1001",
    },
    {
      name: "Tricolor Guard Vigilância & Apoio",
      category: "Segurança Privada",
      contact: "escala@tricolorguard.com.br | (11) 98765-1002",
    },
    {
      name: "Pulse Sound & Light Experience",
      category: "Sonorização e Iluminação",
      contact: "tecnica@pulsesound.com.br | (11) 98765-1003",
    },
    {
      name: "FastLine Logística & Fretes",
      category: "Transporte e Logística",
      contact: "contato@fastlinelog.com.br | (11) 98765-1004",
    },
    {
      name: "Gourmet Matchday Catering",
      category: "Alimentos e Bebidas",
      contact: "chef@gourmetmatchday.com.br | (11) 98765-1005",
    },
    {
      name: "VisualPrint Comunicação Visual",
      category: "Impressão e Banners",
      contact: "producao@visualprint.com.br | (11) 98765-1006",
    },
  ];

  const createdVendors = await Promise.all(
    vendorsData.map((v) => prisma.vendor.create({ data: v }))
  );

  const vendorMap = new Map(createdVendors.map((v) => [v.name, v.id]));

  const now = new Date();
  const day = (d: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    return date;
  };

  // 3. Eventos Realistas no MorumBIS
  const eventsToCreate = [
    {
      name: "SPFC x Palmeiras - Choque-Rei (Brasileirão)",
      type: EventType.JOGO,
      date: day(1), // Amanhã
      venue: "Estádio do MorumBIS",
      sponsorId: sponsorMap.get("Acme Corporation"),
      status: EventStatus.EM_EXECUCAO,
      budgetEstimated: 85000,
      budgetReal: 79200,
      checklists: [
        {
          description: "Inspeção e teste geral dos painéis de LED do campo",
          responsible: "Equipe Técnica Acme / SPFC",
          dueDate: day(0),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(0),
        },
        {
          description: "Montagem do backdrop de coletiva e zona mista",
          responsible: "Morumbi Cenografia",
          dueDate: day(0),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(0),
        },
        {
          description: "Distribuição dos 20.000 balões e bandeirinhas no setor popular",
          responsible: "Coordenação de Ativações",
          dueDate: day(1),
          status: ChecklistStatus.EM_ANDAMENTO,
        },
        {
          description: "Posicionamento do inflável gigante Acme no anel intermediário",
          responsible: "FastLine Logística",
          dueDate: day(1),
          status: ChecklistStatus.EM_ANDAMENTO,
        },
        {
          description: "Coleta e auditoria do relatório fotográfico pós-partida",
          responsible: "Fotografia & Mídia",
          dueDate: day(2),
          status: ChecklistStatus.PENDENTE,
        },
      ],
      vendors: [
        {
          vendorId: vendorMap.get("Morumbi Cenografia & Estruturas")!,
          costEstimated: 35000,
          costReal: 34500,
        },
        {
          vendorId: vendorMap.get("Tricolor Guard Vigilância & Apoio")!,
          costEstimated: 30000,
          costReal: 29200,
        },
        {
          vendorId: vendorMap.get("VisualPrint Comunicação Visual")!,
          costEstimated: 20000,
          costReal: 15500,
        },
      ],
      proofs: [
        {
          fileUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
          status: ProofStatus.ENVIADO,
          submittedAt: day(0),
        },
      ],
    },
    {
      name: "Ativação Wonka: O Bilhete Dourado no Camarote MorumBIS",
      type: EventType.ATIVACAO_PATROCINADOR,
      date: day(3),
      venue: "MorumBIS - Camarote Stadium",
      sponsorId: sponsorMap.get("Wonka Industries"),
      status: EventStatus.PLANEJADO,
      budgetEstimated: 45000,
      budgetReal: 41000,
      checklists: [
        {
          description: "Recebimento e conferência das barras Wonka personalizadas",
          responsible: "Almoxarifado SPFC",
          dueDate: day(1),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(1),
        },
        {
          description: "Distribuição dos bilhetes dourados nos assentos premium",
          responsible: "Promotores Wonka",
          dueDate: day(2),
          status: ChecklistStatus.EM_ANDAMENTO,
        },
        {
          description: "Acompanhamento dos 5 vencedores na visita ao gramado",
          responsible: "Marketing de Experiência",
          dueDate: day(3),
          status: ChecklistStatus.PENDENTE,
        },
        {
          description: "Gravação de vídeo com depoimento dos fãs contemplados",
          responsible: "Social Media Tricolor",
          dueDate: day(3),
          status: ChecklistStatus.PENDENTE,
        },
      ],
      vendors: [
        {
          vendorId: vendorMap.get("Gourmet Matchday Catering")!,
          costEstimated: 25000,
          costReal: 24000,
        },
        {
          vendorId: vendorMap.get("Morumbi Cenografia & Estruturas")!,
          costEstimated: 20000,
          costReal: 17000,
        },
      ],
      proofs: [
        {
          fileUrl: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80",
          status: ProofStatus.PENDENTE,
          submittedAt: null,
        },
      ],
    },
    {
      name: "SPFC x Flamengo - Decisão Copa do Brasil",
      type: EventType.JOGO,
      date: day(7),
      venue: "Estádio do MorumBIS",
      sponsorId: sponsorMap.get("Wayne Enterprises"),
      status: EventStatus.PLANEJADO,
      budgetEstimated: 120000,
      budgetReal: 118000,
      checklists: [
        {
          description: "Reunião de alinhamento com Polícia Militar, CET e CBMESP",
          responsible: "Diretoria de Operações",
          dueDate: day(-2),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-2),
        },
        {
          description: "Programação das vinhetas especiais Wayne no anel do estádio",
          responsible: "Pulse Sound & Light",
          dueDate: day(4),
          status: ChecklistStatus.EM_ANDAMENTO,
        },
        {
          description: "Briefing operacional com os 150 seguranças privados",
          responsible: "Tricolor Guard",
          dueDate: day(6),
          status: ChecklistStatus.PENDENTE,
        },
        {
          description: "Recepção VIP dos executivos da Wayne Enterprises no Lounge",
          responsible: "Relações Institucionais",
          dueDate: day(7),
          status: ChecklistStatus.PENDENTE,
        },
      ],
      vendors: [
        {
          vendorId: vendorMap.get("Tricolor Guard Vigilância & Apoio")!,
          costEstimated: 60000,
          costReal: 58000,
        },
        {
          vendorId: vendorMap.get("Pulse Sound & Light Experience")!,
          costEstimated: 35000,
          costReal: 36000,
        },
        {
          vendorId: vendorMap.get("Gourmet Matchday Catering")!,
          costEstimated: 25000,
          costReal: 24000,
        },
      ],
      proofs: [],
    },
    {
      name: "Show Tecnológico Stark: Drones & Luzes no Gramado",
      type: EventType.ATIVACAO_PATROCINADOR,
      date: day(-3), // Já ocorrido
      venue: "Gramado do MorumBIS",
      sponsorId: sponsorMap.get("Stark Industries"),
      status: EventStatus.CONCLUIDO,
      budgetEstimated: 160000,
      budgetReal: 154200,
      checklists: [
        {
          description: "Autorização de voo junto ao DECEA e Anac",
          responsible: "Engenharia Stark",
          dueDate: day(-10),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-9),
        },
        {
          description: "Calibração dos 200 drones de show sincronizado",
          responsible: "Equipe Stark Tech",
          dueDate: day(-4),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-4),
        },
        {
          description: "Execução do show luminoso antes do apito inicial",
          responsible: "Diretoria de Matchday",
          dueDate: day(-3),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-3),
        },
      ],
      vendors: [
        {
          vendorId: vendorMap.get("Pulse Sound & Light Experience")!,
          costEstimated: 110000,
          costReal: 106000,
        },
        {
          vendorId: vendorMap.get("Tricolor Guard Vigilância & Apoio")!,
          costEstimated: 50000,
          costReal: 48200,
        },
      ],
      proofs: [
        {
          fileUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
          status: ProofStatus.VALIDADO,
          submittedAt: day(-3),
          validatedAt: day(-2),
        },
      ],
    },
    {
      name: "Festival Gastronômico Los Pollos Hermanos na Praça Roberto Pedrosa",
      type: EventType.EVENTO_TORCEDOR,
      date: day(-6),
      venue: "Praça Roberto Gomes Pedrosa (Portão 1)",
      sponsorId: sponsorMap.get("Los Pollos Hermanos"),
      status: EventStatus.CONCLUIDO,
      budgetEstimated: 55000,
      budgetReal: 52400,
      checklists: [
        {
          description: "Liberação do alvará temporário de alimentação na prefeitura",
          responsible: "Jurídico SPFC",
          dueDate: day(-15),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-14),
        },
        {
          description: "Instalação dos food trucks e tendas de atendimento",
          responsible: "Morumbi Cenografia",
          dueDate: day(-7),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-7),
        },
        {
          description: "Controle de filas e distribuição de combos de matchday",
          responsible: "Los Pollos Eventos",
          dueDate: day(-6),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-6),
        },
      ],
      vendors: [
        {
          vendorId: vendorMap.get("Gourmet Matchday Catering")!,
          costEstimated: 35000,
          costReal: 33400,
        },
        {
          vendorId: vendorMap.get("Morumbi Cenografia & Estruturas")!,
          costEstimated: 20000,
          costReal: 19000,
        },
      ],
      proofs: [
        {
          fileUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
          status: ProofStatus.VALIDADO,
          submittedAt: day(-6),
          validatedAt: day(-5),
        },
      ],
    },
    {
      name: "Ação Torcedor Mirim com Santo Paulo (Monsters Inc.)",
      type: EventType.EVENTO_TORCEDOR,
      date: day(1),
      venue: "Túnel e Gramado do MorumBIS",
      sponsorId: sponsorMap.get("Monsters Inc. Entertainment"),
      status: EventStatus.EM_EXECUCAO,
      budgetEstimated: 22000,
      budgetReal: 20800,
      checklists: [
        {
          description: "Triagem e credenciamento das 44 crianças selecionadas",
          responsible: "Comitê Social SPFC",
          dueDate: day(-1),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-1),
        },
        {
          description: "Entrega dos kits infantis temáticos (uniforme + surpresas)",
          responsible: "Produção Monsters Inc.",
          dueDate: day(0),
          status: ChecklistStatus.ATRASADO, // Simulação de item atrasado para demonstrar alerta nos KPIs
        },
        {
          description: "Ensaio da entrada em campo com a mascote Santo Paulo",
          responsible: "Cerimonial de Jogo",
          dueDate: day(1),
          status: ChecklistStatus.EM_ANDAMENTO,
        },
      ],
      vendors: [
        {
          vendorId: vendorMap.get("VisualPrint Comunicação Visual")!,
          costEstimated: 12000,
          costReal: 11000,
        },
        {
          vendorId: vendorMap.get("Gourmet Matchday Catering")!,
          costEstimated: 10000,
          costReal: 9800,
        },
      ],
      proofs: [
        {
          fileUrl: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80",
          status: ProofStatus.ENVIADO,
          submittedAt: day(0),
        },
      ],
    },
    {
      name: "Modernização das Catracas: Biometria Cyberdyne",
      type: EventType.ATIVACAO_PATROCINADOR,
      date: day(14),
      venue: "Portões 1, 2, 4 e 17",
      sponsorId: sponsorMap.get("Cyberdyne Systems"),
      status: EventStatus.PLANEJADO,
      budgetEstimated: 95000,
      budgetReal: null,
      checklists: [
        {
          description: "Instalação dos leitores biométricos faciais nos torniquetes",
          responsible: "TI Cyberdyne",
          dueDate: day(5),
          status: ChecklistStatus.EM_ANDAMENTO,
        },
        {
          description: "Treinamento dos orientadores de público para suporte aos torcedores",
          responsible: "RH Operações MorumBIS",
          dueDate: day(10),
          status: ChecklistStatus.PENDENTE,
        },
        {
          description: "Simulação de carga de 10.000 acessos por hora",
          responsible: "Engenharia de Software",
          dueDate: day(12),
          status: ChecklistStatus.PENDENTE,
        },
      ],
      vendors: [
        {
          vendorId: vendorMap.get("FastLine Logística & Fretes")!,
          costEstimated: 25000,
          costReal: null,
        },
        {
          vendorId: vendorMap.get("Tricolor Guard Vigilância & Apoio")!,
          costEstimated: 70000,
          costReal: null,
        },
      ],
      proofs: [],
    },
    {
      name: "MorumBIS Fest: Chuva de Papel Dunder Mifflin no Portão 5",
      type: EventType.EVENTO_TORCEDOR,
      date: day(-12),
      venue: "Setor Sul do MorumBIS",
      sponsorId: sponsorMap.get("Dunder Mifflin Paper Co."),
      status: EventStatus.CONCLUIDO,
      budgetEstimated: 32000,
      budgetReal: 31100,
      checklists: [
        {
          description: "Pesagem e certificação antichamas dos papéis picados",
          responsible: "Bombeiros / Dunder Mifflin",
          dueDate: day(-14),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-14),
        },
        {
          description: "Posicionamento dos 12 canhões pneumáticos de ar comprimido",
          responsible: "Pulse Sound & Light",
          dueDate: day(-13),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-13),
        },
        {
          description: "Disparo no momento da subida dos jogadores ao gramado",
          responsible: "Coordenação de Torcidas",
          dueDate: day(-12),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-12),
        },
      ],
      vendors: [
        {
          vendorId: vendorMap.get("Pulse Sound & Light Experience")!,
          costEstimated: 20000,
          costReal: 19500,
        },
        {
          vendorId: vendorMap.get("FastLine Logística & Fretes")!,
          costEstimated: 12000,
          costReal: 11600,
        },
      ],
      proofs: [
        {
          fileUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1200&q=80",
          status: ProofStatus.VALIDADO,
          submittedAt: day(-12),
          validatedAt: day(-11),
        },
      ],
    },
    {
      name: "SPFC x Internacional - Noite de Libertadores",
      type: EventType.JOGO,
      date: day(20),
      venue: "Estádio do MorumBIS",
      sponsorId: sponsorMap.get("Wayne Enterprises"),
      status: EventStatus.PLANEJADO,
      budgetEstimated: 130000,
      budgetReal: null,
      checklists: [
        {
          description: "Adequação do estádio aos protocolos operacionais da Conmebol",
          responsible: "Gerência Internacional SPFC",
          dueDate: day(10),
          status: ChecklistStatus.PENDENTE,
        },
        {
          description: "Reserva das salas de doping e antidoping com ar condicionado",
          responsible: "Departamento Médico",
          dueDate: day(15),
          status: ChecklistStatus.PENDENTE,
        },
      ],
      vendors: [
        {
          vendorId: vendorMap.get("Tricolor Guard Vigilância & Apoio")!,
          costEstimated: 75000,
          costReal: null,
        },
        {
          vendorId: vendorMap.get("Morumbi Cenografia & Estruturas")!,
          costEstimated: 55000,
          costReal: null,
        },
      ],
      proofs: [],
    },
    {
      name: "Encontro com Ídolos Históricos no Morumbi Concept Hall",
      type: EventType.EVENTO_TORCEDOR,
      date: day(-20),
      venue: "Morumbi Concept Hall",
      sponsorId: null,
      status: EventStatus.CONCLUIDO,
      budgetEstimated: 28000,
      budgetReal: 29400,
      checklists: [
        {
          description: "Confirmação de agenda e traslado dos 3 ídolos convidados",
          responsible: "Assessoria de Comunicação",
          dueDate: day(-25),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-24),
        },
        {
          description: "Montagem da área de autógrafos e fotos oficiais",
          responsible: "Morumbi Cenografia",
          dueDate: day(-21),
          status: ChecklistStatus.CONCLUIDO,
          completedAt: day(-21),
        },
      ],
      vendors: [
        {
          vendorId: vendorMap.get("Gourmet Matchday Catering")!,
          costEstimated: 16000,
          costReal: 17200,
        },
        {
          vendorId: vendorMap.get("Morumbi Cenografia & Estruturas")!,
          costEstimated: 12000,
          costReal: 12200,
        },
      ],
      proofs: [
        {
          fileUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
          status: ProofStatus.VALIDADO,
          submittedAt: day(-20),
          validatedAt: day(-19),
        },
      ],
    },
  ];

  for (const ev of eventsToCreate) {
    const { checklists, vendors, proofs, ...eventData } = ev;
    const createdEvent = await prisma.event.create({
      data: eventData,
    });

    if (checklists && checklists.length > 0) {
      await prisma.checklistItem.createMany({
        data: checklists.map((c) => ({
          ...c,
          eventId: createdEvent.id,
        })),
      });
    }

    if (vendors && vendors.length > 0) {
      await prisma.eventVendor.createMany({
        data: vendors.map((v) => ({
          ...v,
          eventId: createdEvent.id,
        })),
      });
    }

    if (proofs && proofs.length > 0) {
      await prisma.proof.createMany({
        data: proofs.map((p) => ({
          ...p,
          eventId: createdEvent.id,
        })),
      });
    }
  }

  console.log("✅ Seed concluído com sucesso! 10 eventos, fornecedores, checklists e ativações criados.");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante execução do seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
