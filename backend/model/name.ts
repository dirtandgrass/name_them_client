import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()



export enum Sex {
  male = "male", female = "female", unisex = "unisex", all = "all"
}

export type NameParams = { count?: number, source_ids?: number | Array<number>, sex?: Sex }




export default class Name {

  static async getSimilarNamesForId(name_id: number): Promise<{ count: number, data: string[] }> {

    const similar = await prisma.similar.findMany({
      where: { name_id: name_id }, select: { similar_name_id: true, name_similar_similar_name_idToname: { select: { name: true } } }
    });

    const data: string[] = similar.map((item) => item.name_similar_similar_name_idToname.name);

    const resultObj = { count: similar.length, data: data }
    return resultObj;
  }
  static async getSimilarNames(name: string): Promise<{ count: number, data: string[] }> {

    const name_id = await prisma.name.findFirst({ where: { name: { equals: name, mode: 'insensitive' } }, select: { name_id: true } });

    //console.log(name_id);
    if (name_id === null) return { count: 0, data: [] };

    return this.getSimilarNamesForId(name_id.name_id);

  }


  static getFilterClausesForRaw(sex = Sex.all, source_ids: number | number[] = -1) {
    let source_clause = "";
    if (source_ids !== -1) {
      if (Array.isArray(source_ids)) {
        source_clause = `where sn.source_id in (${source_ids.join(",")})`;
      } else {
        source_clause = `where sn.source_id in (${source_ids})`;
      }
    }

    let sex_clause = "";
    if (sex !== Sex.all) {
      sex_clause = (source_clause.length > 0 ? "and " : "where ");
      if (sex == Sex.unisex) {
        sex_clause += 'n.male = true AND n.female = true ' // unisex
      } else {
        sex_clause += `n.${Sex[sex]} = true ` // one sex
      }
    }

    return [source_clause, sex_clause];
  }



  static async getRandomUnratedName(user_id: number, group_id: number, sex = Sex.all, source_ids: number | number[] = -1)
    : Promise<{ source_id?: number | Array<number>, sex?: string, data: Record<string, unknown> }> {

    const [source_clause, sex_clause] = this.getFilterClausesForRaw(sex, source_ids);

    let in_clause_prefix = "and"
    if (source_clause.length === 0 && sex_clause.length === 0) {
      in_clause_prefix = "where";
    }
    const query = `select n.name_id, n.name, n.male, n.female from source_name sn join name n on n.name_id=sn.name_id ${source_clause} ${sex_clause} ${in_clause_prefix} n.name_id not in (select r.name_id from rating r where r.user_id=${user_id} and r.group_id=${group_id}) order by random() limit 1`;

    // console.log(query);
    const data = (await prisma.$queryRawUnsafe(query) as Record<string, unknown>[])[0];

    const resultObj = { message: "found record", source_ids, sex: Sex[sex], data, success: true }

    return resultObj
  }

  static async getRandomNames({ count = 5, sex = Sex.all, source_ids = -1 }: NameParams)
    : Promise<{ count?: number, source_id?: number | Array<number>, sex?: string, data: Record<string, unknown> }> {
    count = Math.round(count);
    if (count < 1) { count = 1 } else if (count > 20) { count = 20 }


    const [source_clause, sex_clause] = this.getFilterClausesForRaw(sex, source_ids);

    const query = `select n.name_id, n.name, n.male, n.female from source_name sn join name n on n.name_id=sn.name_id ${source_clause} ${sex_clause} order by random() limit ${count}`;

    //console.log(query);
    const data: Record<string, unknown> = await prisma.$queryRawUnsafe(query);

    const resultObj = { message: "found records", count, source_ids, sex: Sex[sex], data, success: true }

    return resultObj
  }
}
