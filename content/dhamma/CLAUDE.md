# Dhamma Glossary — Project Conventions

This file captures the editorial conventions for `glossary.md`. Read this before making changes to the glossary. If a convention is ambiguous or absent, ask rather than guess.

## Headword conventions

- **Headword is the Pāli form** when one exists. Sanskrit equivalent always appears in parentheses: `pāli (Skt: sanskrit)`. If the Sanskrit form is IAST-identical to the Pāli, write `(Skt: same)` — do not silently omit. Any IAST-visible spelling divergence (including anusvāra, conjuncts, vowel length) requires the explicit Sanskrit form.
  - Examples: `jhāna (Skt: dhyāna)`, `sati (Skt: smṛti)`, `karuṇā (Skt: same)`, `brahmavihāra (Skt: same)`, `paṭiccasamuppāda (Skt: pratītyasamutpāda)`.
  - Rationale: section-level language-and-stratum annotation (see next section) signals what corpus is canonical for a given section, so the parenthetical must always carry actual information rather than relying on absence.
- For terms that exist only in Sanskrit traditions (Mahāyāna doctrinal terms, Vedāntic vocabulary, etc.), the Sanskrit form is the headword. Add `(Pāli: …)` only when a canonical Pāli cognate with an analogous doctrinal use actually exists; do not list speculative back-formations.
- For non-Indic terms (Tibetan, Greek, Hebrew, German, Japanese, Chinese), use the standard transliteration with the original script in parentheses where useful.

## Section-level language-and-stratum annotation

Every Part title in `glossary.md` carries a parenthetical with at least one slot: the canonical language(s). Pāli-canonical Parts add a second `; stratum` slot to disambiguate the corpus. The stratum slot is dropped when the title or subsection structure already names the stratum (Sanskrit-tradition Parts XII–XIV; non-Indic Part XV). Format:

```
## Part III — The Gradual Training (Pāli; EBT)
## Part XI — Later Theravāda (Pāli; Abhi. + Theravāda comm.)
## Part XII — Mahāyāna — Sūtric (Sanskrit; XII.e in Chinese / Japanese)
## Part XIII — Mahāyāna — Tantric: Vajrayāna, Dzogchen & Mahāmudrā (Sanskrit / Tibetan)
## Part XIV — Vedānta & Indic Comparatives (Sanskrit)
## Part XV — Non-Indic Philosophical / Mystical Comparatives (Greek, Hebrew, German)
```

When a Part spans multiple strata (e.g., a primarily-EBT Part containing a late-canonical or commentarial entry), tag the anomalous term inline with the stratum after the headword. Examples:

- `paṭibhāga-nimitta (Skt: pratibhāga-nimitta) (Visuddhimagga)`
- `khaṇika-samādhi (Skt: kṣaṇika-samādhi) (Theravāda comm.)`
- `bhavaṅga (Skt: bhavāṅga) (Abhi.)`

### Stratum vocabulary

Use these labels consistently:

- `Aṭṭhakavagga` (or `early Sutta Nipāta`) — earliest stratum within the Pāli canon
- `EBT` — four main Nikāyas + Āgama parallels; the canonical pedagogical core
- `EBT — systematic` — EBT material that is clearly systematizing (e.g., the explicit eightfold-path enumeration, bojjhaṅga list, the seven sets grouped as bodhipakkhiya in DN 16)
- `EBT — late-systematic` — EBT material that is demonstrably late-developing organizing frame (e.g., the four noble truths as a master schema unifying the whole teaching)
- `late canon.` — late Khuddaka, late Vinaya, Paṭisambhidāmagga, Niddesa
- `Abhi.` — Theravāda Abhidhamma (Vibhaṅga, Dhammasaṅgaṇi, Paṭṭhāna, etc.)
- `Theravāda comm.` — Buddhaghosa stratum / aṭṭhakathā / Visuddhimagga
- `Sarvāstivāda Abhi.` — Mahāvibhāṣā, Abhidharmakośa
- `Mahāyāna sūtra` — general Mahāyāna sūtra stratum
- `Prajñāpāramitā` — the Prajñāpāramitā sūtra corpus specifically
- `Madhyamaka` — Nāgārjuna and the Madhyamaka commentarial tradition
- `Yogācāra` — Asaṅga/Vasubandhu and the Yogācāra corpus
- `Tathāgatagarbha` — the _Ratnagotravibhāga_ / buddha-nature corpus
- `Vajrayāna` / `tantra` — Indian tantric Buddhism
- `Dzogchen` — Nyingma rdzogs chen
- `Mahāmudrā` — Kagyü phyag chen
- `Vedānta` (specify Advaita / Viśiṣṭādvaita / Dvaita when relevant)
- `Sāṅkhya` / `Yoga` — Indic non-Buddhist systems
- `Greek` / `Christian mystical` / `Hebrew` / `German` / `Japanese` / `Chinese` — for non-Indic comparative

### Why section-level and term-level annotation

Doctrinal stratum is not philological tidiness — it tracks real doctrinal commitments. The glossary must be readable in a way that keeps clear what comes with each entry: whether a term is EBT-ground, a later systematization, Abhidhamma-metaphysical vocabulary (which may be conventionally useful but is not taken as real ontology), Madhyamaka (assented to), or broader Mahāyāna soteriology (viewed skeptically). When stratum is genuinely contested in scholarship, surface the disagreement with a def-flag rather than picking a side silently.

## Sanskrit form conventions

- **Use the technical dictionary stem for Sanskrit -an stem nouns**, _not_ the popular shortened form. So:
  - `ātman`, not `ātma`
  - `karman`, not `karma`
  - `brahman`, not `brahma`
  - `nāman`, not `nāma`
  - `dhāman`, not `dhāma`

  This matches Monier-Williams, Apte, and the standard scholarly convention used in academic Indology (Olivelle, Bronkhorst, Edgerton, etc.). The popular forms (`karma`, `ātma`) are compound-initial allomorphs that 19th-c. theosophical and 20th-c. popular writing treated as base forms; they're not what dictionaries cite.

  Exception: in compounds, the -n correctly drops by Sanskrit sandhi (`karma-yoga`, `nāma-rūpa`, `brahmavihāra`). The compound spellings stay as written. (Whether such a compound is then hyphenated or written solid is governed separately — see _Compound orthography_ below; `brahmavihāra` is solid as a lexicalized term, `nāma-rūpa` / `karma-yoga` hyphenate as paradigm/analytic compounds.)

- **Drop Vedic pitch accents** (the acute over vowels: `bráhman`, `ātmán`) unless quoting Vedic material directly. They're a Vedic-philology notation; classical Sanskrit lost the pitch accent. Disambiguate `brahman` (n., the absolute) vs. `brahman` (m., the deity/priest) using a gender label, not the accent.

- **Use accurate IAST diacriticals.** Macrons, dots above/below — treat any mismatch as a real error. Don't auto-normalize forms; if uncertain, ask.

## Compound orthography (hyphen vs. solid)

Romanized compounds take one of three forms. The policy is **implicit in the existing entries** — followed consistently but, until now, unstated; this codifies it so new headwords stay aligned.

- **Solid (conjoined)** — fully-lexicalized single-concept terms (the "household words" cited as one unit) and compounds where sandhi has already fused the members. Examples: `nibbāna`, `paṭiccasamuppāda`, `satipaṭṭhāna`, `ānāpānasati`, `kāyagatāsati`, `cetovimutti`, `paññāvimutti`, `āsavakkhaya`, `brahmavihāra`, `ariyasacca`, and the sandhi-fused formless attainments (`ākāsānañcāyatana`, `nevasaññānāsaññāyatana`).
- **Hyphenated** — two triggers:
  1. **Paradigm-set members sharing a head noun**, so the family reads as a family: `*-ñāṇa` (insight-knowledges), `*-dhātu` (elements), `*-diṭṭhi` (views), `*-bala` (powers), `*-sacca` (truths), `*-pāramitā`, `*-samādhi` (samādhi types), `*-nimitta`, `*-svabhāva`, `*-rāga`, `*-mūla`, `*-nibbāna`, `*-samāpatti`, `*-yoga`.
  2. **Two-member analytic compounds** (dvandvas and qualifier-noun) where exposing the constituents aids reading: `nāma-rūpa`, `sati-sampajañña`, `thīna-middha`, `uddhacca-kukkucca`, `indriya-saṃvara`, `sammā-diṭṭhi`, `sakkāya-diṭṭhi`, `jarā-maraṇa`, `magga-phala`.
- **Spaced** — genuine multi-word phrases, not single compounds: `majjhimā paṭipadā`, `yathābhūtaṃ ñāṇadassana` (`yathābhūtaṃ` is an adverb, not a compound member).

Governing intuition: **hyphenate to expose structure (especially paradigm membership); write solid when the term is one lexicalized concept or sandhi has already fused it.**

Caveat — a thin overlay is per-term convention, not mechanical. `cetovimutti` / `paññāvimutti` are solid even though structurally they parallel the hyphenated `*-ñāṇa` set, because that canonical pair is conventionally written solid in the literature (Bodhi et al.). When a term has a settled dominant scholarly spelling, follow it; otherwise apply the buckets above. If a new compound is genuinely ambiguous, ask.

## Capitalization

- **Lowercase common nouns** even when philosophically loaded: `ātman`, `brahman`, `dharma`, `karman`, `nirvāṇa`, `mokṣa`, `puruṣa`, `prakṛti`, `jñāna`, `turīya`, `tathāgata` (when used as a doctrinal common noun), etc.
- **Capitalize proper nouns** — names of deities, philosophical schools, and text corpora: `Brahmā` (the deity), `Vedānta`, `Veda`/`Vedas`, `Upaniṣad(s)`, `Hiraṇyagarbha`, `Buddha` (the historical figure), `Tathāgata` (as a title for the historical Buddha).
- **Disambiguate `brahman` (n., absolute) vs. `brahman` (m., priest/deity)** with a gender label, not capitalization. So `brahman (n.)` for the Upaniṣadic absolute; `Brahmā` (capitalized, m. nom. sg.) for the personified creator deity.
- Rationale: IAST is a transliteration of Devanāgarī, which has no case distinction. Layer English capitalization minimally — only where English convention requires it for proper nouns. Matches academic Indology convention (IIJ, JAOS, JIP).

## Structural conventions — 15-Part historical-stratum spine

The glossary is organized **historical-developmentally within EBT first, then later systematizations in order**. _Not_ 4NT-as-master-spine; _not_ goal-first-as-Theravāda-forest-pedagogy. The spine:

```
I.    Earliest Stratum (Pāli; Aṭṭhakavagga / Pārāyanavagga)
II.   The Goal: Nibbāna & Āsavakkhaya (Pāli; EBT)
III.  The Gradual Training (Pāli; EBT)
        III.a Sequence (sīla → indriya-saṃvara → sati-sampajañña → santuṭṭhi → vivitta-senāsana → hindrances → jhāna → yathābhūtaṃ ñāṇadassana → āsavakkhaya)
        III.b Hindrances (pañca nīvaraṇāni)
        III.c Jhāna & Samādhi (EBT formulation only — commentarial apparatus goes in XI.b)
IV.   Satipaṭṭhāna (Pāli; EBT)
V.    Brahmavihāras (Pāli; EBT)
VI.   Understanding Experience (Pāli; EBT)
        VI.a Three Marks
        VI.b Aggregates
        VI.c Sense Bases (āyatana)
        VI.d Elements (dhātu)
        VI.e Form / Name-and-form
        VI.f Mental Qualities & Functions (EBT-attested — covers proto-cetasika and structural mind-terms like citta and ñāṇa that aren't cetasika under the technical 52-cetasika typology; full Abhi. cetasika go in XI.a)
VII.  Dependent Origination & Causal Frame (Pāli; EBT)
        VII.a Twelve Links
        VII.b Causal-Frame Terms
VIII. Path Systematizations within EBT (Pāli; EBT — systematic)
        VIII.a Noble Eightfold Path
        VIII.b Bojjhaṅgas
        VIII.c Faculties (indriya)
        VIII.d Powers (bala)
        VIII.e Proper Strivings (sammappadhāna)
        VIII.f Bases of Power (iddhipāda)
        VIII.g Fetters & Stages of Awakening
IX.   Four Noble Truths as Systematic Frame (Pāli; EBT — late-systematic)
X.    Non-clinging and the Limits of Doctrine (Pāli; EBT)
        X.a Non-clinging themes
        X.b Open questions (avyākata and the limit-points of doctrine)
XI.   Later Theravāda (Pāli; Abhi. + Theravāda comm.)
        XI.a Abhi. systematics
        XI.b Commentarial Jhāna apparatus
XII.  Mahāyāna — Sūtric (Sanskrit; XII.e in Chinese · Japanese)
        XII.a Prajñāpāramitā (the emptiness-pivot corpus, doctrinal source for Madhyamaka)
        XII.b Madhyamaka
        XII.c Yogācāra
        XII.d Broader Sūtra Corpus (bodhisattva-path, trikāya, tathāgatagarbha, pure-land)
        XII.e East Asian Mahāyāna — Chan/Zen (Chinese / Japanese)
XIII. Mahāyāna — Tantric: Vajrayāna, Dzogchen & Mahāmudrā (Sanskrit / Tibetan)
        XIII.a Sanskrit-stratum
        XIII.b Tibetan (Dzogchen / Mahāmudrā)
XIV.  Vedānta & Indic Comparatives (Sanskrit)
        XIV.a Vedānta
        XIV.b Sāṅkhya / Yoga
        XIV.c Epistemology (pan-Indic)
        XIV.d Ethics / Other
XV.   Non-Indic Philosophical / Mystical Comparatives (Greek · Hebrew · German)
        XV.a Greek
        XV.b Hebrew (Kabbalah)
        XV.c German

Note on the Mahāyāna sub-ordering (XII.a–XII.e): chronological-developmental (Prajñāpāramitā → Madhyamaka → Yogācāra → broader sūtra corpus → East Asian Chan/Zen), NOT doxographic-hierarchical. Madhyamaka is placed after its source corpus (Prajñāpāramitā) rather than promoted to the head of the Part. Doctrinal assent is differential — Madhyamaka in a Prāsaṅgika-rangtong reading is taken as philosophically binding; XII.d material is included as vocabulary, not as assented ontology. A headnote at the start of Part XII in glossary.md flags this.
```

- **Definitions are intentionally absent** right now. Don't add them unless explicitly asked.
- **Don't reorder or re-section** without checking first.
- Homonymous terms with different doctrinal contexts get **split entries** with a cross-reference — e.g., `sabhāva` appears under XI.a (Abhi.) with the dhamma-theory sense, and `svabhāva` appears under XII.b (Madhyamaka) as the target of Nāgārjuna's critique. Same phonological word, incompatible doctrinal contexts; the split is the whole point.

## Def-flag convention

Use inline `*def-flag: …*` notes when a term has contested scholarship, multiple senses across strata, or a Pāli/Mahāyāna sense divergence worth surfacing. Current def-flags include: `mokkha` (two homophonous Pāli forms, both OIA reflexes — from OIA `mukhya` "chief" and OIA `*mokṣa-` "release"), `saṅkhāra` (five distinct doctrinal uses), `ekaggatā` (EBT vs. commentarial jhāna-factor status), `vitakka` / `vicāra` (wide/EBT "thinking/considering" reading vs. narrow/commentarial attention-mechanics reading — `abhiniropana` / `anumajjana` in Vism), `taṇhā` (the "craving / aversion as unified clinging-engagement dynamic" reading vs. classical scholarly "craving" alone), `bojjhaṅga` sequence (EBT vs. commentarial), `bodhipakkhiya` (seven sets EBT-grouped, strict "37" is late), `satipaṭṭhāna` (21-exercise expansion scholarship-contested), `dhammakāya` (EBT epithet vs. Mahāyāna doctrinal body), `buddhadhātu` (Pāli relic sense vs. Mahāyāna buddha-nature), three-marks-to-three-doors mapping (anchored at II `suññatā` — symmetric `tilakkhaṇa`-to-`vimokkha-mukha` correspondence is `late canon. / Theravāda comm.`, not EBT lexical fact).

## Literal-gloss (`lit.`) convention

When a term's etymology illuminates a non-obvious rendering choice, append a short inline `lit. "…"` note after the rendering, semicolon-separated: `— rendering; lit. "literal meaning."` Plain text (not italic — etymology is reference content, not metadata). Skip when the rendering already _is_ the literal sense (e.g., `arūpa` = "formless" needs no lit. note). Skip when the etymology is contested or uninformative. Current examples: `samādhi` (lit. "placing/collecting together"), `vicāra` (lit. "moving/wandering about").

## Multi-headword entries

When one entry groups several headwords with `/`, the gloss after the em-dash follows one of two patterns, chosen by whether the headwords denote distinct referents:

- **Positional gloss — slash.** When each headword is a _distinct_ referent, give one gloss per headword separated by `/` mirroring the headword slashes: `lobha / dosa / moha — greed / hatred / delusion`. The parallel slashes signal a one-to-one mapping. Used by `hiri / ottappa`, `kusala / akusala`, `adhisīla / adhicitta / adhipaññā`, `magga / phala / magga-phala`, etc.
- **Shared gloss — comma.** When the headwords name _one_ referent (synonym pairs; base/compound or singular/plural form-variants; cross-language equivalents), give a single gloss for that shared referent; commas inside it are alternative renderings, not positional: `svasaṃvedana / svasaṃvitti — reflexive cognition, self-awareness (of cognition)` (synonym pair); `pasāda / pasāda-rūpa — sensitive matter, sensitive material` (base/compound, one referent).

Never use commas to separate positionally-mapped glosses — that collides with the comma-as-multiple-renderings convention (e.g. `samādhi — composure, collectedness`) and reads as if the glosses were synonyms of a single term.

## Open consistency calls (pending Jack's decision)

These are flagged but not yet resolved. Don't silently fix them — surface them when relevant:

- **Part XIV Vedānta Pāli-cognate notation.** Pāli surface cognates exist for several entries (`puruṣa`/`purisa`, `prakṛti`/`pakati`, `pratyakṣa`/`paccakkha`, `prāṇa`/`pāṇa`, `svarūpa`/`sarūpa`, etc.) but the doctrinal sense is Sanskrit-tradition only. Currently no `(Pāli: …)` parens (matches convention for Skt-only doctrines). Flag for review if Pāli cognates should ever be noted.
- **Dual listings: `sabhāva`/`svabhāva` and `sammuti`/`saṃvṛti`.** Currently split across Parts (Abhi. in XI.a, Madhyamaka in XII.b) with cross-references. If the split ever feels heavy, consolidating with a stratum tag is an option.

## Tradition tagging convention

Term-level tags like `(Abhi.)`, `(Visuddhimagga)`, `(Mahāyāna sūtra)`, `(Yogācāra)` appear inline after the headword when a term's stratum diverges from its Part's default. The tag signals "this doctrine belongs to this stratum — don't expect a Theravāda parallel even if a Pāli cognate is phonologically constructible." Don't list a Pāli back-formation for Mahāyāna-only terms (e.g., `tathāgatagabbha` was dropped as misleading).

## Translation conventions

`TRANSLATION_CONVENTIONS.md` is an **internal working reference** — not cited from the glossary itself. `glossary.md` is intended to read as a standalone document; do not add pointers back to the conventions file from entries.

The conventions file records:

1. Per-entry format for opinionated renderings: a terse italic `*Standardly "X."*` note appended after the gloss when a preferred rendering diverges from the dominant English and a reader is likely to be confused. The note orients the reader; rationale lives in this working file, not in the glossary entry.
2. Clusters of renderings with shared source/rationale. First cluster: Kumāra Bhikkhu 2022 — EBT samādhi/jhāna vocabulary (samādhi = "composure," jhāna-factors as progressive composure rather than absorption mechanics, nimitta = "basis/object" in its general EBT sense). Scope: applies to Parts II–X (EBT); Part XI.b (commentarial apparatus) preserves the commentarial reification through its own distinct vocabulary.

When drafting entries, consult `TRANSLATION_CONVENTIONS.md` for any term in a cluster covered there and apply the preferred rendering. Defer to consensus renderings from `_references/` lexica for terms not in an opinionated cluster.

## Source material

Both files live in iCloud (external to the repo):

- Original word list: `~/iCloud/jbkjr/BUDDHA/dhamma/WORDS` (Jack's non-dual word-phrase list).
- Diacritical-corrected copy: `~/iCloud/jbkjr/BUDDHA/dhamma/WORDS NON-DUAL [...] CORRECTED.txt`.

## Reference dictionaries

`_references/` is a gitignored symlink at `content/dhamma/_references` pointing into `~/iCloud/jbkjr/BUDDHA/dhamma/dhamma glossary/_references/`. One-time setup (run from the repo root):

```bash
ln -s ~/iCloud/jbkjr/BUDDHA/dhamma/dhamma\ glossary/_references content/dhamma/_references
```

Paths below are relative to `content/dhamma/` (where this file and the symlink both live). The folder contains lexica for grep-based lookup during definition writing:

**Sanskrit (Cologne CDSL — SLP1-encoded headwords):**

- `_references/mw.txt` — Monier-Williams Sanskrit-English (1899), 48 MB
- `_references/ap90.txt` — Apte Practical Sanskrit-English (1890), 12 MB
- `_references/bhs.txt` — Edgerton Buddhist Hybrid Sanskrit Dictionary (1953), 7.3 MB

**Pāli (IAST):**

- `_references/ped.txt` — PTS Pali-English Dictionary (1921–25), 6.1 MB, tab-delimited
- `_references/dpd_headwords.tsv` + `_references/dpd_roots.tsv` — Digital Pali Dictionary (active), 109 MB / 252k entries, 50-column TSV; supersedes PED for most entries; Sanskrit cognates in column 15
- `_references/sc_ncped.json` — New Concise Pali-English Dictionary (3.1 MB, 23,860 entries) — concise modern gloss
- `_references/sc_dppn.json` — Dictionary of Pali Proper Names, Malalasekera (1.2 MB, 1,367 entries) — for buddha/bhikkhu/place/sutta names with canonical citations
- `_references/sc_glossary.json` — SuttaCentral one-line glosses (294 KB)

**Tibetan (Wylie via helper script):**

- `_references/monlam_tib_eng.sqlite` — Monlam Tibetan-English (35 MB, 88,938 entries). Headwords stored in Tibetan Unicode, NOT Wylie. Use `python3 _references/lookup_tib.py "rang grol"` — converts Wylie→Unicode via pyewts (`pip install pyewts --break-system-packages` once).

See `_references/README.md` for the SLP1↔IAST conversion table, DPD column reference, JSON-loading recipes, and lookup examples. Always cross-check at least one entry before quoting a definition — OCR/digitization quality varies.

## Working file

`glossary.md` (at `content/dhamma/glossary.md`) — the active draft.

`TERMS_TO_ADD.md` — running queue of headwords flagged during revision passes but not yet drafted. Append candidates here; clear them once the entries land in `glossary.md`. Excluded from the Quartz build.
