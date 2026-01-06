CREATE TABLE `customer_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`waitlistId` int,
	`eventType` varchar(64) NOT NULL,
	`eventName` varchar(255) NOT NULL,
	`eventData` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`pageUrl` text,
	`referrer` text,
	`sessionId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customer_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`milestoneName` varchar(255) NOT NULL,
	`milestoneType` enum('signup','revenue','user','feature','custom') NOT NULL,
	`targetValue` int NOT NULL,
	`currentValue` int NOT NULL DEFAULT 0,
	`isAchieved` boolean NOT NULL DEFAULT false,
	`achievedAt` timestamp,
	`celebrationMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `onboarding_steps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stepName` varchar(64) NOT NULL,
	`stepOrder` int NOT NULL,
	`onboardingStatus` enum('pending','in_progress','completed','skipped') NOT NULL DEFAULT 'pending',
	`completedAt` timestamp,
	`aiAssisted` boolean NOT NULL DEFAULT false,
	`aiResponse` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `onboarding_steps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`partnerRole` enum('founder','partner','investor','advisor') NOT NULL DEFAULT 'partner',
	`accessLevel` enum('view_only','standard','full','admin') NOT NULL DEFAULT 'view_only',
	`accessCode` varchar(64) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastAccessAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_access_id` PRIMARY KEY(`id`),
	CONSTRAINT `partner_access_email_unique` UNIQUE(`email`),
	CONSTRAINT `partner_access_accessCode_unique` UNIQUE(`accessCode`)
);
--> statement-breakpoint
CREATE TABLE `revenue_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`revenueEventType` enum('subscription_start','subscription_renewal','subscription_cancel','one_time_purchase','refund','upgrade','downgrade') NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`subscriptionTier` varchar(64),
	`stripePaymentId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `revenue_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `signup_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`signupNumber` int NOT NULL,
	`userId` int,
	`waitlistId` int,
	`fullName` varchar(255),
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`ipAddress` varchar(45),
	`userAgent` text,
	`browser` varchar(64),
	`device` varchar(64),
	`os` varchar(64),
	`country` varchar(64),
	`city` varchar(128),
	`region` varchar(128),
	`timezone` varchar(64),
	`referralSource` varchar(255),
	`utmSource` varchar(128),
	`utmMedium` varchar(128),
	`utmCampaign` varchar(128),
	`role` varchar(64),
	`sport` varchar(64),
	`signupType` enum('waitlist','vip','direct','referral') NOT NULL DEFAULT 'waitlist',
	`isConverted` boolean NOT NULL DEFAULT false,
	`convertedAt` timestamp,
	`isPaying` boolean NOT NULL DEFAULT false,
	`firstPaymentAt` timestamp,
	`lifetimeValue` decimal(12,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `signup_analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`platform` enum('instagram','twitter','tiktok','youtube','facebook','linkedin','snapchat','threads') NOT NULL,
	`username` varchar(255),
	`profileUrl` text,
	`followersCount` int DEFAULT 0,
	`followingCount` int DEFAULT 0,
	`postsCount` int DEFAULT 0,
	`engagementRate` decimal(5,2),
	`isVerified` boolean NOT NULL DEFAULT false,
	`accessToken` text,
	`refreshToken` text,
	`tokenExpiresAt` timestamp,
	`lastSyncedAt` timestamp,
	`connectedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_connections_id` PRIMARY KEY(`id`)
);
