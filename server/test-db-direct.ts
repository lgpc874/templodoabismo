import { db } from "./db";
import { courses } from "@shared/schema";
import { eq } from "drizzle-orm";

async function testDatabase() {
  try {
    console.log("Testing direct database connection...");
    
    // Test raw query
    const rawResult = await db.execute(`SELECT COUNT(*) as count FROM courses WHERE is_active = true`);
    console.log("Raw query result:", rawResult.rows);
    
    // Test Drizzle query
    const drizzleResult = await db.select().from(courses).where(eq(courses.is_active, true));
    console.log("Drizzle query result:", drizzleResult);
    
    return { success: true, rawCount: rawResult.rows[0], drizzleCount: drizzleResult.length };
  } catch (error) {
    console.error("Database test failed:", error);
    return { success: false, error: error.message };
  }
}

testDatabase().then(result => {
  console.log("Final result:", result);
  process.exit(0);
}).catch(error => {
  console.error("Test script error:", error);
  process.exit(1);
});