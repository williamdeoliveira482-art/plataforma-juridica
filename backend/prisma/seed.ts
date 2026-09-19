import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed: criando escritório, usuários e dados de exemplo...");

  const office = await prisma.office.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Escritório Modelo & Associados",
      document: "12.345.678/0001-90",
    },
  });

  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@plataformajuridica.local" },
    update: {},
    create: {
      officeId: office.id,
      name: "Administrador Geral",
      email: "admin@plataformajuridica.local",
      passwordHash,
      role: "ADMIN",
    },
  });

  const lawyer = await prisma.user.upsert({
    where: { email: "advogado@plataformajuridica.local" },
    update: {},
    create: {
      officeId: office.id,
      name: "Dra. Camila Ferreira",
      email: "advogado@plataformajuridica.local",
      passwordHash,
      role: "LAWYER",
    },
  });

  await prisma.user.upsert({
    where: { email: "financeiro@plataformajuridica.local" },
    update: {},
    create: {
      officeId: office.id,
      name: "Setor Financeiro",
      email: "financeiro@plataformajuridica.local",
      passwordHash,
      role: "FINANCE",
    },
  });

  await prisma.user.upsert({
    where: { email: "atendimento@plataformajuridica.local" },
    update: {},
    create: {
      officeId: office.id,
      name: "Recepção",
      email: "atendimento@plataformajuridica.local",
      passwordHash,
      role: "ASSISTANT",
    },
  });

  const categories = ["Contratos", "Procurações", "Documentos pessoais", "Petições", "Comprovantes", "Financeiro", "Outros"];
  for (const name of categories) {
    await prisma.documentCategory.upsert({ where: { name }, update: {}, create: { name } });
  }

  const client1 = await prisma.client.upsert({
    where: { document: "123.456.789-00" },
    update: {},
    create: {
      officeId: office.id,
      type: "PF",
      name: "João da Silva",
      document: "123.456.789-00",
      phone: "(48) 99999-0001",
      email: "joao.silva@example.com",
      address: "Rua das Palmeiras, 123 - Chapecó/SC",
      status: "ACTIVE",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { document: "12.345.678/0001-99" },
    update: {},
    create: {
      officeId: office.id,
      type: "PJ",
      name: "Comércio Silva & Cia Ltda",
      document: "12.345.678/0001-99",
      responsible: "Maria Silva",
      phone: "(48) 99999-0002",
      email: "contato@comerciosilva.example.com",
      address: "Av. Central, 500 - Chapecó/SC",
      status: "ACTIVE",
    },
  });

  const process1 = await prisma.process.create({
    data: {
      officeId: office.id,
      clientId: client1.id,
      number: "0001234-56.2026.8.24.0001",
      area: "Trabalhista",
      court: "TRT 12ª Região",
      chamber: "2ª Vara do Trabalho",
      responsibleUserId: lawyer.id,
      status: "EM_ANDAMENTO",
      description: "Reclamação trabalhista referente a verbas rescisórias.",
    },
  });

  await prisma.processHistory.create({
    data: { processId: process1.id, note: "Processo criado a partir do seed." },
  });

  const process2 = await prisma.process.create({
    data: {
      officeId: office.id,
      clientId: client2.id,
      number: "0007890-12.2026.8.24.0001",
      area: "Cível",
      court: "TJSC",
      responsibleUserId: lawyer.id,
      status: "NOVO_CASO",
      description: "Ação de cobrança contra fornecedor inadimplente.",
    },
  });

  await prisma.task.createMany({
    data: [
      {
        officeId: office.id,
        title: "Elaborar contestação",
        description: "Redigir contestação do processo trabalhista.",
        responsibleUserId: lawyer.id,
        clientId: client1.id,
        processId: process1.id,
        priority: "ALTA",
        status: "EM_ANDAMENTO",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        officeId: office.id,
        title: "Solicitar documentos ao cliente",
        responsibleUserId: admin.id,
        clientId: client2.id,
        processId: process2.id,
        priority: "MEDIA",
        status: "PENDENTE",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  await prisma.event.createMany({
    data: [
      {
        officeId: office.id,
        type: "AUDIENCIA",
        title: "Audiência de conciliação",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        responsibleUserId: lawyer.id,
        clientId: client1.id,
        processId: process1.id,
      },
      {
        officeId: office.id,
        type: "PRAZO",
        title: "Prazo para contestação",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        responsibleUserId: lawyer.id,
        clientId: client1.id,
        processId: process1.id,
      },
    ],
  });

  await prisma.financialEntry.createMany({
    data: [
      {
        officeId: office.id,
        clientId: client1.id,
        processId: process1.id,
        description: "Honorários - 1ª parcela",
        amount: 1500,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: "PENDENTE",
      },
      {
        officeId: office.id,
        clientId: client2.id,
        processId: process2.id,
        description: "Honorários contratuais",
        amount: 3200,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "PENDENTE",
      },
    ],
  });

  await prisma.clientPortalAccess.upsert({
    where: { email: "joao.silva@example.com" },
    update: {},
    create: {
      clientId: client1.id,
      email: "joao.silva@example.com",
      passwordHash: await bcrypt.hash("123456", 10),
    },
  });

  console.log("Seed concluído.");
  console.log("Login administrador: admin@plataformajuridica.local / 123456");
  console.log("Login área do cliente: joao.silva@example.com / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
