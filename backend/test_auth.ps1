$ErrorActionPreference = 'Stop'

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Write-Output "=== SIGNUP ==="
try {
  $body = @{ name = 'TestUser'; email = 'testuser@example.com'; password = 'password123' } | ConvertTo-Json
  $signup = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/signup' -Method Post -ContentType 'application/json' -Body $body -WebSession $session
  Write-Output ("Signup response:\n" + ($signup | ConvertTo-Json -Depth 5))
} catch {
  Write-Output "Signup error:"
  Write-Output $_.Exception.Response.StatusCode.Value__ 2>$null
  Write-Output $_.Exception.Message
}

Write-Output "\n=== GET /api/auth/me ==="
try {
  $me = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/me' -Method Get -WebSession $session
  Write-Output ("Me response:\n" + ($me | ConvertTo-Json -Depth 5))
} catch {
  Write-Output "Me error:"
  Write-Output $_.Exception.Message
}

Write-Output "\n=== CREATE TASK ==="
try {
  $taskBody = @{ title = 'Test Task from script'; description = 'Created during automated test' } | ConvertTo-Json
  $create = Invoke-RestMethod -Uri 'http://localhost:5000/api/tasks' -Method Post -ContentType 'application/json' -Body $taskBody -WebSession $session
  Write-Output ("Create task response:\n" + ($create | ConvertTo-Json -Depth 5))
} catch {
  Write-Output "Create task error:"
  Write-Output $_.Exception.Message
}

Write-Output "\n=== GET /api/tasks ==="
try {
  $tasks = Invoke-RestMethod -Uri 'http://localhost:5000/api/tasks' -Method Get -WebSession $session
  Write-Output ("Tasks response:\n" + ($tasks | ConvertTo-Json -Depth 5))
} catch {
  Write-Output "Get tasks error:"
  Write-Output $_.Exception.Message
}

Write-Output "\n=== REFRESH TOKEN ==="
try {
  $refresh = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/refresh' -Method Post -WebSession $session
  Write-Output ("Refresh response:\n" + ($refresh | ConvertTo-Json -Depth 5))
} catch {
  Write-Output "Refresh error:"
  Write-Output $_.Exception.Message
}
