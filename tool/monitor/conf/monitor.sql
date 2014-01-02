SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `monitor`
-- ----------------------------
DROP TABLE IF EXISTS `monitor`;
CREATE TABLE `monitor` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `pdps` varchar(20) NOT NULL DEFAULT '' COMMENT '广告位',
  `url` varchar(2000) NOT NULL DEFAULT '' COMMENT 'URL',
  `http_code` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'HTTP状态码',
  `description` varchar(1024) NOT NULL DEFAULT '' COMMENT '描述',
  `http_result` text NOT NULL COMMENT 'HTTP返回结果',
  `insert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '写入时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;