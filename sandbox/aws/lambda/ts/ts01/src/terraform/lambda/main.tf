terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "lambda-sandbox-terraform-backend-bucket"
    key = "tfstate"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = "eu-central-1"
}

resource "aws_iam_role" "ts_lambda_role" {
  name               = "ts_lambda-role"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_lambda_function" "ts_lambda" {
  filename      = "src/lambda_function_${var.lambdasVersion}.zip"
  function_name = "ts_lambda"
  role          = aws_iam_role.ts_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  memory_size   = 1024
  timeout       = 300
}

variable "lambdasVersion" {
  type        = string
  description = "version of the lambdas zip on S3"
}