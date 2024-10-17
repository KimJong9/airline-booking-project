CREATE EXTERNAL TABLE IF NOT EXISTS vpc_flow_logs_parquet (
  `action` string, 
  `az_id` string, 
  `bytes` bigint, 
  `dstaddr` string, 
  `dstport` int, 
  `end` bigint, 
  `flow_direction` string, 
  `instance_id` string, 
  `interface_id` string, 
  `log_status` string, 
  `packets` bigint, 
  `pkt_dst_aws_service` string, 
  `pkt_dstaddr` string, 
  `pkt_src_aws_service` string, 
  `pkt_srcaddr` string, 
  `protocol` int, 
  `region` string, 
  `srcaddr` string, 
  `srcport` int, 
  `start` bigint, 
  `sublocation_id` string, 
  `sublocation_type` string, 
  `subnet_id` string, 
  `tcp_flags` int, 
  `traffic_path` int, 
  `type` string, 
  `version` int, 
  `vpc_id` string)
PARTITIONED BY ( 
  `aws-account-id` string, 
  `aws-service` string, 
  `aws-region` string, 
  `year` string, 
  `month` string, 
  `day` string, 
  `hour` string)
ROW FORMAT SERDE 
  'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe' 
STORED AS INPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat' 
OUTPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat'
LOCATION
  's3://jaws-vpc-logs/AWSLogs/'
