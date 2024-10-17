# 가장 최근의 요청 100건
SELECT *
FROM "jaws_alb_access_log"."alb_logs_partition_projection"
ORDER by time DESC
limit 100;

# 특정 기간내 까지 5초이상 수행된 URL과 수행시간
SELECT target_processing_time, request_url
from "jaws_alb_access_log"."alb_logs_partition_projection"
WHERE parse_datetime(time,'yyyy-MM-dd''T''HH:mm:ss.SSSSSS''Z') >= parse_datetime('2024-09-23-00:00:00','yyyy-MM-dd-HH:mm:ss')
AND parse_datetime(time,'yyyy-MM-dd''T''HH:mm:ss.SSSSSS''Z') < parse_datetime('2024-09-25-00:00:00','yyyy-MM-dd-HH:mm:ss')
AND (target_processing_time >= 5.0)

# 2024.09.24 하루 동안 alb.heroic.today으로 호출된 건수
SELECT count(1)
FROM "jaws_alb_access_log"."alb_logs_partition_projection"
WHERE request_url LIKE '%alb.heroic.today%'
AND parse_datetime(time,'yyyy-MM-dd''T''HH:mm:ss.SSSSSS''Z') >= parse_datetime('2024-09-24-00:00:00','yyyy-MM-dd-HH:mm:ss')
AND parse_datetime(time,'yyyy-MM-dd''T''HH:mm:ss.SSSSSS''Z') < parse_datetime('2024-09-25-00:00:00','yyyy-MM-dd-HH:mm:ss');