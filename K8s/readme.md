#### 이지현의 EKS 설정에 대한 모든 것 ####

0.EKS 클러스터에 사용자 허용(팀 계정).txt
# 클러스터 > 액세스 > API 및 config 맵 누르고 저장
# IAM 액세스 항목 구성 > AmazonEKSClusterAdminPolicy 선택 > 정책추가 > 	
AmazonEKSEditPolicy 정책 추가 



1.EKS 관리형 노드 설치
# 관리형 노드에 설치 구성 절차
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# for ARM systems, set ARCH to: `arm64`, `armv6` or `armv7`
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH
curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"
# (Optional) Verify checksum
curl -sL "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check
tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz
sudo mv /tmp/eksctl /usr/local/bin

curl -O https://s3.us-west-2.amazonaws.com/amazon-eks/1.30.2/2024-07-12/bin/linux/amd64/kubectl
chmod +x ./kubectl
mkdir -p $HOME/bin && cp ./kubectl $HOME/bin/kubectl && export PATH=$HOME/bin:$PATH
echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
kubectl version --client

aws configure

aws eks update-kubeconfig --region ap-northeast-2 --name my-cluster --alias my-cluster



2.alb-controller 설치
# 정책 역할에서 분리하기
aws iam detach-role-policy --role-name AmazonEKSLoadBalancerControllerRole --policy-arn arn:aws:iam::730335464445:policy/AWSLoadBalancerControllerIAMPolicy

# 기존 정책 지우기
aws iam delete-policy --policy-arn arn:aws:iam::730335464445:policy/AWSLoadBalancerControllerIAMPolicy

# IAM OIDC 자격 증명 공급자를 생성
eksctl utils associate-iam-oidc-provider --cluster my-cluster --approve

# 정책 다시 넣기
  aws iam create-policy   --policy-name AWSLoadBalancerControllerIAMPolicy   --policy-document '{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "acm:DescribeCertificate",
            "acm:ListCertificates",
            "acm:GetCertificate",
            "ec2:AuthorizeSecurityGroupIngress",
            "ec2:CreateSecurityGroup",
            "ec2:CreateTags",
            "ec2:DeleteTags",
            "ec2:DeleteSecurityGroup",
            "ec2:DescribeInstances",
            "ec2:DescribeSecurityGroups",
            "ec2:DescribeSubnets",
            "ec2:DescribeVpcs",
            "ec2:DescribeTags",
            "elasticloadbalancing:AddListenerCertificates",
            "elasticloadbalancing:AddTags",
            "elasticloadbalancing:CreateListener",
            "elasticloadbalancing:CreateLoadBalancer",
            "elasticloadbalancing:CreateRule",
            "elasticloadbalancing:CreateTargetGroup",
            "elasticloadbalancing:DeleteListener",
            "elasticloadbalancing:DeleteLoadBalancer",
            "elasticloadbalancing:DeleteRule",
            "elasticloadbalancing:DeleteTargetGroup",
            "elasticloadbalancing:DeregisterTargets",
            "elasticloadbalancing:DescribeListeners",
            "elasticloadbalancing:DescribeLoadBalancers",
            "elasticloadbalancing:DescribeLoadBalancerAttributes",
            "elasticloadbalancing:DescribeRules",
            "elasticloadbalancing:DescribeSSLPolicies",
            "elasticloadbalancing:DescribeTags",
            "elasticloadbalancing:DescribeTargetGroups",
            "elasticloadbalancing:DescribeTargetHealth",
            "elasticloadbalancing:ModifyListener",
            "elasticloadbalancing:ModifyLoadBalancerAttributes",
            "elasticloadbalancing:ModifyRule",
            "elasticloadbalancing:ModifyTargetGroup",
            "elasticloadbalancing:ModifyTargetGroupAttributes",
            "elasticloadbalancing:RegisterTargets",
            "elasticloadbalancing:RemoveListenerCertificates",
            "elasticloadbalancing:RemoveTags",
            "elasticloadbalancing:SetIpAddressType",
            "elasticloadbalancing:SetSecurityGroups",
            "elasticloadbalancing:SetSubnets",
            "elasticloadbalancing:SetWebACL",
            "iam:CreateServiceLinkedRole",
            "iam:GetServerCertificate",
            "iam:ListServerCertificates",
            "cognito-idp:DescribeUserPoolClient",
            "waf-regional:GetWebACLForResource",
            "waf-regional:AssociateWebACL",
            "waf-regional:DisassociateWebACL",
            "shield:GetSubscriptionState",
            "tag:GetResources",
            "tag:TagResources",
            "waf:GetWebACL"
          ],
          "Resource": "*"
        }
      ]
    }'

  # 역할 만들기
  aws iam create-role   --role-name AmazonEKSLoadBalancerControllerRole   --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Federated": "arn:aws:iam::730335464445:oidc-provider/oidc.eks.<YOUR_REGION>.amazonaws.com/id/my-cluster"
        },
        "Action": "sts:AssumeRoleWithWebIdentity",
        "Condition": {
          "StringEquals": {
            "oidc.eks.<YOUR_REGION>.amazonaws.com/id/my-cluster:sub": "system:serviceaccount:kube-system:aws-load-balancer-controller"
          }
        }
      }
    ]
  }'

* 꼭 해주기
# 정책 role에 붙이기 
aws iam attach-role-policy   --role-name AmazonEKSLoadBalancerControllerRole   --policy-arn arn:aws:iam::730335464445:policy/AWSLoadBalancerControllerIAMPolicy

# 헬름 설치
sudo yum update -y
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
helm version

# eks-charts 차트 Helm 리포지토리를 추가
helm repo add eks https://aws.github.io/eks-charts

# 최신 차트가 적용되도록 로컬 리포지토리를 업데이트합니다.
  helm repo update eks

* vpc 수정 
# AWS Load Balancer Controller를 설치
  helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=my-cluster --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller --set region=ap-northeast-2 --set vpcId=vpc-08a46083992b0687e

# crds 설치
wget https://raw.githubusercontent.com/aws/eks-charts/master/stable/aws-load-balancer-controller/crds/crds.yaml 
kubectl apply -f crds.yaml

# 컨트롤러 restart
  kubectl rollout restart deployment aws-load-balancer-controller -n kube-system

# 서비스 어카운트 생성
kubectl create serviceaccount aws-load-balancer-controller -n kube-system
kubectl create clusterrolebinding aws-load-balancer-controller-rolebinding --clusterrole=cluster-admin --serviceaccount=kube-system:aws-load-balancer-controller
kubectl rollout restart deployment aws-load-balancer-controller -n kube-system

# 서비스 어카운트 수정
kubectl edit serviceAccount aws-load-balancer-controller -n kube-system

######################### > 산이 형이 위에 과정 완료

# 서비스 어카운트에 IAM 역할 추가하기
kubectl annotate serviceaccount -n kube-system aws-load-balancer-controller \
  eks.amazonaws.com/role-arn=arn:aws:iam::730335464445:role/AmazonEKSLoadBalancerControllerRole

# 확인
kubectl get deployment -n kube-system aws-load-balancer-controller

# 정책 추가

eksctl utils associate-iam-oidc-provider --cluster my-cluster --approve > 중복


* 달라지는 클러스터 id 때문에 업데이트 해줘야 함.
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<YOUR_ACCOUNT_ID>:oidc-provider/oidc.eks.<REGION>.amazonaws.com/id/<CLUSTER_ID>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.eks.<REGION>.amazonaws.com/id/<CLUSTER_ID>:sub": "system:serviceaccount:kube-system:aws-load-balancer-controller"
        }
      }
    }
  ]
}

# 정책 sts:AssumeRoleWithWebIdentity 확인
aws iam list-attached-role-policies --role-name AmazonEKSLoadBalancerControllerRole

aws iam attach-role-policy \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --policy-arn arn:aws:iam::aws:policy/AWSLoadBalancerControllerIAMPolicy


aws iam update-assume-role-policy \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --policy-document file://trust-policy.json


########################프로젝트 클러스터에 적용
# 정책 생성
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateSecurityGroup",
        "ec2:DeleteSecurityGroup",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:AuthorizeSecurityGroupEgress",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSecurityGroupRules",
        "ec2:CreateSecurityGroup"
      ],
      "Resource": "*"
    }
  ]
}

aws iam update-assume-role-policy \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --policy-document file://ec2-auth-policy.json


# vpc 및 퍼블릭에 태그 붙이기
- kubernetes.io/role/elb = 1


# 워커 노드 보안 그룹에 대상검사 포트 뚫기 
ex) sg-0ab7d497602879e8f - eks-cluster-sg-jaws_prod_cluster-544705666



3.기존 alb 연동 + Route53 연동


# 먼저 인증서 발급:  acm 에서 도메인 구입 후 도메인 명으로 하나 생성. 


# 먼저 ingress 파일에 해당 내용들 적용 (마리오는 설정 예시)

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zigiingress
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    # alb.ingress.kubernetes.io/load-balancer-arn: arn:aws:elasticloadbalancing:ap-northeast-2:730335464445:loadbalancer/app/my-cluster-alb/15af0753a5725c69  # 바꾸기
    alb.ingress.kubernetes.io/backend-protocol: HTTP  # 백엔드 프로토콜 설정
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:ap-northeast-2:730335464445:certificate/8d91083d-7f51-4b6f-a90f-7a1eb36d898b  # ACM에서 발급받은 인증서 ARN
    alb.ingress.kubernetes.io/healthcheck-path: /health  # 헬스 체크 경로
    alb.ingress.kubernetes.io/healthcheck-interval-seconds: '15'  # 헬스 체크 주기 (초 단위)
    alb.ingress.kubernetes.io/ssl-policy: ELBSecurityPolicy-2016-08
    alb.ingress.kubernetes.io/actions.ssl-redirect: |
         {"Type":"redirect","RedirectConfig":{"Protocol":"HTTPS","Port":"443","StatusCode":"HTTP_301"}}
spec:
  ingressClassName: alb  # ingressClassName으로 변경
  rules:
    - http:
        paths:
          - pathType: Prefix
            path: /
            backend:
              service:
                name: mario
                port:
                  number: 80


# 생성된 alb 경로와 동일하게 기존 alb에 경로 이식

# kubectl edit ingress 로 ingress 파일 부분에서 arn을 기존 arn으로 수정. + 새로생성 로드벨런서의 대상 그룹도 이식

# 새로 생성된 alb 삭제 일정 시간 후에 바뀜. 

# 잘 작동되는지 확인. > 기존 로드벨런서 dns 주소로 확인

# route 53에서 도메인 연동



4.아르고 CD 배포

# 아르고 cd 작동 방법

# 아르고 cd 를 위한 네임 스페이스 생성 + 아르고 cd 설치를 위한 리소스 생성 
  kubectl create namespace argocd
  kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 아르고 cd 관련 리스소들 잘 작동 되는 지 확인
  kubectl get pods -n argocd

# 서비스 타입(진입점)을 로드 벨런서 타입으로 전환
  kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

# 아르고 cd 비밀번호 확인 
  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

# 해당 주소로 브라우저 접속 
  kubectl get svc argocd-server -n argocd

# 브라우저 최초 접속
  ID: admin / PW: 조회한 비밀번호

# # 로그인
   argocd login <EXERNAL-IP>
   # 비밀번호 변경
   argocd account update-password

# 컨테이너 생성후에 오류 발생하여 업데이트
  kubectl set image deployment/argocd-notifications-controller -n argocd argocd-notifications-controller=quay.io/argoproj/argocd:v2.12.0



5.ECR에 이미지 넣는 법(예시)

aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com

docker tag sampleapp-frontend:latest 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com/sampleapp-frontend:latest

docker push 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com/sampleapp-frontend:latest

docker push 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com/sampleapp-frontend:latest
docker push 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com/myapp:latest


docker tag sampleapp-frontend:latest 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com/sampleapp:frontend
docker tag sampleapp-backend:latest 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com/sampleapp:backend
docker tag postgres:latest 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com/sampleapp:postgres


docker push 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com/sampleapp:frontend
docker push 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com/sampleapp:backend
docker push 730335464445.dkr.ecr.ap-northeast-2.amazonaws.com/sampleapp:postgres


        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
              "Action": "ecr:GetAuthorizationToken",
                    "Action": "logs:*",

# 정책 서비스 계정에 달기
AmazonEC2ContainerRegistryReadOnly



6.그라파나 설치하는 법
################# 프로메테우스 설치
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring
helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring
kubectl get all -n monitoring

################# 그라파나 설치
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install grafana grafana/grafana --namespace monitoring --set adminPassword='qwer1234'

################# 연동
kubectl edit svc grafana -n monitoring

spec:
  type: LoadBalancer

kubectl get svc -n monitoring grafana


###### 접속하는 법
이후 로드벨런서 dns 주소:80 로 브라우저로 접속

kubectl get svc -n monitoring

데이터 소스 등록 > http://prometheus-kube-prometheus-prometheus.monitoring.svc.cluster.local:9090


# 그라파나 대시보드에 그래픽 구성을 위한 쿼리 문
- Running 상태의 컨테이너 : kube_pod_container_status_running{namespace="<namespace>"}
- Waiting 상태의 컨테이너 : kube_pod_container_status_waiting{namespace="<namespace>"}
- Terminated 상태의 컨테이너 : kube_pod_container_status_terminated{namespace="<namespace>"}
- 비정상적으로 재시작된 컨테이너 : kube_pod_container_status_restarts_total{namespace="<namespace>"}
- 컨테이너 CPU 사용량 확인 : rate(container_cpu_usage_seconds_total{namespace="<namespace>", pod=~".*"}[5m])
- 컨테이너 메모리 사용량 확인 : container_memory_usage_bytes{namespace="<namespace>", pod=~".*"}
- 컨테이너 네트워크 트래픽 확인
  -- 컨테이너에서 전송된 및 수신된 네트워크 트래픽을 확인하는 쿼리입니다.
     -- 네트워크 수신 트래픽: rate(container_network_receive_bytes_total{namespace="<namespace>", pod=~".*"}[5m])
     -- 네트워크 송신 트래픽: rate(container_network_transmit_bytes_total{namespace="<namespace>", pod=~".*"}[5m])
- 컨테이너의 현재 상태 확인 (Summary)
  -- Running 상태 컨테이너 수: count(kube_pod_container_status_running{namespace="<namespace>"}) by (pod, container)
  -- Waiting 상태 컨테이너 수: count(kube_pod_container_status_waiting{namespace="<namespace>"}) by (pod, container)
  -- Terminated 상태 컨테이너 수: count(kube_pod_container_status_terminated{namespace="<namespace>"}) by (pod, container)
- 특정 컨테이너의 상태 확인
  -- 특정 컨테이너의 상태 확인: kube_pod_container_status_running{namespace="default", pod="nginx-deployment-5d5b9b5d6f-abcde"}
- CPU 사용률 (%) 계산 쿼리: 
  -- 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
- CPU 사용량 (모든 모드 포함): sum by (instance) (rate(node_cpu_seconds_total[5m]))
- 노드 CPU 사용률 계산 (전체 용량 대비): 100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])))

---

# 밑에 계기판 설정
1. CPU
sum by (instance) (irate(node_cpu_seconds_total{mode!~"guest.*|idle|iowait", node="$instance"}[5m]))
2. memory
(node_memory_MemTotal_bytes{node="$instance"}-node_memory_MemAvailable_bytes{node="$instance"})/node_memory_MemTotal_bytes{node="$instance"}
3. disk
sum(node_filesystem_size_bytes{node="$instance"} - node_filesystem_avail_bytes{node="$instance"}) by (instance) / sum(node_filesystem_size_bytes{node="$instance"}) by (instance)





7.HPA 설정하는 법(예시)
# HPA 컨테이너 증가 공식
CPU 사용량 비율 (%) = (현재 사용된 CPU / 요청된 CPU) * 100

1. hpa 설정 배포
---
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-deployment
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 50


2. 수정된 마리오 코드 > 예시
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mario
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mario
  template:
    metadata:
      labels:
        app: mario
    spec:
      containers:
      - name: mario-container
        image: pengbai/docker-supermario
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: "200m"    # 최소 200m CPU 요청 (0.2 vCPU)
            memory: "256Mi"  # 최소 256Mi 메모리 요청
          limits:
            cpu: "500m"    # 최대 500m CPU 제한 (0.5 vCPU)
            memory: "512Mi"  # 최대 512Mi 메모리 제한
---
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: mario-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mario
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 50
---
apiVersion: v1
kind: Service
metadata:
  name: mario
spec:
  selector:
    app: mario
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP



(!) 상태 확인
kubectl get hpa

(!) 부하 테스트 
kubectl run -i --tty load-generator --image=busybox /bin/sh
# 아래 명령으로 CPU 부하를 가합니다.
while true; do wget -q -O- http://booking-service:5002; done

kubectl get hpa --watch



8.그라파나에서 클라우드 워치 설정하는 법
# Amazon CloudWatch

*구성 방법:

1. 그라파나 접속해서 data soruce 로 추가.
2. 707로 rds 대시보드 생성

eksctl utils update-cluster-logging --cluster <cluster-name> --enable-types all --region <region>

kubectl apply -f https://raw.githubusercontent.com/aws/aws-for-fluent-bit/mainline/deployment/aws-observability/fluent-bit-cloudwatch.yaml

특징: 애플리케이션 로그, 시스템 로그, Kubernetes 이벤트 로그 등을 중앙에서 관리.



9.PodDisruptionBudget


(!)주의(minAvailable 값이 replicas 값보다 크면 안 됩니다.)

#테스트 시나리오
*시나리오 1: Pod 수동 삭제
이제 3개의 Pod를 수동으로 삭제해 봅니다: kubectl delete pod <pod_name_1> <pod_name_2> <pod_name_3>
Pod를 삭제하면 Kubernetes는 minAvailable: 2 조건을 적용하여 최소한 2개의 Pod가 항상 남아 있어야 한다는 조건을 유지합니다. 따라서, 세 번째 Pod를 삭제하려고 하면 Kubernetes는 삭제를 거부할 수 있습니다.

*시나리오 2: 노드 드레인 (Drain) 테스트
kubectl drain <node_name> --ignore-daemonsets --force --delete-local-data



# booking-service-pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: booking-service-pdb
spec:
  minAvailable: 2  # 최소한 2개의 Pod는 항상 가용해야 함
  selector:
    matchLabels:
      app: booking-service
---
# flight-service-pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: flight-service-pdb
spec:
  minAvailable: 2  # 최소한 2개의 Pod는 항상 가용해야 함
  selector:
    matchLabels:
      app: flight-service
---
# user-service-pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: user-service-pdb
spec:
  minAvailable: 2  # 최소한 2개의 Pod는 항상 가용해야 함
  selector:
    matchLabels:
      app: user-service



10.eks 에 필요한 권한 최종
# 정책: access-grafa-rds-cloudwatch
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudwatch:DescribeAlarms",
                "cloudwatch:ListMetrics",
                "cloudwatch:GetMetricData",
                "cloudwatch:GetMetricStatistics",
                "cloudwatch:DescribeAlarmHistory",
                "cloudwatch:GetDashboard",
                "cloudwatch:DescribeDashboard",
                "cloudwatch:GetInsightRuleReport",
                "rds:DescribeDBInstances",
                "rds:ListTagsForResource",
                "rds:DescribeDBClusterSnapshots",
                "rds:DescribeDBSnapshots",
                "rds:DescribeDBClusters",
                "rds:DescribeDBInstances",
                "rds:DescribeDBLogFiles"
            ],
            "Resource": "*"
        }
    ]
}

# 정책: ALBControllerPolicy
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:DescribeTargetGroupAttributes",
                "elasticloadbalancing:DescribeTargetGroups",
                "elasticloadbalancing:DescribeListeners",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeRules",
                "elasticloadbalancing:DescribeTags",
                "iam:PassRole",
                "elasticloadbalancing:DescribeTargetHealth",
                "elasticloadbalancing:DescribeSSLPolicies"
            ],
            "Resource": "*"
        }
    ]
}

# 정책: AmazonEC2ContainerRegistryReadOnly (기존)

# 정책: AmazonEKSClusterPolicy(기존)

# 정책: AmazonEKSServicePolicy(기존)

# 정책: AWSLoadBalancerControllerIAMPolicy
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "acm:DescribeCertificate",
                "acm:ListCertificates",
                "acm:GetCertificate",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:CreateSecurityGroup",
                "ec2:CreateTags",
                "ec2:DeleteTags",
                "ec2:DeleteSecurityGroup",
                "ec2:DescribeInstances",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSubnets",
                "ec2:DescribeVpcs",
                "ec2:DescribeTags",
                "ec2:AuthorizeSecurityGroupEgress",
                "ec2:RevokeSecurityGroupEgress",
                "ec2:DescribeSecurityGroupRules",
                "elasticloadbalancing:AddListenerCertificates",
                "elasticloadbalancing:AddTags",
                "elasticloadbalancing:CreateListener",
                "elasticloadbalancing:CreateLoadBalancer",
                "elasticloadbalancing:CreateRule",
                "elasticloadbalancing:CreateTargetGroup",
                "elasticloadbalancing:DeleteListener",
                "elasticloadbalancing:DeleteLoadBalancer",
                "elasticloadbalancing:DeleteRule",
                "elasticloadbalancing:DeleteTargetGroup",
                "elasticloadbalancing:DeregisterTargets",
                "elasticloadbalancing:DescribeListeners",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeLoadBalancerAttributes",
                "elasticloadbalancing:DescribeRules",
                "elasticloadbalancing:DescribeSSLPolicies",
                "elasticloadbalancing:DescribeTags",
                "elasticloadbalancing:DescribeTargetGroups",
                "elasticloadbalancing:DescribeTargetHealth",
                "elasticloadbalancing:ModifyListener",
                "elasticloadbalancing:ModifyLoadBalancerAttributes",
                "elasticloadbalancing:ModifyRule",
                "elasticloadbalancing:ModifyTargetGroup",
                "elasticloadbalancing:ModifyTargetGroupAttributes",
                "elasticloadbalancing:RegisterTargets",
                "elasticloadbalancing:RemoveListenerCertificates",
                "elasticloadbalancing:RemoveTags",
                "elasticloadbalancing:SetIpAddressType",
                "elasticloadbalancing:SetSecurityGroups",
                "elasticloadbalancing:SetSubnets",
                "elasticloadbalancing:SetWebACL",
                "iam:CreateServiceLinkedRole",
                "iam:GetServerCertificate",
                "iam:ListServerCertificates",
                "cognito-idp:DescribeUserPoolClient",
                "waf-regional:GetWebACLForResource",
                "waf-regional:AssociateWebACL",
                "waf-regional:DisassociateWebACL",
                "shield:GetSubscriptionState",
                "tag:GetResources",
                "tag:TagResources",
                "waf:GetWebACL",
                "sts:AssumeRole"
            ],
            "Resource": "*"
        }
    ]
}

# 정책: LoadBalancerControllerPolicy
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:DescribeTargetGroupAttributes",
                "elasticloadbalancing:DescribeTargetGroups",
                "elasticloadbalancing:DescribeListeners",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeListenerCertificates"
            ],
            "Resource": "*"
        }
    ]
}

***신뢰할수 있는 엔티티
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::241533155281:oidc-provider/oidc.eks.ap-northeast-2.amazonaws.com/id/004158EBAF1DE96781A6F65119AFF55C"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "oidc.eks.ap-northeast-2.amazonaws.com/id/004158EBAF1DE96781A6F65119AFF55C:sub": "system:serviceaccount:kube-system:aws-load-balancer-controller"
                }
            }
        },
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::241533155281:oidc-provider/oidc.eks.ap-northeast-2.amazonaws.com/id/1CF3852941FFBDFA06965363A78A4F7F"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "oidc.eks.ap-northeast-2.amazonaws.com/id/1CF3852941FFBDFA06965363A78A4F7F:sub": "system:serviceaccount:kube-system:aws-load-balancer-controller"
                }
            }
        }
    ]
}

