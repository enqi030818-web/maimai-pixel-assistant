# 麦麦八组陪伴动作：最终生成提示词

执行：账号已选择的图像中转，官方 image_gen.py CLI，gpt-image-2、medium。身份参考为 pet/concept.png，另附四槽布局图。请求画布 3072×1024；实际返回画布以生成文件记录为准，打包时按实际尺寸裁切。

listen 与 talk 首版相邻槽位拥挤，最终采用更宽布局的 v2。以下为最终使用的完整提示词。

## 侧耳听你说 · listen

```text
Generate exactly FOUR COMPLETE full-body animation poses in ONE horizontal row, not a 2x2 grid. Image 1 is canonical Maimai IDENTITY; image 2 is LAYOUT ONLY. Keep identical red curly hair, cream round face, tiny red nose, yellow one-piece suit, white collar, red center trim, striped red-white sleeves, yellow mittens and oversized red shoes. Preserve the canonical chibi proportions, chunky square pixel steps, limited flat colors and burgundy outline; no smoother vector or painterly redesign. Each of four invisible equal slots is 768px wide on the requested 3072x1024 canvas. Each whole character must fit safely inside the middle 400px of its slot, be about 400px tall, with generous outside padding. Exact same apparent scale and foot baseline across the row. No crops, overlap or extra people. Use tiny pose changes, not size changes.

FOUR frames left to right: Listening attentively: 1 relaxed small smile; 2 leans head slightly toward viewer and raises RIGHT mitten beside ear; 3 cupped mitten by ear, gentle interested open eyes, slight head tilt; 4 holds attentive pose with a soft blink. Both shoes grounded. No fries or other props. This is listening, mouth mostly closed, not waving.

Outside sprites, use perfectly uniform pure blue #0000FF, with no blue on character or props. No floor, shadows, grid, guide marks, frame numbers, readable logo, text, UI, punctuation, checkerboard, blur, gradients, motion streaks or detached effects. Do not copy visible guide shapes. Exactly four small full-body poses in one row.
REPAIR / SPACE REQUIREMENT: Four SMALL figures with at least 140 pixels empty space on BOTH sides of each figure within each 768px slot. Do not enlarge to fill the canvas. Hair and mittens must not touch neighboring slots. Exactly one miniature per slot. The same RIGHT mitten performs the gesture in all frames; never switch gesture hands.
```

## 认真回应你 · talk

```text
Generate exactly FOUR COMPLETE full-body animation poses in ONE horizontal row, not a 2x2 grid. Image 1 is canonical Maimai IDENTITY; image 2 is LAYOUT ONLY. Keep identical red curly hair, cream round face, tiny red nose, yellow one-piece suit, white collar, red center trim, striped red-white sleeves, yellow mittens and oversized red shoes. Preserve the canonical chibi proportions, chunky square pixel steps, limited flat colors and burgundy outline; no smoother vector or painterly redesign. Each of four invisible equal slots is 768px wide on the requested 3072x1024 canvas. Each whole character must fit safely inside the middle 400px of its slot, be about 400px tall, with generous outside padding. Exact same apparent scale and foot baseline across the row. No crops, overlap or extra people. Use tiny pose changes, not size changes.

FOUR frames left to right: Speaking warmly: 1 tiny closed smile, right mitten at chest; 2 mouth forms a small OPEN red oval and mitten opens outward a little; 3 mouth narrows, palm turns toward viewer; 4 mouth returns to closed smile, mitten settles at chest. Distinct mouth shapes and small conversational hand gesture. No speech bubbles, props or text.

Outside sprites, use perfectly uniform pure blue #0000FF, with no blue on character or props. No floor, shadows, grid, guide marks, frame numbers, readable logo, text, UI, punctuation, checkerboard, blur, gradients, motion streaks or detached effects. Do not copy visible guide shapes. Exactly four small full-body poses in one row.
REPAIR / SPACE REQUIREMENT: Four SMALL figures with at least 140 pixels empty space on BOTH sides of each figure within each 768px slot. Do not enlarge to fill the canvas. Hair and mittens must not touch neighboring slots. Exactly one miniature per slot. The same RIGHT mitten performs the gesture in all frames; never switch gesture hands.
```

## 翻翻找信息 · search

```text
Generate exactly FOUR COMPLETE full-body animation poses in ONE horizontal row, not a 2x2 grid. Image 1 is canonical Maimai IDENTITY; image 2 is LAYOUT ONLY. Keep identical red curly hair, cream round face, tiny red nose, yellow one-piece suit, white collar, red center trim, striped red-white sleeves, yellow mittens and oversized red shoes. Preserve the canonical chibi proportions, chunky square pixel steps, limited flat colors and burgundy outline; no smoother vector or painterly redesign. Each of four invisible equal slots is 768px wide on the requested 3072x1024 canvas. Each whole character must fit safely inside the middle 400px of its slot, be about 400px tall, with generous outside padding. Exact same apparent scale and foot baseline across the row. No crops, overlap or extra people. Use tiny pose changes, not size changes.

FOUR frames left to right: Looking up information in a tiny plain burgundy handheld booklet: 1 holds closed booklet at waist with both mittens; 2 booklet open, eyes look down; 3 RIGHT mitten turns ONE opaque cream page attached to spine while LEFT mitten supports it; 4 open booklet back at rest and eyes glance up. Booklet stays touching hand. No leg travel, readable writing or detached paper.

Outside sprites, use perfectly uniform pure blue #0000FF, with no blue on character or props. No floor, shadows, grid, guide marks, frame numbers, readable logo, text, UI, punctuation, checkerboard, blur, gradients, motion streaks or detached effects. Do not copy visible guide shapes. Exactly four small full-body poses in one row.
REPAIR / SPACE REQUIREMENT: Four SMALL figures with at least 140 pixels empty space on BOTH sides of each figure within each 768px slot. Do not enlarge to fill the canvas. Hair and mittens must not touch neighboring slots. Exactly one miniature per slot. The same RIGHT mitten performs the gesture in all frames; never switch gesture hands.
```

## 认真算价格 · calculate

```text
Generate exactly FOUR COMPLETE full-body animation poses in ONE horizontal row, not a 2x2 grid. Image 1 is canonical Maimai IDENTITY; image 2 is LAYOUT ONLY. Keep identical red curly hair, cream round face, tiny red nose, yellow one-piece suit, white collar, red center trim, striped red-white sleeves, yellow mittens and oversized red shoes. Preserve the canonical chibi proportions, chunky square pixel steps, limited flat colors and burgundy outline; no smoother vector or painterly redesign. Each of four invisible equal slots is 768px wide on the requested 3072x1024 canvas. Each whole character must fit safely inside the middle 400px of its slot, be about 400px tall, with generous outside padding. Exact same apparent scale and foot baseline across the row. No crops, overlap or extra people. Use tiny pose changes, not size changes.

FOUR frames left to right: Calculating a price on a small gray handheld calculator with four large muted red square buttons, no symbols or numbers: 1 holds calculator at waist in left mitten; 2 right mitten presses upper button and eyes focus down; 3 right mitten presses lower button, slight focused head tilt; 4 raises eyes with a satisfied closed smile while holding calculator steady. Calculator remains attached to hand. No detached currency symbols or text.

Outside sprites, use perfectly uniform pure blue #0000FF, with no blue on character or props. No floor, shadows, grid, guide marks, frame numbers, readable logo, text, UI, punctuation, checkerboard, blur, gradients, motion streaks or detached effects. Do not copy visible guide shapes. Exactly four small full-body poses in one row.
REPAIR / SPACE REQUIREMENT: Four SMALL figures with at least 140 pixels empty space on BOTH sides of each figure within each 768px slot. Do not enlarge to fill the canvas. Hair and mittens must not touch neighboring slots. Exactly one miniature per slot. The same RIGHT mitten performs the gesture in all frames; never switch gesture hands.
```

## 准备热薯条 · fry

```text
Generate exactly FOUR COMPLETE full-body animation poses in ONE horizontal row, not a 2x2 grid. Image 1 is canonical Maimai IDENTITY; image 2 is LAYOUT ONLY. Keep identical red curly hair, cream round face, tiny red nose, yellow one-piece suit, white collar, red center trim, striped red-white sleeves, yellow mittens and oversized red shoes. Preserve the canonical chibi proportions, chunky square pixel steps, limited flat colors and burgundy outline; no smoother vector or painterly redesign. Each of four invisible equal slots is 768px wide on the requested 3072x1024 canvas. Each whole character must fit safely inside the middle 400px of its slot, be about 400px tall, with generous outside padding. Exact same apparent scale and foot baseline across the row. No crops, overlap or extra people. Use tiny pose changes, not size changes.

FOUR frames left to right: Preparing fries: one compact plain burgundy rectangular fryer pot sits directly in front of feet, touching the character silhouette, no floor. Maimai holds its short gray wire basket handle: 1 basket down inside pot with golden fries visible; 2 raises basket slightly; 3 basket lifted to waist and tilted gently to drain, fries stay inside; 4 lowers basket toward pot again. The whole small pot, basket, handle and character fit inside each slot. No flame, oil drops, steam, speed lines or loose fries. This is a playful waiting animation, not proof of a real order.

Outside sprites, use perfectly uniform pure blue #0000FF, with no blue on character or props. No floor, shadows, grid, guide marks, frame numbers, readable logo, text, UI, punctuation, checkerboard, blur, gradients, motion streaks or detached effects. Do not copy visible guide shapes. Exactly four small full-body poses in one row.
REPAIR / SPACE REQUIREMENT: Four SMALL figures with at least 140 pixels empty space on BOTH sides of each figure within each 768px slot. Do not enlarge to fill the canvas. Hair and mittens must not touch neighboring slots. Exactly one miniature per slot. The same RIGHT mitten performs the gesture in all frames; never switch gesture hands.
```

## 悄悄吃根薯条 · eat

```text
Generate exactly FOUR COMPLETE full-body animation poses in ONE horizontal row, not a 2x2 grid. Image 1 is canonical Maimai IDENTITY; image 2 is LAYOUT ONLY. Keep identical red curly hair, cream round face, tiny red nose, yellow one-piece suit, white collar, red center trim, striped red-white sleeves, yellow mittens and oversized red shoes. Preserve the canonical chibi proportions, chunky square pixel steps, limited flat colors and burgundy outline; no smoother vector or painterly redesign. Each of four invisible equal slots is 768px wide on the requested 3072x1024 canvas. Each whole character must fit safely inside the middle 400px of its slot, be about 400px tall, with generous outside padding. Exact same apparent scale and foot baseline across the row. No crops, overlap or extra people. Use tiny pose changes, not size changes.

FOUR frames left to right: Eating one fry while STANDING: left mitten holds a small plain red carton of thick golden fries at waist throughout; 1 right mitten picks a fry touching the carton; 2 right mitten brings one fry to small open mouth; 3 fry touches mouth, eyes close happily, cheeks slightly puff; 4 right mitten lowers empty, mouth small content smile. Golden fry always touches hand or mouth, no floating food, no gull, no running.

Outside sprites, use perfectly uniform pure blue #0000FF, with no blue on character or props. No floor, shadows, grid, guide marks, frame numbers, readable logo, text, UI, punctuation, checkerboard, blur, gradients, motion streaks or detached effects. Do not copy visible guide shapes. Exactly four small full-body poses in one row.
REPAIR / SPACE REQUIREMENT: Four SMALL figures with at least 140 pixels empty space on BOTH sides of each figure within each 768px slot. Do not enlarge to fill the canvas. Hair and mittens must not touch neighboring slots. Exactly one miniature per slot. The same RIGHT mitten performs the gesture in all frames; never switch gesture hands.
```

## 坐着打瞌睡 · sleep

```text
Generate exactly FOUR COMPLETE full-body animation poses in ONE horizontal row, not a 2x2 grid. Image 1 is canonical Maimai IDENTITY; image 2 is LAYOUT ONLY. Keep identical red curly hair, cream round face, tiny red nose, yellow one-piece suit, white collar, red center trim, striped red-white sleeves, yellow mittens and oversized red shoes. Preserve the canonical chibi proportions, chunky square pixel steps, limited flat colors and burgundy outline; no smoother vector or painterly redesign. Each of four invisible equal slots is 768px wide on the requested 3072x1024 canvas. Each whole character must fit safely inside the middle 400px of its slot, be about 400px tall, with generous outside padding. Exact same apparent scale and foot baseline across the row. No crops, overlap or extra people. Use tiny pose changes, not size changes.

FOUR frames left to right: Sleepy seated breathing loop, seated in ALL FOUR frames: oversized red shoes gently forward, yellow mittens folded on lap, body compact and cozy; 1 eyes half closed and head upright; 2 eyes fully close and head lowers a tiny bit; 3 head tilts slightly right, body breathes down one logical pixel; 4 head eases toward frame 1, eyes stay sleepy. Preserve head size and outfit. No bed, pillow, bubbles, letters, Z symbols, floor or shadow.

Outside sprites, use perfectly uniform pure blue #0000FF, with no blue on character or props. No floor, shadows, grid, guide marks, frame numbers, readable logo, text, UI, punctuation, checkerboard, blur, gradients, motion streaks or detached effects. Do not copy visible guide shapes. Exactly four small full-body poses in one row.
REPAIR / SPACE REQUIREMENT: Four SMALL figures with at least 140 pixels empty space on BOTH sides of each figure within each 768px slot. Do not enlarge to fill the canvas. Hair and mittens must not touch neighboring slots. Exactly one miniature per slot. The same RIGHT mitten performs the gesture in all frames; never switch gesture hands.
```

## 被摸摸很开心 · petting

```text
Generate exactly FOUR COMPLETE full-body animation poses in ONE horizontal row, not a 2x2 grid. Image 1 is canonical Maimai IDENTITY; image 2 is LAYOUT ONLY. Keep identical red curly hair, cream round face, tiny red nose, yellow one-piece suit, white collar, red center trim, striped red-white sleeves, yellow mittens and oversized red shoes. Preserve the canonical chibi proportions, chunky square pixel steps, limited flat colors and burgundy outline; no smoother vector or painterly redesign. Each of four invisible equal slots is 768px wide on the requested 3072x1024 canvas. Each whole character must fit safely inside the middle 400px of its slot, be about 400px tall, with generous outside padding. Exact same apparent scale and foot baseline across the row. No crops, overlap or extra people. Use tiny pose changes, not size changes.

FOUR frames left to right: Responding happily to a gentle head pat without drawing a human hand: 1 neutral cute smile and arms relaxed; 2 shoulders rise a little, eyes close into happy arcs and head leans a little LEFT; 3 head leans a little RIGHT, mittens tucked near cheeks, shy soft smile; 4 head returns center, eyes open and arms settle. Small grounded movement, not a jump. No hearts, sparkles, detached effects or extra limbs.

Outside sprites, use perfectly uniform pure blue #0000FF, with no blue on character or props. No floor, shadows, grid, guide marks, frame numbers, readable logo, text, UI, punctuation, checkerboard, blur, gradients, motion streaks or detached effects. Do not copy visible guide shapes. Exactly four small full-body poses in one row.
REPAIR / SPACE REQUIREMENT: Four SMALL figures with at least 140 pixels empty space on BOTH sides of each figure within each 768px slot. Do not enlarge to fill the canvas. Hair and mittens must not touch neighboring slots. Exactly one miniature per slot. The same RIGHT mitten performs the gesture in all frames; never switch gesture hands.
```
