# React + TypeScript + Vite

## Typography Guideline

Global UI fonts are defined in `src/styles/index.css`.

Use this Google Fonts import:

```css
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

Font roles:

- Title: `Space Grotesk`
- Text: `Be Vietnam Pro`
- Sub text: `Manrope`

Implementation note:

- `body`, buttons, inputs, selects, and text controls use `Be Vietnam Pro`.
- `h1` to `h6` and `.font-title` use `Space Grotesk`.
- `p`, `small`, captions, and `.font-subtext` use `Manrope`.
- The Owlreka sidebar wordmark intentionally keeps `Agbalumo`.
## `api`

Chá»©a cáº¥u hÃ¬nh vÃ  cÃ¡c hÃ m liÃªn quan Ä‘áº¿n viá»‡c káº¿t ná»‘i vá»›i mÃ¡y chá»§, vÃ­ dá»¥ nhÆ° cáº¥u hÃ¬nh Ä‘Æ°á»ng dáº«n, phÆ°Æ¡ng thá»©c gá»­i yÃªu cáº§u, xá»­ lÃ½ pháº£n há»“i hoáº·c lá»—i tá»« mÃ¡y chá»§.

## `app`

Chá»©a pháº§n khá»Ÿi táº¡o chÃ­nh cá»§a á»©ng dá»¥ng, thÆ°á»ng lÃ  nÆ¡i cáº¥u hÃ¬nh tá»•ng thá»ƒ nhÆ° Ä‘á»‹nh tuyáº¿n, bá»‘ cá»¥c chÃ­nh, nhÃ  cung cáº¥p tráº¡ng thÃ¡i hoáº·c cÃ¡c thiáº¿t láº­p toÃ n cá»¥c.

## `assets`

Chá»©a tÃ i nguyÃªn tÄ©nh cá»§a dá»± Ã¡n nhÆ° hÃ¬nh áº£nh, biá»ƒu tÆ°á»£ng, phÃ´ng chá»¯, Ã¢m thanh hoáº·c cÃ¡c tá»‡p dÃ¹ng chung trong giao diá»‡n.

## `components`

Chá»©a cÃ¡c thÃ nh pháº§n giao diá»‡n dÃ¹ng láº¡i nhiá»u nÆ¡i trong á»©ng dá»¥ng nhÆ° nÃºt báº¥m, Ã´ nháº­p liá»‡u, báº£ng, há»™p thoáº¡i, tháº» hiá»ƒn thá»‹ thÃ´ng tin.

## `constants`

Chá»©a cÃ¡c giÃ¡ trá»‹ cá»‘ Ä‘á»‹nh Ä‘Æ°á»£c dÃ¹ng trong toÃ n dá»± Ã¡n, giÃºp trÃ¡nh viáº¿t láº·p láº¡i vÃ  dá»… thay Ä‘á»•i khi cáº§n.

## `features`

Chá»©a cÃ¡c chá»©c nÄƒng lá»›n cá»§a há»‡ thá»‘ng, Ä‘Æ°á»£c chia theo tá»«ng nghiá»‡p vá»¥ cá»¥ thá»ƒ nhÆ° Ä‘Äƒng nháº­p, quáº£n lÃ½ ngÆ°á»i dÃ¹ng, quáº£n lÃ½ sáº£n pháº©m, Ä‘Æ¡n hÃ ng.

## `hooks`

Chá»©a cÃ¡c hÃ m xá»­ lÃ½ logic dÃ¹ng láº¡i trong React, giÃºp tÃ¡ch pháº§n xá»­ lÃ½ ra khá»i giao diá»‡n vÃ  lÃ m mÃ£ nguá»“n gá»n hÆ¡n.

## `layout`

Chá»©a cÃ¡c bá»‘ cá»¥c chung cá»§a trang nhÆ° khung trang chÃ­nh, thanh bÃªn, thanh Ä‘iá»u hÆ°á»›ng, pháº§n Ä‘áº§u trang, pháº§n chÃ¢n trang.

## `lib`

Chá»©a cÃ¡c thÆ° viá»‡n tá»± viáº¿t, cáº¥u hÃ¬nh cÃ´ng cá»¥, hÃ m há»— trá»£ nÃ¢ng cao hoáº·c pháº§n káº¿t ná»‘i vá»›i thÆ° viá»‡n bÃªn ngoÃ i.

## `pages`

Chá»©a cÃ¡c trang chÃ­nh cá»§a á»©ng dá»¥ng, má»—i tá»‡p thÆ°á»ng tÆ°Æ¡ng á»©ng vá»›i má»™t mÃ n hÃ¬nh hoáº·c má»™t Ä‘Æ°á»ng dáº«n trÃªn trang web.

## `services`

Chá»©a cÃ¡c hÃ m xá»­ lÃ½ nghiá»‡p vá»¥ vÃ  giao tiáº¿p vá»›i mÃ¡y chá»§, thÆ°á»ng dÃ¹ng Ä‘á»ƒ gá»i dá»¯ liá»‡u, gá»­i dá»¯ liá»‡u, cáº­p nháº­t hoáº·c xÃ³a dá»¯ liá»‡u.

## `store`

Chá»©a pháº§n quáº£n lÃ½ tráº¡ng thÃ¡i chung cá»§a á»©ng dá»¥ng, vÃ­ dá»¥ nhÆ° thÃ´ng tin ngÆ°á»i dÃ¹ng, giá» hÃ ng, tráº¡ng thÃ¡i Ä‘Äƒng nháº­p hoáº·c dá»¯ liá»‡u dÃ¹ng á»Ÿ nhiá»u mÃ n hÃ¬nh.

## `styles`

Chá»©a cÃ¡c tá»‡p Ä‘á»‹nh dáº¡ng giao diá»‡n nhÆ° mÃ u sáº¯c, khoáº£ng cÃ¡ch, kiá»ƒu chá»¯, bá»‘ cá»¥c, hiá»‡u á»©ng vÃ  cÃ¡c thiáº¿t láº­p giao diá»‡n dÃ¹ng chung.

## `types`

Chá»©a cÃ¡c kiá»ƒu dá»¯ liá»‡u dÃ¹ng trong TypeScript, giÃºp kiá»ƒm soÃ¡t cáº¥u trÃºc dá»¯ liá»‡u vÃ  háº¡n cháº¿ lá»—i khi láº­p trÃ¬nh.

## `utils`

Chá»©a cÃ¡c hÃ m tiá»‡n Ã­ch dÃ¹ng chung trong nhiá»u nÆ¡i, thÆ°á»ng lÃ  cÃ¡c hÃ m xá»­ lÃ½ dá»¯ liá»‡u, Ä‘á»‹nh dáº¡ng ngÃ y thÃ¡ng, Ä‘á»‹nh dáº¡ng tiá»n tá»‡ hoáº·c kiá»ƒm tra dá»¯ liá»‡u Ä‘Æ¡n giáº£n.

## `validators`

Chá»©a cÃ¡c hÃ m hoáº·c quy táº¯c kiá»ƒm tra dá»¯ liá»‡u Ä‘áº§u vÃ o, vÃ­ dá»¥ nhÆ° kiá»ƒm tra email, máº­t kháº©u, sá»‘ Ä‘iá»‡n thoáº¡i, biá»ƒu máº«u Ä‘Äƒng nháº­p hoáº·c Ä‘Äƒng kÃ½.
