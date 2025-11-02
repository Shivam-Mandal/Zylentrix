# Test script for all API functions
$baseUrl = "http://localhost:3000"

Write-Host "Starting comprehensive API testing..." -ForegroundColor Cyan

# Function to make HTTP requests
function Invoke-ApiRequest {
    param (
        [string]$Method,
        [string]$Endpoint,
        [object]$Body,
        [string]$Cookie
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($Cookie) {
        $headers["Cookie"] = $Cookie
    }

    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$Endpoint" -Method $Method -Body ($Body | ConvertTo-Json) -Headers $headers -UseBasicParsing
        return @{
            StatusCode = $response.StatusCode
            Content = $response.Content | ConvertFrom-Json
            Headers = $response.Headers
            SetCookie = $response.Headers["Set-Cookie"]
        }
    } catch {
        return @{
            StatusCode = $_.Exception.Response.StatusCode.value__
            Error = $_.Exception.Message
        }
    }
}

# 1. Test User Registration
Write-Host "`nTesting User Registration..." -ForegroundColor Green
$registerResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/signup" -Body @{
    username = "testuser$(Get-Random)"
    email = "testuser$(Get-Random)@test.com"
    password = "Test123!"
}
Write-Host "Registration Status: $($registerResponse.StatusCode)"
Write-Host "Response: $($registerResponse.Content | ConvertTo-Json)"

# 2. Test User Login
Write-Host "`nTesting User Login..." -ForegroundColor Green
$loginResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/login" -Body @{
    email = $registerResponse.Content.email
    password = "Test123!"
}
Write-Host "Login Status: $($loginResponse.StatusCode)"
$authCookie = $loginResponse.SetCookie

# 3. Test Get User Profile
Write-Host "`nTesting Get User Profile..." -ForegroundColor Green
$profileResponse = Invoke-ApiRequest -Method "GET" -Endpoint "/auth/me" -Cookie $authCookie
Write-Host "Profile Status: $($profileResponse.StatusCode)"
Write-Host "User Profile: $($profileResponse.Content | ConvertTo-Json)"

# 4. Test Create Task
Write-Host "`nTesting Create Task..." -ForegroundColor Green
$createTaskResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/api/tasks" -Body @{
    title = "Test Task"
    description = "This is a test task"
    dueDate = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
} -Cookie $authCookie
Write-Host "Create Task Status: $($createTaskResponse.StatusCode)"
$taskId = $createTaskResponse.Content._id

# 5. Test Get All Tasks
Write-Host "`nTesting Get All Tasks..." -ForegroundColor Green
$getTasksResponse = Invoke-ApiRequest -Method "GET" -Endpoint "/api/tasks" -Cookie $authCookie
Write-Host "Get Tasks Status: $($getTasksResponse.StatusCode)"
Write-Host "Tasks Count: $(($getTasksResponse.Content).Length)"

# 6. Test Update Task
Write-Host "`nTesting Update Task..." -ForegroundColor Green
$updateTaskResponse = Invoke-ApiRequest -Method "PUT" -Endpoint "/api/tasks/$taskId" -Body @{
    title = "Updated Test Task"
    description = "This task has been updated"
    dueDate = (Get-Date).AddDays(14).ToString("yyyy-MM-dd")
} -Cookie $authCookie
Write-Host "Update Task Status: $($updateTaskResponse.StatusCode)"

# 7. Test Get Single Task
Write-Host "`nTesting Get Single Task..." -ForegroundColor Green
$getTaskResponse = Invoke-ApiRequest -Method "GET" -Endpoint "/api/tasks/$taskId" -Cookie $authCookie
Write-Host "Get Task Status: $($getTaskResponse.StatusCode)"
Write-Host "Task Details: $($getTaskResponse.Content | ConvertTo-Json)"

# 8. Test Delete Task
Write-Host "`nTesting Delete Task..." -ForegroundColor Green
$deleteTaskResponse = Invoke-ApiRequest -Method "DELETE" -Endpoint "/api/tasks/$taskId" -Cookie $authCookie
Write-Host "Delete Task Status: $($deleteTaskResponse.StatusCode)"

# 9. Test Refresh Token
Write-Host "`nTesting Token Refresh..." -ForegroundColor Green
$refreshResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/refresh" -Cookie $authCookie
Write-Host "Refresh Token Status: $($refreshResponse.StatusCode)"

# 10. Test Logout
Write-Host "`nTesting Logout..." -ForegroundColor Green
$logoutResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/logout" -Cookie $authCookie
Write-Host "Logout Status: $($logoutResponse.StatusCode)"

Write-Host "`nAPI Testing Complete!" -ForegroundColor Cyan