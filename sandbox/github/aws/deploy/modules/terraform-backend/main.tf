terraform {
  backend "s3" {
    bucket = "main-organization-terraform-backend-bucket"
    key    = "backends/maprohu-public-github-aws-deploy"
    region = "eu-central-1"
  }
}

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

resource "aws_s3_bucket" "backend" {
  bucket = "maprohu-public-github-aws-deploy-terraform-backend-bucket"
  force_destroy = true
}