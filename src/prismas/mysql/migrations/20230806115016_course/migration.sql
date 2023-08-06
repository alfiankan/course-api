-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `author_id` VARCHAR(36) NOT NULL,
    `contents` TEXT NULL,

    UNIQUE INDEX `Course_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
