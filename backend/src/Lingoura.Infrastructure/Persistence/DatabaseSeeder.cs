using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Lingoura.Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static async Task SeedRolesAsync(
        RoleManager<ApplicationRole> roleManager,
        ILogger logger)
    {
        var roles = Enum.GetNames<UserRole>();

        foreach (var role in roles)
        {
            if (await roleManager.RoleExistsAsync(role))
                continue;

            var result = await roleManager.CreateAsync(new ApplicationRole { Name = role });

            if (result.Succeeded)
                logger.LogInformation("Seeded role: {Role}", role);
            else
                logger.LogError("Failed to seed role {Role}: {Errors}", role,
                    string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }

    public static async Task SeedVocabularyAsync(
        ApplicationDbContext db,
        ILogger logger)
    {
        if (await db.VocabularyWords.AnyAsync())
            return; // already seeded

        logger.LogInformation("Seeding vocabulary words and packs...");

        var words = BuildWords();
        db.VocabularyWords.AddRange(words);

        var packs = BuildPacks(words);
        db.VocabularyPacks.AddRange(packs.Select(p => p.Pack));
        db.PackWords.AddRange(packs.SelectMany(p => p.PackWords));

        // Seed word of the day for today
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (!await db.DailyWords.AnyAsync(d => d.Date == today))
        {
            db.DailyWords.Add(new DailyWord
            {
                Date   = today,
                WordId = words[0].Id,
                Source = "internal",
            });
        }

        await db.SaveChangesAsync();
        logger.LogInformation("Vocabulary seeded: {Count} words, {Packs} packs",
            words.Length, packs.Length);
    }

    private static VocabularyWord[] BuildWords() =>
    [
        new()
        {
            Word = "mitigate", Slug = "mitigate", PartOfSpeech = "verb",
            Pronunciation = "MIT-uh-gayt", PhoneticIpa = "/ˈmɪtɪɡeɪt/",
            Definition = "To lessen the severity, seriousness, or painfulness of something.",
            ShortDefinition = "To reduce or lessen the impact of something harmful.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "environment",
            IsIeltsCore = true, IsAcademicWordList = true,
            Synonyms = ["alleviate", "reduce", "diminish", "lessen", "ease"],
            Antonyms = ["intensify", "worsen", "aggravate", "exacerbate"],
            Collocations = ["mitigate the effects", "mitigate risk", "mitigate climate change", "mitigate damage"],
            Examples = [
                "Governments must take urgent steps to mitigate the effects of climate change.",
                "The new policy aims to mitigate the financial burden on low-income families.",
                "Planting trees can help mitigate carbon emissions in urban areas.",
            ],
            Mnemonic = "MITIgate = make IT lighter — reduce the weight of a problem.",
            Etymology = "Latin 'mitigare' — to soften, from 'mitis' (soft) + 'agere' (to act).",
            CommonMistake = "Don't confuse with 'militate' (to be a powerful factor against something).",
        },
        new()
        {
            Word = "ubiquitous", Slug = "ubiquitous", PartOfSpeech = "adjective",
            Pronunciation = "yoo-BIK-wuh-tus", PhoneticIpa = "/juːˈbɪkwɪtəs/",
            Definition = "Present, appearing, or found everywhere.",
            ShortDefinition = "Found or seen everywhere.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "technology",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["omnipresent", "pervasive", "widespread", "universal"],
            Antonyms = ["rare", "scarce", "uncommon", "limited"],
            Collocations = ["ubiquitous technology", "ubiquitous presence", "become ubiquitous"],
            Examples = [
                "Smartphones have become ubiquitous in modern society.",
                "Plastic pollution is now ubiquitous across the world's oceans.",
                "The internet has made information ubiquitous and instantly accessible.",
            ],
            Mnemonic = "UBI = everywhere, like UBI (universal basic income) — for everyone, everywhere.",
            Etymology = "Latin 'ubique' — everywhere.",
            CommonMistake = "Don't spell it 'ubiqitous' — remember the 'u' before 'itous'.",
        },
        new()
        {
            Word = "exacerbate", Slug = "exacerbate", PartOfSpeech = "verb",
            Pronunciation = "ig-ZAS-er-bayt", PhoneticIpa = "/ɪɡˈzæsəbeɪt/",
            Definition = "To make a problem, bad situation, or negative feeling worse.",
            ShortDefinition = "To make something worse.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "general",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["aggravate", "worsen", "intensify", "compound", "inflame"],
            Antonyms = ["alleviate", "mitigate", "improve", "relieve"],
            Collocations = ["exacerbate the problem", "exacerbate tensions", "exacerbate poverty", "further exacerbate"],
            Examples = [
                "The drought was exacerbated by poor water management practices.",
                "Cutting funding for education will only exacerbate social inequality.",
                "Stress can exacerbate existing health conditions.",
            ],
            Mnemonic = "EX-ACER-bate: like making an 'ACER' (sharp) problem even sharper — intensifying it.",
            Etymology = "Latin 'exacerbare' — to make harsh, from 'acerbus' (harsh, bitter).",
            CommonMistake = "Often misspelled as 'exasperate' (which means to irritate, not worsen).",
        },
        new()
        {
            Word = "proliferate", Slug = "proliferate", PartOfSpeech = "verb",
            Pronunciation = "pruh-LIF-er-ayt", PhoneticIpa = "/prəˈlɪfəreɪt/",
            Definition = "To grow or increase rapidly in numbers; to multiply.",
            ShortDefinition = "To increase rapidly in number or amount.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "education",
            IsIeltsCore = true, IsAcademicWordList = true,
            Synonyms = ["multiply", "spread", "expand", "escalate", "burgeon"],
            Antonyms = ["dwindle", "decrease", "decline", "diminish"],
            Collocations = ["proliferate rapidly", "nuclear proliferation", "proliferate across", "continue to proliferate"],
            Examples = [
                "Online learning platforms have proliferated since the pandemic.",
                "Misinformation continues to proliferate on social media platforms.",
                "New regulations were introduced to prevent the proliferation of weapons.",
            ],
            Mnemonic = "PROLI-ferate: 'pro' + 'life' → generating more life — multiplying rapidly.",
            Etymology = "Latin 'proles' (offspring) + 'ferre' (to bear).",
            CommonMistake = "Don't confuse 'proliferate' with 'elaborate'. They sound similar but mean very different things.",
        },
        new()
        {
            Word = "alleviate", Slug = "alleviate", PartOfSpeech = "verb",
            Pronunciation = "uh-LEE-vee-ayt", PhoneticIpa = "/əˈliːvieɪt/",
            Definition = "To make suffering, deficiency, or a problem less severe.",
            ShortDefinition = "To reduce pain or a problem.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "health",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["relieve", "ease", "mitigate", "reduce", "lessen"],
            Antonyms = ["aggravate", "worsen", "intensify", "exacerbate"],
            Collocations = ["alleviate poverty", "alleviate suffering", "alleviate pressure", "alleviate symptoms"],
            Examples = [
                "Overseas aid is intended to alleviate poverty in developing nations.",
                "Exercise has been shown to alleviate symptoms of depression.",
                "The government introduced subsidies to alleviate the financial burden on farmers.",
            ],
            Mnemonic = "ALL-EVIATE: ALL light — lifting ALL the weight off, making it lighter.",
            Etymology = "Latin 'alleviare' — to lighten, from 'levis' (light).",
            CommonMistake = "Don't confuse with 'allay' (to diminish fears/concerns) — both mean to reduce but alleviate implies more significant relief.",
        },
        new()
        {
            Word = "pragmatic", Slug = "pragmatic", PartOfSpeech = "adjective",
            Pronunciation = "prag-MAT-ik", PhoneticIpa = "/præɡˈmætɪk/",
            Definition = "Dealing with things sensibly and realistically based on practical considerations.",
            ShortDefinition = "Practical rather than idealistic.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "education",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["practical", "realistic", "sensible", "rational", "down-to-earth"],
            Antonyms = ["idealistic", "impractical", "unrealistic", "dogmatic"],
            Collocations = ["pragmatic approach", "pragmatic solution", "pragmatic decision", "remain pragmatic"],
            Examples = [
                "The government took a pragmatic approach to immigration reform.",
                "A pragmatic leader focuses on solutions rather than ideology.",
                "We need pragmatic policies that can be implemented immediately.",
            ],
            Mnemonic = "PRAGMA = practice in Latin — pragmatic means focused on practice, not theory.",
            Etymology = "Greek 'pragmatikos' — skilled in business/affairs, from 'pragma' (deed, act).",
            CommonMistake = "Not to be confused with 'dogmatic' (blindly following rules without flexibility).",
        },
        new()
        {
            Word = "sustainable", Slug = "sustainable", PartOfSpeech = "adjective",
            Pronunciation = "suh-STAYN-uh-bul", PhoneticIpa = "/səˈsteɪnəbl/",
            Definition = "Able to be maintained at a certain rate or level without exhausting natural resources.",
            ShortDefinition = "Able to continue without harming the environment.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "environment",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["eco-friendly", "renewable", "viable", "lasting", "enduring"],
            Antonyms = ["unsustainable", "destructive", "wasteful", "damaging"],
            Collocations = ["sustainable development", "sustainable energy", "sustainable growth", "sustainable agriculture"],
            Examples = [
                "The UN promotes sustainable development to balance economic growth with environmental protection.",
                "Many companies are switching to sustainable packaging to reduce plastic waste.",
                "Sustainable agriculture practices help preserve soil health for future generations.",
            ],
            Mnemonic = "SUSTAIN + able = able to be sustained — kept going without running out.",
            Etymology = "Latin 'sustinere' — to hold up, maintain.",
            CommonMistake = "Overused in essays — vary with synonyms like 'viable', 'enduring', or 'long-term'.",
        },
        new()
        {
            Word = "detrimental", Slug = "detrimental", PartOfSpeech = "adjective",
            Pronunciation = "det-ruh-MEN-tul", PhoneticIpa = "/ˌdetrɪˈmentl/",
            Definition = "Tending to cause harm or damage; harmful.",
            ShortDefinition = "Harmful or damaging.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "health",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["harmful", "damaging", "injurious", "adverse", "destructive"],
            Antonyms = ["beneficial", "advantageous", "helpful", "positive"],
            Collocations = ["detrimental effect", "detrimental to health", "prove detrimental", "potentially detrimental"],
            Examples = [
                "Excessive screen time can be detrimental to children's cognitive development.",
                "Air pollution has a detrimental impact on respiratory health.",
                "Lack of sleep is detrimental to both physical and mental wellbeing.",
            ],
            Mnemonic = "DETRI-MENTAL: 'detri' like 'destroy' — destroying your mental (and physical) state.",
            Etymology = "Latin 'detrimentum' — damage, from 'deterere' (to wear away).",
            CommonMistake = "Always followed by 'to' — 'detrimental to health', not 'detrimental for health'.",
        },
        new()
        {
            Word = "encompass", Slug = "encompass", PartOfSpeech = "verb",
            Pronunciation = "en-KUM-pus", PhoneticIpa = "/ɪnˈkʌmpəs/",
            Definition = "To include, contain, or deal with a wide range of ideas or topics.",
            ShortDefinition = "To include or surround completely.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "education",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["include", "incorporate", "cover", "contain", "embrace"],
            Antonyms = ["exclude", "omit", "leave out"],
            Collocations = ["encompass a wide range", "encompass all aspects", "encompass the idea", "broadly encompass"],
            Examples = [
                "The term 'wellbeing' encompasses both physical and mental health.",
                "The new curriculum encompasses skills in critical thinking, creativity, and collaboration.",
                "The report encompasses all aspects of urban development.",
            ],
            Mnemonic = "EN + COMPASS: a compass draws a circle to surround everything — to encompass is to include everything.",
            Etymology = "Old French 'encompasser' — to go around, surround.",
            CommonMistake = "Don't use 'encompass' when you mean 'compose'. 'Encompass' = surround/include; 'compose' = make up.",
        },
        new()
        {
            Word = "disparity", Slug = "disparity", PartOfSpeech = "noun",
            Pronunciation = "dis-PAR-uh-tee", PhoneticIpa = "/dɪˈspærɪti/",
            Definition = "A great difference or inequality, especially in an unfair way.",
            ShortDefinition = "A large and unfair difference.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "society",
            IsIeltsCore = true, IsAcademicWordList = true,
            Synonyms = ["inequality", "imbalance", "gap", "discrepancy", "unevenness"],
            Antonyms = ["equality", "parity", "balance", "similarity"],
            Collocations = ["income disparity", "wealth disparity", "gender disparity", "growing disparity", "stark disparity"],
            Examples = [
                "There is a stark disparity in healthcare access between rural and urban areas.",
                "The wealth disparity between the richest and poorest nations continues to grow.",
                "Efforts are being made to address the gender disparity in STEM fields.",
            ],
            Mnemonic = "DIS-PARITY: lacking PARITY (equality) — a gap between two things.",
            Etymology = "Latin 'disparitas' — difference, from 'disparare' (to separate).",
            CommonMistake = "Use 'disparity in' or 'disparity between', not 'disparity of'.",
        },
        new()
        {
            Word = "paramount", Slug = "paramount", PartOfSpeech = "adjective",
            Pronunciation = "PAIR-uh-mownt", PhoneticIpa = "/ˈpærəmaʊnt/",
            Definition = "More important than anything else; supreme.",
            ShortDefinition = "Of the greatest importance; supreme.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "general",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["supreme", "foremost", "primary", "chief", "overriding"],
            Antonyms = ["unimportant", "secondary", "minor", "trivial"],
            Collocations = ["of paramount importance", "paramount concern", "paramount issue", "remain paramount"],
            Examples = [
                "Patient safety is of paramount importance in any healthcare system.",
                "Environmental protection must be a paramount consideration in policy decisions.",
                "The paramount goal of education is to develop independent thinkers.",
            ],
            Mnemonic = "PARA-MOUNT: above the mountain — higher than everything else.",
            Etymology = "Old French 'par amont' — above, from Latin 'per' (by) + 'ad montem' (to the mountain).",
            CommonMistake = "Usually used in the phrase 'of paramount importance', not standalone.",
        },
        new()
        {
            Word = "infrastructure", Slug = "infrastructure", PartOfSpeech = "noun",
            Pronunciation = "IN-fruh-struk-cher", PhoneticIpa = "/ˈɪnfrəstrʌktʃə/",
            Definition = "The basic physical systems of a country or region, such as transportation, communications, and utilities.",
            ShortDefinition = "The basic systems of a country, like roads and utilities.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "technology",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["framework", "foundation", "system", "network", "base"],
            Antonyms = [],
            Collocations = ["infrastructure development", "transport infrastructure", "digital infrastructure", "crumbling infrastructure"],
            Examples = [
                "Investment in infrastructure is crucial for economic development.",
                "Many developing countries lack the digital infrastructure needed for remote work.",
                "The city plans to overhaul its ageing transport infrastructure.",
            ],
            Mnemonic = "INFRA = below/under — infrastructure is the underlying structure that holds society up.",
            Etymology = "French 'infrastructure' — the underlying structure, from Latin 'infra' (below).",
            CommonMistake = "Infrastructure is uncountable — say 'infrastructure' not 'an infrastructure'.",
        },
        new()
        {
            Word = "deteriorate", Slug = "deteriorate", PartOfSpeech = "verb",
            Pronunciation = "dih-TEER-ee-uh-rayt", PhoneticIpa = "/dɪˈtɪəriəreɪt/",
            Definition = "To become progressively worse.",
            ShortDefinition = "To become worse over time.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "health",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["worsen", "decline", "degrade", "decay", "degenerate"],
            Antonyms = ["improve", "recover", "develop", "advance"],
            Collocations = ["deteriorate rapidly", "deteriorating conditions", "health deteriorates", "quality deteriorates"],
            Examples = [
                "The patient's condition began to deteriorate after the second week.",
                "Air quality in major cities has deteriorated significantly over the past decade.",
                "Without maintenance, the building's structure will continue to deteriorate.",
            ],
            Mnemonic = "DE-TERRIOR-ate: 'de' (down) + 'terrior' sounds like 'worse territory' — going to worse territory.",
            Etymology = "Latin 'deteriorare' — to make worse, from 'deterior' (worse).",
            CommonMistake = "Don't forget the 'r' in the middle — 'deteriorate' not 'deterioate'.",
        },
        new()
        {
            Word = "inevitable", Slug = "inevitable", PartOfSpeech = "adjective",
            Pronunciation = "in-EV-ih-tuh-bul", PhoneticIpa = "/ɪnˈevɪtəbl/",
            Definition = "Certain to happen; unable to be avoided or prevented.",
            ShortDefinition = "Impossible to avoid; certain to happen.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "general",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["unavoidable", "inescapable", "certain", "predictable", "unstoppable"],
            Antonyms = ["avoidable", "preventable", "unlikely", "uncertain"],
            Collocations = ["inevitable consequence", "seem inevitable", "virtually inevitable", "inevitable result"],
            Examples = [
                "Conflict seemed inevitable given the long-standing tensions between the two nations.",
                "Technological change is inevitable, and societies must adapt accordingly.",
                "The inevitable consequence of overfishing is the depletion of marine ecosystems.",
            ],
            Mnemonic = "IN-EVIT-able: cannot be EVIT-ed (avoided) — it WILL happen.",
            Etymology = "Latin 'inevitabilis' — unavoidable, from 'in' (not) + 'evitare' (to avoid).",
            CommonMistake = "Often used as a noun: 'the inevitable' — perfectly acceptable in formal writing.",
        },
        new()
        {
            Word = "substantial", Slug = "substantial", PartOfSpeech = "adjective",
            Pronunciation = "sub-STAN-shul", PhoneticIpa = "/səbˈstænʃl/",
            Definition = "Of considerable importance, size, or worth.",
            ShortDefinition = "Large in size, value, or importance.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "general",
            IsIeltsCore = true, IsAcademicWordList = true,
            Synonyms = ["significant", "considerable", "sizeable", "major", "large"],
            Antonyms = ["insignificant", "minor", "negligible", "trivial"],
            Collocations = ["substantial evidence", "substantial investment", "substantial progress", "substantial increase"],
            Examples = [
                "There is substantial evidence that diet affects mental health.",
                "The project requires a substantial investment in renewable energy infrastructure.",
                "The new regulations have led to a substantial reduction in carbon emissions.",
            ],
            Mnemonic = "SUBSTANCE + ial: having real SUBSTANCE — large and meaningful.",
            Etymology = "Latin 'substantialis' — having substance, from 'substantia' (substance, essence).",
            CommonMistake = "Don't use 'substantial' and 'significantly' together — they're redundant.",
        },
        new()
        {
            Word = "contemporary", Slug = "contemporary", PartOfSpeech = "adjective",
            Pronunciation = "kun-TEM-puh-reh-ree", PhoneticIpa = "/kənˈtempərəri/",
            Definition = "Living or occurring at the same time; belonging to or occurring in the present.",
            ShortDefinition = "Existing at the same time or belonging to the present.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "education",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["modern", "current", "present-day", "existing", "coexisting"],
            Antonyms = ["historical", "past", "outdated", "ancient"],
            Collocations = ["contemporary society", "contemporary art", "contemporary issue", "contemporary world"],
            Examples = [
                "Contemporary society faces challenges that previous generations never encountered.",
                "The novel explores themes that are highly relevant to contemporary readers.",
                "Contemporary education must prioritize digital literacy and critical thinking.",
            ],
            Mnemonic = "CON-TEMPO-rary: TEMPO = time — CON (with) + TIME = existing at the same time.",
            Etymology = "Latin 'contemporarius' — at the same time, from 'con' (with) + 'temporarius' (temporary, of time).",
            CommonMistake = "As a noun, 'contemporary' means someone alive at the same time — 'Shakespeare and his contemporaries'.",
        },
        new()
        {
            Word = "inequitable", Slug = "inequitable", PartOfSpeech = "adjective",
            Pronunciation = "in-EK-wuh-tuh-bul", PhoneticIpa = "/ɪnˈekwɪtəbl/",
            Definition = "Not fair or reasonable; unjust.",
            ShortDefinition = "Unfair or unjust.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "society",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["unfair", "unjust", "biased", "discriminatory", "one-sided"],
            Antonyms = ["equitable", "fair", "just", "balanced"],
            Collocations = ["inequitable distribution", "inequitable access", "inequitable system", "deeply inequitable"],
            Examples = [
                "The current tax system is widely regarded as inequitable, favouring the wealthy.",
                "Inequitable access to quality education perpetuates cycles of poverty.",
                "Critics argue that the new policy is fundamentally inequitable.",
            ],
            Mnemonic = "IN-EQUIT-able: IN (not) + EQUIT (equity/fairness) — not fair.",
            Etymology = "Latin 'iniquitatem' — unfairness, from 'in' (not) + 'aequus' (equal).",
            CommonMistake = "Don't confuse with 'inequal' — the correct form is 'unequal', not 'inequal'.",
        },
        new()
        {
            Word = "undermine", Slug = "undermine", PartOfSpeech = "verb",
            Pronunciation = "un-der-MINE", PhoneticIpa = "/ˌʌndəˈmaɪn/",
            Definition = "To weaken or damage someone or something gradually or insidiously.",
            ShortDefinition = "To gradually weaken or damage.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "general",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["weaken", "sabotage", "erode", "subvert", "destabilise"],
            Antonyms = ["strengthen", "support", "reinforce", "bolster"],
            Collocations = ["undermine confidence", "undermine authority", "undermine efforts", "seriously undermine"],
            Examples = [
                "Corruption can seriously undermine public trust in government institutions.",
                "The new policy may undermine the progress made in environmental protection.",
                "Spreading misinformation undermines the credibility of scientific research.",
            ],
            Mnemonic = "UNDER + MINE: digging under a structure, like a mine, until it collapses — weakening from below.",
            Etymology = "Old English 'underminian' — to dig beneath, from 'under' + 'minian' (to dig).",
            CommonMistake = "Always transitive — you undermine something, not 'undermine at' something.",
        },
        new()
        {
            Word = "advocate", Slug = "advocate", PartOfSpeech = "verb",
            Pronunciation = "AD-vuh-kayt", PhoneticIpa = "/ˈædvəkeɪt/",
            Definition = "To publicly recommend or support a cause or policy.",
            ShortDefinition = "To publicly support or recommend something.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "society",
            IsIeltsCore = true, IsAcademicWordList = true,
            Synonyms = ["support", "champion", "promote", "recommend", "endorse"],
            Antonyms = ["oppose", "discourage", "reject", "criticise"],
            Collocations = ["advocate for change", "strongly advocate", "advocate a policy", "advocate the use of"],
            Examples = [
                "Many scientists advocate for stricter carbon emission targets.",
                "The charity advocates for the rights of homeless people.",
                "Health professionals advocate a balanced diet and regular exercise.",
            ],
            Mnemonic = "AD-VOCA-te: AD (toward) + VOC (voice) — to voice support toward something.",
            Etymology = "Latin 'advocare' — to call to one's aid, from 'ad' (to) + 'vocare' (to call).",
            CommonMistake = "'Advocate for' and 'advocate' (without 'for') are both correct: 'advocate for reform' or 'advocate reform'.",
        },
        new()
        {
            Word = "predominantly", Slug = "predominantly", PartOfSpeech = "adverb",
            Pronunciation = "pruh-DOM-uh-nunt-lee", PhoneticIpa = "/prɪˈdɒmɪnəntli/",
            Definition = "Mainly; for the most part.",
            ShortDefinition = "Mainly or mostly.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "general",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["mainly", "primarily", "largely", "mostly", "chiefly"],
            Antonyms = ["partially", "minimally", "rarely"],
            Collocations = ["predominantly male", "predominantly urban", "predominantly white", "predominantly used"],
            Examples = [
                "The workforce in this sector is predominantly female.",
                "The country is predominantly agricultural, with little industrial development.",
                "This disease predominantly affects people over the age of 65.",
            ],
            Mnemonic = "PRE-DOMIN-ant: DOMIN (dominant) — what is dominant or most important comes first (pre-).",
            Etymology = "Latin 'praedominari' — to have power over, from 'prae' (before) + 'dominari' (to rule).",
            CommonMistake = "Don't confuse with 'predominately' — both are correct, but 'predominantly' is preferred in formal writing.",
        },
        new()
        {
            Word = "autonomous", Slug = "autonomous", PartOfSpeech = "adjective",
            Pronunciation = "aw-TON-uh-mus", PhoneticIpa = "/ɔːˈtɒnəməs/",
            Definition = "Having self-government; acting independently without outside control.",
            ShortDefinition = "Self-governing; independent.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "technology",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["independent", "self-governing", "sovereign", "self-directed", "free"],
            Antonyms = ["dependent", "controlled", "governed", "subordinate"],
            Collocations = ["autonomous vehicle", "autonomous region", "autonomous decision-making", "fully autonomous"],
            Examples = [
                "Autonomous vehicles are expected to transform urban transportation.",
                "The region was granted autonomous status within the federation.",
                "AI systems are becoming increasingly autonomous in decision-making.",
            ],
            Mnemonic = "AUTO-NOMOS: AUTO (self) + NOMOS (Greek for law) — self-law, making your own rules.",
            Etymology = "Greek 'autonomos' — living by one's own laws, from 'auto' (self) + 'nomos' (law).",
            CommonMistake = "The noun is 'autonomy' — don't say 'autonomous' when you mean 'autonomy'.",
        },
        new()
        {
            Word = "conjecture", Slug = "conjecture", PartOfSpeech = "noun",
            Pronunciation = "kun-JEK-cher", PhoneticIpa = "/kənˈdʒektʃə/",
            Definition = "An opinion or conclusion formed on the basis of incomplete information; speculation.",
            ShortDefinition = "A guess or speculation without full evidence.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "education",
            IsIeltsCore = false, IsAcademicWordList = true,
            Synonyms = ["speculation", "hypothesis", "supposition", "guess", "theory"],
            Antonyms = ["fact", "certainty", "evidence", "proof"],
            Collocations = ["mere conjecture", "pure conjecture", "conjecture that", "based on conjecture"],
            Examples = [
                "Without evidence, any conclusion would be mere conjecture.",
                "Historians often rely on conjecture when primary sources are unavailable.",
                "The scientist's conjecture was later confirmed by experimental data.",
            ],
            Mnemonic = "CON-JECT-ure: 'ject' = throw (like project, reject) — throwing ideas together without proof.",
            Etymology = "Latin 'conjectura' — a conclusion drawn together, from 'conjicere' (to throw together).",
            CommonMistake = "Don't use 'conjecture' when you mean 'prediction' — conjecture lacks basis; a prediction is usually informed.",
        },
        new()
        {
            Word = "leverage", Slug = "leverage", PartOfSpeech = "verb",
            Pronunciation = "LEV-er-ij", PhoneticIpa = "/ˈlevərɪdʒ/",
            Definition = "To use something to maximum advantage.",
            ShortDefinition = "To use something to gain advantage.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "business",
            IsIeltsCore = false, IsAcademicWordList = false,
            Synonyms = ["utilise", "exploit", "use", "apply", "capitalise on"],
            Antonyms = ["waste", "squander", "ignore"],
            Collocations = ["leverage technology", "leverage data", "leverage resources", "leverage expertise"],
            Examples = [
                "Companies must learn to leverage artificial intelligence to remain competitive.",
                "Developing nations can leverage international aid to build sustainable industries.",
                "The charity leveraged social media to raise millions in donations.",
            ],
            Mnemonic = "LEVER-age: a lever multiplies force — to leverage is to multiply your advantage.",
            Etymology = "From 'lever' — a mechanical tool that provides mechanical advantage.",
            CommonMistake = "Overused in business writing. Consider 'use', 'apply', or 'exploit' for variety.",
        },
        new()
        {
            Word = "unprecedented", Slug = "unprecedented", PartOfSpeech = "adjective",
            Pronunciation = "un-PRES-uh-den-tid", PhoneticIpa = "/ʌnˈpresɪdentɪd/",
            Definition = "Never done or known before; without previous example.",
            ShortDefinition = "Never happened before; unique.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "general",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["unparalleled", "unheard-of", "novel", "unique", "extraordinary"],
            Antonyms = ["common", "typical", "ordinary", "routine"],
            Collocations = ["unprecedented scale", "unprecedented growth", "unprecedented challenge", "historically unprecedented"],
            Examples = [
                "The pandemic created unprecedented challenges for healthcare systems worldwide.",
                "Economic growth at an unprecedented rate has lifted millions out of poverty.",
                "The wildfire season of 2020 was described as unprecedented in its scale.",
            ],
            Mnemonic = "UN-PRECEDENT-ed: no PRECEDENT (no previous example) has existed before.",
            Etymology = "Latin 'prae' (before) + 'cedere' (to go) — nothing has 'gone before' it.",
            CommonMistake = "Don't confuse with 'unpresented' — that's not a word. The correct form is 'unprecedented'.",
        },
        new()
        {
            Word = "coherent", Slug = "coherent", PartOfSpeech = "adjective",
            Pronunciation = "koh-HEER-ent", PhoneticIpa = "/kəʊˈhɪərənt/",
            Definition = "Logical and consistent; forming a unified whole.",
            ShortDefinition = "Logical, consistent, and clearly expressed.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "education",
            IsIeltsCore = true, IsAcademicWordList = true,
            Synonyms = ["logical", "consistent", "clear", "reasoned", "intelligible"],
            Antonyms = ["incoherent", "confused", "contradictory", "illogical"],
            Collocations = ["coherent argument", "coherent strategy", "coherent policy", "logically coherent"],
            Examples = [
                "A high-scoring IELTS essay must present a coherent and well-supported argument.",
                "The government lacks a coherent strategy for dealing with housing shortages.",
                "His speech, while passionate, was not particularly coherent.",
            ],
            Mnemonic = "CO-HERE-nt: things that COHERE (stick together) — a coherent argument holds together.",
            Etymology = "Latin 'cohaerere' — to stick together, from 'co' (together) + 'haerere' (to cling).",
            CommonMistake = "Don't write 'a coherent' when you mean 'coherently'. Use the adjective with nouns, the adverb with verbs.",
        },
        new()
        {
            Word = "marginalise", Slug = "marginalise", PartOfSpeech = "verb",
            Pronunciation = "MAR-jih-nuh-lize", PhoneticIpa = "/ˈmɑːdʒɪnəlaɪz/",
            Definition = "To treat a person or group as insignificant or peripheral.",
            ShortDefinition = "To push someone to the margins of society.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "society",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["exclude", "sideline", "alienate", "isolate", "peripheralise"],
            Antonyms = ["include", "integrate", "empower", "mainstream"],
            Collocations = ["marginalise communities", "marginalise women", "feel marginalised", "marginalised groups"],
            Examples = [
                "Low-income communities are often marginalised in urban development plans.",
                "Minorities can feel marginalised when media fails to represent their experiences.",
                "The policy risks marginalising older workers who lack digital skills.",
            ],
            Mnemonic = "MARGIN-alise: pushing someone to the MARGIN (edge) of the page — and of society.",
            Etymology = "From 'margin' — Latin 'margo' (edge, border).",
            CommonMistake = "British English: 'marginalise'; American English: 'marginalize' — both are correct in their contexts.",
        },
        new()
        {
            Word = "facilitate", Slug = "facilitate", PartOfSpeech = "verb",
            Pronunciation = "fuh-SIL-uh-tayt", PhoneticIpa = "/fəˈsɪlɪteɪt/",
            Definition = "To make an action or process easy or easier.",
            ShortDefinition = "To make something easier or help it happen.",
            CefrLevel = "B2", IeltsBandMin = 6, Category = "education",
            IsIeltsCore = true, IsAcademicWordList = true,
            Synonyms = ["enable", "assist", "promote", "aid", "help"],
            Antonyms = ["hinder", "obstruct", "impede", "complicate"],
            Collocations = ["facilitate learning", "facilitate communication", "facilitate access", "facilitate growth"],
            Examples = [
                "Technology can facilitate communication between people from different countries.",
                "The new road network will facilitate the movement of goods across the region.",
                "Teachers should facilitate critical thinking rather than just transmitting knowledge.",
            ],
            Mnemonic = "FACIL-itate: FACIL (easy in Latin) — to make things easy or FACILE.",
            Etymology = "Latin 'facilis' — easy to do.",
            CommonMistake = "'Facilitate' means to make easier — don't use it to mean simply 'do' or 'help'.",
        },
        new()
        {
            Word = "cognitive", Slug = "cognitive", PartOfSpeech = "adjective",
            Pronunciation = "KOG-nih-tiv", PhoneticIpa = "/ˈkɒɡnɪtɪv/",
            Definition = "Relating to cognition — the mental processes of perception, memory, judgement, and reasoning.",
            ShortDefinition = "Relating to mental processes and thinking.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "health",
            IsIeltsCore = true, IsAcademicWordList = true,
            Synonyms = ["mental", "intellectual", "psychological", "cerebral"],
            Antonyms = ["physical", "emotional", "instinctive"],
            Collocations = ["cognitive development", "cognitive ability", "cognitive decline", "cognitive skills"],
            Examples = [
                "Children's cognitive development is significantly influenced by their early environment.",
                "Studies show that regular physical exercise can slow cognitive decline in older adults.",
                "Language learning has been linked to improved cognitive flexibility.",
            ],
            Mnemonic = "COGN-itive: COGN comes from Latin 'cognoscere' (to know) — relating to knowing and thinking.",
            Etymology = "Latin 'cognoscere' — to know, from 'co' (together) + 'gnoscere' (to know).",
            CommonMistake = "Don't confuse 'cognitive' with 'congenital' (present from birth) — completely different meaning.",
        },
        new()
        {
            Word = "inequity", Slug = "inequity", PartOfSpeech = "noun",
            Pronunciation = "in-EK-wuh-tee", PhoneticIpa = "/ɪnˈekwɪti/",
            Definition = "Lack of fairness or justice; an instance of unfairness.",
            ShortDefinition = "Unfairness or injustice.",
            CefrLevel = "C1", IeltsBandMin = 7, Category = "society",
            IsIeltsCore = true, IsAcademicWordList = false,
            Synonyms = ["injustice", "unfairness", "bias", "discrimination", "imbalance"],
            Antonyms = ["equity", "fairness", "justice", "equality"],
            Collocations = ["social inequity", "address inequity", "health inequity", "educational inequity"],
            Examples = [
                "Health inequities between different socioeconomic groups are well documented.",
                "The report highlighted the persistent inequities in the justice system.",
                "Technology has the potential to either reduce or amplify existing social inequities.",
            ],
            Mnemonic = "IN-EQUITY: lack of EQUITY (fairness) — injustice.",
            Etymology = "Latin 'iniquitas' — unfairness, from 'iniquus' (unequal).",
            CommonMistake = "Don't confuse 'inequity' (unfairness) with 'inequality' (difference in size/amount). They overlap but are not identical.",
        },
    ];

    private sealed record PackSeed(VocabularyPack Pack, IEnumerable<PackWord> PackWords);

    private static PackSeed[] BuildPacks(VocabularyWord[] words)
    {
        var environmentWords = words
            .Where(w => w.Category is "environment")
            .ToArray();
        var societyWords = words
            .Where(w => w.Category is "society")
            .ToArray();
        var healthWords = words
            .Where(w => w.Category is "health")
            .ToArray();
        var educationWords = words
            .Where(w => w.Category is "education" or "technology" or "general")
            .Take(8)
            .ToArray();

        var packs = new List<PackSeed>();

        if (environmentWords.Length > 0)
        {
            var pack = new VocabularyPack
            {
                Slug = "ielts-environment-band-7",
                Title = "Environment & Climate",
                Description = "Essential vocabulary for IELTS environment topics. Covers climate change, sustainability, and ecological issues.",
                Category = "environment",
                IeltsTopicLabel = "Environment",
                BandTarget = 7,
                WordCount = environmentWords.Length,
                IsFeatured = true,
                CoverEmoji = "🌱",
                Color = "emerald",
                SortOrder = 1,
            };
            packs.Add(new PackSeed(pack,
                environmentWords.Select((w, i) => new PackWord { PackId = pack.Id, WordId = w.Id, SortOrder = i })));
        }

        if (societyWords.Length > 0)
        {
            var pack = new VocabularyPack
            {
                Slug = "ielts-society-band-7",
                Title = "Society & Social Issues",
                Description = "Key academic vocabulary for discussing inequality, marginalisation, and social justice in IELTS Writing Task 2.",
                Category = "society",
                IeltsTopicLabel = "Society",
                BandTarget = 7,
                WordCount = societyWords.Length,
                IsFeatured = true,
                CoverEmoji = "🤝",
                Color = "indigo",
                SortOrder = 2,
            };
            packs.Add(new PackSeed(pack,
                societyWords.Select((w, i) => new PackWord { PackId = pack.Id, WordId = w.Id, SortOrder = i })));
        }

        if (healthWords.Length > 0)
        {
            var pack = new VocabularyPack
            {
                Slug = "ielts-health-band-6",
                Title = "Health & Medicine",
                Description = "Vocabulary for IELTS health, medicine, and wellbeing topics.",
                Category = "health",
                IeltsTopicLabel = "Health",
                BandTarget = 6,
                WordCount = healthWords.Length,
                IsFeatured = false,
                CoverEmoji = "🏥",
                Color = "sky",
                SortOrder = 3,
            };
            packs.Add(new PackSeed(pack,
                healthWords.Select((w, i) => new PackWord { PackId = pack.Id, WordId = w.Id, SortOrder = i })));
        }

        if (educationWords.Length > 0)
        {
            var pack = new VocabularyPack
            {
                Slug = "ielts-academic-essentials",
                Title = "Academic Essentials",
                Description = "Core academic vocabulary that appears across all IELTS topics. Ideal for Band 7+ candidates.",
                Category = "general",
                IeltsTopicLabel = "General Academic",
                BandTarget = 7,
                WordCount = educationWords.Length,
                IsFeatured = true,
                CoverEmoji = "📚",
                Color = "violet",
                SortOrder = 4,
            };
            packs.Add(new PackSeed(pack,
                educationWords.Select((w, i) => new PackWord { PackId = pack.Id, WordId = w.Id, SortOrder = i })));
        }

        return [.. packs];
    }
}
