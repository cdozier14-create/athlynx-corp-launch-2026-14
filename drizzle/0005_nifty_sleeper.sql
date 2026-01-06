CREATE TABLE `community_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320),
	`userId` int,
	`name` varchar(128),
	`whatTheyLove` text,
	`whatCouldBeBetter` text,
	`featureRequests` text,
	`generalComments` text,
	`siteVersion` enum('site_a','site_b','both','general') DEFAULT 'general',
	`overallRating` int,
	`feedbackType` enum('design','features','usability','performance','content','other') DEFAULT 'other',
	`priority` enum('low','medium','high','critical') DEFAULT 'medium',
	`status` enum('new','reviewed','in_progress','implemented','wont_do') DEFAULT 'new',
	`adminNotes` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`pageUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	CONSTRAINT `community_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feature_request_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`featureRequestId` int NOT NULL,
	`email` varchar(320),
	`userId` int,
	`voteType` enum('upvote','downvote') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feature_request_votes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feature_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(64),
	`upvotes` int NOT NULL DEFAULT 0,
	`downvotes` int NOT NULL DEFAULT 0,
	`status` enum('submitted','under_review','planned','in_progress','completed','declined') DEFAULT 'submitted',
	`submittedByEmail` varchar(320),
	`submittedByUserId` int,
	`adminResponse` text,
	`estimatedRelease` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feature_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320),
	`userId` int,
	`votedFor` enum('site_a','site_b') NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`referralSource` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `site_votes_id` PRIMARY KEY(`id`)
);
