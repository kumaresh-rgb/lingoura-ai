using Asp.Versioning;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Application.Vocabulary.Commands.AddWordToDeck;
using Lingoura.Application.Vocabulary.Commands.ReviewWord;
using Lingoura.Application.Vocabulary.DTOs;
using Lingoura.Application.Vocabulary.Queries.GetPackWords;
using Lingoura.Application.Vocabulary.Queries.GetVocabularyFeed;
using Lingoura.Application.Vocabulary.Queries.GetVocabularyPacks;
using Lingoura.Shared.Responses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Lingoura.Api.Controllers.V1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/vocabulary")]
[Authorize]
public sealed class VocabularyController(ISender mediator, ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet("feed")]
    public async Task<IActionResult> GetFeed(CancellationToken ct)
    {
        if (currentUser.UserId is not { } userId)
            return Unauthorized(ApiResponse.Fail("Not authenticated", traceId: HttpContext.TraceIdentifier));

        var result = await mediator.Send(new GetVocabularyFeedQuery(userId), ct);
        return Ok(ApiResponse<VocabularyFeedDto>.Ok(result.Value, traceId: HttpContext.TraceIdentifier));
    }

    [HttpGet("packs")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPacks(CancellationToken ct)
    {
        var result = await mediator.Send(new GetVocabularyPacksQuery(), ct);
        return Ok(ApiResponse<IReadOnlyList<VocabularyPackDto>>.Ok(result.Value, traceId: HttpContext.TraceIdentifier));
    }

    [HttpGet("packs/{slug}")]
    public async Task<IActionResult> GetPackWords(string slug, CancellationToken ct)
    {
        if (currentUser.UserId is not { } userId)
            return Unauthorized(ApiResponse.Fail("Not authenticated", traceId: HttpContext.TraceIdentifier));

        var result = await mediator.Send(new GetPackWordsQuery(userId, slug), ct);
        if (!result.IsSuccess)
            return NotFound(ApiResponse.Fail(result.Error.Message, traceId: HttpContext.TraceIdentifier));

        return Ok(ApiResponse<PackWordsDto>.Ok(result.Value, traceId: HttpContext.TraceIdentifier));
    }

    [HttpPost("words/{wordId:guid}/deck")]
    public async Task<IActionResult> AddToDeck(Guid wordId, CancellationToken ct)
    {
        if (currentUser.UserId is not { } userId)
            return Unauthorized(ApiResponse.Fail("Not authenticated", traceId: HttpContext.TraceIdentifier));

        var result = await mediator.Send(new AddWordToDeckCommand(userId, wordId), ct);
        if (!result.IsSuccess)
            return NotFound(ApiResponse.Fail(result.Error.Message, traceId: HttpContext.TraceIdentifier));

        return Ok(ApiResponse<bool>.Ok(result.Value, traceId: HttpContext.TraceIdentifier));
    }

    [HttpPost("words/{wordId:guid}/review")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> ReviewWord(
        Guid wordId, [FromBody] ReviewWordRequestDto dto, CancellationToken ct)
    {
        if (currentUser.UserId is not { } userId)
            return Unauthorized(ApiResponse.Fail("Not authenticated", traceId: HttpContext.TraceIdentifier));

        var result = await mediator.Send(new ReviewWordCommand(userId, wordId, dto.Quality), ct);
        if (!result.IsSuccess)
            return BadRequest(ApiResponse.Fail(result.Error.Message, traceId: HttpContext.TraceIdentifier));

        return Ok(ApiResponse<ReviewResultDto>.Ok(result.Value, traceId: HttpContext.TraceIdentifier));
    }
}

public sealed record ReviewWordRequestDto(int Quality);
