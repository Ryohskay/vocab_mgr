# run the vocab-api
$api_filePath = "vocab-api\target\release\vocab-api.exe"

if (Test-Path $api_filePath) {
    Write-Host "The exe file exists."
} else {
    Write-Host "The exe file does not exist."
    cd vocab-api
    cargo build --release
    cd ..
}

vocab-api\target\release\vocab-api.exe