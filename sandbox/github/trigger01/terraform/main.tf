terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}


provider "aws" {
  region = "eu-central-1"
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../dist"
  output_path = "${path.module}/../build/lambda.zip"
}

data "aws_iam_policy_document" "lambda" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda" {
  name               = "iam_for_trigger_github_action"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

data "aws_iam_policy" "lambda_basic_execution_policy" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_flow_log_cloudwatch" {
  role       = aws_iam_role.lambda.name
  policy_arn = data.aws_iam_policy.lambda_basic_execution_policy.arn
}

resource "aws_lambda_function" "trigger_github_action" {
  filename      = data.archive_file.lambda.output_path
  function_name = "trigger_github_action"
  role          = aws_iam_role.lambda.arn
  handler       = "lambda.lambdaHandler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs18.x"

  environment {
    variables = {
      GITHUB_APP_ID = var.github_app_id
      GITHUB_APP_PRIVATE_KEY = var.github_app_private_key
      GITHUB_APP_INSTALLATION_ID = var.github_app_installation_id
      GITHUB_OWNER = var.github_owner
      GITHUB_REPO = var.github_repo
      GITHUB_EVENT_TYPE = var.github_event_type
    }
  }
}

resource "aws_lambda_function_url" "lambda" {
  function_name      = aws_lambda_function.trigger_github_action.function_name
  authorization_type = "NONE"
}

output "function_url" {
  value = aws_lambda_function_url.lambda.function_url
}