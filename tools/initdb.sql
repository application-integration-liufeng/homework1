SET NAMES utf8;

-- DROP TABLE IF EXISTS `user`;
-- CREATE TABLE `user` (
--   `uid` int(32) NOT NULL AUTO_INCREMENT,
--   `email` varchar(100) NOT NULL,
--   `phone` int(32) NOT NULL DEFAULT 0,
--   `nickname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `deleted` tinyint(1) NOT NULL DEFAULT 0,
--   PRIMARY KEY (`uid`) USING BTREE,
--   UNIQUE KEY (`email`) USING BTREE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
