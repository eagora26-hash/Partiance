/**
 * Seed reference taxonomy: skills, goals, industries (bilingual IT/EN).
 * These are the building blocks the matching engine and onboarding rely on.
 * Idempotent — safe to run repeatedly (upsert by slug).
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const SKILLS: [slug: string, it: string, en: string][] = [
  ['software-development', 'Sviluppo Software', 'Software Development'],
  ['product-management', 'Product Management', 'Product Management'],
  ['ui-ux-design', 'UI/UX Design', 'UI/UX Design'],
  ['marketing', 'Marketing', 'Marketing'],
  ['growth', 'Growth', 'Growth'],
  ['sales', 'Vendite', 'Sales'],
  ['finance', 'Finanza', 'Finance'],
  ['operations', 'Operations', 'Operations'],
  ['data-ai', 'Data & AI', 'Data & AI'],
  ['fundraising', 'Fundraising', 'Fundraising'],
  ['legal', 'Legale', 'Legal'],
  ['branding', 'Branding', 'Branding'],
];

const GOALS: [slug: string, it: string, en: string][] = [
  ['find-cofounder', 'Trovare un co-founder', 'Find a co-founder'],
  ['raise-capital', 'Raccogliere capitali', 'Raise capital'],
  ['build-mvp', 'Costruire un MVP', 'Build an MVP'],
  ['scale-startup', 'Scalare la startup', 'Scale the startup'],
  ['find-clients', 'Trovare clienti', 'Find clients'],
  ['join-project', 'Unirmi a un progetto', 'Join a project'],
  ['invest', 'Investire', 'Invest'],
  ['mentor', 'Fare mentoring', 'Mentor others'],
];

const INDUSTRIES: [slug: string, it: string, en: string][] = [
  ['ai', 'AI', 'AI'],
  ['saas', 'SaaS', 'SaaS'],
  ['fintech', 'Fintech', 'Fintech'],
  ['tourism', 'Turismo', 'Tourism'],
  ['healthtech', 'HealthTech', 'HealthTech'],
  ['edtech', 'EdTech', 'EdTech'],
  ['foodtech', 'FoodTech', 'FoodTech'],
  ['greentech', 'GreenTech', 'GreenTech'],
  ['creative-agency', 'Agenzia Creativa', 'Creative Agency'],
  ['ecommerce', 'E-commerce', 'E-commerce'],
];

async function main() {
  console.log('🌱 Seeding taxonomy...');

  for (const [slug, nameIt, nameEn] of SKILLS) {
    await db.skill.upsert({ where: { slug }, update: { nameIt, nameEn }, create: { slug, nameIt, nameEn } });
  }
  for (const [slug, nameIt, nameEn] of GOALS) {
    await db.goal.upsert({ where: { slug }, update: { nameIt, nameEn }, create: { slug, nameIt, nameEn } });
  }
  for (const [slug, nameIt, nameEn] of INDUSTRIES) {
    await db.industry.upsert({ where: { slug }, update: { nameIt, nameEn }, create: { slug, nameIt, nameEn } });
  }

  const [s, g, i] = await Promise.all([db.skill.count(), db.goal.count(), db.industry.count()]);
  console.log(`✓ Seeded ${s} skills, ${g} goals, ${i} industries`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
