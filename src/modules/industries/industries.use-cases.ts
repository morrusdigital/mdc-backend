import prisma from "../../config/prisma";
import { ConflictError, NotFoundError } from "../../shared/errors/app-error";
import { industryInclude, mapIndustry } from "./industries.helpers";

const db = prisma as any;
const findIndustry = async (id: string) => {
  const item = await db.industry.findUnique({ where: { id }, include: industryInclude });
  if (!item) throw new NotFoundError("Industri tidak ditemukan");
  return item;
};

export async function listIndustries(publicOnly = false) {
  const items = await db.industry.findMany({ where: publicOnly ? { isPublished: true } : {}, include: industryInclude, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return items.map((item: any) => mapIndustry(item, publicOnly));
}
export async function getPublicIndustry(slug: string) {
  const item = await db.industry.findFirst({ where: { slug, isPublished: true }, include: { solutions: { where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } } });
  if (!item) throw new NotFoundError("Industri tidak ditemukan");
  return mapIndustry(item, true);
}
export async function createIndustry(input: any) {
  if (await db.industry.findUnique({ where: { slug: input.slug } })) throw new ConflictError("Slug industri sudah digunakan");
  return mapIndustry(await db.industry.create({ data: { ...input, seoKeywords: input.seoKeywords ?? undefined }, include: industryInclude }));
}
export async function updateIndustry(id: string, input: any) {
  await findIndustry(id);
  if (input.slug && await db.industry.findFirst({ where: { slug: input.slug, NOT: { id } } })) throw new ConflictError("Slug industri sudah digunakan");
  return mapIndustry(await db.industry.update({ where: { id }, data: input, include: industryInclude }));
}
export async function deleteIndustry(id: string) { await findIndustry(id); await db.industry.delete({ where: { id } }); }
export async function createSolution(industryId: string, input: any) {
  await findIndustry(industryId);
  return db.industrySolution.create({ data: { ...input, industryId, benefits: input.benefits } });
}
export async function updateSolution(industryId: string, solutionId: string, input: any) {
  const existing = await db.industrySolution.findFirst({ where: { id: solutionId, industryId } });
  if (!existing) throw new NotFoundError("Solusi tidak ditemukan");
  return db.industrySolution.update({ where: { id: solutionId }, data: input });
}
export async function deleteSolution(industryId: string, solutionId: string) {
  const existing = await db.industrySolution.findFirst({ where: { id: solutionId, industryId } });
  if (!existing) throw new NotFoundError("Solusi tidak ditemukan");
  await db.industrySolution.delete({ where: { id: solutionId } });
}
