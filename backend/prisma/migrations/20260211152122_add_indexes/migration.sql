-- RenameIndex
ALTER TABLE `Products` RENAME INDEX `Products_categoryId_fkey` TO `Products_categoryId_idx`;

-- RenameIndex
ALTER TABLE `Products` RENAME INDEX `Products_userId_fkey` TO `Products_userId_idx`;
