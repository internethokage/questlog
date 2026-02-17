# QuestLog Pixel Art Style Guide

## Aesthetic

**Style:** 16x16 or 32x32 retro JRPG  
**Palette:** Dark mode optimized, Norse-inspired  
**Vibe:** Final Fantasy (SNES era) meets Dark Souls atmosphere

---

## Color Palette

### Base Colors
```
Background:  #0f0f1e (near-black blue)
UI Dark:     #1a1a2e (dark blue-gray)
UI Mid:      #2d4059 (slate blue)
UI Light:    #4a7c59 (muted green)
Accent:      #ffd700 (gold)
```

### Realm Colors (for UI theming)
```
Helheim:      #1a1a2e (dark blue-gray)
Niflheim:     #2d4059 (slate blue)
Svartalfheim: #6b4423 (bronze)
Midgard:      #4a7c59 (forest green)
Jotunheim:    #596e79 (stone gray)
Alfheim:      #f4e4c1 (light cream)
Vanaheim:     #3a5a40 (deep green)
Muspelheim:   #d62828 (fire red)
Asgard:       #ffd700 (gold)
```

### Rarity Colors
```
Common:    #8b8b8b (gray)
Uncommon:  #1eff00 (bright green)
Rare:      #0070dd (blue)
Epic:      #a335ee (purple)
Legendary: #ff8000 (orange-gold)
```

---

## Character Sprite (32x32)

### Design Concept
- **Humanoid warrior** (gender-neutral)
- **Norse aesthetic** (furs, leather, horned helmet optional)
- **Idle stance:** Standing with weapon (sword or axe)
- **Attack animation:** 3-frame swing
- **Victory pose:** Weapon raised

### Animation States
1. **Idle** (2 frames, breathing)
2. **Attack** (3 frames, swing motion)
3. **Victory** (1 frame, weapon raised)
4. **Defeat** (1 frame, kneeling/wounded)

### Prestige Variants
- Prestige 1+: Golden aura (1px glow)
- Prestige 5+: Silver armor accents
- Prestige 10+: Einherjar wings (small, pixel-style)

---

## Monster Sprites (32x32)

### Slime (Level 1)
- Round blob, single eye
- Green base color (#3a5a40)
- 2-frame idle (wobble)

### Goblin (Level 2)
- Small humanoid, hunched
- Green skin, yellow eyes
- Holds crude dagger

### Wolf (Level 3)
- Four-legged, fierce
- Gray fur, red eyes
- 2-frame running animation

### Orc Warrior (Level 5)
- Large humanoid, muscular
- Green-gray skin, iron armor
- Holds battle axe

### Dark Knight (Level 8)
- Armored humanoid, tall
- Black plate armor, red cape
- Holds greatsword

### Dragon (Level 15)
- Serpentine, wings spread
- Red scales, golden horns
- Fire breath effect (3-frame)

---

## Gear Icons (16x16)

### Weapons
- **Dagger:** Small blade, angled
- **Sword:** Medium blade, vertical
- **Axe:** Curved blade, thick handle
- **Hammer:** Square head, short handle
- **Spear:** Long shaft, pointed tip
- **Bow:** Curved wood, string visible

### Armor
- **Leather:** Brown, simple chest piece
- **Chainmail:** Silver, linked pattern
- **Plate:** Iron/steel, shoulder guards
- **Robes:** Flowing, hooded (for mage gear)

### Accessories
- **Ring:** Circular, gemstone accent
- **Amulet:** Pendant on chain
- **Belt:** Horizontal strap, buckle
- **Boots:** Simple footwear outline

### Rarity Visual Cues
- Common: Gray border, no glow
- Uncommon: Green border, faint glow (1px)
- Rare: Blue border, medium glow
- Epic: Purple border, strong glow (2px)
- Legendary: Gold border, animated sparkle (2-frame)

---

## UI Elements

### HP/XP Bars
- **Style:** Horizontal bars, 2px border
- **Fill:** Gradient (dark to bright)
- **HP:** Red gradient (#8b0000 → #ff0000)
- **XP:** Blue gradient (#003366 → #0099ff)
- **Gold:** Yellow gradient (#b8860b → #ffd700)

### Buttons
- **Idle:** Dark border, light center
- **Hover:** Light border, brighter center
- **Pressed:** Inverted colors, 1px shift down

### Borders
- **Pixel style:** 2px thick, dark outer, light inner
- **Corner accents:** Norse rune symbols (4px)

---

## Yggdrasil Map Sprites

### Realm Nodes (64x64 each)
Each realm represented by a circular node with unique icon:

1. **Helheim:** Skull icon, dark mist effect
2. **Niflheim:** Snowflake, frost particles
3. **Svartalfheim:** Hammer & anvil, spark effect
4. **Midgard:** Sword & shield, neutral
5. **Jotunheim:** Giant footprint, stone texture
6. **Alfheim:** Sun rays, light glow
7. **Vanaheim:** Leaf/tree, green vines
8. **Muspelheim:** Flame, fire particles
9. **Asgard:** Crown/hall, golden glow

### Trunk/Branches
- **Width:** 16px
- **Style:** Organic, bark texture
- **Animation:** Subtle pulse (2-frame, slow)

### Current Realm Highlight
- Bright glow (4px radius)
- Pulsing animation (60bpm, like heartbeat)
- Connected branch lights up

---

## Animation Guidelines

### Frame Rate
- **Idle animations:** 2 frames, 500ms per frame
- **Attack animations:** 3 frames, 150ms per frame
- **Victory/defeat:** 1 frame (static)
- **Effects (fire, glow):** 3-4 frames, 200ms per frame

### Timing
- **Battle sequence:** 2 seconds total
  - Approach: 0.5s
  - Attack: 1s (3 frames × 150ms + pause)
  - Result: 0.5s
- **Loot drop:** 1 second (fade-in + sparkle)

---

## Reference Assets (Free Resources)

### Sprite Packs (itch.io)
- **LimeZu's Modern Exteriors** (pixel characters)
- **Pixel Fantasy RPG Icons** (gear/items)
- **Free RPG Monster Pack** (enemies)

### Tools
- **Aseprite** ($20, best pixel editor)
- **Piskel** (free, browser-based)
- **Lospec Palette List** (color palettes)

### Placeholder Strategy (MVP)
1. Use free sprite packs for initial build
2. Replace with custom sprites post-launch
3. Prioritize character + 6 core monsters first
4. Gear icons can be simple shapes initially

---

## Mobile Optimization

### Screen Sizes
- **Target:** 375x667 (iPhone SE / standard)
- **Scale:** 2x or 3x for retina displays
- **Export:** PNG with transparency

### Performance
- Limit animations to essential states
- Use sprite sheets (reduce file count)
- Compress PNGs (TinyPNG)

---

## Norse Symbol Accents

Use these as decorative UI elements (4x4 or 8x8):
- **ᚠ (Fehu)** - Wealth, cattle
- **ᚦ (Thurisaz)** - Giant, thorn
- **ᚨ (Ansuz)** - Odin, wisdom
- **ᚱ (Raido)** - Journey, wheel
- **ᚲ (Kaunan)** - Torch, knowledge

---

## Example Sprite Sheet Layout

```
character_32x32.png (256x32 total)
[Idle 1][Idle 2][Atk 1][Atk 2][Atk 3][Victory][Defeat][Empty]

monsters_32x32.png (256x192 total, 6 monsters × 32px each)
Row 1: Slime (idle 1, idle 2, attack, defeat)
Row 2: Goblin (idle 1, idle 2, attack, defeat)
Row 3: Wolf (idle 1, idle 2, attack, defeat)
Row 4: Orc (idle 1, idle 2, attack, defeat)
Row 5: Dark Knight (idle 1, idle 2, attack, defeat)
Row 6: Dragon (idle 1, idle 2, attack, defeat)

gear_16x16.png (128x128 total, 8x8 grid = 64 items)
```

---

**This is the visual blueprint. Let's make it look dope. 🔷**
