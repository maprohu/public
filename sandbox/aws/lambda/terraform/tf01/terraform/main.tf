data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/src"
  output_path = "${path.module}/builds/lambda_function_payload.zip"
}
module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name          = "my-lambda1"
  handler                = "index2.handler"
  runtime                = "nodejs18.x"
  create_package         = false
  local_existing_package = "${path.module}/builds/lambda_function_payload.zip"
}
