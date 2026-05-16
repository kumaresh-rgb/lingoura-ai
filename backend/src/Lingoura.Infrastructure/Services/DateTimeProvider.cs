using Lingoura.Application.Common.Interfaces;

namespace Lingoura.Infrastructure.Services;

public sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}
