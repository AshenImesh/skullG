# SKAL4R — Complete Mathematical Model Analysis

This document explains every mathematical model used in SKAL4R, where it lives in the code, and how it works end-to-end.

---

## Model 1: Probabilistic Trait Matching (The Core Engine)

**File:** `src/lib/animalMatcher.ts`
**Function:** `calculateProbabilities()`
**Used in:** The `/explore` page — whenever the user adjusts any slider, this runs over all 91 animals in real-time.

### Step 1.1 — L1 Distance (Manhattan Distance)

For each animal, compute the absolute difference between the user's slider value and the animal's stored trait value across all 8 traits:

```
d_i = Σₜ |uₜ - aᵢₜ|
```

Where:
- `uₜ` = user's slider value for trait `t` (1–10)
- `aᵢₜ` = animal `i`'s score for trait `t` (1–10)
- `t` ∈ { dentition, skullProportions, orbitVision, mandible, nasalRegion, muscleAttachments, cranialStructure, specialAdaptations }

**Maximum possible distance:** 8 traits × max range 9 = **72**
**Minimum possible distance:** 0 (perfect match)

**Code location:** `animalMatcher.ts:19-25`

### Step 1.2 — Exponential Decay Similarity

Convert distance to a similarity score using exponential decay:

```
sᵢ = exp(-dᵢ × λ)
```

Where:
- `λ = 0.25` (decay constant — controls how quickly similarity drops)
- `sᵢ` ∈ (0, 1], where 1 = perfect match

**Why exponential decay?**
- Small distances produce high similarity (distance 0 → 1.000, distance 1 → 0.779)
- Large distances drop off quickly (distance 10 → 0.082, distance 20 → 0.007)
- This behaves like a **radial basis function kernel**, giving higher weight to close matches

**Lookup table:**
| dᵢ | sᵢ = exp(-dᵢ × 0.25) |
|----|----------------------|
| 0  | 1.000 |
| 1  | 0.779 |
| 2  | 0.607 |
| 5  | 0.287 |
| 10 | 0.082 |
| 20 | 0.007 |
| 40 | 0.00005 |

**Code location:** `animalMatcher.ts:30`

### Step 1.3 — Softmax-style Normalization to Probabilities

Convert similarity scores into a probability distribution that sums to 100%:

```
Pᵢ = (sᵢ / Σⱼ sⱼ) × 100%
```

Where:
- `sᵢ` = similarity of animal `i`
- `Σⱼ sⱼ` = sum of similarities across all 91 animals
- `Pᵢ` = probability that the user's slider combination matches animal `i`

**Properties:**
- The probabilities sum to exactly 100%
- This is mathematically equivalent to **softmax with temperature T = 1/λ = 4**
- i.e., `Pᵢ = exp(-λdᵢ) / Σⱼ exp(-λdⱼ)` which is `softmax(-λ × distances)`

**Code location:** `animalMatcher.ts:45-50`

### Step 1.4 — Independent Match Score (for visualization)

A separate 0–100% "how close" metric independent of other animals:

```
matchScoreᵢ = max(0, 1 - dᵢ / (D_max × 0.5))
```

Where:
- `dᵢ` = L1 distance for animal `i`
- `D_max` = 72 (8 traits × 9)
- The `0.5` factor penalizes faster than linear

**Examples:**
| dᵢ | matchScore |
|----|-----------|
| 0  | 100% |
| 9  | 75% |
| 18 | 50% |
| 36 | 0% |

**Code location:** `animalMatcher.ts:34-35`

### Complete Pipeline Summary

```
User moves slider → new uₜ values
         ↓
For each of 91 animals:
    dᵢ = Σₜ |uₜ - aᵢₜ|          (L1 Distance)
    sᵢ = exp(-dᵢ × 0.25)         (Exponential Similarity)
    matchScoreᵢ = 1 - dᵢ/36      (Independent Score)
         ↓
Pᵢ = sᵢ / Σⱼ sⱼ × 100%          (Softmax Normalization)
         ↓
Sort descending by Pᵢ → Top-10 matches shown in panel
```

---

## Model 2: Composite Trait Score Computation (The Scoring Engine)

**File:** `src/data/traitScoring.ts`
**Functions:** `computeCompositeScore()`, `computeAllScores()`
**Used in:** Pre-computation of the 1–10 trait scores from raw morphology data. This was used once to build `animalDatabase.ts`.

### Step 2.1 — Binary Morphology Vectors

Each animal has 109 binary flags (0 or 1) organized into 8 categories. The sub-traits are defined in `src/data/morphologyData.ts`.

| Category | Number of Sub-traits | Example Sub-traits |
|----------|---------------------|-------------------|
| Dentition | 27 | Incisor_Absent, Canine_Extreme, CheekTooth_Secodont, Carnassials_Strong |
| Skull_Proportions | 16 | Snout_Long, Skull_Broad, Rostrum_Robust |
| Orbit_Vision | 13 | Orbit_Forward, Postorb_FullClosure, Interorb_Narrow |
| Mandible | 12 | Jaw_Deep, Coronoid_High, Symphysis_Fused |
| Nasal_Region | 12 | Nasal_Long, Turbinate_High, Proboscis_Strong |
| Muscle_Attachments | 13 | SagCrest_Large, TempFossa_Large, Zyg_Robust |
| Cranial_Structure | 6 | Occip_Expanded, FM_Inferior |
| Special_Adaptations | 10 | Carnivore_Adaptation, Burrowing_Adaptation |

**Code location:** `morphologyData.ts:134-1044`

### Step 2.2 — Weighted Linear Sum

For a given animal and category, compute the raw score as a weighted sum:

```
raw = Σᵢ (vᵢ × wᵢ)
```

Where:
- `vᵢ` = binary value (0 or 1) for sub-trait `i`
- `wᵢ` = expert-defined weight for sub-trait `i`

**Example (Cat, Dentition):**

The binary vector for cat dentition:
```
[0, 1, 0, 0, 0,  0, 0, 0, 0, 1,  0, 0, 0, 1, 0,  1, 0, 0, 1, 0,  0, 0, 0, 1, 0, 1, 0]
```

The weight vector for dentition:
```
[-2, -1, 0, 1, 0,  -2, 0, 2, 4, 6,  1, -1, -1, 4, 0,  1, 0, -1, 0, 0,  0, -1, 2, 5, 0, -1, -3]
```

Raw sum = (1 × -1) + (1 × 6) + (1 × 4) + (1 × 1) + (1 × 0) + (1 × 5) + (1 × -1) = **14**

**Key weights that drive carnivore scores high:**
| Sub-trait | Weight | Why |
|-----------|--------|-----|
| Canine_Extreme | +6 | Huge canine teeth for killing |
| Carnassials_Strong | +5 | Shearing blades for meat |
| CheekTooth_Secodont | +4 | Sectorial cheek teeth |

**Code location:** `traitScoring.ts:159-161`

### Step 2.3 — Min-Max Normalization to 1–10 Scale

Convert the raw weighted sum into a 1–10 integer score:

```
clamped = max(rMin, min(rMax, raw))
normalized = (clamped - rMin) / (rMax - rMin)
score = round(1 + 9 × normalized)
```

Where `[rMin, rMax]` are predefined theoretical ranges for each category:

| Category | rMin | rMax | Range Width |
|----------|------|------|-------------|
| Dentition | -10 | 17 | 27 |
| Skull_Proportions | -5 | 7 | 12 |
| Orbit_Vision | -5 | 8 | 13 |
| Mandible | -6 | 9 | 15 |
| Nasal_Region | -3 | 8 | 11 |
| Muscle_Attachments | -4 | 11 | 15 |
| Cranial_Structure | -2 | 4 | 6 |
| Special_Adaptations | 0 | 10 | 10 |

**Example (Cat, Dentition):**
```
raw = 14
clamped = max(-10, min(17, 14)) = 14
normalized = (14 - (-10)) / (17 - (-10)) = 24/27 = 0.8889
score = round(1 + 9 × 0.8889) = round(9.0) = 9
```

**Verification:** Cat's dentition in `animalDatabase.ts` is indeed **9**.

**Code location:** `traitScoring.ts:145-149`

### Complete Pipeline

```
Morphology binary vectors (109 flags)
         ↓
For each of 8 categories:
    raw = Σ(vᵢ × wᵢ)              (Weighted linear sum)
    score = 1 + 9 × clamp(raw)     (Min-max normalize to 1-10)
         ↓
8 trait scores per animal → stored in animalDatabase.ts
```

---

## Model 3: Biological Constraint Enforcement

**File:** `src/lib/traitConstraints.ts`
**Function:** `enforceConstraints()`
**Used in:** The `/explore` page — whenever a slider changes, this runs before the matching engine to keep trait combinations biologically realistic.

### Step 3.1 — Correlation Map

A directed graph defining which traits constrain which:

```
specialAdaptations → dentition, orbitVision, muscleAttachments
dentition          → specialAdaptations, orbitVision, muscleAttachments
orbitVision        → specialAdaptations, dentition
muscleAttachments  → specialAdaptations, dentition
skullProportions   → mandible
mandible           → skullProportions
nasalRegion        → ∅ (no constraints)
cranialStructure   → ∅ (no constraints)
```

**Code location:** `traitConstraints.ts:9-18`

### Step 3.2 — Range Validation via Database Filtering

When the user changes trait `T` to value `v`, the algorithm:

1. **Find all animals** whose trait `T` is within ±2 of `v`:
```
Matching = {a ∈ Database : |a[T] - v| ≤ 2}
```

2. **For each correlated trait `C`**, compute the biologically valid range:
```
minValid = min({a[C] : a ∈ Matching}) - 2
maxValid = max({a[C] : a ∈ Matching}) + 2
```

3. **Clamp** to 1–10 scale:
```
minValid = max(1, minValid)
maxValid = min(10, maxValid)
```

4. **Check if the current slider value for trait `C`** falls within this valid range:
```
if currentValue < minValid → snap to minValid
if currentValue > maxValid → snap to maxValid
```

### Concrete Example

User sets **Dentition = 10** (maximum carnivore). Current **Orbit & Vision = 2** (fully lateral, prey-like).

1. Find all animals with dentition ∈ [8, 10]: Cat, Cheetah, Coyote, Dog, Fox, Hyena, Jaguar, Lion, Tiger, Wolf, etc.
2. For Orbit & Vision, these animals have values in range [7, 9].
3. Expand by tolerance: minValid = 7 - 2 = 5, maxValid = 9 + 2 = 10.
4. User's OrbitVision = 2. Since 2 < 5, snap to 5.

**Result:** Orbit & Vision auto-adjusts from 2 to 5, and a toast notification explains why.

**Code location:** `traitConstraints.ts:51-100`

### Step 3.3 — Notification Generation

When a trait is auto-adjusted, a notification is created with:
- Source trait name + value
- Target trait name + old value + new value
- Trilingual message template
- Timestamp + unique ID

**Code location:** `traitConstraints.ts:82-98`

---

## Model 4: Diet Biochemistry Radar Chart

**File:** `src/components/AnimalDetailModal.tsx`
**Used in:** The encyclopedia and explore page — when clicking an animal, the detail modal shows a 6-axis radar chart.

### Step 4.1 — Baseline Assignment by Diet Category

Each diet category has baseline biochemistry values (0–100 scale):

| Axis | Carnivore | Herbivore | Omnivore | Insectivore |
|------|-----------|-----------|----------|-------------|
| Protein | 90 | 30 | 60 | 70 |
| Fat | 10 | 90 | 50 | 20 |
| Fibre | 70 | 20 | 50 | 40 |
| Starch | 10 | 40 | 60 | 10 |
| Chitin | 20 | 10 | 20 | 90 |
| Mineral | 30 | 40 | 30 | 20 |

**Code location:** `AnimalDetailModal.tsx:87-97`

### Step 4.2 — Specialization Modulation

The `specialAdaptations` trait score (1–10) modulates these baselines:

```
Protein_adj = min(100, Protein_base + (scoreNum / 10) × 10)
Fibre_adj   = max(10,  Fibre_base   - (scoreNum / 10) × 20)
```

Higher specialization → more protein, less fibre (shifts toward hypercarnivory).

**Code location:** `AnimalDetailModal.tsx:99-102`

### Step 4.3 — Polar-to-Cartesian Projection for SVG Rendering

Each axis is an angle in the hexagon:

```
θᵢ = (2π × i) / 6 - π/2    for i = 0, 1, ..., 5
```

Where `i` indexes the axes in order: [Protein, Fibre, Fat, Starch, Chitin, Mineral].

The `-π/2` offset rotates the chart so the first axis points straight up.

**Data point coordinates:**
```
xᵢ = cx + (vᵢ / 100) × r × cos(θᵢ)
yᵢ = cy + (vᵢ / 100) × r × sin(θᵢ)
```

Where:
- `(cx, cy) = (100, 90)` = chart center in SVG coordinates
- `r = 65` = chart radius
- `vᵢ` = value for axis `i` (0–100)

**Background grid:** 4 concentric hexagons at 25%, 50%, 75%, 100% of radius:
```
x_grid = cx + (r × l / 4) × cos(θᵢ)
y_grid = cy + (r × l / 4) × sin(θᵢ)
```

**Axis lines:** Single line from center `(cx, cy)` to outer point at radius `r`.

**Code location:** `AnimalDetailModal.tsx:104-152`

---

## Model 5: Particle Network Animation

**File:** `src/components/ParticleCanvas.tsx`
**Used in:** Background visual effect.

### Step 5.1 — Particle Motion

Each particle has position `(x, y)` and velocity `(vx, vy)`:

```
x ← x + vx
y ← y + vy
```

Velocities are random: `vx, vy ~ Uniform(-0.25, 0.25)`.

### Step 5.2 — Wrap-Around Boundary

When a particle exits the canvas, it wraps to the opposite edge:
```
if x < 0 → x = canvas.width
if x > canvas.width → x = 0
if y < 0 → y = canvas.height
if y > canvas.height → y = 0
```

### Step 5.3 — Distance-Based Connection Lines

For every pair of particles `(i, j)`:

```
dx = xᵢ - xⱼ
dy = yᵢ - yⱼ
dist = √(dx² + dy²)

if dist < 150 → draw line between (xᵢ, yᵢ) and (xⱼ, yⱼ)
```

### Step 5.4 — Sinusoidal Lifecycle Opacity

Each particle has a life counter and maxLife:

```
opacity = sin((life / maxLife) × π) × 0.9
```

This creates a smooth fade-in/fade-out: opacity rises from 0 → 0.9 → 0 over the particle's lifetime.

When `life ≥ maxLife`, the particle is removed and replaced with a new one.

**Code location:** `ParticleCanvas.tsx:64-89`

---

## Model 6: PixelBlast — WebGL Procedural Background

**File:** `src/components/PixelBlast.tsx`
**Used in:** Decorative background on all pages (home, explore, encyclopedia, skull-lab).

### Step 6.1 — Fractal Brownian Motion (fBm) Noise

The base pattern uses 5-octave value noise:

```
fbm(uv) = Σₖ (ampₖ × vnoise(p × freqₖ))
```

Where:
- `octaves = 5`
- `lacunarity = 1.25` (frequency multiplier per octave)
- `gain = 1.0` (amplitude multiplier per octave)
- Each octave uses 3D value noise with hash-based pseudo-random

**Code location:** `PixelBlast.tsx:249-260` (GLSL fragment shader)

### Step 6.2 — Bayer Matrix Dithering

To create the pixelated look, ordered dithering is applied:

```
bayer = Bayer8(fragCoord / pixelSize) - 0.5
bw = step(0.5, fbm_output + bayer)
```

This converts the continuous noise into a binary (on/off) pixel grid with smooth transitions.

**Code location:** `PixelBlast.tsx:321-322`

### Step 6.3 — Shape Generation

Each pixel can be one of 4 shapes:
- **Square:** Direct coverage value
- **Circle:** Distance-based circular mask:
  ```
  M = 1 - smoothstep(-aa, aa, (|p - 0.5| - r) × 2)
  ```
- **Triangle:** Edge-based triangular mask (alternating flip per cell)
- **Diamond:** Manhattan distance threshold:
  ```
  M = step(|px - 0.49| + |py - 0.49|, r)
  ```

**Code location:** `PixelBlast.tsx:262-281`

### Step 6.4 — Interactive Ripple Effect

When the user clicks/taps, a ripple wave propagates outward:

```
waveR = speed × t
ring = exp(-((r - waveR) / thickness)²)
atten = exp(-dampT × t) × exp(-dampR × r)
feed = max(feed, ring × atten × intensity)
```

This creates expanding rings that fade with distance and time.

**Code location:** `PixelBlast.tsx:306-318`

### Step 6.5 — Liquid Distortion Effect

An optional post-processing effect using WebGL uniforms:

```
tex = texture2D(uTouchTexture, uv)
vx = tex.r × 2 - 1
vy = tex.g × 2 - 1
intensity = tex.b

wave = 0.5 + 0.5 × sin(uTime × freq + intensity × 2π)
amt = strength × intensity × wave

uv += vec2(vx, vy) × amt
```

This creates a liquid-like distortion that follows pointer movement.

**Code location:** `PixelBlast.tsx:144-172`

### Step 6.6 — Gamma Correction

The final output color undergoes sRGB gamma encoding:

```
srgb = if color <= 0.0031308:
           color × 12.92
       else:
           1.055 × color^(1/2.4) - 0.055
```

**Code location:** `PixelBlast.tsx:343-347`

---

## Model 7: Dice Coefficient / Similarity (Conceptual Use)

This is not explicitly coded but is conceptually present in how the constraint tolerance works:

```
tolerance_check = |a[T] - v| ≤ 2
```

This is effectively a **binary relevance filter** — it asks: "does this animal's trait value fall within a ±2 window of the user's selection?" The tolerance of 2 creates a **±2σ-like acceptance window** over the 1–10 range (20% of the total scale).

---

## Model 8: QR Code (Data Encoding)

**File:** `src/components/AnimalDetailModal.tsx`
**Library:** `qrcode.react`

Wikipedia URLs are encoded into QR codes using:
- **Error correction level:** Q (25% data can be restored)
- **SVG renderer** (no canvas needed)
- Each QR code stores 50–80 bytes (a Wikipedia URL)

This is a standard Reed-Solomon error-correcting code — the math is handled entirely by the library.

---

## Summary Table: Where Each Model is Used

| Model | File | Used In Page | Input | Output |
|-------|------|-------------|-------|--------|
| 1. Probabilistic Matching | `animalMatcher.ts` | `/explore` | 8 slider values | 91 probabilities (sum=100%) |
| 2. Composite Scoring | `traitScoring.ts` | Build-time | 109 binary flags | 8 scores (1-10) |
| 3. Constraint Enforcement | `traitConstraints.ts` | `/explore` | Changed trait + value | Auto-adjusted sliders + toasts |
| 4. Diet Radar | `AnimalDetailModal.tsx` | encyclopedia/explore modals | Diet category | 6-axis SVG polygon |
| 5. Particle Network | `ParticleCanvas.tsx` | All pages (background) | Canvas dimensions | Animated particles + lines |
| 6. PixelBlast | `PixelBlast.tsx` | All pages (background) | Props + pointer events | WebGL pixel animation |
| 7. Constraint Tolerance | `traitConstraints.ts` | `/explore` | Trait value | Filtered animal subset |
| 8. QR Code | `AnimalDetailModal.tsx` | encyclopedia/explore modals | Wikipedia URL | Scannable QR SVG |
