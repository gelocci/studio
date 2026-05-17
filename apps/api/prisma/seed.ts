import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.demand.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      title: "Revisar achados visuais do www",
      description: "Demanda inicial criada para validar o fluxo do Studio com auditoria visual, agentes, pareceres e workflow.",
      project: "www",
      origin: "AUDIT",
      priority: "HIGH",
      status: "WAITING_APPROVAL",
      backlogItems: {
        create: [{
          title: "Avaliar tokens CSS duplicados",
          description: "Verificar se os tokens duplicados são intencionais ou se indicam dívida de organização visual.",
          project: "www",
          type: "AUDIT",
          priority: "MEDIUM",
          status: "TRIAGE",
          source: "seed"
        }]
      }
    }
  });
}

main().then(async()=>{ await prisma.$disconnect(); }).catch(async(error)=>{ console.error(error); await prisma.$disconnect(); process.exit(1); });
