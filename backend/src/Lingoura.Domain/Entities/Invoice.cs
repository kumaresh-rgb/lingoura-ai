namespace Lingoura.Domain.Entities;

public sealed class Invoice
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; init; }
    public Guid? SubscriptionId { get; init; }
    public Guid? PaymentId { get; init; }
    public string InvoiceNumber { get; init; } = string.Empty;   // LNG-2024-001234
    public decimal Amount { get; init; }
    public string Currency { get; init; } = "USD";
    public decimal TaxAmount { get; init; }
    public string Status { get; set; } = "PAID";
    public DateTime? DueDate { get; init; }
    public DateTime? PaidAtUtc { get; set; }
    public string? PdfUrl { get; set; }
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;

    public ApplicationUser User { get; init; } = null!;
}
