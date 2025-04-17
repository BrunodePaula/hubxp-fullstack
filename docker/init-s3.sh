#!/bin/bash
echo "⏳ Criando bucket S3 no LocalStack..."
awslocal s3 mb s3://nestjs-products
