namespace Lingoura.Shared.Responses;

public sealed class ApiResponse<T>
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public T? Data { get; init; }
    public IReadOnlyList<string> Errors { get; init; } = [];
    public string? TraceId { get; init; }

    public static ApiResponse<T> Ok(T data, string message = "Success", string? traceId = null) =>
        new() { Success = true, Message = message, Data = data, TraceId = traceId };

    public static ApiResponse<T> Fail(string message, IEnumerable<string>? errors = null, string? traceId = null) =>
        new() { Success = false, Message = message, Errors = (errors ?? []).ToList(), TraceId = traceId };
}

public sealed class ApiResponse
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public IReadOnlyList<string> Errors { get; init; } = [];
    public string? TraceId { get; init; }

    public static ApiResponse Ok(string message = "Success", string? traceId = null) =>
        new() { Success = true, Message = message, TraceId = traceId };

    public static ApiResponse Fail(string message, IEnumerable<string>? errors = null, string? traceId = null) =>
        new() { Success = false, Message = message, Errors = (errors ?? []).ToList(), TraceId = traceId };
}
