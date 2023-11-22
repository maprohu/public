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
      GITHUB_APP_ID              = var.github_app_id
      GITHUB_APP_PRIVATE_KEY     = var.github_app_private_key
      GITHUB_APP_INSTALLATION_ID = var.github_app_installation_id
      GITHUB_OWNER               = var.github_owner
      GITHUB_REPO                = var.github_repo
      GITHUB_EVENT_TYPE          = var.github_event_type
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

resource "null_resource" "yarn_install" {
  provisioner "local-exec" {
    command = "yarn --cwd ${path.module}/../ui install"
  }
  triggers = {
    always_run = "${timestamp()}"
  }
}
resource "null_resource" "yarn_build" {
  depends_on = [null_resource.yarn_install]
  provisioner "local-exec" {
    command = "yarn --cwd ${path.module}/../../ui build"
    environment = {
      "PUBLIC_API_URL" = aws_lambda_function_url.lambda.function_url
    }
  }
  triggers = {
    always_run = "${timestamp()}"
  }
}
data "archive_file" "ui" {
  type        = "zip"
  source_dir  = "${path.module}/../../ui/dist"
  output_path = "${path.module}/../build/ui.zip"
}
resource "aws_s3_bucket" "ui" {
  bucket        = "github-trigger-ui"
  force_destroy = true
}
resource "aws_s3_bucket_website_configuration" "ui" {
  bucket = aws_s3_bucket.ui.id

  index_document {
    suffix = "index.html"
  }
}
output "ui_url" {
  value = "http://${aws_s3_bucket_website_configuration.ui.website_endpoint}"
}
resource "aws_s3_bucket_ownership_controls" "ui" {
  bucket = aws_s3_bucket.ui.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "ui" {
  bucket = aws_s3_bucket.ui.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "ui" {
  depends_on = [
    aws_s3_bucket_ownership_controls.ui,
    aws_s3_bucket_public_access_block.ui,
  ]

  bucket = aws_s3_bucket.ui.id
  acl    = "private"
}

data "aws_iam_policy_document" "ui" {
  statement {
    sid    = "AllowPublicRead"
    effect = "Allow"
    resources = [
      "${aws_s3_bucket.ui.arn}/*",
    ]
    actions = ["S3:GetObject"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}
resource "aws_s3_bucket_policy" "bucket-policy" {
  bucket = aws_s3_bucket.ui.id
  policy = data.aws_iam_policy_document.ui.json
}

resource "null_resource" "s3_sync" {
  depends_on = [aws_s3_bucket.ui, null_resource.yarn_build]
  provisioner "local-exec" {
    command = "aws s3 sync ${path.module}/../../ui/dist s3://${aws_s3_bucket.ui.bucket} --delete"
    environment = {
      "PUBLIC_API_URL" = aws_lambda_function_url.lambda.function_url
    }
  }
  triggers = {
    always_run = data.archive_file.lambda.output_sha256
  }

}
