#!/bin/bash
for  i in `aws ecs list-tasks --cluster owh-prod --service owh-prod-frontend-service --region us-east-1|grep arn|tr -d ","|tr -d '"'|awk -F/ '{print $2}'`
do 
aws ecs stop-task --task $i --cluster owh-prod --region us-east-1
done
