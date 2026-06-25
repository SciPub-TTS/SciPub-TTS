# Owlreka UI Context for Figma Report Page

This document gives design context for creating a new `Report` page in Owlreka.
It is written so a designer or Figma AI can understand the current visual system,
page shell, tone, and component language before proposing a new screen.

## 1. Product Summary

Owlreka is a research trend intelligence platform for researchers, lecturers, and students.
The product helps users explore papers, topics, bookmarks, social posts, trends, and reports.

The product personality is:

- Academic, but not boring
- Clean and data-driven, but still warm and expressive
- Structured, but not overly enterprise/corporate
- Modern, high-contrast, and readable

The UI should feel like a research workspace, not a generic SaaS admin template.

## 2. Where the Report Page Lives

The `Report` page is part of the main user workspace, not the admin console.

That means it sits inside this shell:

- Left fixed black sidebar
- Top sticky white header with breadcrumb
- Light page background
- Content area with generous padding
- Footer with system/project information

Current route:

- `/report`

Current file:

- `src/features/reports/components/ReportPage.tsx`

Current shell references:

- `src/layout/user/MainLayout.tsx`
- `src/layout/user/Sidebar.tsx`
- `src/layout/user/Header.tsx`
- `src/layout/global/Footer.tsx`

## 3. Core Layout Language

### Main app shell

- Sidebar width: `56` Tailwind units (`ml-56` content offset)
- Sidebar background: pure black / near-black
- Active nav item: emerald green
- Header: sticky, white, semi-translucent, subtle blur, thin animated divider
- Main content: `p-6`
- Overall app background: `slate-50`

### Page structure expectation

Most user pages should look like:

1. Intro / hero section
2. Filters or controls
3. Main content cards
4. Supporting insights / charts / lists

The `Report` page should respect this flow and should not look detached from the workspace shell.

## 4. Visual DNA

### Overall mood

- White surfaces on a very light neutral background
- Black borders used intentionally
- Rounded cards with large radius
- Radial gradient accents inside some surfaces
- Strong typography hierarchy
- Bright accent colors used as signals, not as full-page fill

### Important contrast rule

The product prefers:

- black borders
- white cards
- dark text
- strategic accent color

It does **not** prefer:

- low-contrast gray-on-gray
- glassmorphism-heavy layouts
- neon dashboards
- dark full-page report screens in the user workspace

## 5. Typography

Current font system:

- Titles: `Space Grotesk`
- Main text / controls: `Be Vietnam Pro`
- Supporting text / metadata: `Manrope`
- Brand wordmark: `Agbalumo`
- Editorial/search showcase headings only: `Cormorant Garamond`

Design guidance:

- Use `Space Grotesk` for report page titles, section titles, and strong data callouts
- Use `Be Vietnam Pro` for buttons, inputs, tabs, labels, and main UI text
- Use `Manrope` for helper text, captions, timestamps, source notes, and metadata rows
- Avoid overusing `Cormorant Garamond` on the report page; that style belongs more to landing/editorial moments

## 6. Color Language

Primary product colors used repeatedly:

- Deep green: `#14532D`
- Brighter green hover/state: `#15803D`
- Brand green accent: `#00A859`
- Orange accent: `#F37021`
- Blue accent: `#00AEEF`
- Strong blue metadata: `#005CB9`
- Light background base: `#F8FAFC`
- Text: near-black / black

Suggested semantic use:

- Green = positive action, active state, trusted product action
- Orange = taxonomy, emphasis, field/subfield, warm academic highlight
- Blue = type/system/info/reference data
- Black border = structure and definition

## 7. Shape, Borders, and Shadows

Current shape language:

- Large cards: around `rounded-[1.8rem]` to `rounded-[2rem]`
- Small controls: rounded `lg`, `xl`, or `2xl`
- Pills/badges: often rounded-full
- Black 1px borders are common and intentional

Shadow style:

- Soft but visible
- More like lifted paper/cards, less like floating glass
- Example mood: `shadow-[0_18px_55px_rgba(15,23,42,0.06)]`

Report page should continue this "stack of research surfaces" feeling.

## 8. Existing Shared Components and Their Meaning

### Breadcrumb bar

- White bordered control surface
- Back button + breadcrumb path
- Compact, functional, high-contrast

Reference:

- `src/layout/global/BreadcrumbBar.tsx`

### Metadata badges

These encode research metadata and should influence report chips/legends:

- Blue badge = generic type/system metadata
- Orange badge = taxonomy/subfield
- Green badge = topic
- Trend badge = stronger gradient and glow

Reference:

- `src/layout/global/MetadataBadge.tsx`

### Work cards

Work/result cards are information-dense but still visually calm:

- top metadata row
- strong title
- author/source/citation row
- abstract preview
- keyword row
- clear action buttons

Reference:

- `src/layout/global/ListWorkLayout.tsx`
- `src/features/bookmarks/components/BookmarkCard.tsx`

### Confirmation dialog

Dialog language is clean, white, bordered, rounded, and centered.
No noisy decoration, just direct action framing.

Reference:

- `src/layout/global/SafeActionDialog.tsx`

## 9. Existing Page Personalities

### Landing page

- More expressive
- More editorial
- More storytelling and oversized headings
- Good source of energy and visual ambition

### Search / Bookmark / Social pages

- Closer to the day-to-day product experience
- Better references for the `Report` page than landing

### Admin dashboard

- Useful reference for chart density and information grouping
- But admin visual style is more straightforward and less brand-expressive than user pages

Design guidance for `Report`:

- Use user-workspace styling first
- Borrow chart clarity from admin where useful
- Do not make the report page look like an admin-only BI dashboard

## 10. Report Page Design Goal

The `Report` page should feel like:

- a polished research summary workspace
- a place where users can review synthesized findings
- a page that mixes narrative insight, metrics, and export-ready structure

It should feel one step more curated than Search, and one step more formal than Social Hub.

## 11. Recommended Report Page Structure

Suggested sections for Figma to explore:

### A. Report hero / summary card

- Big title such as `Research Reports`
- One-line explanation of what the page does
- Optional highlighted summary box
- CTA row such as `Generate report`, `Export PDF`, `Save snapshot`

### B. Filter / scope controls

Possible controls:

- date range
- topic
- field/subfield
- source type
- report mode

This row should feel like a smart research control bar, not an enterprise form wall.

### C. Key metrics strip

Examples:

- total papers analyzed
- fastest-growing topic
- top cited theme
- dominant source type
- weekly change

These cards should be compact, crisp, and easy to scan.

### D. Primary insight panels

Examples:

- trend over time
- topic distribution
- citation momentum
- source/venue distribution
- notable keywords

Panels should use white cards with strong headings and breathing room.

### E. Written insights / report narrative

Important for this product:

- include a section that reads like a generated research summary
- use 2-4 insight blocks with short paragraphs
- make it feel like "interpreted intelligence", not only raw charts

### F. Supporting evidence / references

Examples:

- top related papers
- top supporting topics
- bookmarked sources connected to the report
- references used to generate the report

This section should connect visually to existing work cards and metadata badges.

## 12. Interaction and UX Expectations

- Desktop first, but must scale cleanly to tablet/mobile
- Cards can stack vertically on smaller screens
- Sticky header stays as-is from the app shell
- Filters should be easy to scan and not too tall
- Export actions should be clear and prominent
- Avoid hidden actions unless there is a strong reason

## 13. What to Avoid

- Do not design it like a plain Bootstrap dashboard
- Do not make the page fully dark
- Do not remove black borders from the design language
- Do not overuse purple gradients
- Do not use tiny typography for analytical content
- Do not create an overly crowded chart wall with no narrative hierarchy
- Do not make it look like admin analytics unless the route moves under admin

## 14. Desired Figma Output

For the first design pass, create:

1. One desktop report page
2. One mobile adaptation
3. Clear hero section
4. Filter row
5. 3-5 metric cards
6. 2-4 chart/insight panels
7. 1 written-summary section
8. 1 references/supporting papers section

## 15. Copy-Paste Prompt for Figma AI

Use this prompt directly if needed:

```text
Design a Report page for Owlreka, a research trend intelligence platform for researchers, lecturers, and students. The page lives inside a user workspace app shell with a fixed black left sidebar, a sticky white top header with breadcrumb, a light slate background, and large rounded white content cards with subtle shadows and black borders.

Visual style: modern academic workspace, clean and high-contrast, expressive but not playful, data-driven but warm. Use Space Grotesk for headings, Be Vietnam Pro for UI text, and Manrope for supporting metadata. Use deep green (#14532D) as the primary action color, orange (#F37021) for taxonomy emphasis, blue (#00AEEF or #005CB9) for system/type accents, and green (#00A859 / #15803D) for topic/trend emphasis. Keep white surfaces, strong black borders, and soft paper-like shadows. Some cards may use subtle radial gradient accents, but the page should remain mostly clean and readable.

The page should feel more curated than a search page and more formal than a social page. It should not look like a generic BI dashboard or enterprise admin panel. Include:
- a strong report hero/summary section
- a compact research filter row
- key metric cards
- chart panels for trend over time, topic distribution, citation momentum, or keyword movement
- a written summary/insight section
- a supporting references or top papers section
- export/report actions such as Generate Report, Save Snapshot, Export PDF

Keep the design desktop-first, but provide a clear mobile adaptation. Preserve the existing Owlreka visual language: black border structure, rounded cards, strong hierarchy, light background, and research-focused clarity.
```

## 16. Source References in Code

These files best represent the current UI system:

- `src/styles/index.css`
- `src/layout/user/MainLayout.tsx`
- `src/layout/user/Sidebar.tsx`
- `src/layout/user/Header.tsx`
- `src/layout/global/Footer.tsx`
- `src/layout/global/BreadcrumbBar.tsx`
- `src/layout/global/MetadataBadge.tsx`
- `src/layout/global/ListWorkLayout.tsx`
- `src/layout/global/SafeActionDialog.tsx`
- `src/features/bookmarks/components/BookmarkCard.tsx`
- `src/features/social/components/SocialHubPage.tsx`
- `src/features/admin/components/AdminDashboardInsights.tsx`
- `src/features/reports/components/ReportPage.tsx`
