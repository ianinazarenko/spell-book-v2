/*
  Warnings:

  - You are about to drop the `spell_configss` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "spell_configss";

-- CreateTable
CREATE TABLE "spell_configs" (
    "id" TEXT NOT NULL,
    "duration_min" INTEGER DEFAULT 60,
    "iterations_total" INTEGER NOT NULL DEFAULT 1770,
    "iterations_completed" INTEGER NOT NULL DEFAULT 0,
    "status" "SpellStatus" NOT NULL DEFAULT 'QUEUED',

    CONSTRAINT "spell_configs_pkey" PRIMARY KEY ("id")
);
