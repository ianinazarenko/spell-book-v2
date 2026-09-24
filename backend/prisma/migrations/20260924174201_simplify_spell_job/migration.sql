/*
  Warnings:

  - You are about to drop the column `duration_min` on the `spell_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `iterations_completed` on the `spell_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `iterations_total` on the `spell_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `spell_jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "spell_jobs" DROP COLUMN "duration_min",
DROP COLUMN "iterations_completed",
DROP COLUMN "iterations_total",
DROP COLUMN "status";
