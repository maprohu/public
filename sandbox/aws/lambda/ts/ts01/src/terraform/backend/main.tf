terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "main-organization-terraform-backend-bucket"
    key    = "backends/labmda-sandbox"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = "eu-central-1"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "lambda-sandbox-terraform-backend-bucket"
  force_destroy = true
}
