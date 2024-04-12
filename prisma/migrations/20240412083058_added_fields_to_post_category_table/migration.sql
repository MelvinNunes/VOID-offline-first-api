/*
  Warnings:

  - You are about to drop the column `firstName` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `PostCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `first_name` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phoneNumber",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- DropTable
DROP TABLE "PostCategory";

-- CreateTable
CREATE TABLE "post_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "post_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_categories_name_key" ON "post_categories"("name");

-- AddForeignKey
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
