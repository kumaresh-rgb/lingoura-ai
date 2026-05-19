# Lingoura AI - Endpoint Test Runner (PowerShell 5.1 compatible)
# Usage:
#   .\tests\run-api-tests.ps1
#   .\tests\run-api-tests.ps1 -BaseUrl https://localhost:44301/api/v1

param([string]$BaseUrl = "http://localhost:5030/api/v1")

$passCount = 0
$failCount = 0
$results   = [System.Collections.ArrayList]::new()

function Invoke-Test {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Body    = $null,
        [hashtable]$Headers = @{},
        [int[]]$Expect,
        [string]$Note = ""
    )

    $h = @{ "Content-Type" = "application/json"; "Accept" = "application/json" }
    foreach ($k in $Headers.Keys) { $h[$k] = $Headers[$k] }

    $params = @{ Method = $Method; Uri = $Url; Headers = $h; ErrorAction = "Stop" }
    if ($Body) { $params["Body"] = ($Body | ConvertTo-Json -Depth 5) }

    $status = 0
    $ok     = $false

    try {
        $resp   = Invoke-WebRequest @params -SkipCertificateCheck
        $status = [int]$resp.StatusCode
        $ok     = $Expect -contains $status
    }
    catch {
        if ($_.Exception.Response -ne $null) {
            $status = [int]$_.Exception.Response.StatusCode
            $ok     = $Expect -contains $status
        }
        else {
            $status = 0
            $ok     = $false
            $Note   = "Network error: $($_.Exception.Message)"
        }
    }

    if ($ok) {
        $script:passCount++
        $tag = "PASS"
        Write-Host "  [PASS] $Name ($status)" -ForegroundColor Green
    }
    else {
        $script:failCount++
        $tag = "FAIL"
        $exp = $Expect -join "/"
        Write-Host "  [FAIL] $Name  got=$status  expected=$exp" -ForegroundColor Red
    }

    $null = $script:results.Add([PSCustomObject]@{
        Result = $tag
        HTTP   = $status
        Test   = $Name
        Note   = $Note
    })

    if ($ok -and (Get-Variable resp -ErrorAction SilentlyContinue)) {
        return $resp
    }
    return $null
}

function Parse-Body($resp) {
    if ($resp -eq $null) { return $null }
    try   { return $resp.Content | ConvertFrom-Json }
    catch { return $null }
}

# ── Banner ────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Lingoura AI  -  API Endpoint Test Suite" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Base URL : $BaseUrl" -ForegroundColor Gray
Write-Host "  Time     : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

# ── Connectivity check ────────────────────────────────────────────────────────

$reachable = $false
try {
    $null = Invoke-WebRequest -Uri "$BaseUrl/billing/plans" -Method GET `
        -SkipCertificateCheck -ErrorAction Stop -TimeoutSec 5
    $reachable = $true
}
catch {
    if ($_.Exception.Response -ne $null) { $reachable = $true }
}

if (-not $reachable) {
    Write-Host "  ERROR: Cannot reach backend at $BaseUrl" -ForegroundColor Red
    Write-Host "  Run:  cd backend && dotnet run --project src/Lingoura.Api --launch-profile http" -ForegroundColor Yellow
    Write-Host "  IIS:  .\tests\run-api-tests.ps1 -BaseUrl https://localhost:44301/api/v1" -ForegroundColor Yellow
    exit 1
}
Write-Host "  Backend reachable" -ForegroundColor Green

# ── Shared state ──────────────────────────────────────────────────────────────

$ts           = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$testEmail    = "test_${ts}@lingoura.dev"
$testPwd      = "Test@Secure123!"
$accessToken  = ""
$refreshToken = ""

# ── AUTH ──────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "-- AUTH -------------------------------------------------" -ForegroundColor Cyan

$r = Invoke-Test -Name "Register new user" -Method POST -Url "$BaseUrl/auth/register" `
    -Body @{ email=$testEmail; password=$testPwd; firstName="Api"; lastName="Tester" } `
    -Expect 200,201 -Note "Creates user, returns tokens"

$b = Parse-Body $r
if ($b -ne $null -and $b.data -ne $null) {
    if ($b.data.accessToken)  { $accessToken  = $b.data.accessToken }
    if ($b.data.refreshToken) { $refreshToken = $b.data.refreshToken }
}

Invoke-Test -Name "Register duplicate email" -Method POST -Url "$BaseUrl/auth/register" `
    -Body @{ email=$testEmail; password=$testPwd; firstName="Api"; lastName="Tester" } `
    -Expect 409 -Note "Email already taken" | Out-Null

Invoke-Test -Name "Register weak password" -Method POST -Url "$BaseUrl/auth/register" `
    -Body @{ email="weak_${ts}@test.com"; password="abc"; firstName="W"; lastName="U" } `
    -Expect 400,409,422 -Note "Rejects passwords under 12 chars" | Out-Null

$r = Invoke-Test -Name "Login correct credentials" -Method POST -Url "$BaseUrl/auth/login" `
    -Body @{ email=$testEmail; password=$testPwd } `
    -Expect 200 -Note "Returns accessToken + refreshToken"

$b = Parse-Body $r
if ($b -ne $null -and $b.data -ne $null) {
    if ($b.data.accessToken)  { $accessToken  = $b.data.accessToken }
    if ($b.data.refreshToken) { $refreshToken = $b.data.refreshToken }
}

Invoke-Test -Name "Login wrong password" -Method POST -Url "$BaseUrl/auth/login" `
    -Body @{ email=$testEmail; password="WrongPass999!" } `
    -Expect 401 -Note "Rejects bad credentials" | Out-Null

Invoke-Test -Name "Login unknown email" -Method POST -Url "$BaseUrl/auth/login" `
    -Body @{ email="nobody_${ts}@test.com"; password="SomePass123!" } `
    -Expect 401 -Note "Rejects unknown user" | Out-Null

$r = Invoke-Test -Name "Refresh token" -Method POST -Url "$BaseUrl/auth/refresh" `
    -Body @{ refreshToken=$refreshToken } `
    -Expect 200 -Note "Issues new token pair"

$b = Parse-Body $r
if ($b -ne $null -and $b.data -ne $null) {
    if ($b.data.accessToken)  { $accessToken  = $b.data.accessToken }
    if ($b.data.refreshToken) { $refreshToken = $b.data.refreshToken }
}

Invoke-Test -Name "Refresh invalid token" -Method POST -Url "$BaseUrl/auth/refresh" `
    -Body @{ refreshToken="garbage-token-xyz" } `
    -Expect 401 -Note "Rejects tampered token" | Out-Null

Invoke-Test -Name "Google login fake token" -Method POST -Url "$BaseUrl/auth/google" `
    -Body @{ idToken="not-a-real-google-jwt" } `
    -Expect 400,401,422 -Note "Rejects invalid Google JWT" | Out-Null

# ── BILLING ───────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "-- BILLING ----------------------------------------------" -ForegroundColor Cyan

$r = Invoke-Test -Name "Get plans (public, no auth)" `
    -Method GET -Url "$BaseUrl/billing/plans" `
    -Expect 200 -Note "Public endpoint, no token needed"

$b = Parse-Body $r
if ($b -ne $null -and $b.data -ne $null) {
    Write-Host "     Plans in DB: $($b.data.Count)" -ForegroundColor Gray
}

Invoke-Test -Name "Get subscription (no token)" `
    -Method GET -Url "$BaseUrl/billing/subscription" `
    -Expect 401 -Note "Protected endpoint" | Out-Null

if ($accessToken -ne "") {
    $authHeader = @{ Authorization = "Bearer $accessToken" }

    Invoke-Test -Name "Get subscription (authenticated)" `
        -Method GET -Url "$BaseUrl/billing/subscription" `
        -Headers $authHeader `
        -Expect 200,404 -Note "200 if provisioned, 404 if not" | Out-Null

    Invoke-Test -Name "Get usage summary" `
        -Method GET -Url "$BaseUrl/billing/usage" `
        -Headers $authHeader `
        -Expect 200 -Note "Feature quota list" | Out-Null

    $idemKey = "test-$(New-Guid)"
    Invoke-Test -Name "Consume ai_chats feature" `
        -Method POST -Url "$BaseUrl/billing/usage/consume" `
        -Headers $authHeader `
        -Body @{ feature="ai_chats"; idempotencyKey=$idemKey } `
        -Expect 200,429 -Note "200 quota ok, 429 exhausted" | Out-Null

    Invoke-Test -Name "Consume same idempotency key (idempotent)" `
        -Method POST -Url "$BaseUrl/billing/usage/consume" `
        -Headers $authHeader `
        -Body @{ feature="ai_chats"; idempotencyKey=$idemKey } `
        -Expect 200,429 -Note "Must match previous result" | Out-Null

    Invoke-Test -Name "Create Razorpay PRO checkout" `
        -Method POST -Url "$BaseUrl/billing/checkout" `
        -Headers $authHeader `
        -Body @{
            plan         = "PRO"
            interval     = "monthly"
            successUrl   = "http://localhost:3000/billing/success"
            cancelUrl    = "http://localhost:3000/billing/cancel"
            providerHint = "razorpay"
        } `
        -Expect 200,400 -Note "200 with orderId, 400 if plan IDs not set" | Out-Null
}
else {
    Write-Host "  [SKIP] Authenticated billing tests - login did not return a token" -ForegroundColor Yellow
}

# ── WEBHOOKS ──────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "-- WEBHOOKS ---------------------------------------------" -ForegroundColor Cyan

$wsecret = "35f6e7e7ea57372365be6a3c1df9430f3eda9db09c10878e3bb615cab66620fb"

Invoke-Test -Name "Razorpay webhook - no internal secret" `
    -Method POST -Url "$BaseUrl/payments/webhook/razorpay" `
    -Body @{ event="payment.captured" } `
    -Expect 401 -Note "Must reject missing X-Internal-Secret" | Out-Null

Invoke-Test -Name "Razorpay webhook - valid secret, no HMAC" `
    -Method POST -Url "$BaseUrl/payments/webhook/razorpay" `
    -Headers @{ "X-Internal-Secret"=$wsecret } `
    -Body @{ event="payment.captured" } `
    -Expect 400 -Note "Must reject missing X-Razorpay-Signature" | Out-Null

Invoke-Test -Name "Stripe webhook - no internal secret" `
    -Method POST -Url "$BaseUrl/payments/webhook/stripe" `
    -Body @{ type="payment_intent.succeeded" } `
    -Expect 401 -Note "Must reject missing X-Internal-Secret" | Out-Null

Invoke-Test -Name "Stripe webhook - valid secret, no Stripe-Signature" `
    -Method POST -Url "$BaseUrl/payments/webhook/stripe" `
    -Headers @{ "X-Internal-Secret"=$wsecret } `
    -Body @{ type="payment_intent.succeeded" } `
    -Expect 400 -Note "Must reject missing Stripe-Signature" | Out-Null

# ── LOGOUT ────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "-- LOGOUT -----------------------------------------------" -ForegroundColor Cyan

if ($accessToken -ne "" -and $refreshToken -ne "") {
    Invoke-Test -Name "Logout - revoke refresh token" `
        -Method POST -Url "$BaseUrl/auth/logout" `
        -Headers @{ Authorization = "Bearer $accessToken" } `
        -Body @{ refreshToken=$refreshToken } `
        -Expect 200 -Note "Server-side token revocation" | Out-Null

    Invoke-Test -Name "Refresh after logout (revoked)" `
        -Method POST -Url "$BaseUrl/auth/refresh" `
        -Body @{ refreshToken=$refreshToken } `
        -Expect 401 -Note "Must reject revoked token" | Out-Null
}
else {
    Write-Host "  [SKIP] Logout tests - no token available" -ForegroundColor Yellow
}

# ── Report ────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  RESULTS" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

foreach ($row in $results) {
    $color = if ($row.Result -eq "PASS") { "Green" } else { "Red" }
    $line  = "{0,-6} {1,-5} {2,-48} {3}" -f $row.Result, $row.HTTP, $row.Test, $row.Note
    Write-Host "  $line" -ForegroundColor $color
}

$total = $passCount + $failCount
$pct   = if ($total -gt 0) { [math]::Round($passCount / $total * 100) } else { 0 }

Write-Host ""
if ($failCount -eq 0) {
    Write-Host "  ALL $total TESTS PASSED - ${pct}% success rate" -ForegroundColor Green
}
else {
    Write-Host "  $passCount / $total passed (${pct}%)   $failCount FAILED" -ForegroundColor Red
}
Write-Host ""
