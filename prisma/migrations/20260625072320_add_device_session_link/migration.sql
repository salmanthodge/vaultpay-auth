-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "user_device_id" UUID;

-- CreateIndex
CREATE INDEX "refresh_tokens_user_device_id_idx" ON "refresh_tokens"("user_device_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_device_id_fkey" FOREIGN KEY ("user_device_id") REFERENCES "user_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
