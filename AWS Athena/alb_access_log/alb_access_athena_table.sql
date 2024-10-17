CREATE EXTERNAL TABLE IF NOT EXISTS alb_logs_partition_projection (
   type string,
   TIME string,
   elb string,
   client_ip string,
   client_port INT,
   target_ip string,
   target_port INT,
   request_processing_time DOUBLE,
   target_processing_time DOUBLE,
   response_processing_time DOUBLE,
   elb_status_code string,
   target_status_code string,
   received_bytes BIGINT,
   sent_bytes BIGINT,
   request_verb string,
   request_url string,
   request_proto string,
   user_agent string,
   ssl_cipher string,
   ssl_protocol string,
   target_group_arn string,
   trace_id string,
   domain_name string,
   chosen_cert_arn string,
   matched_rule_priority string,
   request_creation_time string,
   actions_executed string,
   redirect_url string,
   lambda_error_reason string,
   target_port_list string,
   target_status_code_list string,
   classification string,
   classification_reason string
) 
PARTITIONED BY(YEAR INT, MONTH INT, DAY INT) 
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.RegexSerDe'
WITH SERDEPROPERTIES (
   'serialization.format' = '1',
   'input.regex' = '([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*):([0-9]*) ([^ ]*)[:-]([0-9]*) ([-.0-9]*) ([-.0-9]*) ([-.0-9]*) (|[-0-9]*) (-|[-0-9]*) ([-0-9]*) ([-0-9]*) \"([^ ]*) (.*) (- |[^ ]*)\" \"([^\"]*)\" ([A-Z0-9-_]+) ([A-Za-z0-9.-]*) ([^ ]*) \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\" ([-.0-9]*) ([^ ]*) \"([^\"]*)\" \"([^\"]*)\" \"([^ ]*)\" \"([^\s]+?)\" \"([^\s]+)\" \"([^ ]*)\" \"([^ ]*)\" ?([^ ]*)?( .*)?'
) 
LOCATION 's3://jaws-alb-access-logs/AWSLogs/241533155281/elasticloadbalancing/ap-northeast-2/'
TBLPROPERTIES (
   'projection.enabled' = 'true',
   'projection.day.digits' = '2',
   'projection.day.range' = '01,31',
   'projection.day.type' = 'integer', 
   'projection.month.digits' = '2', 
   'projection.month.range' = '01,12', 
   'projection.month.type' = 'integer', 
   'projection.year.digits' = '4', 
   'projection.year.range' = '2023,2025',  
   'projection.year.type' = 'integer', 
   "storage.location.template" = "s3://jaws-alb-access-logs/AWSLogs/241533155281/elasticloadbalancing/ap-northeast-2/${year}/${month}/${day}"
)