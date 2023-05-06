CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`ownerId` integer,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`)
);

ALTER TABLE users ADD `googleProfileId` text NOT NULL;
ALTER TABLE users ADD `serviceId` text;
ALTER TABLE users ADD `iconUrl` text;
ALTER TABLE users ADD `registeredAt` integer NOT NULL;
CREATE UNIQUE INDEX `googleProfileIdIdx` ON `users` (`googleProfileId`);
CREATE UNIQUE INDEX `serviceIdIdx` ON `users` (`serviceId`);