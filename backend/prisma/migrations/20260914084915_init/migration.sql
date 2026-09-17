-- CreateTable
CREATE TABLE "spell_jobs" (
    "id" TEXT NOT NULL,
    "spell_text" TEXT NOT NULL,
    "iterations_total" INTEGER NOT NULL,
    "iterations_completed" INTEGER NOT NULL DEFAULT 0,
    "duration_min" INTEGER NOT NULL DEFAULT 60,
    "status" VARCHAR(50) NOT NULL DEFAULT 'accepted',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "error_message" TEXT,

    CONSTRAINT "spell_jobs_pkey" PRIMARY KEY ("id")
);
