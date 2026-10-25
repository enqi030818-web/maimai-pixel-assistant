# 海鸥搞薯条：最终生成提示词

执行方式：本机已配置的图像中转，官方 image_gen.py CLI，gpt-image-2 medium。主参考附原麦麦形象；动作附双角色基准与对应布局图。以下为最终采用的提示词，早期未采用版本保留在被 Git 忽略的制作目录中。

## base.md

`	ext
Create one full-body pixel-art reference for a desktop companion duo. Attached image is the canonical Maimai character identity reference, not a background to copy. Preserve this exact cute red curly hair, cream round face, tiny red nose, yellow suit, striped red-white sleeves, yellow mittens and red shoes; keep the same chunky pixel edges and burgundy outline. Add a small round white seagull standing to Maimai's right, only hip high, with pale warm-gray folded wings, tiny orange feet, stubby orange-yellow beak, black dot eyes and a comically innocent expression. The gull must clearly read as a gull, with no eyebrows, hair or clothes. Maimai holds a small plain red carton of 4-5 thick golden fries at waist height. Both face slightly toward each other, main character looking fond but resigned, gull staring at fries. Full duo compactly fits a single 192x208 sprite cell; Maimai remains the larger lead character. No readable logo or text. Actual low-resolution handheld-game pixel art with crisp square steps, flat limited palette, 2-tone shading. One pose only, whole bodies and props complete with padding. Solid perfectly uniform blue #0000FF backdrop, no blue in the sprites. No floor, shadow, grid, checkerboard, labels, motion marks, extra characters or scenery.

`

## peek-four.md

`	ext
Make a FOUR-FRAME pixel art animation strip. Exactly FOUR groups in ONE horizontal row, not eight. Input 1 canonical duo for identity, input 2 FOUR-SLOT layout-only guide. Each group contains ONE COMPLETE Maimai and ONE COMPLETE seagull. Keep entire duo SMALL and safely inside the middle of each of four equal-width slots. Leave generous space between groups and outside image edges; no character or beak crosses a slot. Guide must not be visible.

Preserve same red-curly-haired Maimai, ivory round face, red nose, yellow suit, striped sleeves, yellow mittens, red shoes and plain red carton of chunky golden fries. Preserve same round small white gull with gray wings, orange beak and feet. Gull hip-high, Maimai lead character. Exact same pixel-art proportions, chunky square stepped edges, flat palette and burgundy outline as canonical reference. No redesign.

FOUR frames left to right: 1 Maimai LEFT holds fries at waist and looks ahead, gull RIGHT peeks from a distance, whole gull visible; 2 gull takes a tiny step closer, neck lowered, Maimai unchanged; 3 gull is close to carton, neck reaches, beak remains CLOSED and EMPTY; 4 Maimai glances down with HALF-CLOSED EYES and small flat mouth, gull freezes innocently. This is ONLY approaching, NO stolen fry, NO eating. Maimai fixed position, height and baseline; gull moves within its group only. All four full duos, no missing body parts, no clipping, no overlapping groups.

Flat pure blue #0000FF background, blue absent in figures. NO floor, shadow, text, speech, logo, frame numbers, grids, borders, guide marks, checkerboard, speed lines or effects. Exactly four safely spaced groups in one row.

`

## celebrate-repair.md

`	ext
Generate exactly EIGHT SMALL COMPLETE DUO POSES in ONE horizontal row. This is a repair: the previous strip clipped the first character and last gull and crowded the cells. That is unacceptable. Input1 is canonical duo identity; input2 is the EXACT 3072x1024 layout guide. Follow all EIGHT equal slots, one duo per slot. Each slot is 384px wide on the target canvas. The ENTIRE pair, including gull, shoes, beak and fry, must fit within the middle 280px of each slot, leaving at least 50px clear on BOTH sides. Leave large top/bottom empty background. Maimai should be SMALL, only about 280px tall, gull 130px tall. Eight MINIATURE full duos, not eight large portraits. No clipping, no overlap, no drawing against outside image edges. Do not draw boxes or guides. Exact same scale and baseline throughout.

Preserve canonical pixel art Maimai red curly hair, cream face, tiny red nose, yellow suit, red/white sleeves, yellow mittens, red shoes and small plain red fries carton. Same cute tiny round white gull with gray wings, orange beak and orange feet, no clothes. Crisp square pixel steps, flat colors, dark burgundy outlines, no smooth painting.

Maimai is LEFT, gull RIGHT in every slot. Carton held by one mitten at waist throughout, only EMPTY hand celebrates. 8 frames left to right: (1) both calm; (2) empty hand raises; (3) empty hand up, happy closed eyes, gull reaches; (4) gull pulls ONE golden fry from carton using beak; (5) gull turns right with fry CROSSWISE in beak; (6) first short rightward running step, alternate feet visible; (7) opposite short running step farther right but entirely inside its 280px group; (8) gull freezes still holding fry, Maimai drops raised hand slightly, HALF-CLOSED EYES and SMALL FLAT MOUTH with lowered shoulders, clearly RESIGNED, NOT smiling or angry. The other hand still holds carton. Beak and fry touch, no detached fries or extra arms.

Uniform pure blue #0000FF backdrop outside sprites, no blue in sprites. No floor or shadows, labels, logos, speech, punctuation, visible guide, borders, scenery, motion lines or effects. One row, exactly eight groups with ample space and complete unclipped bodies.

`

## caught-four.md

`	ext
Create FOUR full-body pixel-art duo animation frames in ONE horizontal row. Input1 is canonical duo identity. Input2 is a FOUR-SLOT layout-only guide. Each invisible equal-width slot must contain one COMPLETE small Maimai and one COMPLETE small seagull, with ample free space around BOTH. One row of FOUR miniature duos, not eight, no cropped bodies or overlapping slots. Do not draw guides. Fixed scale, position and baseline for Maimai; gull moves inside group only.

Preserve exact canonical Maimai red curls, ivory round face, red nose, yellow outfit, red-white sleeves, yellow mittens, red shoes and small plain red carton of golden fries. Gull is same cute round white bird with gray wings, orange-yellow beak and orange feet, hip-high. Same chunky square pixel-art edges, limited flat palette, burgundy outlines and 2-tone shading, not smooth vector or painted.

Four frames left to right: (1) Maimai on LEFT looks ahead holding carton at waist, gull on RIGHT stretches neck toward fries; (2) gull has withdrawn ONE long fry from carton, clearly held CROSSWISE IN ITS BEAK, Maimai begins looking down; (3) Maimai looks directly at gull with HALF-CLOSED EYES, SMALL FLAT MOUTH and DROPPED SHOULDERS, gull freezes wide-eyed with fry in beak; (4) Maimai keeps gently resigned 'you again' expression, NOT smiling, angry or crying; gull takes one tiny backward step right while pretending innocent, stolen fry still touching beak. Clear eye contact. Carton always held by Maimai; exactly one stolen fry, no extra limbs or detached food.

Uniform pure blue #0000FF backdrop outside sprites, no blue on characters. Safe margin at entire canvas edges and each slot. No floor, shadows, caption, speech bubble, punctuation, labels, logo, guide marks, borders, checkerboard, motion lines, tears, stars or effects. Exactly FOUR complete groups in one row.

`

## share-four.md

`	ext
Create FOUR full-body pixel-art duo animation frames in ONE horizontal row. Input1 canonical duo identity, input2 FOUR-SLOT layout-only guide. One complete SMALL Maimai and one complete SMALL gull INSIDE each equal-width slot, with generous free margins around BOTH characters. Four separate complete duos, no overlaps, crops or extra characters. All four poses are SEATED with fixed head size, character scale and baseline. Do not draw guides.

Preserve exact reference Maimai red curls, ivory round face, red nose, yellow outfit, red-white sleeves, yellow mittens and red shoes. Same small plump white gull, warm-gray wings, orange beak and feet. Maimai LEFT, gull RIGHT. Exact same chunky square pixel-art edges, limited flat colors, dark burgundy outline, no smooth vector or painting. Maimai sits with red shoes forward and plain red carton on lap held by LEFT mitten throughout. Gull sits beside on tucked feet.

FOUR frames left to right: (1) both sit comfortably, Maimai RIGHT mitten picks one golden fry from carton on lap; (2) Maimai clearly offers the fry with extended RIGHT mitten toward gull, smiling gently, LEFT mitten still holding carton; (3) gull gently ACCEPTS offered fry from mitten into its beak, Maimai withdraws empty right mitten; (4) Maimai holds a DIFFERENT fry to own mouth with right mitten, gull nibbles its OWN fry, both sitting happily side by side with soft content eyes. This is VOLUNTARY SHARING, not stealing or running. Show the giving gesture clearly. Fries always touching hand/beak, never floating, no extra limbs.

Uniform flat pure blue #0000FF backdrop, no blue in characters. No floor, shadows, speech, text, logo, hearts, sparkles, labels, frame numbers, borders, visible guide, grid, checkerboard, scenery or effects. Whole bodies with generous padding in each of FOUR groups, one row only.

`
