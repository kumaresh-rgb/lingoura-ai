using System.Text.Json;
using Lingoura.Common.Exceptions;
using Lingoura.Shared.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Lingoura.Api.Middleware;

public sealed class GlobalExceptionMiddleware(
    RequestDelegate next,
    ILogger<GlobalExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var statusCode = GetStatusCode(exception);
        var traceId    = context.TraceIdentifier;

        if (statusCode >= 500)
            logger.LogError(exception, "Unhandled exception {TraceId}", traceId);
        else
            logger.LogWarning(exception, "Handled exception {TraceId} — {Message}", traceId, exception.Message);

        var (message, errors) = GetMessageAndErrors(exception);
        var response = ApiResponse.Fail(message, errors, traceId);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode  = statusCode;

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        });

        await context.Response.WriteAsync(json);
    }

    private static int GetStatusCode(Exception exception) => exception switch
    {
        ValidationException     => StatusCodes.Status422UnprocessableEntity,
        NotFoundException       => StatusCodes.Status404NotFound,
        UnauthorizedException   => StatusCodes.Status401Unauthorized,
        ForbiddenException      => StatusCodes.Status403Forbidden,
        ConflictException       => StatusCodes.Status409Conflict,
        TooManyRequestsException => StatusCodes.Status429TooManyRequests,
        _                       => StatusCodes.Status500InternalServerError,
    };

    private static (string message, IEnumerable<string> errors) GetMessageAndErrors(Exception exception)
    {
        if (exception is ValidationException ve)
        {
            var errors = ve.Errors
                .SelectMany(kv => kv.Value.Select(msg => $"{kv.Key}: {msg}"));
            return (ve.Message, errors);
        }

        var isServerError = GetStatusCode(exception) >= 500;
        var message = isServerError ? "An unexpected error occurred." : exception.Message;
        return (message, []);
    }
}
