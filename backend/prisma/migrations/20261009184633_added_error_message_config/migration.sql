/*
  Warnings:

  - Made the column `run_id` on table `spell_configs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "spell_configs" ADD COLUMN     "error_message" TEXT,
ALTER COLUMN "run_id" SET NOT NULL;
