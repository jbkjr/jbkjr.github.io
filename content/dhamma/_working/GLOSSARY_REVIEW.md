# Glossary review — Fable, 2026-06-10

A fresh-eyes detailed review of `glossary.md` (all 1,904 lines: body + index), the editorial conventions (`CLAUDE.md`), the audit trail (`GLOSSARY_AUDIT.md`), and both working queues (`TERMS_TO_ADD.md`, `RENDERINGS_TO_CONSIDER.md`). Suspicions verified against the `_references/` lexica (MW, BHS, DPD) where checkable. Citations were **not** re-litigated — the 2026-06-03 adversarial audit covers those; spot-checks all held.

Line numbers are snapshots as of 2026-06-10 — verify before editing.

## Overall verdict

A genuinely impressive document — not a word-list but a doctrinal-epistemological instrument. The 15-part historical-stratum spine is the right architecture for the goal (keeping visible _what commitments come with each term_), the def-flag discipline is consistently honored, and the split-entry policy (`upadhi`/`upādhi`, `sabhāva`/`svabhāva`, the two `viveka`s, the two `avidyā`s) with "the macron is the tell" notes is reader-kindness most glossaries skip. The remaining unreliability lives at the seams: a handful of real bugs (some apparently introduced _by_ the post-audit mechanical edits), convention-consistency gaps, and a few editorial questions for Jack's judgment.

**One-paragraph summary:** architecture, doctrine, and (post-audit) citations are in excellent shape; residual unreliability now lives in _mechanical consistency_ — index lines, directional pointers, abbreviation declarations, Skt-parenthetical uniformity — exactly the layer that drifts when a document is edited heavily by agents in localized passes. All bug-tier items are small, safe fixes.

---

## 1. Bugs worth fixing

1. **Two inverted directional pointers in Part II.**
   - L81 `ubhatobhāgavimutta` says the three vimokkha-mukha are "above" — they're **below**, in `suññatā` (L92).
   - L92 `suññatā` says the aṭṭha vimokkha are "referenced under `ubhatobhāgavimutta` **below**" — that entry is **above**.
   - The entries were evidently reordered at some point; both pointers now point the wrong way.

2. **Two merged lines in the index.**
   - L1164: `**anuttara-samyak-saṃbodhi** — XII.d` and the `_apatrāpya_` cross-ref run together on one line.
   - L1183: same for `**arūpāvacara**` and `_ārūpya-samāpatti_`.
   - The audit verified the index 713/713, so these were almost certainly introduced by the post-audit index re-sort (the pass that moved `abdhātu` and added `jarāmṛtyu`).

3. **Index omission: `cetasika`.** Bold headword at both VI.f (L345) and XI.a, but the index (L1262) lists only XI.a. The index's own policy ("terms with multiple appearances list all locations") and the `dhamma — VI.c (EBT), XI.a (Abhi.)` precedent both say it should read `VI.f, XI.a`.
   - Smaller cousin: the `_dṛṣṭi_` cross-ref (L1301) points to `diṭṭhi (I)` while the bold entry says `I, VIII.g`.

4. **Dangling cross-references.**
   - `kuṇḍalinī` (L977) points to "Vajrayāna `caṇḍālī` (XIII.a) / Tibetan `tummo` (XIII.b)" — **neither headword exists** anywhere in the doc.
   - `visuddhi` (L685) says "cf. II for the general term" — Part II has no `visuddhi` entry (the only general-sense mention is the `saṅkilesa`/`visuddhi` pairing inside `kilesa`, VI.f).
   - Either add the targets or retarget the pointers.

5. **The promised Part XII headnote doesn't exist.** `content/dhamma/CLAUDE.md` says: "Doctrinal assent is differential — Madhyamaka in a Prāsaṅgika-rangtong reading is taken as philosophically binding; XII.d material is included as vocabulary, not as assented ontology. _A headnote at the start of Part XII in glossary.md flags this._" The actual headnote (L711) carries only the chronological-ordering note. Given the differential-assent stance is arguably the most personal editorial commitment in the document, the missing flag matters.

6. **The Abbreviations block doesn't cover the document's own most-used abbreviations.** L24 declares the Nikāya and dictionary abbreviations — but:
   - **EBT** — the single most load-bearing label in the glossary — is never expanded anywhere a site reader can see (defined only in CLAUDE.md, which is build-excluded).
   - Also undeclared: **DO**, **4NT** (used throughout def-flags), **MMK** (~10 uses in XII.b), **OIA**, **PIE**, **BHS**, **YS**, **Spk**, **DĀ/MĀ**.
   - L69 cites "Iti 44" while the block declares "Itiv."
   - A reader-facing standalone document (per the conventions) needs these.

## 2. Convention-consistency items

- **`(Skt: same)` rule violations:** `dvāra` (L647) glossed `(Skt: dvāra)`; `upacāra-samādhi` (L670) glossed `(Skt: upacāra-samādhi)`. Both IAST-identical → should read `(Skt: same)`.
- **Five powers lack Skt parentheticals** (L473–477) while the structurally identical five faculties all carry them (`saddhindriya (Skt: śraddhendriya)` etc.). The four jhāna ordinals (`paṭhamajjhāna`…) and `nīvaraṇa-pahāna` also lack them. If list-item compounds are exempt, the faculties shouldn't have them; if not, the powers need them.
- **Four sammappadhānas are the only Part VIII set given English-only** (L485–488) — no Pāli at all. The AN 4.14 names (`saṃvara-` / `pahāna-` / `bhāvanā-` / `anurakkhaṇā-padhāna`) fit the house style, with a note that the named list comes from the parallel padhāna-sutta rather than the descriptive formula.
- **`jarā-maraṇa (Skt: jarāmṛtyu)`** (L387). Verified: this came from DPD col 15 (and MW has only `jarāmṛtyu` as a headword), so the audit's choice was dictionary-grounded. But DPD col 15 gives _etymological cognates_, and `jarāmṛtyu` is the Vedic/Upaniṣadic compound. The Buddhist Sanskrit DO chain itself — MMK 26, Śālistamba, Mahāvyutpatti — uses `jarāmaraṇa`, IAST-identical to the Pāli. By the same logic that yielded `nirupadhiśeṣa-nirvāṇa` (Buddhist Sanskrit form, not Vedic), this should arguably be `(Skt: same)`, perhaps noting MW lemmatizes only the Vedic compound.
- **`tejo-dhātu (Skt: tejas-dhātu)`** (L320). The sandhi convention says compounds keep sandhi (`nāma-rūpa`, `brahma-vihāra`); in a Sanskrit compound `tejas + dhātu → tejodhātu`, identical to the Pāli (cf. the honored case `cetovimutti (Skt: cetovimukti)`). This entry cites the unsandhied stem instead.
- **`muñcitukamyatā-ñāṇa (Skt: mumukṣā-jñāna)`** (L698). Every neighboring ñāṇa gets a morphological calque; `mumukṣā` is a functional equivalent (desiderative abstract), not a cognate form. Either a "functional equivalent" note or reconsideration.
- **The `@`-notation leak.** `upādāna@VII.a` and `taṇhā@VII.a` (L38–39) are the only two uses of this notation in the published document — the working-notes idiom from TERMS_TO_ADD item 11 escaped into reader-facing text. Everywhere else cross-refs are plain `(VII.a)`.
- **Smaller style nits:**
  - ALL-CAPS emphasis (`NOT`, `ARE`, `IS`, `FROM`) in ~6 entries where house style is italics.
  - Chinese script inconsistency: `zuòchán` uses simplified 坐禅 for the Chinese form while `běnlái miànmù` correctly distinguishes traditional 本來面目 from Japanese 本来の面目; `gōngàn`/`wúxīn` use traditional.
  - "honraino menmoku" → segment as "honrai no menmoku."

## 3. Stratum-precision points (held to the glossary's own standard)

- **`suññatā` (II, L92) claims "the three terms and their use as `vimokkha-mukha` are EBT (MN 43, MN 121)."** The three _terms_ and the three samādhis/cetovimuttis are EBT (SN 43.4, MN 43, MN 121) — but the compound `vimokkha-mukha` and the doors-framing as such are Paṭisambhidāmagga/commentarial, the very stratum the entry correctly assigns to the three-marks mapping one sentence later. The sentence conflates the two; tightening it makes the entry's stratum-discipline self-consistent.
- **Modern-pedagogy material sits untagged inside EBT Parts.** The document's whole apparatus exists to tag stratum divergence inline, yet the Stephen Procter / MIDL block (L325–332) is a full sub-block of VI.d with no marker analogous to `(Theravāda comm.)`, and modern teachers (Kumāra, U Tejaniya, Goenka, IMS, Mahāsi) appear inline throughout III.c and the taṇhā def-flag. Prose attribution does the work informally, but a deliberate convention — even just a recognized `(modern)` register in the stratum vocabulary — would close the one gap in an otherwise airtight tagging system.

## 4. Editorial observations (Jack's call, not errors)

- **Genre drift in the longest entries.** The frontmatter promises "brief glosses and rendering-notes rather than full prose definitions," but `taṇhā` (I), the "Note on DN 2's surface narrative" (III.a), and `pratītyasamutpāda` (XII.b) are now multi-hundred-word doctrinal essays. They're _good_ essays — the taṇhā craving/aversion analysis is the best thing in the document — but the variance (karuṇā: one word; taṇhā: ~250) raises the question of whether mega-entries want a visual/structural distinction, or whether the format statement should just be updated to match reality.
- **VI.c headnote redundancy.** The intro paragraph (L283) and the post-list paragraph (L290) state the same co-reference point — "the lenses remain conceptually distinct even when they pick out one referent" — nearly verbatim, including the mano-dhātu exception, twice within ten lines.
- **CLAUDE.md spine drift** — the conventions file is stale in five places:
  1. Part II title: spine has "The Goal — Āsavakkhaya & Nibbāna"; glossary has "The Goal: Nibbāna & Āsavakkhaya".
  2. VIII.e: spine "Right Strivings" vs. glossary "Proper Strivings".
  3. VIII.g: spine "Fetters & Stream-entry" vs. glossary "Fetters & Stages of Awakening".
  4. III.a sequence in spine omits `vivitta-senāsana`.
  5. Def-flag inventory claims `anicca` is "listed in multiple Parts" — it appears only in VI.a, with no def-flag.

## 5. Coverage candidates (not already in the queues)

Offered as candidates for `TERMS_TO_ADD.md`, not obligations — judged against the stated purpose ("the goal and how to attain it"):

- **yoniso manasikāra** — the doctrinally load-bearing compound; bare `manasikāra` is present, but the MN 2 / AN 1 "appropriate attention" term is arguably more central to the path than half of VI.f.
- **saṃvega** — the canonical urgency-affect; conspicuous next to `appamāda`.
- **vimokkha** — as its own Part II headword; currently doing heavy work while buried inside two other entries.
- **upakkilesa** — defined in passing twice (in `kilesa` and `pabhassara`).
- **antarābhava** — already referenced from `bardo` (XIII.b).
- **caṇḍālī / tummo** — would also repair the dangling `kuṇḍalinī` pointer (§1.4).
- Also: the **hiri/ottappa correctness flag** in `RENDERINGS_TO_CONSIDER.md` (shame possibly mapped to the wrong member) is still open and is the one item there to prioritize — DPD's inward/outward split is real.

## 6. What's working well (for the record)

- The stratum spine + def-flag discipline: contested scholarship surfaced rather than silently resolved (vitakka/vicāra, ekaggatā, 4NT-as-late-frame, satipaṭṭhāna 21-exercise).
- Split-entry policy and the "macron is the tell" notes.
- The Kumāra rendering cluster applied consistently across Parts II–X (samādhi = "composure" carried through VIII.a/b/c/d).
- The defilement-architecture cross-linking (kāmacchanda/byāpāda vs. kāma-rāga/paṭigha across roots → hindrances → fetters → anusayas).
- The iddhi-vs-siddhi and muni/mona etymology notes — exactly the right level of restraint.
- Part XV epistemic hygiene (the headnote disclaimer; "structural analogy, not doctrinal equivalence").
- The index: folded-diacritics sort verified correct in spot-checks; italic Skt cross-refs work well.
