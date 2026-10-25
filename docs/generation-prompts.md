# 麦麦像素桌宠生成提示词

执行方式：本机已配置中转，官方 image_gen.py，gpt-image-2 medium。主形象附六张角色参考；每个动作附 canonical 与布局图。最终图集使用官方工具确定几何。向左移动经检查后逐帧镜像，未单独调用生图。

## base-pet

```text
Create one clean full-body reference sprite for Codex pet 麦麦.

Pet identity: Use the six supplied Ronald McDonald images as character design references only. Make a much cuter full-body chibi pixel-art desktop companion: 2.25 heads tall, large rounded fluffy scarlet curly hair, round ivory-white face, bright gentle black oval eyes, tiny round red nose, pink square cheeks, small friendly red smile. Yellow one-piece outfit with a simple white collar and red center trim, red-and-white horizontal striped sleeves, yellow mittens, oversized rounded red shoes. Short soft limbs, head about 55 percent of total height. Resting neutral front-facing pose, both arms relaxed. Preserve recognizable red-yellow-white outfit, no visible text or logos, no balloon or other props, no meme expressions. Reference 3 and 5 inform warmth and roundness, 2 informs full-body compact proportions, 6 informs graphic simplicity; do not copy source backgrounds, captions, watermarks, confetti or floating symbols..
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `pixel`: Pixel-art-adjacent digital mascot with a chunky silhouette, simple dark outline, limited palette, flat cel shading, and visible stepped edges. User style notes: Actual low-resolution video-game pixel sprite, designed on about a 64x80 pixel logical grid, then enlarged with nearest-neighbor. Consistent chunky 1 logical-pixel dark burgundy outline, crisp square stair-step edges, limited 12-18 color palette, flat 2-tone shading, no smooth vector curves, no painted textures, no gradients, no antialiasing. Cute cozy handheld-game aesthetic. Whole body readable at desktop size..


Place a single centered pose on a perfectly flat pure blue #0000FF chroma-key background. Keep the full pet visible, compact, readable at 192x208, and easy to animate. Preserve approved reference identity cues. No scenery, text, borders, checkerboard transparency, shadows, glows, detached effects, or extra props. Keep #0000FF and close colors out of the pet, props, highlights, and effects.

```

## rows/idle

```text
Create one horizontal animation strip for Codex pet `maimai`, state `idle`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 6 full-body frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 6 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Use the six supplied Ronald McDonald images as character design references only. Make a much cuter full-body chibi pixel-art desktop companion: 2.25 heads tall, large rounded fluffy scarlet curly hair, round ivory-white face, bright gentle black oval eyes, tiny round red nose, pink square cheeks, small friendly red smile. Yellow one-piece outfit with a simple white collar and red center trim, red-and-white horizontal striped sleeves, yellow mittens, oversized rounded red shoes. Short soft limbs, head about 55 percent of total height. Resting neutral front-facing pose, both arms relaxed. Preserve recognizable red-yellow-white outfit, no visible text or logos, no balloon or other props, no meme expressions. Reference 3 and 5 inform warmth and roundness, 2 informs full-body compact proportions, 6 informs graphic simplicity; do not copy source backgrounds, captions, watermarks, confetti or floating symbols.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `pixel`: Pixel-art-adjacent digital mascot with a chunky silhouette, simple dark outline, limited palette, flat cel shading, and visible stepped edges. User style notes: Actual low-resolution video-game pixel sprite, designed on about a 64x80 pixel logical grid, then enlarged with nearest-neighbor. Consistent chunky 1 logical-pixel dark burgundy outline, crisp square stair-step edges, limited 12-18 color palette, flat 2-tone shading, no smooth vector curves, no painted textures, no gradients, no antialiasing. Cute cozy handheld-game aesthetic. Whole body readable at desktop size..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Calm low-distraction resting loop: subtle breathing, tiny blink, slight head/body bob, and only quiet persona-preserving motion.

State requirements:
- CRITICAL: idle is the low-distraction baseline state and the first frame is also used as the reduced-motion static pet.
- Use only subtle idle motion: gentle breathing, a tiny blink, a slight head or body bob, a very small material sway, or another quiet motion that fits the pet persona.
- Keep the pet essentially in the same pose, facing direction, silhouette, markings, palette, and prop state across all 6 frames.
- Idle variation must stay calm but still read as animation; do not repeat effectively identical copies across the loop.
- Do not show waving, walking, running, jumping, talking, working, reviewing, emotional reactions, large gestures, item interactions, or new props.
- Feet, base, body, or object anchor should remain planted or nearly planted.
- The first and last frames should be very close visually so the loop feels calm and does not pop.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.

```

## rows/running-right

```text
Create one horizontal animation strip for Codex pet `maimai`, state `running-right`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 8 full-body frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 8 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Use the six supplied Ronald McDonald images as character design references only. Make a much cuter full-body chibi pixel-art desktop companion: 2.25 heads tall, large rounded fluffy scarlet curly hair, round ivory-white face, bright gentle black oval eyes, tiny round red nose, pink square cheeks, small friendly red smile. Yellow one-piece outfit with a simple white collar and red center trim, red-and-white horizontal striped sleeves, yellow mittens, oversized rounded red shoes. Short soft limbs, head about 55 percent of total height. Resting neutral front-facing pose, both arms relaxed. Preserve recognizable red-yellow-white outfit, no visible text or logos, no balloon or other props, no meme expressions. Reference 3 and 5 inform warmth and roundness, 2 informs full-body compact proportions, 6 informs graphic simplicity; do not copy source backgrounds, captions, watermarks, confetti or floating symbols.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `pixel`: Pixel-art-adjacent digital mascot with a chunky silhouette, simple dark outline, limited palette, flat cel shading, and visible stepped edges. User style notes: Actual low-resolution video-game pixel sprite, designed on about a 64x80 pixel logical grid, then enlarged with nearest-neighbor. Consistent chunky 1 logical-pixel dark burgundy outline, crisp square stair-step edges, limited 12-18 color palette, flat 2-tone shading, no smooth vector curves, no painted textures, no gradients, no antialiasing. Cute cozy handheld-game aesthetic. Whole body readable at desktop size..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Dragging-right loop: show directional movement to the right through body and limb poses only.

State requirements:
- Show directional drag movement to the right through body, limb, and prop movement only.
- The row must unmistakably face and travel right.
- The movement cadence must alternate visibly across the 8 frames instead of repeating one nearly static stride.
- Do not draw speed lines, dust clouds, floor shadows, motion trails, or detached motion effects.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.

```

## rows/running-left

```text
Create one horizontal animation strip for Codex pet `maimai`, state `running-left`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 8 full-body frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 8 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Use the six supplied Ronald McDonald images as character design references only. Make a much cuter full-body chibi pixel-art desktop companion: 2.25 heads tall, large rounded fluffy scarlet curly hair, round ivory-white face, bright gentle black oval eyes, tiny round red nose, pink square cheeks, small friendly red smile. Yellow one-piece outfit with a simple white collar and red center trim, red-and-white horizontal striped sleeves, yellow mittens, oversized rounded red shoes. Short soft limbs, head about 55 percent of total height. Resting neutral front-facing pose, both arms relaxed. Preserve recognizable red-yellow-white outfit, no visible text or logos, no balloon or other props, no meme expressions. Reference 3 and 5 inform warmth and roundness, 2 informs full-body compact proportions, 6 informs graphic simplicity; do not copy source backgrounds, captions, watermarks, confetti or floating symbols.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `pixel`: Pixel-art-adjacent digital mascot with a chunky silhouette, simple dark outline, limited palette, flat cel shading, and visible stepped edges. User style notes: Actual low-resolution video-game pixel sprite, designed on about a 64x80 pixel logical grid, then enlarged with nearest-neighbor. Consistent chunky 1 logical-pixel dark burgundy outline, crisp square stair-step edges, limited 12-18 color palette, flat 2-tone shading, no smooth vector curves, no painted textures, no gradients, no antialiasing. Cute cozy handheld-game aesthetic. Whole body readable at desktop size..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Dragging-left loop: show directional movement to the left through body and limb poses only.

State requirements:
- Show directional drag movement to the left through body, limb, and prop movement only.
- The row must unmistakably face and travel left.
- The movement cadence must alternate visibly across the 8 frames instead of repeating one nearly static stride.
- Do not draw speed lines, dust clouds, floor shadows, motion trails, or detached motion effects.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.

```

## rows/waving

```text
Create one horizontal animation strip for Codex pet `maimai`, state `waving`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 4 full-body frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 4 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Use the six supplied Ronald McDonald images as character design references only. Make a much cuter full-body chibi pixel-art desktop companion: 2.25 heads tall, large rounded fluffy scarlet curly hair, round ivory-white face, bright gentle black oval eyes, tiny round red nose, pink square cheeks, small friendly red smile. Yellow one-piece outfit with a simple white collar and red center trim, red-and-white horizontal striped sleeves, yellow mittens, oversized rounded red shoes. Short soft limbs, head about 55 percent of total height. Resting neutral front-facing pose, both arms relaxed. Preserve recognizable red-yellow-white outfit, no visible text or logos, no balloon or other props, no meme expressions. Reference 3 and 5 inform warmth and roundness, 2 informs full-body compact proportions, 6 informs graphic simplicity; do not copy source backgrounds, captions, watermarks, confetti or floating symbols.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `pixel`: Pixel-art-adjacent digital mascot with a chunky silhouette, simple dark outline, limited palette, flat cel shading, and visible stepped edges. User style notes: Actual low-resolution video-game pixel sprite, designed on about a 64x80 pixel logical grid, then enlarged with nearest-neighbor. Consistent chunky 1 logical-pixel dark burgundy outline, crisp square stair-step edges, limited 12-18 color palette, flat 2-tone shading, no smooth vector curves, no painted textures, no gradients, no antialiasing. Cute cozy handheld-game aesthetic. Whole body readable at desktop size..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Greeting loop: paw or limb down, raised, tilted, and returning in a friendly attention gesture.

State requirements:
- Show the greeting through paw, hand, wing, or limb pose only.
- Do not draw wave marks, motion arcs, lines, sparkles, symbols, or floating effects around the gesture.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.

```

## rows/jumping

```text
Create one horizontal animation strip for Codex pet `maimai`, state `jumping`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 5 full-body frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 5 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Use the six supplied Ronald McDonald images as character design references only. Make a much cuter full-body chibi pixel-art desktop companion: 2.25 heads tall, large rounded fluffy scarlet curly hair, round ivory-white face, bright gentle black oval eyes, tiny round red nose, pink square cheeks, small friendly red smile. Yellow one-piece outfit with a simple white collar and red center trim, red-and-white horizontal striped sleeves, yellow mittens, oversized rounded red shoes. Short soft limbs, head about 55 percent of total height. Resting neutral front-facing pose, both arms relaxed. Preserve recognizable red-yellow-white outfit, no visible text or logos, no balloon or other props, no meme expressions. Reference 3 and 5 inform warmth and roundness, 2 informs full-body compact proportions, 6 informs graphic simplicity; do not copy source backgrounds, captions, watermarks, confetti or floating symbols.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `pixel`: Pixel-art-adjacent digital mascot with a chunky silhouette, simple dark outline, limited palette, flat cel shading, and visible stepped edges. User style notes: Actual low-resolution video-game pixel sprite, designed on about a 64x80 pixel logical grid, then enlarged with nearest-neighbor. Consistent chunky 1 logical-pixel dark burgundy outline, crisp square stair-step edges, limited 12-18 color palette, flat 2-tone shading, no smooth vector curves, no painted textures, no gradients, no antialiasing. Cute cozy handheld-game aesthetic. Whole body readable at desktop size..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Hover jump loop: anticipation, lift, airborne peak, descent, and settle through body height.

State requirements:
- Show the jump through pose and vertical body position only: anticipation, lift, airborne peak, descent, settle.
- Do not draw ground shadows, contact shadows, drop shadows, oval shadows, landing marks, dust, smears, bounce pads, or motion marks under the pet.
- Keep the background outside the pet perfectly flat chroma key with no darker key-colored patches.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.

```

## rows/failed

```text
Create one horizontal animation strip for Codex pet `maimai`, state `failed`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 8 full-body frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 8 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Use the six supplied Ronald McDonald images as character design references only. Make a much cuter full-body chibi pixel-art desktop companion: 2.25 heads tall, large rounded fluffy scarlet curly hair, round ivory-white face, bright gentle black oval eyes, tiny round red nose, pink square cheeks, small friendly red smile. Yellow one-piece outfit with a simple white collar and red center trim, red-and-white horizontal striped sleeves, yellow mittens, oversized rounded red shoes. Short soft limbs, head about 55 percent of total height. Resting neutral front-facing pose, both arms relaxed. Preserve recognizable red-yellow-white outfit, no visible text or logos, no balloon or other props, no meme expressions. Reference 3 and 5 inform warmth and roundness, 2 informs full-body compact proportions, 6 informs graphic simplicity; do not copy source backgrounds, captions, watermarks, confetti or floating symbols.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `pixel`: Pixel-art-adjacent digital mascot with a chunky silhouette, simple dark outline, limited palette, flat cel shading, and visible stepped edges. User style notes: Actual low-resolution video-game pixel sprite, designed on about a 64x80 pixel logical grid, then enlarged with nearest-neighbor. Consistent chunky 1 logical-pixel dark burgundy outline, crisp square stair-step edges, limited 12-18 color palette, flat 2-tone shading, no smooth vector curves, no painted textures, no gradients, no antialiasing. Cute cozy handheld-game aesthetic. Whole body readable at desktop size..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Blocked/failed loop: slumped or deflated reaction with sad or closed eyes.

State requirements:
- Show failure through slumped pose, drooping ears/limbs, closed or sad eyes, and lower body position.
- Tears, small smoke puffs, or tiny stars are allowed only if attached to or overlapping the pet silhouette and kept inside the same frame slot.
- Do not draw red X marks, floating symbols, detached stars, separated smoke clouds, falling tear drops, dust, or other loose effects.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.

```

## rows/waiting

```text
Create one horizontal animation strip for Codex pet `maimai`, state `waiting`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 6 full-body frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 6 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Use the six supplied Ronald McDonald images as character design references only. Make a much cuter full-body chibi pixel-art desktop companion: 2.25 heads tall, large rounded fluffy scarlet curly hair, round ivory-white face, bright gentle black oval eyes, tiny round red nose, pink square cheeks, small friendly red smile. Yellow one-piece outfit with a simple white collar and red center trim, red-and-white horizontal striped sleeves, yellow mittens, oversized rounded red shoes. Short soft limbs, head about 55 percent of total height. Resting neutral front-facing pose, both arms relaxed. Preserve recognizable red-yellow-white outfit, no visible text or logos, no balloon or other props, no meme expressions. Reference 3 and 5 inform warmth and roundness, 2 informs full-body compact proportions, 6 informs graphic simplicity; do not copy source backgrounds, captions, watermarks, confetti or floating symbols.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `pixel`: Pixel-art-adjacent digital mascot with a chunky silhouette, simple dark outline, limited palette, flat cel shading, and visible stepped edges. User style notes: Actual low-resolution video-game pixel sprite, designed on about a 64x80 pixel logical grid, then enlarged with nearest-neighbor. Consistent chunky 1 logical-pixel dark burgundy outline, crisp square stair-step edges, limited 12-18 color palette, flat 2-tone shading, no smooth vector curves, no painted textures, no gradients, no antialiasing. Cute cozy handheld-game aesthetic. Whole body readable at desktop size..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Needs-input loop: expectant asking pose for approval, help, or user input.

State requirements:
- Show that Codex needs approval, help, or user input through an expectant asking pose.
- Keep the motion patient and readable, without turning it into ordinary idle or review.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.

```

## rows/running

```text
Create one horizontal animation strip for Codex pet `maimai`, state `running`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 6 full-body frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 6 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Use the six supplied Ronald McDonald images as character design references only. Make a much cuter full-body chibi pixel-art desktop companion: 2.25 heads tall, large rounded fluffy scarlet curly hair, round ivory-white face, bright gentle black oval eyes, tiny round red nose, pink square cheeks, small friendly red smile. Yellow one-piece outfit with a simple white collar and red center trim, red-and-white horizontal striped sleeves, yellow mittens, oversized rounded red shoes. Short soft limbs, head about 55 percent of total height. Resting neutral front-facing pose, both arms relaxed. Preserve recognizable red-yellow-white outfit, no visible text or logos, no balloon or other props, no meme expressions. Reference 3 and 5 inform warmth and roundness, 2 informs full-body compact proportions, 6 informs graphic simplicity; do not copy source backgrounds, captions, watermarks, confetti or floating symbols.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `pixel`: Pixel-art-adjacent digital mascot with a chunky silhouette, simple dark outline, limited palette, flat cel shading, and visible stepped edges. User style notes: Actual low-resolution video-game pixel sprite, designed on about a 64x80 pixel logical grid, then enlarged with nearest-neighbor. Consistent chunky 1 logical-pixel dark burgundy outline, crisp square stair-step edges, limited 12-18 color palette, flat 2-tone shading, no smooth vector curves, no painted textures, no gradients, no antialiasing. Cute cozy handheld-game aesthetic. Whole body readable at desktop size..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Working loop: focused active-task processing, thinking, typing, scanning, or effortful concentration; not literal foot-running, jogging, sprinting, treadmill motion, raised knees, long steps, pumping arms, or directional travel.

State requirements:
- Show the pet actively working or processing, as if running a task: focused posture, busy hands or paws, purposeful bobbing, thinking motion, tool or prop motion only if already part of the pet identity, or other non-locomotion activity.
- Do not show literal foot-running, jogging, sprinting, treadmill motion, raised knees, long steps, pumping arms, directional travel, speed lines, dust clouds, floor shadows, motion trails, or detached motion effects.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.

```

## rows/review

```text
Create one horizontal animation strip for Codex pet `maimai`, state `review`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 6 full-body frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 6 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Use the six supplied Ronald McDonald images as character design references only. Make a much cuter full-body chibi pixel-art desktop companion: 2.25 heads tall, large rounded fluffy scarlet curly hair, round ivory-white face, bright gentle black oval eyes, tiny round red nose, pink square cheeks, small friendly red smile. Yellow one-piece outfit with a simple white collar and red center trim, red-and-white horizontal striped sleeves, yellow mittens, oversized rounded red shoes. Short soft limbs, head about 55 percent of total height. Resting neutral front-facing pose, both arms relaxed. Preserve recognizable red-yellow-white outfit, no visible text or logos, no balloon or other props, no meme expressions. Reference 3 and 5 inform warmth and roundness, 2 informs full-body compact proportions, 6 informs graphic simplicity; do not copy source backgrounds, captions, watermarks, confetti or floating symbols.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `pixel`: Pixel-art-adjacent digital mascot with a chunky silhouette, simple dark outline, limited palette, flat cel shading, and visible stepped edges. User style notes: Actual low-resolution video-game pixel sprite, designed on about a 64x80 pixel logical grid, then enlarged with nearest-neighbor. Consistent chunky 1 logical-pixel dark burgundy outline, crisp square stair-step edges, limited 12-18 color palette, flat 2-tone shading, no smooth vector curves, no painted textures, no gradients, no antialiasing. Cute cozy handheld-game aesthetic. Whole body readable at desktop size..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Ready-review loop: focused inspection of completed output with lean, blink, narrowed eyes, head tilt, or paw pose.

State requirements:
- Show review through lean, blink, narrowed eyes, head tilt, or paw/hand position.
- Do not add magnifying glasses, papers, code, UI, punctuation, symbols, or other new props unless they already exist in the base pet identity.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.

```
