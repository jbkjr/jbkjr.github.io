# Revision triage — Jack's PDF annotation pass

Jack's own detailed read of the glossary, annotated as highlights + notes in Preview on exported PDFs. Each batch is extracted, anchored to `glossary.md`, and triaged into groups by how much discussion it needs. Jack's notes are kept **verbatim** (light trims marked `[…]`).

**Extraction** (repeatable for later batches):

```bash
uv run --with pymupdf python -c "
import fitz
doc = fitz.open('<the annotated PDF>')
for page in doc:
    for annot in page.annots() or []:
        ...  # see /tmp/glossary4-annotations.txt generator; prints HIGHLIGHT + NOTE per annotation
"
```

**Batch log:**

| Batch | PDF                          | Pages | Coverage         | Items | Extracted  |
| ----- | ---------------------------- | ----- | ---------------- | ----- | ---------- |
| B1    | `~/Downloads/glossary-4.pdf` | 2–18  | Parts I → VIII.a | 63    | 2026-06-11 |

**Groups:** **A** — mechanical, applied without discussion · **B** — needs a one-line ruling from Jack, then (where relevant) a sweep · **C** — substantive discussion · **D** — side questions, researched answers inline · **E** — resolved / no action.

Line numbers cite `glossary.md` @ `eda0ccc` (2026-06-11, **before** the Group-A edits below). Items that echo an earlier annotation are folded into the primary item.

---

## A — Mechanical fixes (applied 2026-06-11)

### A1 (= B1.12) — `tathāgatagarbha` mention unlinked — `pabhassara` (II), L99 — **applied**

> HL: "tathāgatagarbha" · Note: "this is not linked for some reason (just the section in the parentheses is)"

Sibling terms in the same sentence (`prabhāsvara-citta` (XII.d), `'od gsal` (XIII.b)) are backticked; backtick spans are what the glossary transform resolves into entry links. `tathāgatagarbha` is a XII.d headword (L816), so wrapping it links it. **Fix:** backticked the mention.

### A2 (= B1.33) — `dukkha` (VI.a) missing back-ref to Part I — L261 — **applied**

> HL: "dukkha" · Note: "no reference made to its entry in Part I?"

Part I `dukkha` (L49) points forward ("cf. VI.a for the three-marks treatment, IX for the 4NT framing") but VI.a never points back — against the bidirectional pattern (cf. VII.a `taṇhā` → "cf. Part I"). **Fix:** added "cf. I for the earliest-stratum predicament-framing" to the VI.a entry.

### A3 (= B1.56) — inline `def-flag:` in `upanisā` — VII.b, L396 — **applied**

> HL: "def-flag:" · Note: "isn't the def-flag usually on a new line?"

Yes — own indented italic paragraph is the dominant convention (~20 instances). `upanisā` embedded it mid-note. **Fix:** split the def-flag into its own indented paragraph. Three other inline cases exist and are **not** Jack-flagged → see B12 for the ruling on normalizing them (`natthika-diṭṭhi` L425, `satori` L836, `tantra` L852).

### A4 (= B1.51) — ten kilesa-vatthūni unlinked — `kilesa` (VI.f), L363 — **applied**

> HL: "lobha, dosa, moha, māna, diṭṭhi, vicikicchā, thīna, uddhacca, ahirika, anottappa" · Note: "is there a reason these are not linked?"

No deliberate reason found — comparable enumerations elsewhere are backticked (cf. L129, L155). **Fix:** backticked all ten. Caveat noted: seven resolve to entries (`lobha`, `dosa`, `moha`, `māna`, `diṭṭhi`, `vicikicchā`, `uddhacca`); `thīna` (only `thīna-middha` exists), `ahirika`, `anottappa` render as code without links — precedented (L113 `cūḷasīla` etc.), but if the mixed rendering bothers you, options are adding `ahirika`/`anottappa` stubs (→ TERMS_TO_ADD candidates) or reverting.

### A5 (= part of B1.27) — `yathābhūta-ñāṇa-dassana` outlier — `pāmojja` (III.c), L197 — **applied**

> Note (Jack, part 2): "also why are we separating 'nana-dassana' with the dash here but not other places?"

Within the **same sentence**, chain (a) spells it `yathābhūta-ñāṇa-dassana` and chain (b) `yathābhūta-ñāṇadassana`. The doc's compound form (used for the SN 12.23-idiom chains) is `yathābhūta-ñāṇadassana` (4 other instances). **Fix:** normalized chain (a)'s spelling to match. The _policy_ question (hyphenated compound vs. spaced adverbial phrase) is B11.

### A6 (sweep-discovered, adjacent to B1.17) — `yathābhūtaṃ-ñāṇadassana` outlier — DN 2 narrative note (III.a), L129 — **applied**

Found while inventorying B1.17: the only instance of a _hyphenated_ `yathābhūtaṃ-` form. It references "step 8's" headword, which is spelled spaced (`yathābhūtaṃ ñāṇadassana`, L120, per the CLAUDE.md spaced-phrase convention — `yathābhūtaṃ` is an adverb). **Fix:** hyphen → space, matching the headword it cites (also lets the backtick span resolve to the step-8 anchor).

### A7 (= B1.53) — `Lit.` capitalized — `upādāna` (VII.a), L384 — **applied**

> HL: "Lit." · Note: "usually we have 'lit' but in this case it may be ok because we ended the previous clauses with a period? just noting that it kind of stood out to me"

The documented convention (CLAUDE.md, Literal-gloss section) is semicolon-separated lowercase `lit.`. **Fix:** changed the preceding period to a semicolon: `…(PED's material-support sense); lit. "taking up."` — the only capitalized instance in the file.

---

## B — Rulings (all 16 decided by Jack 2026-06-11; applied same day)

| Item | Ruling                                                                                                                                                                                            | Outcome                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| B1   | Spaced `/` = dictionary formatting only (multi-headword lists, positional glosses, title tags, Abbreviations block); prose unspaced; exception: keep spaces when an operand has an internal space | swept: 151 converted, 33 kept by exception; codified in CLAUDE.md |
| B2   | Keep spaced em-dashes (file was already 100% consistent)                                                                                                                                          | codified, no edits                                                |
| B3   | American spelling — "tranquility" (doc is otherwise AmE)                                                                                                                                          | applied (5 sites); codified                                       |
| B4   | "destruction" for both -kkhaya entries                                                                                                                                                            | applied                                                           |
| B5   | Drop the "Revulsion" sentence                                                                                                                                                                     | applied                                                           |
| B6   | Flip criterion clause to match headword order                                                                                                                                                     | applied                                                           |
| B7   | Shared-gloss comma form                                                                                                                                                                           | applied                                                           |
| B8   | Fold upādāna pointer into opening mention                                                                                                                                                         | applied                                                           |
| B9   | "flagged here per the Part headnote's criterion"                                                                                                                                                  | applied                                                           |
| B10  | Keep "Sutta" corpus capitalization                                                                                                                                                                | no edit                                                           |
| B11  | Compound `yathābhūta-ñāṇadassana` everywhere nominal (verified vs SN 12.23 ×4 / AN 10.2 ×2 Pāli; DN 2 has only `yathābhūtaṃ pajānāti` ×16 — now flagged at step 8)                                | applied (headword, 4 body sites, index ×2); codified              |
| B12  | Normalize **all** def-flags to own indented paragraph                                                                                                                                             | applied (natthika-diṭṭhi, satori, tantra); codified               |
| B13  | Keep "hedonic tone"                                                                                                                                                                               | no edit                                                           |
| B14  | Parenthesize "(all)" + align rendering sets                                                                                                                                                       | applied (2 sites)                                                 |
| B15  | Drop "intentional activities"                                                                                                                                                                     | applied (2 sites)                                                 |
| B16  | Keep `(Skt: bodhipakṣa-dharma)` compound cite                                                                                                                                                     | no edit                                                           |

Commits: `e45f428` (B2–B16 + CLAUDE.md codifications), slash sweep in the follow-up commit. Original per-item framing kept below for the record.

### B1 (= B1.22, B1.8-part) — Slash conventions: spaced `A / B` vs unspaced `A/B`

> (p9) HL: "/" · Note: "echoing earlier question about '/' conventions - why is this one spaced here but literaly just before we have 'placing/collecting' without the space?"
>
> (p4, second half of the āsavakkhaya note): "another thought regarding the use of '/' - as noted above, i think our usual convention is to use '/' to separate renderings of distinct headwords/terms and ',' to separate different renderings for the same word. in this case, the use of '/' is not confusing because there's only one headword. but i'm wondering if it would be worth to use '/' (without spaces) in such a case and leave the use of ' / ' for separating distinct headwords and/or renderings? would this not better accord with standard use of the slash in everyday language? i feel like usually i see humans write eg 'A/B' and it's only AIs that i see use 'A / B' a lot"

**Current state:** ~309 spaced (`A / B`), ~30 unspaced (`a/b`; mostly inside `lit.` glosses: "placing/collecting," "moving/wandering"). CLAUDE.md's multi-headword rule governs _positional_ slashes (distinct referents) but is silent on spacing for same-term alternates.
**Recommendation:** adopt Jack's proposal — unspaced `A/B` for tight same-term alternates (the lit.-gloss style already does this), spaced `A / B` reserved for separating distinct headwords / positional glosses / quoted alternate renderings. Sweep = case-by-case semantic classification of the ~309 spaced instances; estimate a few dozen actual changes (most spaced slashes are genuinely positional or separate quoted renderings and stay). Codify in CLAUDE.md either way.

### B2 (= B1.23) — Em-dash spacing

> HL: "—" · Note: "similar question as for '/' regarding dash usage - i've always used the em-dash without space on either side (en-dash can be used with the spaces), but LLMs seem to _really_ love putting the space on other side - is there a settled convention here or is it purely stylistic/aesthetic?
>
> (this question does not apply to the use of the em-dash with spaces between the headword and the renderings, which looks/feels better to me)"

**Answer:** purely a style-guide split, both fully legitimate: Chicago/most US book typography sets em-dashes closed (unspaced); AP style and much UK/web typography spaces them (UK print often prefers spaced en-dash). Not an AI-ism per se, but spaced-em is indeed the common web convention LLM text mirrors.
**Current state:** the file is ~100 % consistent: 1,414 spaced em-dashes, zero confirmed unspaced.
**Recommendation:** keep spaced — it's consistent, you like it in the headword—gloss position, and a closed-up sweep would touch ~1,400 sites while splitting the file into two dash styles (closed in prose, open after headwords). If you want closed-up prose dashes anyway, that sweep is mechanical but huge; say the word.

### B3 (= B1.48) — "tranquillity" (BrE) vs "tranquility" (AmE)

> HL: "tranquillity" · Note: "is the one with two l's the british or american spelling? i would've written 'tranquility'. also let's ensure we're being consistent throughout"

**Answer:** two l's = British (also the PED/Bodhi/PTS-literature spelling, which is why it's entrenched in Buddhist studies); one l = American.
**Current state:** 5 instances, all "tranquillity" — already consistent.
**Recommendation:** Jack's call, pure preference. If switching to AmE: 5 edits — but then check the doc for other BrE forms for global consistency (none jumped out in Parts I–VIII).

### B4 (= B1.8-part) — Harmonize khaya renderings: "the ending / destruction of craving" vs "destruction of the āsavas"

> HL: "the ending / destruction" · Note: "for asavakkhaya we say 'destruction of the asavas' - is there a reason for having a difference between the two renderings? should we use 'ending / destruction' for both or just 'destruction'?"

`taṇhākkhaya` (L77) = "the ending / destruction of craving"; `āsavakkhaya` (L74) = "destruction of the āsavas"; same `-kkhaya` head. (Note the I `upadhi` def-flag also has `upadhikkhaye`, and II `khīṇāsava` "whose āsavas are destroyed.")
**Recommendation:** harmonize to "destruction" alone for both (it's the standard khaya rendering; "ending" duplicates what `nirodha`/`anta` vocabulary carries elsewhere) — or, if you want "ending" kept, "ending/destruction" unspaced per B1. One-or-two-line sweep.

### B5 (= B1.10) — Keep/drop "'Revulsion' in older translations" — `nibbidā` (II), L88

> HL: "'Revulsion' in older translations." · Note: "is there a particularly strong reason to even include this?"

**Recommendation:** keep but it's genuinely optional. The case for keeping: "revulsion" is what readers meet in Bodhi's SN/AN (he uses it for nibbidā throughout), so the note pre-empts a real lookup-collision; the glossary does the same service elsewhere ("Standardly X"). The case for dropping: it's not a "Standardly"-formatted note and the older rendering is fading. If kept, consider conforming it to the house format: _Standardly "revulsion" (Bodhi)._

### B6 (= B1.19) — Gloss order not respective — `kusala / akusala` (III.a), L139

> HL: "the criterion being whether an action or quality leads to suffering (dukkha) or to its cessation" · Note: "i guess this is pretty automatically clear which is which but just noting that the ordering here is not respective of the ordering of the original terms, which may not be a problem, since i imagine basically no one would be confused that what leads to suffering is unwholesome rather than wholesome"

Headwords run kusala/akusala; the criterion clause runs suffering-first (akusala-first).
**Recommendation:** flip the clause to "leads to the cessation of suffering (dukkha) or to its arising" so it tracks the headword order — costless precision, no downside. One edit.

### B7 (= B1.7) — `anupadhi / nirupadhi — without substrate / free of acquisition` (I), L53

> HL: "anupadhi (Skt: same) / nirupadhi (Skt: same) — without substrate / free of acquisition" · Note: "are these renderings respective to the two terms or apply equally well to both headwords? just want to make sure we're being consistent in our syntactic conventions - e.g. below we use the slash to separate the distinct/respective renderings for lobha / dosa / moha"

Sharp catch — this collides with the documented multi-headword rule. The slash format signals positional mapping (anupadhi = "without substrate", nirupadhi = "free of acquisition"), but the two glosses are translator-variants of the _same_ upadhi-free goal-state (an-/nir- are both plain negations; "substrate" vs "acquisition" tracks Burford vs Norman, not an-/nir-). They're a synonym pair → shared-gloss-with-commas per CLAUDE.md.
**Recommendation:** `— without substrate, free of acquisition; …` (comma form). One edit.

### B8 (= B1.5) — Double `upādāna` mention+link in one sentence — `anupādiyāno` (I), L38

> HL: "is absent from the Aṭṭhakavagga / Pārāyanavagga; its systematization as DO link 9 belongs to the (still-EBT) four-Nikāya core, later than this earliest stratum →upādāna (VII.a)." · Note: "why the extra mention/link of upadana at the end of this sentence when it's already mentioned and linked at the beginning? is there any benefit to keeping it like this?"

The trailing `→ upādāna (VII.a)` is a house "directional pointer" (go-here-for-the-entry), distinct from the opening _mention_; but in one sentence it does read redundant.
**Recommendation:** keep one: fold the section-pointer into the opening mention — "The abstract noun `upādāna` (clinging; VII.a) is absent from…" — and drop the trailing arrow. One edit.

### B9 (= B1.6) — "flagged here for the same reason" antecedent unclear — `taṇhā` (I), L39

> HL: "flagged here for the same reason" · Note: "wait which reason is the 'same'?"

The intended antecedent is the Part-I headnote criterion (L30: terms flagged here when their non-clinging soteriological use is earliest-stratum-characteristic even though the word recurs pan-canonically). Two sentences of distance breaks the reference.
**Recommendation:** "flagged here per the Part headnote's criterion." One edit.

### B10 (= B1.26) — "Sutta" capitalization — `samādhi` (III.c), L176

> HL: "Sutta" · Note: "is it correct to have this capitalized?"

**Answer:** as used, yes — "Sutta jhāna" (L163), "Sutta samādhi" (L176), "the Suttas" (L178–9) all use _Sutta_ as the corpus proper noun (≈ "the Sutta-piṭaka's"), consistent with the capitalization convention (proper nouns for text corpora). Lowercase "sutta" would be for the common noun ("a sutta").
**Recommendation:** keep; no change. (Flagged as B not D because if you _dislike_ the corpus-adjective usage, the alternative is rewording to "suttanta jhāna/samādhi" or "the suttas' jhāna" — your call.)

### B11 (= B1.17, B1.27-part) — `yathābhūta(ṃ)` form policy

> (p7) HL: "yathābhūta-ñāṇadassana →" · Note: "'yathabhuta-nanadassana' vs 'yathabhutam nanadassana'?"

**Answer / current state:** the variation is (mostly) _deliberate and source-tracking_, not drift: spaced `yathābhūtaṃ ñāṇadassana` (6×) renders the DN 2 idiom where `yathābhūtaṃ` is an adverb (CLAUDE.md spaced-phrase convention); hyphenated `yathābhūta-ñāṇadassana` (now 5×) renders the SN 12.23/AN 10.2 chain-compound (`yathābhūtañāṇadassana` in the Pāli, hyphenated per the paradigm-compound bucket); `yathābhūtaṃ-pajāna` (3×) is the DN 2 verb-idiom. The two true outliers were fixed (A5, A6).
**Recommendation:** ratify the two-form policy and add a line to CLAUDE.md's compound-orthography section stating it explicitly (spaced = adverbial phrase contexts; hyphenated = the lexicalized chain-compound), so future passes don't "fix" one into the other. If you'd rather collapse to a single form everywhere, say which.

### B12 (follow-on from A3) — Normalize the other three inline def-flags?

`natthika-diṭṭhi` (L425), `satori` (L836), `tantra` (L852) also declare `def-flag:` inline. The satori/tantra cases are structurally different (the def-flag _is_ the entry's entire note, opening at the entry line); natthika's is embedded mid-note like upanisā's was.
**Recommendation:** split natthika's to its own paragraph (same fix as A3); leave satori/tantra as-is (an entry whose whole note is a def-flag reads fine inline) — or normalize all four for strictness.

### B13 (= B1.35) — "hedonic tone" vs "hedonic tone/quality" — `vedanā` (VI.b), L271

> HL: "hedonic tone" · Note: "'hedonic tone/quality' or simply 'hedonic tone'?"

Current: "feeling, hedonic tone (pleasant, unpleasant, or neither-pleasant-nor-unpleasant tonal quality of experience)" — "tone" in the gloss, "tonal quality" in the parenthetical.
**Recommendation:** keep just "hedonic tone" (the established term in both philosophy of mind and dharma writing); the parenthetical already supplies "quality." One edit at most.

### B14 (= B1.37) — "(all)" parenthetical in saṅkhāra sense-3 glosses — VI.b L275 / VII.b L397

> HL: "'all conditioned phenomena' / 'all fabrications'" · Note: "should the 'all's be included parenthetically? eg '(all) conditioned phenomena'. and should we also include 'fabrications' here in addition to phenomena/formations?"

The "all" belongs to the canonical formula (`sabbe saṅkhārā…`) rather than to the term itself — saṅkhāra sense 3 means "conditioned thing"; the formula quantifies it.
**Recommendation:** parenthesize: "(all) conditioned phenomena, (all) formations, (all) fabrications" at both sites — and note VII.b L397 already includes "fabrications" while VI.b's sense-3 line has only phenomena/fabrications phrasing; align the rendering set across the two. Two edits. (Rendering-set question overlaps C9.)

### B15 (= B1.52) — "intentional activities" as a saṅkhāra rendering — VI.b L273 + VII.a L377

> HL: "activities" · Note: "idk how i feel about 'activities' (which i don't think we used in the above sankhara listing?) - is this standard?"

**Answer first:** it _is_ used in both places — VI.b's aggregate-4 line (L273) and VII.a's DO-link-2 line (L377) both read "intentional formations, intentional activities," so they're already parallel. Is it standard? "Volitional activities" appears in some of Bodhi's prose explanations but is not a signature rendering the way "volitional formations" (Bodhi), "fabrications" (Thanissaro), or "choices" (Sujato) are.
**Recommendation:** drop "intentional activities" from both lines (keep "intentional formations" + the named-translator alternatives in the note), unless you actively like the activity-register. Two edits.

### B16 (= B1.59) — Pāli spaced vs Skt hyphenated — `bodhipakkhiyā dhammā (Skt: bodhipakṣa-dharma)`, L409

> HL: "-" · Note: "is there a reason/convention why the sanksrit form is hyphenated but not the pali?"

The Pāli is a two-word phrase (inflected adjective + noun — spaced per convention); the cited Skt form is a single compound, hence the hyphen. So the asymmetry is real but motivated. However: the Sanskrit tradition's own term is usually cited as `bodhipakṣya-dharma` / `bodhipākṣika-dharma` (BHS); whether to keep the compound cite or parallel the Pāli phrasing (`bodhipakṣā dharmāḥ`) is a real choice.
**Recommendation:** keep as-is (phrase vs compound asymmetry is legitimate and recurs, e.g. `majjhimā paṭipadā (Skt: madhyamā pratipad)` — both phrases there, but compound-vs-phrase mismatches are attested in the lexica); optionally verify the best-attested Skt citation form in BHS/MW before changing anything.

---

## C — Substantive discussion items

### C1 (= B1.1 + B1.3) — `upādāna` in the Part I headnote — L30

> HL: "Direct soteriology of dropping taṇhā / upādāna / diṭṭhi" · Note: "we're still saying using upadana here after recognizing (below) that the noun does not actually appear in Atthakavagga or Parayanavagga? why?"
> (Supporting highlight, no note: "The abstract noun upādāna (clinging)" — L38.)

The headnote names the triad with the noun the stratum doesn't attest, two entries before the `anupādiyāno` entry explains the noun's absence. Ties directly into the pending anupādiyāno/upādāna split decision (`GLOSSARY_AUDIT.md` §A L38 item; `TERMS_TO_ADD.md` item 11). Candidate wordings: "dropping taṇhā / grasping (upādāna in its later noun-form) / diṭṭhi," or use the participle, or keep the noun as a reader-orienting label with a parenthetical hedge. **Decide together with TERMS item 11.**

### C2 (= B1.2) — English/Pāli asymmetry in the diṭṭhi def-flag — L36

> HL: "eternalism / annihilationism and atthitā / natthitā antinomies" · Note: "why is one in English and the other in Pali?"

"Eternalism / annihilationism" _are_ Pāli doctrines (`sassata-` / `uccheda-diṭṭhi`, X.b headwords) cited by their English labels, while `atthitā` / `natthitā` get Pāli. Options: all-Pāli with English parens — "the `sassata` / `uccheda` (eternalism / annihilationism) and `atthitā` / `natthitā` antinomies" — or leave (English names are the recognizable handles). Small but worth a consistent policy for naming doctrines-by-label vs by-term.

### C3 (= B1.4) — Ordering of "What is to be relinquished" — Part I, L32–45

> HL: "What is to be relinquished" · Note: "may be worth thinking through the optimal ordering of the terms here?"

Current order: diṭṭhi, anupādiyāno, taṇhā, upadhi. Candidate orderings: (a) the headnote-triad order taṇhā → upādāna/anupādiyāno → diṭṭhi; (b) soteriological depth (diṭṭhi as coarsest, upadhi as deepest); (c) attestation-centrality within Sn 4–5. Worth a deliberate choice + a comment in the file so it doesn't look accidental.

### C4 (= B1.9 + B1.14 + B1.16) — nibbidā→virāga chain consistency & "proximate condition" precision — L88, L107, L120

> (p5, `nibbidā` L88) HL: "yathābhūtaṃñāṇadassana →nibbidā →virāga →vimutti (SN 12.23 Upanisā-sutta, etc.)" · Note: "in III.a, we have yathabhutan nanadassana -> vmutti / asavakkhaya -> vimutti-nanadassana, but don't have nibbida and viraga? so why are we saying that here? if the sequence is presented differently in different places, i want to make sure the way we're covering things is ideal"
>
> (p6, Part III headnote L107) Note: "cf my earlier question about nibbida and viraga"
>
> (p6, step 8 L120) HL: "this knowing-and-seeing is the proximate condition for liberation" · Note: "but i thought with the upanisa language/description, they added nibbida and viraga as the proximate and/or supporting conditions for liberation? just want to be sure we're being precise with our technical language"

The substance is already handled well in one place — the III.a "Parallel canonical formulas" bullet (L128) explains exactly the DN 2 vs SN 12.23 divergence (and even cites Schmithausen/Vetter). The problems are (i) `nibbidā`'s entry calling the SN 12.23 chain "the **standard** EBT goal-path sequence" — overclaiming, since DN 2's pericope (no nibbidā/virāga) is at least as standard; and (ii) step 8's "**the** proximate condition for liberation" — in the upanisā idiom the proximate condition of vimutti is virāga, not yathābhūta-ñāṇadassana; the wording borrows SN 12.23's technical term to describe DN 2's chain, which skips those links. Fixes to discuss: reword L88 ("a standard…" / "the SN 12.23 sequence"); reword L120 (e.g. "in DN 2's pericope this knowing-and-seeing conditions liberation directly"); both entries cross-ref the L128 bullet.

### C5 (= B1.11) — Add `vimokkha` as a headword? — Part II — `→ TERMS_TO_ADD` candidate

> HL: "vimokkha" · Note: "we have vimutti and mokkha but not yet vimokkha - should it be included too if it's used in EBT?"

EBT-attested in both schemas the glossary already _mentions_: the `aṭṭha vimokkha` (DN 15 / AN 8.66, cited at `ubhatobhāgavimutta` L81) and the (late-canonical) `vimokkha-mukha` (at `suññatā` L92). Strong candidate: a short Part II entry — `vimokkha (Skt: vimokṣa) — liberation, release` — anchoring the two schema-mentions, with the stratum split already written in those entries. Decision + drafting → queue to TERMS_TO_ADD.

### C6 (= B1.13) — Is `pabhassara` or `pabhassara-citta` the phenomenal-consciousness analogue? — L101

> HL: "pabhassara" · Note: "would it not be that 'pabhassara*-citta*' is the analogue to phenomenal consciousness"

Fair precision point: pabhassara is an adjective ("luminous"); the candidate analogue to phenomenal consciousness is the luminous _mind_ (the AN 1.49 `pabhassaraṃ cittaṃ`), not luminosity itself. The def-flag could read "the luminous citta may be the closest Buddhist analogue…" — but note the entry's last clause already contrasts _pabhassara_ with viññāṇa as "the mind's luminous-knowing register," so the fix should keep that framing coherent. Discuss wording.

### C7 (= B1.18 + B1.20) — Six-abhiññās organizing-convention passage is confusing — L129 + L147

> (p7) HL: "The 'six abhiññās' listing under abhiññā below counts āsavakkhaya-ñāṇa as the sixth — an alternate organizing convention that folds the first DN 2 ñāṇa (body-with-viññāṇa) and manomayiddhi into the fourth-jhāna fruit and counts only the remaining five as numbered abhiññās." · Note: "i'm not sure i'm exactly tracking what's going on here..."
>
> (p8) HL: "The six abhiññās" · Note: "echoing above question about how these are grouped/presented"

What the passage is trying to say: DN 2 lists **eight** post-jhāna ñāṇa-fruits (1 body-viññāṇa contemplation, 2 manomayiddhi, then the six familiar ones); the "six abhiññās" convention keeps only the last six and treats DN 2's first two as unnumbered fourth-jhāna fruits. The sentence compresses this into one breath with "folds…into the fourth-jhāna fruit," which doesn't parse on first read. Rewrite candidate: state DN 2's full eight-fruit sequence first, then "the canonical 'six abhiññās' set = fruits 3–8 of that sequence." Needs a rewrite pass — draft for Jack's approval.

### C8 (= B1.21) — `sampajāno` rendered "fully aware" inside the jhāna formulas — `tatiyajjhāna`, L171

> HL: "fully aware" · Note: "i know that kumara renders sampajanna as 'full awareness' but we ourselves have rendered it as 'clear comprehension,' so should it be 'clearly comprehending' here, or fully stick with Kumara's choices within the section?"

Real policy tension: III.c is explicitly the Kumāra-cluster section (TRANSLATION*CONVENTIONS cluster 1), but `sampajañña` is \_not* part of the samādhi/jhāna cluster — the glossary's own IV entry (L236) establishes "clear comprehension" and even notes "Kumāra renders it 'full awareness.'" Options: (a) "clearly comprehending" at L171 for glossary-internal consistency (recommended — cluster scope is jhāna-vocabulary, not every word inside a quoted formula); (b) keep Kumāra verbatim within III.c and accept divergence. Ruling, then 1 edit.

### C9 (= B1.40 + B1.58) — "construction(s)" as a rendering for saṅkhāra/saṅkhata — L273/L275 + L398 — `→ RENDERINGS_TO_CONSIDER` candidate

> (p13) HL: "con-struction" · Note: "would it be crazy to include 'construction(s)' as an actual rendering here or below in the flag in addition to fabrications? or is that not scholarly/traditionally conventional enough"
>
> (p17, `saṅkhata` L398) HL: "constructed" · Note: "re: earlier question about potentially including 'construction' as rendering for sankhara - might be nice to keep everything parallel with sankhara or sankhata? not a big deal though, the way it is rn is not wrong per se"

Not crazy at all — "constructions" is scholarly-attested (Hamilton, _Identity and Experience_; Sue Hamilton renders saṅkhārā "constructions"; cf. also Ñāṇavīra's "determinations" family). And `saṅkhata` already reads "conditioned, **constructed**, fabricated" (L398), so adding "constructions" to the saṅkhāra slots would complete the paradigm: saṅkhāra:construction :: saṅkhata:constructed :: fabrication:fabricated. Queue to RENDERINGS_TO_CONSIDER with the Hamilton attribution to be spot-checked.

### C10 (= B1.36) — "the other four aggregates are themselves saṅkhārā (conditioned)" — saṅkhāra vs saṅkhata precision — L275

> HL: "the other four aggregates are themselves saṅkhārā (conditioned)" · Note: "i thought 'sankhata' was the adjective form? so sankhara:fabrication::sankhata:fabricated and so on. is this not correct? also, should we consider including sankhata as a headword or at least in the flag here somehow, since it's a term practitioners are likely to encounter?"

The noun-predicate is canonically right (`sabbe saṅkhārā aniccā` predicates the _noun_ of everything conditioned — "the aggregates **are** saṅkhārā [fabrications]"), and the parenthetical "(conditioned)" silently switches to the adjective, inviting exactly Jack's confusion. The headword half is **resolved** (saṅkhata exists at VII.b L398 — see E1); remaining decisions: (i) change "(conditioned)" → "(conditioned things)" or "(= saṅkhata, conditioned)"; (ii) whether the VI.b def-flag should name `saṅkhata` explicitly in sense 3 (it currently says "the noun corresponding to saṅkhata" only in VII.b).

### C11 (= B1.38) — "factors" word-choice in saṅkhāra sense 2 — L275

> HL: "factors" · Note: "why are we using 'factors' here?"

Sense 2 reads "intentional / constructive **factors** led by cetanā" — "factors" here = the ~50 cetasikas the Abhi. files under saṅkhārakkhandha (everything except vedanā/saññā). It's doing Abhi-taxonomy work mid-EBT-def-flag. Candidates: "the intentional / constructive aggregate led by cetanā," or "intentional formations (the cetanā-led aggregate)," or keep "factors" with "(cetasikas, XI.a)" made explicit. Discuss.

### C12 (= B1.39 + B1.42 + B1.43) — saṅkhāra def-flag: are the five senses really five? — L275

> HL: "distinct" · Note: "are the first two really distinct? can we check that they are truly distinct rather than being the same sense of the term used in two lists/places?"
>
> HL: "(4)" · Note: "like the question about the 'distinct'ness of 1 and 2 is 4 truly distinct from 3 here, or would it be better to say something like 'the three here are specific kinds/categorizations of sankharas in the general/3 sense'?"
>
> HL: "Contexts do not reduce to a single gloss" · Note: "this assertion seems like it would be in tension with the previous statement that formations/fabrications 'spans all the uses' as a rendering"

Three connected pressure-points on the same def-flag:

- **1 vs 2:** defensible as one _sense_ (cetanā-led intentional formation) in two doctrinal _slots_ — the flag itself half-concedes this ("senses (1)–(2) are the narrower intentional-factors use"). Restructuring option: "three senses, five canonical slots."
- **4 vs 3:** the kāya/vacī/citta-saṅkhāra triad is genuinely tricky — in MN 44 the triad is _conditioning_ processes (breath conditions body, vitakka-vicāra condition speech), i.e. closer to the active sense than to sense 3's "all conditioned things"; folding 4 into 3 would lose that. But presenting 3/4/5 as "specific kinds/categorizations" has merit for 5 (āyu-saṅkhārā).
- **"Contexts do not reduce" vs "spans all the uses":** real surface tension; the intended claim is "one English _word-family_ can cover all uses (because it shares the active/passive ambiguity), but you still must disambiguate _which_ use per context." Reword to say exactly that.
  Worth one focused discussion; the def-flag is load-bearing (cross-ref'd from VII.a and VII.b).

### C13 (= B1.41) — Is it cetanā that "constructs"? — L275

> HL: "volition" · Note: "is it really volition/intention (cetana) which is said to _do the construction_ traditionally? just want to ensure we're being adequately precise here"

The flag's active-sense line ("the forming, kammically-charged volition that constructs") leans on SN 22.79's `saṅkhatamabhisaṅkharontīti … saṅkhārā` ("they construct the constructed, thus they are called constructions") — there it is the _saṅkhārā themselves_ that construct; the cetanā-identification ("saṅkhārā = the six cetanā-bodies," SN 22.56/57) is also canonical. So "volition that constructs" is a legitimate compression of two sutta moves, but worth making the seam visible (cite SN 22.79 + SN 22.56). Verify citations against bilara before editing (audit discipline).

### C14 (= B1.24 + B1.44) — Treat the vi- prefix once, explicitly? — `vipassanā` L178, `viññāṇa` L277 (also vimutti, vimokkha, vicāra, vitakka, viveka, virāga, vicikicchā…)

> (p9) HL: "vi-" · Note: "same vi- prefix as for vimutti and vimokkha? is it worth saying something about this prefix explicitly, or just stick with the rendering here of vipassana where this information is already implicit?"
>
> (p13) HL: "vi- 'apart, distinct'" · Note: "echoing earlier note on vipassana about vi- prefix (also vimutti, vimokkha?)"

Caution: vi- is polysemous — "apart/asunder/distinct" (viññāṇa, vipassanā), intensive ("vi-mutti" is usually read as intensive/completive "fully released" rather than "released-apart"), and negative/privative in some formations. A single prefix-note would have to carry that nuance or it will mislead. Options: (a) a short "Pāli affix glossary" block in the front-matter (vi-, sam-, anu-, paṭi-, ā-…) — nice reader-service, real work; (b) per-entry lit. notes as now (status quo); (c) a one-line vi- note at `viññāṇa` cross-ref'd from vipassanā. Discuss appetite.

### C15 (= B1.25) — "still / stillness" as secondary ekaggatā rendering — L190 — `→ RENDERINGS_TO_CONSIDER` candidate

> HL: "idiomatically 'still' (Kumāra's preferred rendering" · Note: "worth including stillness as a secondary rendering?"

The entry's gloss slot has only "one-placed-ness" with "still" buried mid-note. Adding "stillness (of mind)" to the gloss would surface Kumāra's actual rendering. Queue to RENDERINGS_TO_CONSIDER (consistent with the cluster-scope: Kumāra governs this section).

### C16 (= B1.27-part) — "running upstream into the jhānas" reads backwards — `pāmojja`, L197

> HL: "samādhi (composure) →yathābhūta-ñāṇa-dassana — running upstream into the jhānas" · Note: "don't the jhannas preceed yathabhuta nanadassana, at least in the gradual training?"

Jack's doctrine is right (jhāna → yathābhūta-ñ-d in the gradual training), and that's also what the chain says (samādhi before yathābhūta). The confusing phrase is "running upstream **into** the jhānas," which was meant as "this chain feeds into / ascends toward jhāna-territory at its samādhi link" but reads as "yathābhūta then jhānas." Reword: e.g. "— the samādhi link opening into the jhānas" or simply drop the clause. One edit once wording agreed.

### C17 (= B1.28) — Note the modern "formless jhānas" label? — III.c, L200–207

> HL: "The Formless Attainments (cattāro arūpa-samāpatti)" · Note: "worth including a note about how these are very commonly modernly labeled as the formless 'jhanas' whereas they were not explicitly described as such in EBT, where they're called 'attainments'?"

Good reader-service and stratum-consistent (the "jhānas 5–8" framing is commentarial/modern; EBT calls them āyatana/samāpatti). Suggested: one italic line under the subsection header — "Modern usage often calls these the 'formless jhānas' (jhānas 5–8); EBT never applies `jhāna` to them, presenting them as `samāpatti` (attainments) / `āyatana` (bases) — the jhāna-label is commentarial-and-later." Verify the "EBT never" claim against bilara before committing (there are edge passages, e.g. AN 9.32–36 sequence framing; the safe wording may be "EBT does not standardly").

### C18 (= B1.30) — "mental objects" as lead rendering of dhammā (4th foundation) — `dhammānupassanā`, L230

> HL: "mental objects" · Note: "are we happy with (leading with) this rendering? 'mental objects' feels potentially too narrow and/or too close to 'contemplation of mind'? is this scholarly standard/convention?"

"Mental objects" is the older convention (Nyanaponika, Soma); current scholarship mostly rejects it for exactly Jack's reason — Bodhi moved to "phenomena," Anālayo argues dhammā here = the _categories/frames_ (hindrances, aggregates, …), Sujato uses "principles," Thanissaro "mental qualities." The entry already hedges with "/ of phenomena / of dhammas; the ambiguity is deliberate." Options: lead with "phenomena" (Bodhi-standard), or with untranslated "dhammas," demoting "mental objects" to the Standardly-note. Recommend: lead "contemplation of dhammas," then "phenomena," then note the older "mental objects." Discuss.

### C19 (= B1.31) — `sampajañña` placement under "Associated terms" — IV, L236 — _(see D2 for the research)_

> HL: "sampajañña" · Note: "is there a reason this is included here under 'associated terms' rather than above in the section which contains sati? was 'sampajanna' not actually mentioned in the satipatthana sutta?"

Research (D2) confirms sampajañña is _in_ MN 10 twice over: the `sampajānakārī` body-exercise and the `ātāpī sampajāno satimā` core formula. "Associated terms" placement is therefore arguably too weak — but the current section structure has the four foundations as the spine, and sati itself gets the headword slot. Options: (a) move sampajañña up beside `sati` with a note on its two roles in the sutta; (b) keep placement, add the two-roles note. Decide after reading D2.

### C20 (= B1.32) — muditā "neither feeling-into … nor concern-for-another's-wellbeing" — `muditā`, L251

> HL: "nor concern- for-another's-wellbeing" · Note: "totally on board with it not being a feeling-into the state of another, but was more suprised about this. is this traditionally supported? i would've thought metta karuna and mudita all involve this concern, unless the thing you're disavowing is the word 'concern' specifically for some reason?"

The note's contrast was aimed at disambiguating muditā from _empathic concern_ (the Batson/Bloom psychological construct ≈ compassion) — i.e. muditā is not karuṇā-directed-at-wellbeing but joy-at-flourishing. Jack's reading is fair though: the brahmavihāras as a family plainly involve other-regarding concern, so "nor concern-for-another's-wellbeing" overshoots. Reword candidate: "muditā is not feeling-into another's state (affective mirroring), and is distinct from karuṇā's concern for their suffering — it is joyful appreciation of their flourishing." Discuss.

### C21 (= B1.34) — Note on "not-self" vs "non-self"? — `anattā` (VI.a), L262

> HL: "anattā" · Note: "worth including anything in the note about why we render as 'not-self' rather than 'non-self'? or is that already included elsewhere"

Not currently explained anywhere. The standard rationale: "not-self" (Thanissaro, Sujato) reads anattā as a _predicate_ ("form is not self" — the canonical usage, SN 22.59) and avoids reifying a metaphysical "non-self" doctrine; "non-self" (Bodhi) is the other major convention. A one-line note in the entry would fit the glossary's rendering-note style. Draft on request.

### C22 (= B1.45 + B1.46 + B1.49) — The citta / mano / viññāṇa triad: renderings + "interchangeable" claim — L277, L302, L346 ★ flagged 3×

> (p13, `viññāṇa` L277) HL: "EBT sometimes treats the three (citta / mano / viññāṇa) as interchangeable" · Note: "but how is this possible if they have distinct meanings? is it citta that would most closely correspond to 'phenomenal consciousness' in english? i have a feeling vinnana would correspond more to the functional sense of consciousness, and obviously mano is referring to 'mind as specifically mental (rather than general) cognition/consciousness, mind as the sixth sense, etc."
>
> (p14, `mano` L302) HL: "citta (mind, heart-mind, VI.f) and viññāṇa (consciousness," · Note: "returning to above question - just want to really be sure about what i'm rendering the three terms as in english and why"
>
> (p15, `citta` L346) HL: "the affective/intentional sense" · Note: "flagging again that i want to just really carefully go through citta / vinnana / mano and the rendering choices"

The big one — deserves its own session. Scope for that discussion: (i) the SN 12.61 "interchangeable" claim (the sutta's point is that the _worldling_ can't disidentify from "yaṃ ca kho etaṃ vuccati cittaṃ itipi mano itipi viññāṇaṃ itipi" — the three names are used for the same referent there, while the technical analyses elsewhere differentiate roles; "interchangeable" needs that nuance); (ii) settled role-glosses: viññāṇa = event-consciousness (object-cognition), mano = mind-as-faculty/sense-base, citta = the mind as affective-intentional center (the thing that gets developed, defiled, liberated); (iii) the phenomenal-consciousness mapping (cf. C6 — the glossary currently gives pabhassara that slot, with viññāṇa explicitly contrasted; Jack's hunch viññāṇa=functional is consistent with that); (iv) whether each entry's gloss + cross-refs state the division of labor identically at all three sites. Pre-reading: Bodhi's SN introduction on the triad; Hamilton ch. on viññāṇa; Johansson _The Psychology of Nirvana_ if wanted.

### C23 (= B1.60) — "factors of awakening" on `bodhipakkhiyā dhammā` collides with bojjhaṅga — L409 vs L443

> HL: "factors of awakening" · Note: "but i thought the 'factors of awakening' is 'bohjjanga'?"

Correct collision: `bojjhaṅga` (L443) is glossed "factor of awakening" — the standard English for that set — while `bodhipakkhiyā dhammā` (L409) lists "factors of awakening" as a secondary rendering of the _37_. Scholarly usage for bodhipakkhiyā is "wings to awakening" (Thanissaro), "aids to awakening," "qualities conducive to awakening" (already the lead gloss). **Recommend:** drop "factors of awakening" from L409 (keep "qualities conducive to awakening" + lit.), leaving "factor(s) of awakening" unambiguously bojjhaṅga's. One edit once approved.

### C24 (= B1.61) — Wrong-view block interrupts the eightfold-path listing — VIII.a, L422–427

> HL: "Wrong view (micchā-diṭṭhi) and the Six Teachers' denials:" · Note: "i know on an earlier pass we decided to put these here and other ditthi terms in another place, but reading this now i don't like the aesthetics of how this interrupts the list of the 8 items of the eightfold path. potential options:
>
> 1. as we have done in earlier places, explicitly ennumerate the 8 and leave the rest as bullets (this is presuming that the list is standardly numbered/ordered, as with the other numbered lists)
> 2. just move the wrong view stuff somewhere else, potentially with the other ditthi terms elsewhere
> 3. something else, even better than these two options?"

Structure today: Wisdom (2 factors) → _wrong-view block (4 entries)_ → Ethical Conduct (3) → Composure (3). A third option that preserves both the micchā-material's VIII.a relevance (MN 117 pairs each factor with its micchā counterpart — that's _this_ section's doctrine) and an uninterrupted eightfold run: **number the eight factors 1–8 across the three division-headers (option 1), and move the wrong-view block to the end of VIII.a as a clearly-set-off appendix block** ("The micchā counterparts and the Six Teachers' denials") after sammā-samādhi. Moving the Six-Teachers material wholesale to X.b (option 2) is defensible but separates it from MN 117, its anchor. Recommend option 1+appendix hybrid; needs Jack's call since it's a structural move (CLAUDE.md: don't reorder without checking).

---

## D — Side questions (researched answers)

### D1 (= B1.15) — How can contentment precede abandoning the hindrances? — `santuṭṭhi` (III.a), L116

> HL: "contentment" · Note: "this is just an aside question - how is contentment supposed to precede the abandonment of the hindrances? isn't it abandoning the hindrances that brings contentment? like, if there's strong restlessness, sensory desire, etc., there can't be contentment. what is the traditional take on this?"

**Answer (researched; DN 2 / MN 27 fetched and quoted verbatim):** No paradox — the gradual training's santuṭṭhi is **requisite-frugality, not an affective state**. DN 2 §66 defines it entirely materially: "content with robes to protect his body and almsfood to sustain his belly; wherever he goes he sets out taking only (his requisites)" — the bird-with-wings simile the glossary already cites. Same formula at MN 27:14.1, where contentment comes even _earlier_ (before sense-restraint). Its function in the sequence is portability / seclusion-readiness: DN 2 §67 has the monk, "endowed with this noble aggregate of moral discipline … and this noble contentment," resort to the secluded dwelling, where hindrance-abandonment then happens. The _felt_ contentment Jack has in mind arrives only after the hindrances drop: seeing them abandoned → pāmojja → pīti → passaddhi → sukha → samādhi (DN 2 §75–76 — the same gladdening-chain as at `pāmojja`, III.c). Commentarial gloss (second-hand, via Bodhi's BPS notes — not directly fetched): threefold santosa — yathālābha- (with what one gets), yathābala- (per one's strength), yathāsāruppa- (per suitability) — applied per requisite. **Possible glossary tweak (Jack's call):** L116 could read "contentment (with the requisites)" to pre-empt the affective misreading.

### D2 (= B1.29) — Is sampajañña an "exercise" in the 21-exercise expansion? — IV def-flag, L216

> HL: "clear comprehension" · Note: "random/side q: is sampajanna listed as an 'exercise' (rather than a mental factor like sati) in the expansion?"

**Answer (researched; MN 10 root text scanned exhaustively):** Yes. sampajañña is in MN 10 in exactly two roles: (i) the definition formula for all four foundations — `ātāpī sampajāno satimā` — as an accompanying quality beside ardency and sati; and (ii) the `sampajānapabba` ("acting with clear comprehension when going forward and returning…"; Sujato: "Situational Awareness"), which **is** body exercise #3 of the 14 in the 21-exercise scheme (ānāpāna, postures, sampajāna, paṭikūla-manasikāra, dhātu-manasikāra, ninefold sivathika = 14; + 1 vedanā + 1 citta + 5 dhammā = 21). Caveat: the explicit "21" tally is commentarial (Papañcasūdanī — arahantship "in twenty-one places," via Soma Thera), not in the sutta itself — consistent with how the IV def-flag already strata-tags the expansion. So: sampajañña-as-activity is an exercise; sampajañña-as-quality is in the formula. → Feeds C19: the "Associated terms" placement is internally consistent (ātāpī and abhijjhā-domanassa, the formula's other elements, also live there), but the entry never mentions that sampajañña occurs in MN 10 itself; minimum fix is one clause noting the double role.

### D3 (= B1.50) — kāma-rāga vs kāma-taṇhā — L360 (cf. L155, L517, L546)

> HL: "kāma-rāga (the sensual anusaya, VIII.g), kāma-taṇhā" · Note: "what, if anything, would be the difference between kama-raga and kama-tanha?"

**Answer (researched; lexica quoted from grep hits, suttas fetched):** Same sensual orientation, different analytic schemas — not two different mental factors. Vibhaṅga 365 _defines_ kāma-taṇhā as a rāga (`kāmadhātu-paṭisaṃyutto rāgo`, "the rāga bound up with the sense-sphere" — PED s.v. kāma-taṇhā). The split is list-membership: kāma-taṇhā = first of the three taṇhās of the 2nd noble truth (SN 56.11 ✓); kāma-rāga = the sensual anusaya (AN 7.11 ✓) and the Abhi.'s name for fetter 4, where the suttas use kāmacchanda (SN 45.179 ✓) — exactly the "successive registers of one sensual defilement" picture the glossary already draws at L155/L517/L546. Etymological flavor differs: taṇhā < √tṛṣ "thirst" (appetitive lack); rāga < √rañj "color" (the mind colored/inflamed). No glossary change needed.

### D4 (= B1.54) — hetu vs paccaya: the traditional cause/condition distinction — VII.b, L393–394

> HL: "hetu (Skt: same) — cause • paccaya (Skt: pratyaya) — condition" · Note: "and what is the traditional account of the difference between 'cause' and 'condition'?"

**Answer (researched; PED/DPD quoted, MN 135 fetched):** A stratum-split answer. **In the suttas they are near-synonyms**, standardly paired in the idiom `ko hetu ko paccayo` ("what is the cause, what is the condition?" — MN 135 ✓; PED: "in the older use paccaya and hetu are almost identical as synonyms," citing D I 53, D III 284). **In the Abhidhamma they differentiate**: paccaya becomes the genus — "condition/relation," the 24 paccayas of the Paṭṭhāna — and hetu narrows to one species, `hetu-paccaya` "root-condition" (first of the 24), where hetu means specifically the six mūlas (lobha/dosa/moha + opposites; PED s.v. hetu; DPD `hetupaccaya` "(abhi) causal condition"). So "cause vs condition" as a _systematic_ distinction is Abhi., not EBT. **Possible glossary tweak (Jack's call):** the bare L393–394 entries could each carry one stratum clause (e.g. hetu: "in Abhi., narrowed to the six roots — `hetu-paccaya`, first of the 24 paccayas (XI.a)").

### D5 (= B1.55) — Is nidāna identical to hetu? — VII.b, L395

> HL: "cause" · Note: "is nidana identical to hetu or distinguished in some way?"

**Answer (researched; PED/DPD quoted, SN 12.11 fetched):** A sutta-level near-synonym of hetu, distinguished by metaphor and idiom-niche, with **no** later technical narrowing (unlike hetu, cf. D4). nidāna is lit. "tying down" (ni + √dā of binding — PED and DPD both ✓): source-as-anchor, vs hetu's impulsion image (Vedic hetu < √hi "impel"). Its niche is the DO orbit: SN 12 is the Nidāna-saṃyutta, and the four-term idiom `taṇhā-nidānā taṇhā-samudayā taṇhā-jātikā taṇhā-pabhavā` (SN 12.11 ✓) stacks it with samudaya/jātika/pabhava; PED lists the whole cluster (hetu, nidāna, samudaya, paccaya, sambhava, pabhava…) as used "apparently without distinction in meaning" (Niddesa usage). Later specialization is literary, not doctrinal: a text's "occasion/preamble"; disease-etiology (Miln). Current line ("source, cause, causal link") is accurate; optionally add `lit. "tying down"` per the lit.-convention.

### D6 (= B1.62) — The "wrong tenfold path" — `micchā-diṭṭhi` note, L424

> HL: "wrong tenfold path" · Note: "not sure if i've ever heard of this - curious to learn more (side question - not necessarily to cause any changes in the doc)"

**Answer (researched; all loci fetched):** Real and canonical. MN 117 (Mahācattārīsaka) is the anchor: "the trainee has eight factors, but the perfected one has ten" (`dasaṅgasamannāgato arahā hoti`) — adding **sammā-ñāṇa** (right knowledge) and **sammā-vimutti** (right liberation) as the arahant's fruits beyond the eight. Each right factor "wears away" (`nijjiṇṇā`) its wrong counterpart, generating the mirrored **wrong tenfold path** ending in micchā-ñāṇa / micchā-vimutti (pseudo-knowledge, false liberation); the rights + wrongs together are the "Great Forty" of the sutta's title. The explicit micchatta ("wrong way") framing is AN 10.103 (✓ — the glossary's existing citation is correct) and AN 10.145. Editing caution for the future: SN 45.1 contains only the eightfold chains — don't cite SN 45 for the tenfold. No glossary change needed.

### D7 (= B1.63) — "Determinism" for the no-cause view? — `ahetuka-diṭṭhi`, L427

> HL: "determinism" · Note: "seems _really_ strange to me to call a view which denies causality 'determinism' - is this actually standard?"

**Answer (researched; DN 2 fetched verbatim, Basham verified):** Yes, standard — and the apparent paradox is the doctrine's own structure. DN 2's Makkhali section couples the no-cause claim ("there is no cause or reason for the corruption … purification of sentient beings"; "one does not act of one's own volition … no power, no energy") with `niyati-saṅgati-bhāva-pariṇatā` — beings are "molded by **destiny**, circumstance, and nature" — and the ball-of-string simile: saṃsāra unwinds for a fixed span, "for the foolish and the astute" alike, unshortenable by any practice. So Gosāla denies _moral/volitional_ causation (kamma, effort) while affirming an all-fixing impersonal order (niyati): "no-cause" and "determinism" are the same doctrine seen from its two faces. Basham's standard monograph (_History and Doctrines of the Ājīvikas_, 1951) treats niyati-vāda as thoroughgoing fatalism/determinism; the label is conventional in the scholarship. Strictly, "determinism" attaches to niyati-vāda; ahetuka-diṭṭhi names the denial-of-moral-causation facet. **Possible glossary tweak (Jack's call):** surface both facets, e.g. "— Makkhali Gosāla's denial (DN 2) that any cause or condition — including one's own effort — defiles or purifies beings; the corollary of his Ājīvika niyati-vāda, the doctrine of all-determining fate."

### D8 (= B1.47) — Is "concomitant" a noun? — `cetasika` (VI.f), L345

> HL: "concomitant" · Note: "is concomitant also a noun? i'm more used to hearing it as an adjective"

**Answer:** yes — standard English noun ("a thing that naturally accompanies something"); and specifically in Buddhist studies, "mental concomitants" is the long-established noun rendering of cetasika (Nārada's and Bodhi's _Comprehensive Manual of Abhidhamma_, PED). No change needed.

_(The em-dash "settled convention?" sub-question from B1.23 is answered inside B2; the "Sutta" capitalization question is answered inside B10; the "activities" recollection-check is answered inside B15.)_

---

## E — Resolved / no action

### E1 (= B1.57) — saṅkhata headword exists — VII.b, L398

> HL: "saṅkhata" · Note: "this answers my earlier question about sankhata"

Self-resolved on Jack's read (the p13 question "should we consider including sankhata as a headword" — it already is, at VII.b). The residual sub-questions live in C10 (name saṅkhata inside the VI.b flag?) and C9 (parallel "construction(s)" renderings).

---

## Queue-routing markers (deferred until Jack's decisions)

- `→ TERMS_TO_ADD`: C5 (`vimokkha`); possibly `ahirika` / `anottappa` stubs (A4 caveat).
- `→ RENDERINGS_TO_CONSIDER`: C9 ("construction(s)" for saṅkhāra, Hamilton-attested — spot-check), C15 ("stillness" for ekaggatā).

## Cross-references to existing working files

- C1 ↔ `GLOSSARY_AUDIT.md` §A "L38 upādāna (structural)" + `TERMS_TO_ADD.md` item 11 — same pending decision; resolve together.
- B1/B2 (slash + em-dash) ↔ CLAUDE.md "Multi-headword entries" section — whatever is ruled should be codified there.
- B11 (yathābhūta policy) ↔ CLAUDE.md "Compound orthography" — add the two-form note there if ratified.
- `GLOSSARY_REVIEW.md` §1–2 items (index regressions, Skt-parenthetical uniformity, Part XII headnote) are independent of this pass and still open.
