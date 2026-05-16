FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["src/Lingoura.Api/Lingoura.Api.csproj",             "src/Lingoura.Api/"]
COPY ["src/Lingoura.Application/Lingoura.Application.csproj", "src/Lingoura.Application/"]
COPY ["src/Lingoura.Infrastructure/Lingoura.Infrastructure.csproj", "src/Lingoura.Infrastructure/"]
COPY ["src/Lingoura.Domain/Lingoura.Domain.csproj",       "src/Lingoura.Domain/"]
COPY ["src/Lingoura.Common/Lingoura.Common.csproj",       "src/Lingoura.Common/"]
COPY ["src/Lingoura.Shared/Lingoura.Shared.csproj",       "src/Lingoura.Shared/"]

RUN dotnet restore "src/Lingoura.Api/Lingoura.Api.csproj"

COPY . .
RUN dotnet publish "src/Lingoura.Api/Lingoura.Api.csproj" -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Lingoura.Api.dll"]
