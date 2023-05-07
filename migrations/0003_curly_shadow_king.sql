CREATE TABLE `tagOwnerships` (
	`id` integer PRIMARY KEY NOT NULL,
	`tagId` integer,
	`postId` integer,
	FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`),
	FOREIGN KEY (`postId`) REFERENCES `posts`(`id`)
);

CREATE TABLE `tags` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
