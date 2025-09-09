-- CreateEnum
CREATE TYPE "public"."MemberRole" AS ENUM ('PARENT', 'CHILD', 'GUARDIAN', 'OTHER');

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "passwordHash" DROP NOT NULL,
ALTER COLUMN "passwordSalt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Family" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FamilyMember" (
    "id" SERIAL NOT NULL,
    "familyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "public"."MemberRole" NOT NULL,
    "relation" TEXT,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_familyId_userId_key" ON "public"."FamilyMember"("familyId", "userId");

-- AddForeignKey
ALTER TABLE "public"."FamilyMember" ADD CONSTRAINT "FamilyMember_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "public"."Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FamilyMember" ADD CONSTRAINT "FamilyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
