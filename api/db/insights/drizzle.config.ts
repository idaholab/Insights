// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "schema.ts",
  dbCredentials: {
    url: "file:db/insights/insights.db",
  },
  out:'./db/insights'
});
