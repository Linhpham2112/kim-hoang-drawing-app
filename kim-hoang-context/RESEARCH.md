# RESEARCH.md — Research Brief

*This document is part of the portfolio submission for [Student Name]. It explains the research and design thinking behind every major decision in the Kim Hoàng Drawing App.*

---

## 1. Cultural Research: Kim Hoàng Painting

### What It Is

Kim Hoàng painting (tranh Kim Hoàng) is a genre of Vietnamese woodcut folk art originating from Kim Hoàng village, Hoài Đức district, Hanoi, dating back to the 18th century during the Lê dynasty. It was traditionally produced for Tết (Lunar New Year) — hung on walls to bring good luck, chase away evil spirits, and celebrate family life.

What makes Kim Hoàng distinct from other Vietnamese folk paintings (Đông Hồ, Hàng Trống):
- **Pre-dyed paper:** The paper itself is colored first — scarlet red (giấy hồng điều) or Chinese yellow (giấy vàng tầu). The painting begins with a background that already has emotional weight.
- **Two-step making process:** A carved woodblock is inked in black, stamps the impression, then the artist hand-colors each region with mineral-based pigments. Same template, unique execution.
- **Poetry in the corner:** A poem or auspicious character (Phúc/Lộc/Thọ) written by hand in the upper-left corner in cursive Chinese script (chữ thảo). The image and the word together make the meaning.
- **Motifs from rural life:** Pigs, roosters, buffalo, fish — animals of northern Vietnamese agricultural communities. These weren't decorative subjects; they were wishes (a fat pig = prosperity for the new year).

### Why It's Nearly Lost

A catastrophic flood in 1915 destroyed most of the original woodblocks in Kim Hoàng village. By 1945, no families in the village continued the practice. Today, authentic Kim Hoàng paintings are found only in the Vietnam Fine Arts Museum and private collections. Restoration efforts began in 2015, led by collector Nguyễn Thị Thu Hoa, who has documented and revived approximately 80 surviving paintings.

### Why This App Matters Culturally

The digital format is not a replacement for the artisan village experience — it is an extension of it. Children who can visit Kim Hoàng village and stamp their own molds gain something irreplaceable. But:
- The village is inaccessible to most children in Vietnam, let alone internationally
- Children with motor disabilities cannot participate even if present
- The tradition needs a new generation to care about it in order to survive

This app teaches the *structure* of Kim Hoàng — carve, black ink, paper choice, stamp, hand-color, poem — in a way that might inspire a child to seek out the real thing, or at minimum, carry an awareness of it forward.

---

## 2. User Research: Children 5–8 with Motor Disabilities

### The Access Gap

Traditional art activities assume:
- **Precision grip:** Holding a brush or crayon requires controlled finger positioning
- **Fine motor coordination:** Staying "inside the lines" requires constant micro-adjustments
- **Sustained pressure:** Painting requires applying consistent force across a surface
- **Bilateral coordination:** Holding paper still with one hand while drawing with the other

For children with motor disabilities — including cerebral palsy, developmental coordination disorder (DCD), or upper limb differences — these assumptions exclude them from the full creative experience.

### Design Principles Derived from Research

**1. Replace precision with intention**
The child's intention matters more than their precision. Carve completes on coverage (not a perfect outline). Colour is one plate at a time: tap the next swatch, then rub until it appears. The pig has a faint white ghost so staying inside the lines is optional.

**2. Minimize the action vocabulary**
Navigation and choices are taps. Drag is reserved for the few actions that *are* dragging in the village (gouge, roll the brayer, place the block, brush, rub pigment). One physical action still maps to one creative beat.

**3. Feedback must be immediate and unambiguous**
Children with attention difficulties lose engagement if actions don't produce visible results. Chips burst, the stamp presses, plates fade in as the finger travels, the character appears. The wood/paper surface is never a blank hole while art decodes.

**4. Failure must be soft**
A wrong rooster swatch is a short error haptic — no red X, no "try again" copy. The child taps the highlighted next plate and continues. Harsh failure feedback is particularly damaging for children who already experience more failure than their peers.

**5. Completion is always achievable**
Every session produces a finished Kim Hoàng painting. Sequential rooster plates and a short pig-white minimum guarantee a complete sheet without requiring fine motor mastery.

### Why Not Voice Control?

Voice control was considered and deprioritized for this version for several reasons:
- Children aged 5–8 may not have reliable expressive language ability
- Some motor disabilities co-occur with speech impairments
- Voice in a group setting (classroom, therapy center) creates noise interference
- The stamp-and-color interaction already reduces motor demands sufficiently

Voice control remains a potential future feature for older or more language-capable users.

---

## 3. Product Design Decisions

### Why Kim Hoàng and Not a Generic Coloring App?

Generic coloring apps already exist and are accessible. This product's differentiation is:
1. **Cultural specificity** — learning about a nearly-lost Vietnamese art form
2. **The woodblock stamp mechanic** — the single-tap stamp is both accessible *and* historically meaningful. It's not a simplified version of painting; it's the actual technique.
3. **Constraints breed creativity** — Kim Hoàng's limited palette and bold style are features, not limitations. A child with one color and a stamp can still make something that looks like the 18th-century original.

### Why a limited palette?

More colors = more decisions = more cognitive load. Historical Kim Hoàng pigments (white gypsum, vermilion, gardenia yellow, indigo, black) are the village set. The app follows the scans: pig colour is white only (red is the sheet); rooster colour is seven plates taken from the colour print.

### The Poem Corner as Culminating Action

The poem corner (stage 8) closes the sheet. The rooster stamps scanned Kim Hoàng calligraphy (`roosterPoem.ts`) in black ink; the child can drag it. There is no Phúc/Lộc/Thọ picker. The pig still visits this stage so the sequence matches; copy explains that a large pig print does not take a verse.

Authenticity: village rooster prints carry a poem. Accessibility: one stamp action and a large Next, not a three-character quiz.

### The Caregiver Layer (Invisible in the UI, Present in the Design)

No settings are accessible to the child. Caregiver setup (sound, device rotation lock) happens before the session. The child's screen stays uncluttered.

---

## 4. Sources

- Wikipedia: "Kim Hoàng painting" — history, technique, woodblock materials
- VOVworld (Voice of Vietnam): "Kim Hoàng folk paintings" — artisan descriptions, flood history
- Vietnam Fine Arts Museum documentation
- VietnamPlus: "Collector launches new book on Kim Hoàng folk painting" — restoration efforts
- WHO Global Report on Assistive Technology (2021) — motor disability prevalence in children
- Universal Design for Learning (UDL) Framework — principles for accessible educational design
- "Designing for Children with Disabilities" — UNICEF accessibility guidelines
