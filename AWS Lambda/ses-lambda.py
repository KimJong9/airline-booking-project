import json
import boto3
import os
from botocore.exceptions import ClientError

# SES 클라이언트 설정
ses_client = boto3.client('ses', region_name='ap-northeast-2')

# Lambda 환경 변수에서 송신자 이메일 읽기
SENDER_EMAIL = os.environ['SENDER_EMAIL']

def send_email(customer_email, customer_name, flight_code, booking_id, booking_date):
    subject = f"예약 확인: {flight_code} 비행편"
    body_text = (f"{customer_name}님,\n\n"
                 f"예약이 확인되었습니다.\n\n"
                 f"예약 ID: {booking_id}\n"
                 f"비행편 코드: {flight_code}\n"
                 f"예약 날짜: {booking_date}\n\n"
                 "안전한 여행 되세요!\n")

    try:
        response = ses_client.send_email(
            Source=SENDER_EMAIL,
            Destination={
                'ToAddresses': [customer_email],
            },
            Message={
                'Subject': {
                    'Data': subject,
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Text': {
                        'Data': body_text,
                        'Charset': 'UTF-8'
                    }
                }
            }
        )
        return response
    except ClientError as e:
        print(f"Error sending email: {e}")
        return None

def lambda_handler(event, context):
    # 받은 이벤트 로그 출력
    print("Received event:", json.dumps(event))

    # 이벤트 데이터에서 필요한 정보 추출
    customer_email = event['customer_email']
    customer_name = event['customer_name']
    flight_code = event['flight_code']
    booking_id = event['booking_id']
    booking_date = event['booking_date']
    
    # SES를 통해 이메일 전송
    response = send_email(customer_email, customer_name, flight_code, booking_id, booking_date)
    
    if response:
        print(f"Email sent successfully to {customer_email}")
    else:
        print(f"Failed to send email to {customer_email}")

    return {
        'statusCode': 200,
        'body': json.dumps('Lambda executed successfully')
    }
