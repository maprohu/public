Compress-Archive -Path dist/* -DestinationPath dist.zip -Force
aws s3 cp dist.zip s3://mhu-paris01/

