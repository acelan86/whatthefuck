#!/bin/sh
# 获取20分钟前错误的状态码的行
# 删除1周以前的数据
MONITOR_ROOT='/Users/xiaobinlan/github/sinaads/tool/monitor/';
MYSQL_DBNAME='monitor';
MYSQL_TABLENAME='monitor';
DBCONF_PATH=${MONITOR_ROOT}'conf/db.cnf';
MONITOR_DATA=${MONITOR_ROOT}'data/monitor_data.txt'
DATA_RANGE=20;


MYSQL_CLINET_CMD='mysql';
PHP_CMD='php';


#delete from monitor where insert_time < DATE_SUB(NOW(), INTERVAL 1 WEEK);
##where http_code not in (200, 0, 204, 302) 
${MYSQL_CLINET_CMD} --defaults-extra-file=${DBCONF_PATH} -D${MYSQL_DBNAME} --default-character-set=gbk -N -e '
select * from '${MYSQL_TABLENAME}' where http_code not in (200, 0, 204, 302) and insert_time > DATE_SUB(NOW(), INTERVAL '${DATA_RANGE}' MINUTE);
' > ${MONITOR_DATA};

${PHP_CMD} ${MONITOR_ROOT}sendmail.php;