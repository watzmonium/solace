import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from "next/server";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;
  const searchTerm = searchParams.get("searchTerm") || "";

  try {
    const offset = (page - 1) * pageSize;

    const advocateResult = await db
      .select()
      .from(advocates)
      .where(
        sql`first_name ILIKE ${`%${searchTerm}%`} OR
            last_name ILIKE ${`%${searchTerm}%`} OR 
            city ILIKE ${`%${searchTerm}%`} OR 
            degree ILIKE ${`%${searchTerm}%`} OR 
            phone_number::text ILIKE ${`%${searchTerm}%`} OR 
            payload::text ILIKE ${`%${searchTerm}%`}`
      )
      .limit(pageSize)
      .offset(offset);

    const totalCountResult = await db
      .select()
      .from(advocates)
      .where(
        sql`first_name ILIKE ${`%${searchTerm}%`} OR
            last_name ILIKE ${`%${searchTerm}%`} OR
            city ILIKE ${`%${searchTerm}%`} OR
            degree ILIKE ${`%${searchTerm}%`} OR
            phone_number::text ILIKE ${`%${searchTerm}%`} OR
            payload::text ILIKE ${`%${searchTerm}%`}`
      );

    const totalCount = totalCountResult.length;

    return Response.json({
      advocates: advocateResult,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json({ advocates: [], totalCount: 0 });
  }
}
