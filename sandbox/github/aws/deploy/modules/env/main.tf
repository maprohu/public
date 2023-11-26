terraform {
  backend "s3" {
    bucket = "maprohu-public-github-aws-deploy-terraform-backend-bucket"
    key    = "modules/env"
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
  bucket = "maprohu-public-github-aws-deploy-content"
  force_destroy = true
}

output "s3" {
  value = aws_s3_bucket.backend.id
}