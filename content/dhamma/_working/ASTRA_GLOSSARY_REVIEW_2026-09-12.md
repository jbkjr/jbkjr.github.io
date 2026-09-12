# Astra’s review of the Dhamma glossary — September 12, 2026

**Implementation follow-up — September 12, 2026.** At Jack’s request, applied the straightforward corrections below: contact/consciousness; the AN 6.63 quotation and grammatical overclaim (retaining the adopted doctrinal interpretation); MN 27 versus DN 2; the pīti attribution; canonical balancing and seven-purifications antecedents; parinibbāna’s lexical scope; “untranslated”; the Sammlung prefix claim; minor `(Skt: same)` consistency; and misleading cross-references to absent entries. Also qualified the fetter/anusaya correspondence and corrected the denial of a sammā/micchā contrast while retaining “proper.”

Search now retains distinct words and contextual senses, recognizes Sanskrit/Pāli/Wylie equivalents and explicit “Standardly” renderings, maps positional glosses to their headwords, and prefers exact matches. Added conventional-rendering notes to the eight path factors. Exact-spelling inline and index links now distinguish upadhi from upādhi, while existing bare and section anchors remain available. Term counts count distinct headwords rather than repeated senses.

The broader philosophical and historical judgments, translation changes, Sanskrit-equivalent policy, new headwords, bibliography, entry-layout redesign, and printed-index policy remain pending. The original review below records the draft before this implementation pass.

Reviewed the current source of [the glossary](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md), its editorial and translation conventions, selected working notes, and the code that generates glossary search data. Read the substantive entries throughout Parts I–XV and checked the index mechanically and through targeted inspection. Verified selected consequential claims against primary texts, the local DPD, and scholarly sources. This is a thorough editorial and conceptual review with targeted verification, not certification of every citation, Sanskrit equivalent, or historical claim. No glossary content or application code was changed. The published web layout and PDF were not visually audited.

Line references below describe the source as reviewed and will move with subsequent edits.

**Overall assessment**

The glossary’s distinctive achievement is teaching readers to notice differences that English translations can conceal: different functions of saṅkhāra; the roles of citta, mano, and viññāṇa; the changing significance of sabhāva/svabhāva; and the difference between resemblance across traditions and doctrinal identity. Those distinctions give it value beyond a list of translations.

Its principal weakness is uneven confidence. A brief gloss can be followed by a long argument whose historical or philosophical premises receive less qualification than the headword itself. The result sometimes makes a preferred interpretation look like a finding established by philology. This is especially consequential in a document whose organizing principle is to distinguish historical strata.

The draft also seems more fully developed as a record of difficult interpretive conversations than as a reference for a reader encountering the vocabulary. Consider the attention given to the genealogy of English “concentration” versus the very brief entry for paññā. The former has intellectual interest; the latter is more central to the stated purpose of understanding the goal and how to attain it. A revision should rebalance that attention without turning every entry into a full definition.

I would preserve the contextual organization, split entries, Pāli-first policy, and opinionated renderings. I would revise the evidence standards, reduce repetition, and improve discovery before adding much more vocabulary.

**What I would preserve**

- The map of saṅkhāra’s different uses, especially the warning that MN 44’s bodily/verbal/mental formations cannot simply be substituted for the identically named dependent-origination categories. The map itself is excellent; some claims attached to it need separate scrutiny.
- The distinction between suffering as something to understand and craving as something to abandon. The four functions in Part IX make the vocabulary practically intelligible.
- Contextual cross-references among roots, hindrances, fetters, and latent tendencies. They help readers see why lists overlap without assuming that their members have identical functions.
- The convention of retaining familiar translations alongside preferred ones. This is essential for a glossary that uses “composure,” “settling,” and “proper.”
- The willingness to state an authorial standpoint. Readers benefit from knowing the philosophical commitments informing the selections. The next step is to make the boundary between that standpoint and a tradition’s self-description more consistent.
- The explicit caution about comparisons in Part XV. The comparative material can remain a useful part of the project if the entries honor that caution individually.

**Corrections and clarifications I would prioritize**

1. **Contact and consciousness are explained in the wrong relationship. High confidence.**

   At [line 296](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:296), the VI.c note says that consciousness arises from base and object “via phassa.” In the formula at MN 18, consciousness arises dependent on the sense faculty and its object; contact is the conjunction of those three. The current wording makes contact sound like the intervening event that produces consciousness. [MN 18](https://www.dhammatalks.org/suttas/MN/MN18.html).

   Suggested replacement: “Dependent on a sense faculty and its object, the corresponding consciousness arises; their conjunction is contact, which conditions feeling.” This states the formula without asserting a sequence of separately measurable cognitive instants.

2. **The cetanā note quotes a framing question absent from the checked Pāli text. High confidence for the checked edition.**

   At [line 355](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:355), the note presents `katamañca, bhikkhave, kammaṃ?` as AN 6.63’s framing question. In SuttaCentral’s Pāli edition, the relevant section instead reprises the injunction to understand kamma and its conditions, asks what that statement refers to, and gives the cetanā formulation. See segments 33.1–33.5 of the [Pāli text](https://raw.githubusercontent.com/suttacentral/bilara-data/published/root/pli/ms/sutta/an/an6/an6.63_root-pli-ms.json).

   Remove the purported quotation or identify a specific edition containing it. More fundamentally, the claim that every kamma is intention but not every intention is kamma cannot be established by choosing which English noun appears as the subject. The distinction between ordinary action, karmically productive intention, and an arahant’s activity needs doctrinal argument independent of English syntax. The immediate continuation also speaks of acting through body, speech, and mind after intending. [AN 6.63 translation](https://www.dhammatalks.org/suttas/AN/AN6_63.html).

   Preserve the useful warning about karmic productivity, but present it as an interpretive qualification. “Keeping kamma as subject blocks the misread” overestimates what the translation can establish. The same claim is repeated under kamma in VII.b and should be revised together.

3. **MN 27 is wrongly cited for the six-knowledge sequence. High confidence.**

   The [abhiññā entry, line 149](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:149), attributes the six knowledges and the availability of the first five to DN 2 and MN 27 together. MN 27 presents the three knowledges: recollection of past lives, the passing and reappearance of beings, and the ending of the taints. It does not supply the six-member sequence as described. [MN 27](https://www.dhammatalks.org/suttas/MN/MN27.html).

   Cite DN 2 for the fuller sequence and identify MN 27 separately as a three-knowledge presentation. Also qualify “repeated nearly verbatim” in the Part III introduction: distinguish a shared training pattern from identity of all stages and terminal fruits.

4. **The pīti note misattributes a translation to Ṭhānissaro. High confidence.**

   At [line 192](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:192), “Joy (Thanissaro, Kumāra)” is misleading. Ṭhānissaro’s MN 27 renders the relevant jhāna term as “rapture,” alongside “pleasure.” Keep “joy” as the glossary’s preference, but remove the unsupported attribution or identify the specific passage intended. [MN 27](https://www.dhammatalks.org/suttas/MN/MN27.html).

   The additional claim that a bodily rapture reading does not track sutta usage needs its own argument. The history or connotations of an English word cannot by itself rule out a phenomenological interpretation.

5. **Canonical balancing of awakening factors needs to be acknowledged. High confidence; distinction required.**

   The [VIII.b note, line 458](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:458), distinguishes canonical sequential development from a commentarial balancing-pairs framework. That may be defensible for a specific later pairwise arrangement, but it leaves a misleading impression about balancing generally. SN 46.53 already differentiates the factors appropriate to sluggishness from those appropriate to restlessness, with mindfulness appropriate throughout. [SN 46.53](https://www.dhammatalks.org/suttas/SN/SN46_53.html).

   Suggested addition: “The suttas also teach contextual balancing: investigation, energy, and pīti counter sluggishness; tranquility, samādhi, and equanimity counter restlessness. Specific pairwise and path-moment systematizations should be identified separately.” This preserves the useful distinction without relocating the whole balancing principle to the commentaries.

6. **The seven purifications have a canonical antecedent worth stating. High confidence.**

   The [visuddhi entry, line 698](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:698), identifies the seven-purifications scheme with the Visuddhimagga spine. That is appropriate to its location, but MN 24 already presents the seven purifications and their relation to liberation. The later contribution is the detailed architecture and exposition, not the mere existence of the sevenfold sequence. [MN 24](https://www.dhammatalks.org/suttas/MN/MN24.html).

   Suggested wording: “Purification; the seven purifications are listed in MN 24 and receive extensive systematic development in the Visuddhimagga.” Similar checks would improve the treatment of kasiṇa and anussati: distinguish early vocabulary from its later arrangement and apparatus.

7. **Parinibbāna is too narrowly presented as death-only vocabulary. High confidence that its lexical range is broader.**

   At [line 69](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:69), the entire gloss and note identify it with an arahant’s death. The local DPD distinguishes extinguishing of mental defilement, extinguishing of fire, and an arahant’s final death. A glossary organized around contextual senses should acknowledge that range rather than make the death-context sense exhaustive. [Local DPD](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/_references/dpd_headwords.tsv), entries `parinibbāna 1–3`.

   A short qualification is enough: “Complete extinguishing; in death narratives, an arahant’s final passing away.” Retain the useful comparison with the two nibbāna-elements while marking its scope.

8. **Small linguistic corrections should accompany the substantive pass.**

   “Left untransliterated” should be “left untranslated” in the nibbāna, kamma, arahant, kasiṇa, bodhisattva, and bodhicitta notes. The Romanized forms are already transliterations.

   At [line 180](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:180), the German Sammlung comparison need not claim the “same sam- prefix.” German sammeln has its own attested morphological history; a semantic parallel or possible deeper historical relationship is different from a shared productive prefix. Preserve the analogy and remove the unsupported morphological shortcut. [Duden: sammeln](https://www.duden.de/rechtschreibung/sammeln).

   At [line 39](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:39), anupādiyāno is a participle, whereas the parenthesized anupādāna does not transparently give the corresponding participial form. The local DPD explicitly supplies a participial Sanskrit comparison for anupādiyāna. Clarify whether a parenthesis supplies a morphological cognate, an attested Buddhist Sanskrit equivalent, or merely a related concept. This is a policy question with consequences beyond this entry; do not mechanically replace all equivalents from one dictionary column.

**Interpretive improvements: these call for judgment rather than automatic correction**

**Separate attestation, chronology, interpretation, and preference.** A text can attest a word without establishing that word’s earliest use. A list can be canonical while its later integration into a system is not. An early attestation does not by itself establish philosophical priority. A preferred translation does not settle the history of the experience being described.

The [Part IX headnote](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:573) already does something valuable by calling its developmental account a hypothesis and acknowledging dissent. Apply that standard to statements such as āsavakkhaya “predates and underwrites” nibbāna/vimutti vocabulary, the sharp early-versus-late contrasts in Part I, and claims that a particular translation restores the original meditation experience. Anālayo’s treatment of the four truths offers an actual argument for the alternative position, rather than merely a dissenting name. [Early Buddhist Meditation Studies, pp. 101–108](https://www.buddhismuskunde.uni-hamburg.de/pdf/5-personen/analayo/ebms.pdf).

I would keep the fifteen Parts but describe their order as an editorial route through texts and traditions informed by historical scholarship. It cannot bear the implication of an uncontested chronology of the whole teaching. The EBT category is primarily a corpus designation, not a precise date attached to every sentence within it.

**Give Yogācāra the same interpretive generosity given to Madhyamaka.** The [tathatā notes](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:604) characterize Yogācāra developments as ontologically reifying, while Madhyamaka is explained through a sophisticated reading that carefully avoids reification. That is an uneven comparison. The Yogācāra section itself partly recognizes this by distinguishing the three natures from strong inherent existence.

State a representative Yogācāra understanding first, then mark the criticism as coming from the preferred Madhyamaka perspective. Interpretations of Yogācāra are contested: Dan Lusthaus, for example, argues for an account centered on the cognitive conditions that produce attachment to ontological theories. That does not settle the debate in his favor; it demonstrates why a blanket “reifying” description is inadequate. [Lusthaus, What is and isn’t Yogācāra](https://www.acmuller.net/yogacara/articles/intro.html).

**Protect the distinction between dependent designation and linguistic labeling.** The [Madhyamaka pratītyasamutpāda entry](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:744) is one of the most interesting passages. Its cup example is useful. But “the thing/name distinction … collapses” invites the inference that an object is identical to a word or that naming produces objects. The entry’s qualifier about the Prāsaṅgika reading helps, but the terminal claim is still stronger than the explanation warrants.

Within the chosen reading, explain the absence of an independently established object without erasing the conventional distinction between a name, the act of designation, and what is designated. This is a request for conceptual precision within the glossary’s own commitments, not a request to substitute realism.

**Broaden the account of early emptiness.** The early/late distinction is useful, but describing early suññatā only through meditation can make the transition to later philosophy too abrupt. SN 35.85 applies emptiness of self and what belongs to self across the sense domain; SN 22.95 describes the aggregates as empty and insubstantial. Neither passage by itself establishes the full Madhyamaka account, but both deserve a place in the bridge. [SN 35.85](https://www.dhammatalks.org/suttas/SN/SN35_85.html), [SN 22.95](https://www.accesstoinsight.org/tipitaka/sn/sn22/sn22.095.than.html).

**Keep samādhi = composure; reduce the burden placed on the translation.** I find “composure” an effective rendering: it suggests a quality of the whole person or mind and connects naturally with the training’s affective development. That practical merit can stand without proving that “concentration” necessarily implies forceful fixation, or that “absorption” necessarily imports the entire Visuddhimagga apparatus.

The III.c headnote already attributes the approach to Kumāra. Use “in the reading adopted here” at consequential interpretive transitions. Etymologies and cross-language analogies should illuminate the reading, not serve as decisive evidence about meditation phenomenology. This is especially relevant to ekodibhāva: a proposed derivation should not be presented as an unqualified literal gloss before its disputed status is explained.

**I am less persuaded by sammā = proper.** This is an editorial preference, not an error. “Proper” can sound socially conformist or etiquette-bound, so it does not obviously avoid the unwanted connotations of “right.” More importantly, the claim that the word has no moral right/wrong contrast is too strong: MN 117 explicitly contrasts proper/right and wrong view and conduct. [MN 117](https://www.dhammatalks.org/suttas/MN/MN117.html).

The glossary can retain “proper” while giving the narrower rationale: it is chosen to emphasize appropriate, complete, or correct practice. That does not require disqualifying the conventional translation. “Right view” should remain discoverable in search.

**Reconsider the pabhassara comparison with phenomenal consciousness.** Calling it perhaps the closest Buddhist analogue is marked interpretive, which is good, but the analogy remains underexplained. A term describing luminosity and its relation to defilement is doing different work from a category intended to cover what experience feels like generally. The glossary needs to say what the analogy captures and what it excludes. Its neighboring citta/viññāṇa distinction should not quietly become a theory of two separate layers of consciousness. [Current entry](/Users/jbkjr/dev/jbkjr.github.io/content/dhamma/glossary.md:101).

**Reduce schematic equivalences where a list does not support them.** In VIII.g, bhava-rāga is called the one slot where the anusaya and fetter lists fail to align; the lists also differ in membership, for example regarding uddhacca and sīlabbata-parāmāsa. The useful point is that one becoming-related category corresponds approximately to two higher fetters, not that the taxonomies otherwise match one-to-one. Likewise, “paṭigha — the latent tendency, not a momentary state” transfers the specificity of paṭighānusaya onto the bare word too readily.

**Editorial changes with the highest return**

1. **Give the reader a short orientation before the technical format paragraph.** Say who the glossary is for, that the sequence is an editorial organization informed by historical scholarship, and how to use the index/search for lookup. Move the details of plural endings out of the opening encounter.

2. **Use a consistent two-level entry.** The first level gives a gloss, context, and one important distinction. The second holds translation rationale, contested scholarship, and citations. On the web the longer note could be expandable; in the PDF it could be a clearly distinguished note. Preserve the substance of the long saṅkhāra and cetanā discussions while reducing the amount a reader must traverse during lookup. “Usage note” or “Interpretive note” is a friendlier public label than “def-flag.”

3. **Shorten the argumentative passages before lengthening short entries.** Remove repeated accounts of the same defilement relationships and the repeated VI.c account of the sensory apparatus. Long stretches of italic prose are also hard to scan; reserve italics for short notes and use normal text for sustained discussion.

4. **Add brief discriminators where the ordinary English gloss is insufficient.** Paññā versus ñāṇa, the different senses of upekkhā, and nāma in the dependent-origination context deserve attention. This can be done with a clause and a source rather than full definitions. The goal is to help a reader recognize the intended sense, not to standardize every entry to the same length.

5. **Prioritize omissions by the glossary’s own purpose.** The strongest candidates are a general dhamma entry covering teaching and contextual uses; dāna in early Buddhist training; yoniso/ayoniso manasikāra; and paññāvimutta alongside ubhatobhāgavimutta. Yoniso manasikāra is already queued, and the vicikicchā note already directs readers to VI.f for it even though the entry is absent. Dāna currently appears in the Mahāyāna perfections, which can give an accidental impression about where generosity belongs. Jīva is promised under XIV but has no corresponding standalone entry there. I would resolve those before extending the comparative vocabulary.

6. **Add a small public bibliography with claim-specific references.** Sutta identifiers are useful, but names such as Bodhi, Anālayo, Schmithausen, and Vetter are not enough to locate a particular argument. Give exact work and page for disputed historical claims and unusual renderings. Keep modern pedagogy visibly attributed, including the extension of the four elements to mental qualities in the MIDL block. A named modern interpretation should not become a canonical claim merely by being placed in an EBT Part.

7. **Make the comparative section smaller in its claims, not necessarily its coverage.** Each substantial comparison should specify the dimension of similarity and one limit. The claim that Christian theōsis is a redeployment of Plotinian henōsis needs a historical source and qualification. The satori/kenshō versus first/fourth-path analogy probably costs more precision than it provides, despite its caveat. These are places where deleting one ambitious sentence could improve the reference.

**Search and navigation: reproduced problems**

These findings come from running the current Markdown through the actual shared transform in memory and applying the search script’s matching logic. They are not guesses based on the source’s lack of explicit links. The existing transform already adds links and section anchors.

| Lookup             | Current generated result                                                                  | Improvement                                                             |
| ------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `upādhi`           | Matches the folded Pāli upadhi family; there is no separate XIV.a upādhi result.          | Preserve distinct lexical entries and senses before folding query text. |
| `limiting adjunct` | No result.                                                                                | Index the later upādhi entry with its own gloss and section target.     |
| `nirvāṇa`          | No result.                                                                                | Include Sanskrit equivalents as searchable aliases.                     |
| `concentration`    | Finds the three XI.b compounds, but not the basic samādhi entry in III.c.                 | Index the conventional-rendering notes as aliases.                      |
| `hatred`           | Matches lobha, dosa, moha and all three opposites, each carrying its whole grouped gloss. | Associate positional glosses with the corresponding headword.           |

The cause of the first two is that [updateHeadwordIndex](/Users/jbkjr/dev/jbkjr.github.io/custom/glossary-transforms.ts:188) keeps only the first record for each folded slug. The same choice hides later senses of a repeated headword. Query folding is useful; using the folded query form as lexical identity is the problem. The document’s strongest editorial feature—contextual disambiguation—should survive into search.

The grouped-gloss issue is explicitly present in [collectHeadwords](/Users/jbkjr/dev/jbkjr.github.io/custom/glossary-transforms.ts:254): each term gets the same paragraph gloss. That makes sense for synonyms but loses the positional mapping for lobha/dosa/moha and hiri/ottappa. The conventions already distinguish those two kinds of grouped entry, so the search data can eventually honor that distinction.

The printed index also has policy inconsistencies: some bold body headwords become italic redirects in the index, while the introductory promise says all primary entries are bold. Some repeated appearances are omitted from its location list. These are lower priority than search correctness; choose an explicit alias and occurrence policy before generating or validating the index automatically. My mechanical comparison was a diagnostic, not proof that every difference is a missing entry.

**Suggested revision order**

1. Correct the contact formula, AN 6.63 quotation, MN 27 citation, and pīti attribution; clarify the canonical antecedents and parinibbāna’s scope.
2. Repair search identity and alias coverage so that the existing distinctions are actually findable.
3. Review historical priority claims and descriptions of other schools, distinguishing evidence from the adopted interpretation.
4. Shorten and visually separate the longest notes; add the small number of missing terms that already leave holes in the reader’s route.
5. Revisit the comparative analogies and copy consistency.

My strongest recommendation is to spend the next revision on selectivity and epistemic calibration. The glossary already has enough intellectual substance. It will become more trustworthy and more useful when readers can easily see what a term means here, what evidence supports that account, and where the author is making a considered choice.
