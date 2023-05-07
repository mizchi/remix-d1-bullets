CREATE UNIQUE INDEX `tagIdPostIdIdx` ON `tagOwnerships` (`tagId`,`postId`);
CREATE UNIQUE INDEX `postIdIdx` ON `tagOwnerships` (`postId`);
CREATE UNIQUE INDEX `tagIdIdx` ON `tagOwnerships` (`tagId`);