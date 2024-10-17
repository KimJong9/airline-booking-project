# 어떤 서버가 가장 많은 수의 HTTPS 요청을 수신하는 쿼리
WITH date_filtered AS (
  SELECT *
  FROM jaws_vpc_flow_logs.vpc_flow_logs_parquet
  WHERE
    (CAST(CONCAT(year, '-', month, '-', day) AS DATE) >= current_date - interval '1' day)
    AND dstport = 443
)
SELECT
  SUM(packets) AS packetcount,
  dstaddr
FROM date_filtered
GROUP BY dstaddr
ORDER BY packetcount DESC
LIMIT 10;


# 특정 날짜 시간 트래픽 쿼리
SELECT *
FROM jaws_vpc_flow_logs.vpc_flow_logs_parquet
WHERE 
  year = '2024'
  AND month = '09'
  AND day = '24'
  AND hour = '07';
  
# 거절된 모든 TCP 연결을 나열
WITH date_combined AS (
  SELECT
    CAST(CONCAT(year, '-', month, '-', day) AS DATE) AS date,
    interface_id,
    srcaddr,
    action,
    protocol
  FROM jaws_vpc_flow_logs.vpc_flow_logs_parquet
  WHERE action = 'REJECT'
    AND protocol = 6
)
SELECT
  EXTRACT(DOW FROM date) AS day,  -- day_of_week equivalent
  date,
  interface_id,
  srcaddr,
  action,
  protocol
FROM date_combined
LIMIT 100;
