# Lingoura Backend — Architecture & Auth Reference

## Table of Contents
1. [Folder Structure](#folder-structure)
2. [Layer Rules](#layer-rules)
3. [Authentication Flows](#authentication-flows)
   - [Registration](#1-registration)
   - [Login](#2-login)
   - [Token Refresh](#3-token-refresh)
   - [Logout](#4-logout)
   - [Google OAuth](#5-google-oauth)
4. [Database Schema](#database-schema)
5. [Middleware Pipeline](#middleware-pipeline)
6. [Configuration & Secrets](#configuration--secrets)

---

## Folder Structure

```
backend/
├── Lingoura.sln
├── docker-compose.yml
├── docker-compose.override.yml
├── ARCHITECTURE.md                          ← this file
│
└── src/
    ├── Lingoura.Domain/                     ← core business entities, no dependencies
    │   ├── Entities/
    │   │   ├── ApplicationUser.cs           ← IdentityUser<Guid> + soft-delete + audit
    │   │   ├── ApplicationRole.cs           ← IdentityRole<Guid>
    │   │   ├── RefreshToken.cs              ← SHA-256 hashed, rotate-on-use
    │   │   └── UserExternalLogin.cs         ← Google / Apple / Microsoft links
    │   ├── Enums/
    │   │   ├── AuthProvider.cs              ← Local, Google, Apple, Microsoft
    │   │   └── UserRole.cs                  ← Learner, Instructor, Admin
    │   └── Events/
    │       └── UserRegisteredDomainEvent.cs
    │
    ├── Lingoura.Common/                     ← cross-cutting utilities, no dependencies
    │   ├── Results/
    │   │   ├── Result.cs                    ← Result<T> monad
    │   │   └── Error.cs                     ← typed error record
    │   ├── Exceptions/
    │   │   ├── DomainException.cs           ← abstract base
    │   │   ├── ValidationException.cs
    │   │   ├── NotFoundException.cs
    │   │   ├── UnauthorizedException.cs
    │   │   ├── ForbiddenException.cs
    │   │   ├── ConflictException.cs
    │   │   └── TooManyRequestsException.cs
    │   ├── Helpers/
    │   │   └── CryptoHelper.cs              ← GenerateSecureToken, HashToken, SecureEquals
    │   ├── Constants/
    │   │   ├── AuthConstants.cs             ← expiry, lockout, length limits
    │   │   └── ClaimTypeNames.cs
    │   └── Extensions/
    │       ├── ClaimsPrincipalExtensions.cs
    │       └── StringExtensions.cs
    │
    ├── Lingoura.Shared/                     ← API contracts & DTOs shared across projects
    │   └── Responses/
    │       └── ApiResponse.cs               ← ApiResponse<T>, ApiResponse (non-generic)
    │
    ├── Lingoura.Application/                ← CQRS use cases, no framework deps
    │   ├── DependencyInjection.cs           ← MediatR + FluentValidation + behaviors
    │   ├── Common/
    │   │   ├── Behaviors/
    │   │   │   ├── ValidationBehavior.cs    ← runs all IValidator<T> before handler
    │   │   │   └── LoggingBehavior.cs       ← logs request/response names
    │   │   ├── Interfaces/
    │   │   │   ├── IApplicationDbContext.cs
    │   │   │   ├── ITokenService.cs
    │   │   │   ├── IGoogleAuthService.cs
    │   │   │   ├── ICurrentUserService.cs
    │   │   │   └── IDateTimeProvider.cs
    │   │   └── Models/
    │   │       ├── TokenResult.cs
    │   │       └── GoogleUserInfo.cs
    │   └── Authentication/
    │       ├── Commands/
    │       │   ├── Register/                ← RegisterCommand + Handler + Validator
    │       │   ├── Login/                   ← LoginCommand + Handler + Validator
    │       │   ├── RefreshToken/            ← RefreshTokenCommand + Handler + Validator
    │       │   ├── Logout/                  ← LogoutCommand + Handler
    │       │   └── GoogleLogin/             ← GoogleLoginCommand + Handler + Validator
    │       └── DTOs/
    │           ├── AuthResponseDto.cs
    │           ├── RegisterRequestDto.cs
    │           ├── LoginRequestDto.cs
    │           ├── RefreshTokenRequestDto.cs
    │           └── GoogleLoginRequestDto.cs
    │
    ├── Lingoura.Infrastructure/             ← EF Core, Identity, JWT, Google, options
    │   ├── Extensions/
    │   │   └── InfrastructureServiceExtensions.cs  ← all DI wiring
    │   ├── Options/
    │   │   ├── JwtOptions.cs
    │   │   ├── GoogleAuthOptions.cs
    │   │   └── DatabaseOptions.cs
    │   ├── Authentication/
    │   │   ├── JwtTokenService.cs           ← HMACSHA256 JWT, refresh token generation
    │   │   └── GoogleAuthService.cs         ← GoogleJsonWebSignature.ValidateAsync
    │   ├── Services/
    │   │   ├── CurrentUserService.cs        ← reads sub claim from HttpContext
    │   │   └── DateTimeProvider.cs          ← wraps DateTime.UtcNow for testability
    │   └── Persistence/
    │       ├── ApplicationDbContext.cs      ← IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    │       ├── DatabaseSeeder.cs            ← seeds Learner/Instructor/Admin roles at startup
    │       ├── Configurations/
    │       │   ├── ApplicationUserConfiguration.cs  ← soft-delete filter, column lengths
    │       │   ├── RefreshTokenConfiguration.cs     ← unique index on TokenHash
    │       │   └── UserExternalLoginConfiguration.cs ← unique (Provider, ProviderUserId)
    │       ├── Interceptors/
    │       │   └── AuditSaveChangesInterceptor.cs   ← auto-sets CreatedAtUtc / UpdatedAtUtc
    │       └── Migrations/                  ← EF Core migration history (always committed)
    │           ├── 20260516070225_InitialCreate.cs
    │           ├── 20260516070225_InitialCreate.Designer.cs
    │           └── ApplicationDbContextModelSnapshot.cs
    │
    └── Lingoura.Api/                        ← HTTP entry point only
        ├── Program.cs                       ← host setup, middleware pipeline, startup checks
        ├── DesignTimeDbContextFactory.cs    ← enables dotnet ef without running the host
        ├── Controllers/
        │   └── V1/
        │       └── AuthController.cs        ← register, login, refresh, logout, google
        └── Middleware/
            ├── GlobalExceptionMiddleware.cs ← maps exceptions → HTTP status codes
            ├── CorrelationIdMiddleware.cs   ← X-Correlation-Id header propagation
            └── SecurityHeadersMiddleware.cs ← HSTS headers on every response
```

---

## Layer Rules

```
Domain        ←  no dependencies
Common        ←  no dependencies
Shared        ←  no dependencies
Application   ←  Domain, Common, Shared
Infrastructure←  Application, Domain, Common
Api           ←  Application, Infrastructure, Shared, Common
```

Application never references Infrastructure. Controllers never contain business logic — they only translate HTTP ↔ MediatR commands.

---

## Authentication Flows

### 1. Registration

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant VB as ValidationBehavior
    participant RH as RegisterCommandHandler
    participant UM as UserManager<ApplicationUser>
    participant TS as JwtTokenService
    participant DB as PostgreSQL

    C->>AC: POST /api/v1/auth/register<br/>{email, password, firstName, lastName}
    AC->>VB: RegisterCommand (via MediatR)
    VB->>VB: FluentValidation<br/>(email format, password strength, name chars)
    VB-->>AC: 422 Unprocessable if invalid

    VB->>RH: pass to handler
    RH->>UM: FindByEmailAsync(email)
    UM->>DB: SELECT Users WHERE Email
    DB-->>UM: existing user?
    alt email already registered
        RH-->>AC: Result.Failure (Conflict)
        AC-->>C: 409 Conflict
    end

    RH->>UM: CreateAsync(user, password)
    Note over UM: PBKDF2-SHA256 hash<br/>stored in PasswordHash
    UM->>DB: INSERT Users
    RH->>UM: AddToRoleAsync(user, "Learner")
    UM->>DB: INSERT UserRoles

    RH->>TS: GenerateAccessToken(user, roles)
    Note over TS: HMACSHA256 JWT<br/>sub, email, jti, roles
    RH->>TS: GenerateRefreshToken()
    Note over TS: 64-byte CSPRNG → Base64<br/>SHA-256 hash stored in DB
    RH->>DB: INSERT RefreshTokens (hash only)

    RH-->>AC: Result.Success(AuthResponseDto)
    AC-->>C: 201 Created<br/>{accessToken, refreshToken, expiresAt, user}
```

---

### 2. Login

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant LH as LoginCommandHandler
    participant UM as UserManager<ApplicationUser>
    participant TS as JwtTokenService
    participant DB as PostgreSQL

    C->>AC: POST /api/v1/auth/login<br/>{email, password}
    AC->>LH: LoginCommand (via MediatR)

    LH->>UM: FindByEmailAsync(email)
    UM->>DB: SELECT Users WHERE Email
    alt user not found
        LH-->>AC: Result.Failure (Unauthorized)
        AC-->>C: 401 Unauthorized (generic message)
    end

    LH->>UM: IsLockedOutAsync(user)
    alt account locked
        LH-->>AC: Result.Failure (TooManyRequests)
        AC-->>C: 429 Too Many Requests
    end

    LH->>UM: CheckPasswordAsync(user, password)
    Note over UM: constant-time PBKDF2 verify
    alt wrong password
        LH->>UM: AccessFailedAsync(user)
        Note over UM: increments AccessFailedCount<br/>locks at 5 failures for 15 min
        LH-->>AC: Result.Failure (Unauthorized)
        AC-->>C: 401 Unauthorized
    end

    LH->>UM: ResetAccessFailedCountAsync(user)
    LH->>UM: GetRolesAsync(user)
    LH->>TS: GenerateAccessToken(user, roles)
    LH->>TS: GenerateRefreshToken()
    LH->>DB: INSERT RefreshTokens (hash only)<br/>Revoke previous active tokens

    LH-->>AC: Result.Success(AuthResponseDto)
    AC-->>C: 200 OK<br/>{accessToken, refreshToken, expiresAt, user}
```

---

### 3. Token Refresh

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant RH as RefreshTokenCommandHandler
    participant TS as JwtTokenService
    participant DB as PostgreSQL

    C->>AC: POST /api/v1/auth/refresh<br/>{refreshToken: "<raw token>"}
    AC->>RH: RefreshTokenCommand (via MediatR)

    RH->>RH: SHA-256 hash of inbound raw token
    RH->>DB: SELECT RefreshTokens WHERE TokenHash = hash
    alt token not found
        RH-->>AC: Result.Failure (Unauthorized)
        AC-->>C: 401 Unauthorized
    end

    alt token revoked (reuse detected)
        Note over RH,DB: SECURITY: revoke entire token family<br/>possible token theft
        RH->>DB: Revoke all tokens for this UserId
        RH-->>AC: Result.Failure (Unauthorized)
        AC-->>C: 401 Unauthorized
    end

    alt token expired
        RH-->>AC: Result.Failure (Unauthorized)
        AC-->>C: 401 Unauthorized
    end

    RH->>DB: SELECT Users WHERE Id = token.UserId
    RH->>TS: GenerateAccessToken(user, roles)
    RH->>TS: GenerateRefreshToken()
    RH->>DB: UPDATE old token → RevokedAt, ReplacedByTokenHash
    RH->>DB: INSERT new RefreshToken (new hash)

    RH-->>AC: Result.Success(AuthResponseDto)
    AC-->>C: 200 OK<br/>{new accessToken, new refreshToken}
```

---

### 4. Logout

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant LH as LogoutCommandHandler
    participant DB as PostgreSQL

    C->>AC: POST /api/v1/auth/logout<br/>Authorization: Bearer <accessToken><br/>{refreshToken: "<raw token>"}

    AC->>LH: LogoutCommand (via MediatR)
    LH->>LH: SHA-256 hash of refresh token
    LH->>DB: SELECT RefreshTokens WHERE TokenHash = hash
    Note over LH,DB: silently no-op if token not found<br/>(idempotent — client may retry)
    LH->>DB: UPDATE RefreshToken → RevokedAt = UtcNow

    LH-->>AC: Result.Success
    AC-->>C: 204 No Content
```

---

### 5. Google OAuth (Backend-Validated)

```mermaid
sequenceDiagram
    participant C as Client (browser)
    participant GS as Google Sign-In SDK
    participant AC as AuthController
    participant GH as GoogleLoginCommandHandler
    participant GAS as GoogleAuthService
    participant UM as UserManager<ApplicationUser>
    participant TS as JwtTokenService
    participant DB as PostgreSQL

    C->>GS: Trigger Google Sign-In popup
    GS-->>C: Google ID Token (JWT signed by Google)

    C->>AC: POST /api/v1/auth/google<br/>{idToken: "<Google ID Token>"}
    AC->>GH: GoogleLoginCommand (via MediatR)

    GH->>GAS: ValidateGoogleTokenAsync(idToken)
    GAS->>GAS: GoogleJsonWebSignature.ValidateAsync<br/>(verifies signature, audience = ClientId, expiry)
    alt invalid / expired token
        GAS-->>GH: null
        GH-->>AC: Result.Failure (Unauthorized)
        AC-->>C: 401 Unauthorized
    end

    GAS-->>GH: GoogleUserInfo {sub, email, name, picture}

    GH->>DB: SELECT UserExternalLogins<br/>WHERE Provider=Google AND ProviderUserId=sub
    alt existing Google login found
        GH->>DB: SELECT Users WHERE Id = login.UserId
        Note over GH: existing user — skip creation
    else no Google login found
        GH->>DB: SELECT Users WHERE Email = googleEmail
        alt email match (account linking)
            GH->>DB: INSERT UserExternalLogins<br/>(link Google to existing account)
        else brand new user
            GH->>UM: CreateAsync(newUser)
            UM->>DB: INSERT Users
            GH->>UM: AddToRoleAsync("Learner")
            GH->>DB: INSERT UserExternalLogins
        end
    end

    GH->>TS: GenerateAccessToken(user, roles)
    GH->>TS: GenerateRefreshToken()
    GH->>DB: INSERT RefreshTokens (hash only)

    GH-->>AC: Result.Success(AuthResponseDto)
    AC-->>C: 200 OK<br/>{accessToken, refreshToken, expiresAt, user}
```

---

## Database Schema

```mermaid
erDiagram
    Users {
        uuid Id PK
        varchar FirstName
        varchar LastName
        varchar AvatarUrl
        bool IsEmailVerified
        bool IsDeleted
        timestamptz DeletedAtUtc
        timestamptz CreatedAtUtc
        timestamptz UpdatedAtUtc
        varchar Email
        varchar NormalizedEmail
        varchar UserName
        varchar NormalizedUserName
        text PasswordHash
        text SecurityStamp
        bool TwoFactorEnabled
        bool LockoutEnabled
        int AccessFailedCount
        timestamptz LockoutEnd
    }

    Roles {
        uuid Id PK
        varchar Name
        varchar NormalizedName
    }

    UserRoles {
        uuid UserId FK
        uuid RoleId FK
    }

    RefreshTokens {
        uuid Id PK
        uuid UserId FK
        varchar TokenHash UK
        varchar IpAddress
        varchar DeviceInfo
        timestamptz ExpiresAtUtc
        timestamptz CreatedAtUtc
        timestamptz RevokedAtUtc
        varchar ReplacedByTokenHash
    }

    UserExternalLogins {
        uuid Id PK
        uuid UserId FK
        int Provider
        varchar ProviderUserId
        varchar ProviderEmail
        timestamptz LinkedAtUtc
    }

    UserClaims {
        int Id PK
        uuid UserId FK
        text ClaimType
        text ClaimValue
    }

    Users ||--o{ UserRoles : "has"
    Roles ||--o{ UserRoles : "grants"
    Users ||--o{ RefreshTokens : "owns"
    Users ||--o{ UserExternalLogins : "links"
    Users ||--o{ UserClaims : "has"
```

All `timestamp` columns are `timestamptz` (UTC). Soft-delete via `IsDeleted` + `DeletedAtUtc` — EF global query filter excludes deleted users and their related tokens/logins automatically.

---

## Middleware Pipeline

Request flows through middleware in this exact order (order is critical):

```
Incoming Request
       │
       ▼
 GlobalExceptionMiddleware    ← catches all unhandled exceptions → ApiResponse JSON
       │
       ▼
 CorrelationIdMiddleware       ← read/generate X-Correlation-Id; push to Serilog context
       │
       ▼
 SecurityHeadersMiddleware     ← X-Content-Type-Options, X-Frame-Options, CSP, etc.
       │
       ▼
 SerilogRequestLogging         ← structured HTTP access log
       │
       ▼
 HttpsRedirection
       │
       ▼
 CORS (LingouraPolicy)
       │
       ▼
 RateLimiter                   ← global: 100/min | auth endpoints: 10/min
       │
       ▼
 Authentication (JWT Bearer)
       │
       ▼
 Authorization
       │
       ▼
 Controllers → MediatR → Handler
       │
       ▼
Outgoing Response
```

Exception → HTTP status mapping (in `GlobalExceptionMiddleware`):

| Exception                  | HTTP Status |
|---------------------------|-------------|
| `ValidationException`     | 422         |
| `NotFoundException`       | 404         |
| `UnauthorizedException`   | 401         |
| `ForbiddenException`      | 403         |
| `ConflictException`       | 409         |
| `TooManyRequestsException`| 429         |
| anything else             | 500         |

---

## Configuration & Secrets

All secrets arrive via .NET User Secrets (dev) or environment variables (prod). **Nothing sensitive is in `appsettings.json`.**

| Config key                     | Source                      | Example value                          |
|-------------------------------|-----------------------------|----------------------------------------|
| `Database:ConnectionString`   | User Secrets / env var      | `Host=...;Port=5432;Database=lingoura` |
| `Jwt:SecretKey`               | User Secrets / env var      | 256-bit random base64 string           |
| `GoogleAuth:ClientId`         | User Secrets / env var      | `xxxx.apps.googleusercontent.com`      |
| `Jwt:Issuer`                  | `appsettings.json`          | `https://api.lingoura.ai`              |
| `Jwt:Audience`                | `appsettings.json`          | `https://app.lingoura.ai`              |
| `RateLimit:AuthEndpointsPerMinute` | `appsettings.json`    | `10`                                   |

Environment variable override format (12-factor): `Database__ConnectionString`, `Jwt__SecretKey`.

Set secrets locally:
```bash
cd backend
dotnet user-secrets set "Database:ConnectionString" "Host=localhost;Port=5432;..." --project src/Lingoura.Api
dotnet user-secrets set "Jwt:SecretKey" "<256-bit-random>" --project src/Lingoura.Api
dotnet user-secrets set "GoogleAuth:ClientId" "<your-client-id>" --project src/Lingoura.Api
```
