-- CreateTable
CREATE TABLE "spell_configss" (
    "id" TEXT NOT NULL,
    "duration_min" INTEGER DEFAULT 60,
    "iterations_total" INTEGER NOT NULL DEFAULT 1770,
    "iterations_completed" INTEGER NOT NULL DEFAULT 0,
    "status" "SpellStatus" NOT NULL DEFAULT 'QUEUED',

    CONSTRAINT "spell_configss_pkey" PRIMARY KEY ("id")
);
