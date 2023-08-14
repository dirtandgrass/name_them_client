import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()



export default class Source {
  static async getSources(): Promise<{ count: number, data: Source[] }> {

    const sources = await prisma.source.findMany(
      { orderBy: { name: 'asc' } }
    );




    const resultObj = { count: sources.length, data: sources }
    return resultObj;
  }

  static async getSourcesForNameId(name_id: number): Promise<{ count: number, data: Source[] }> {

    const sources = await prisma.source_name.findMany(
      { where: { name_id: name_id }, select: { source: { select: { source_id: true, name: true, url: true, description: true } } } });

    const resultObj = { count: sources.length, data: sources.map((item) => item.source) }
    return resultObj;
  }

}
