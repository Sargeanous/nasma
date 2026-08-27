# Nasma Operations Hub

Build the front end for Nasma (نسمة), a mosque operations platform for Awqaf,

the government authority for Islamic affairs and endowments in Abu Dhabi, who

are custodian of every mosque in the emirate. React + TypeScript + Tailwind.

I am attaching screenshots of the current working build. Keep the information

architecture and the data. Your job is to raise the visual craft to something a

government minister would present.

BUILD IN THIS ORDER, and show me each stage before moving on:

  1 design tokens and RTL infrastructure   2 mock data   3 component library

  4 access gate   5 phone surfaces   6 iPad board   7 laptop surfaces

  8 mosque twin   9 edge states and accessibility audit

=============================== 1. FOUNDATION ===============================

TONE: institutional calm. Swiss information design discipline, Gulf palette.

Restraint is the aesthetic. Usable by a 60-year-old Imam without instruction.

TOKENS as CSS variables and Tailwind theme:

  deep-green #0A4239  green #0E5E50  gold #B98A2F  gold-light #CFA14C

  sand #F2EFE7  sand-2 #F4F1E9  sand-3 #EDEAE0  hairline #DDD7C8

  ink #1B1E1C  muted #79756A

  success #1F7A4D  warning #B4690E  alert #B3372E

TYPE: Schibsted Grotesk for Latin UI. IBM Plex Sans Arabic for Arabic, a true

Arabic typeface and never a Latin font rendering Arabic glyphs. Marcellus for

the word "Nasma" only. Strict type scale. Tabular figures wherever numbers

align in columns; numbers are the hero of most screens.

FORM: radii 9px controls, 12-16px cards, never mixed arbitrarily. Elevation via

1px hairlines and very soft shadows only. One line-icon set at 1.5px stroke.

BILINGUAL AND RTL, set up now because retrofitting it fails:

  a direction context with an ar/en switch at the app root

  logical CSS everywhere: margin-inline, padding-inline, text-align start/end,

  inset-inline. Never left or right.

  mirror directional icons under RTL

  a BidiText helper wrapping Latin runs (ticket ids, times, percentages, "SLA")

  in U+2068/U+2069 isolates when inside Arabic text, or they visually jump to

  the wrong end of the line

HOUSE RULE for all interface copy: no em dashes, no en dashes, and no middle

dot as a separator. Use a hyphen or a vertical bar according to context.

NEVER: dark dashboards, neon, glassmorphism, purple or blue SaaS gradients,

stock photography, mosque-at-sunset imagery, crescent-and-star clip art,

playful illustration, mascots, emoji in the UI, hero sections or other

marketing patterns, animation over 200ms.

CULTURAL REQUIREMENTS, these are correctness not taste:

  Arabic is primary on phone and iPad, English is the twin

  Gregorian and Hijri (Umm al-Qura) dates always appear together

  the five prayer times with iqamah are a permanent structural element of the

  mosque-facing surfaces, with the next prayer always indicated

  Islamic geometry (eight-point star, interlaced double diamond) may appear as

  a watermark, divider or empty-state mark at low opacity. Never as clip art.

  restraint reads as respect

=============================== 2. MOCK DATA ===============================

One typed mock layer every screen reads from, so it looks like one product.

12 mosques, each with name_en, name_ar, region, district, class, capacity,

area_m2, hvac, contractor, compliance 79-97, lat/lng, 12 months of electricity

and water:

  m-001 Al Aziz, Al Reem Island, Jame'e (Friday), 1500

  m-002 Sheikh Hamdan bin Mohammed Al Nahyan, Al Reem Island, Daily, 420

  m-003 Reem Central Park, Al Reem Island, Daily, 320

  m-004 Mariam Umm Eisa, Al Mushrif, Jame'e (Friday), 900

  m-005 Al Khalidiyah, Al Khalidiyah, Daily, 340

  m-006 Al Kareem, Al Kasir Street, Daily, 300

  m-007 Al Noor, Khalifa City, Daily, 350

  m-008 Madinat Zayed, Al Dhafra, Daily, 240

  m-009 Al Mirfa, Al Dhafra, Jame'e (Friday), 520

  m-010 Sheikh Khalifa bin Zayed Al Nahyan, Al Ain, Jame'e, 4800

  m-011 Sheikha Salama, Al Ain, Jame'e (Friday), 680

  m-012 Al Jimi, Al Ain, Daily, 300

Contractors: Al Diyar FM Services m-001..007, Gulf Crescent Maintenance

m-008..009, Oasis Facilities Co. m-010..012.

8 people (name_en, name_ar, role, scope):

  Ahmed Al Mansoori, HQ admin, all 12

  Khalid Al Hammadi, regional supervisor, Abu Dhabi City

  Sheikh Yousef Al Marzooqi, imam, m-002

  Bilal Rahman, muezzin, m-002

  Noor Alam, caretaker, m-002

  Ramesh Kumar, FM technician, m-002/003/005

  Joseph Mathew, FM supervisor, Al Diyar FM Services

  Abdulrahman Al Suwaidi, FM supervisor, Gulf Crescent Maintenance

6 work orders (id, mosque, zone, title_en, title_ar, category, severity,

status, sla_hours, sla_remaining, assignee, impact 0-100, feasibility 0-100,

band do_now|escalate|batch|plan):

  t-1001 m-002 women's hall, AC weak cooling, high, assigned to Ramesh Kumar,

         5h left, impact 70 feasibility 85, do_now

  t-1002 m-007 main hall, carpet water damage near entrance, medium, reported

  t-1003 m-009 courtyard, courtyard lights flickering, medium, SLA BREACHED by

         9h, escalated to Saif Al Mazrouei

  t-1004 m-001 main hall, fire alarm panel showing fault code, critical,

         emergency dispatched, 20h left, impact 100, do_now

  t-1005 m-009 main hall, hall not reaching target temperature during prayer,

         high, raised by sensor

  t-1006 m-009 women's hall, temperature sensor reporting a flat line, medium,

         raised by sensor

Prayer times today: Fajr 04:42, Shuruq 05:59, Dhuhr 12:27, Asr 15:55,

Maghrib 18:49, Isha 20:05. Iqamah offsets: fajr 20, dhuhr 15, asr 15,

maghrib 10, isha 15.

Dates: "Thursday, 27 August 2026" and "14 Rabi I 1448 AH", plus Arabic.

Six zones per mosque: main_hall, women_hall, wudu, courtyard, minaret, stores.

============================ 3. COMPONENT LIBRARY ===========================

Card, StatTile (micro-label, large numeral, sub-line, tone), Chip (severity /

status / band variants), Dot, Meter, DataTable (sticky header, tabular figures,

own scroll container), Timeline (actor, role, change, timestamp), PrayerStrip

(five prayers, adhan and iqamah, next highlighted), DatePair, NamePair,

TaskRow, BottomSheet, EmptyState (geometric mark at low opacity), Denied.

Rules: never encode meaning in colour alone, always pair with a label or icon.

All must work under RTL unmodified. Tabular figures on all numbers.

=============================== 4. ACCESS GATE ==============================

The entry screen at /. Three columns by device class, each with a coloured

header: Phone (gold) "Arabic first, one hand, under two minutes a day";

iPad (green) "A working board, landscape, on site"; Laptop (deep green)

"Fleet oversight across all 12 mosques".

Under each, the people who work that way as selectable cards: initials avatar,

name in English with Arabic beneath, one line on what they actually do, and

chips for role, scope and permission count.

  Phone: Sheikh Yousef, Bilal Rahman, Noor Alam, Ramesh Kumar

  iPad: Joseph Mathew, Abdulrahman Al Suwaidi

  Laptop: Ahmed Al Mansoori, Khalid Al Hammadi

Header: Nasma wordmark with نسمة, and "Choose who you are. Each role gets the

surface built for the job, on the device that job is actually done on."

This is the first thing anyone sees. Make it feel considered, not like a login.

============================== 5. PHONE (402pt) =============================

Arabic RTL by default, centred on larger screens. ?lang=en gives the English

twin mirrored back to LTR.

HOME: header with wordmark, DatePair and role avatar. Greeting

"السلام عليكم، الشيخ يوسف" with role, mosque, district. PrayerStrip. My tasks

today with OMS references and a confirm action. "Report a fault in ten seconds"

card. My reports showing t-1001 with severity chip, "Technician assigned:

Ramesh Kumar" and a 5-hour SLA chip. Utilities this month, electricity and

water with AED and change vs last month. Regulations. Monthly maintenance list

with submit. Emergency as a full-width alert-red action with confirmation.

FAULT REPORT, the signature interaction, a BottomSheet, under four taps:

camera viewfinder with shutter and an optional voice note with timer and simple

waveform, then five category chips (تكييف، سباكة، إنارة، نظافة، أخرى), then

submit. An "analysing the photo" state, then the detected category and

description shown as a suggestion the user can accept or change. Never let the

machine silently overwrite what the person chose. Confirmation shows the ticket

reference, the fix window, and that contractor and supervisor were notified.

TECHNICIAN HOME (Ramesh Kumar): my work orders with SLA chip; t-1001 card with

"Assigned to you, 5h left in the 24h SLA" and a Start job action; then In

progress, then Attach fix photo, then Close with evidence. Monthly inspection

card with a 5-item pass/fail plus photo checklist. Meter reading card where

after capture the value read from the photo is shown with a confidence

indicator and an edit affordance.

============================ 6. iPAD (1194x834) =============================

FM Supervisor board, landscape, fills the viewport with no page scroll.

Header: wordmark, "FM SUPERVISOR", DatePair, supervisor name with contractor

and portfolio size. Four KPI tiles: open work orders with ids beneath, SLA

breaches 0 with "all within window", emergency 1 with "24h containment",

portfolio compliance 88%. Team card: Ramesh Kumar with mosques, load, an "on

site" pill, and the line "Regulation limit: 5 mosques or 4 km radius per team".

Active work orders, most urgent first, with an Assign action on unassigned

rows. PPM calendar with OVERDUE / THIS WEEK / scheduled chips. Export KPI

evidence opening a print-ready document.

================================ 7. LAPTOP =================================

SHELL: slim deep-green top bar with wordmark, device label, tabs (Fleet

overview, Map, Maintenance, Mosque twin, Cooling, Users and access), and on the

right the signed-in person with scope and a Switch role action. Content on sand,

max width 1420px. An ع/EN toggle switches the surface to Arabic RTL.

FLEET OVERVIEW: six stat tiles (average compliance 88%, open faults 6 with "1

breaching SLA", electricity AED 33,559, water AED 9,720, footfall 7,240,

variance flags 1). A thin banner of inspections due and pre-Ramadan AC checks.

"Needs attention now" as a two-column panel of urgent items with severity icon,

description, mosque and chevron. Compliance pulse with best and weakest named.

Mosque registry split by region. Attendance highlights ending with a line

stating counts only and no identities.

MAINTENANCE, the most important laptop screen because the ranking must explain

itself:

  Left: an impact against feasibility quadrant chart, roughly 300x230, four

  tinted quadrants labelled DO NOW, ESCALATE, BATCH, PLAN, every open ticket

  plotted as a dot coloured by band, clickable. Axes "Feasibility, can it be

  done" and "Impact". Beneath it band filter pills with counts, then the ticket

  list sorted by band then score.

  Right: the selected ticket. Band, severity and status chips. Title in English

  with Arabic beneath. SLA block with meter, either "18h remaining of 24h" or

  "breached by 9h" in alert red. Then "Why it is ranked here": the band

  headline, then TWO COLUMNS of factors, impact and feasibility, each factor

  showing its name, points contributed out of its maximum, a small meter, and

  one line of plain English such as "1,400 worshippers today" or "only 79 min

  of prayer-safe access today, job needs 90". A prominent scheduling line: "No

  prayer-safe window left today. Next fits tomorrow, 06:00 to 11:57." Flag

  chips. Role-appropriate actions. Full history as a Timeline.

  Give the factor breakdown room. It is the headline claim of the product.

MAP: Leaflet with OpenStreetMap. 12 circle markers coloured by urgency (alert

red needs attention, amber open work, green clear) and sized by capacity, so

colour carries urgency and size carries scale. A soft dashed halo on anything

urgent. Hover tooltip. Click fills a right panel: names in both languages,

district and region, chips for class, capacity and AC mode, a 2x2 grid of open

work, compliance, comfort and area, contractor, and an Open mosque action.

Legend bottom-left, a small "3D twin arrives with PoP" note top-right. If tiles

fail, fall back to a clean list rather than a grey box.

COOLING: four stat tiles (fleet saving kWh/day, the same in AED/year, mosques

still on manual, cooling degree day with sub-line "the normaliser behind every

saving"). Then "Where the cooling headroom is", all 12 mosques with a status

dot for on-plan or manual, a saving bar, percentage, AED/year and comfort

percentage, footnoted that savings are weather-normalised on cooling degree

days and comfort is measured at iqamah and reported beside the saving rather

than after it. Selected mosque below with zone tabs, then a full-width day

chart around 720x210: indoor as a solid green line, setpoint dashed grey,

outdoor dashed amber, electrical draw as a soft filled area beneath, and each

prayer block shaded gold for pre-cool and green for occupied with the prayer

name above. Cooling schedule, one row per prayer: start time, minutes ahead of

iqamah, target, hold temperature between prayers, and a "humidity guard" chip

where active. A plain-English rationale. Comfort delivered as five small cards

showing temperature at iqamah against target, green met and amber missed.

Detected anomalies labelled either "Fixed by accepting the plan" or "Needs a

technician, ticket raised". Accept and reject actions with a line clarifying

that accepting records the decision and does not write setpoints to the plant.

USERS AND ACCESS, three sub-tabs:

  People and scope: 8 people grouped by role, selecting one switches the whole

  platform to their view.

  Permission matrix: permissions down the side, seven roles across, grouped

  into Maintenance, Cooling and Oversight. Filled deep-green dot where granted,

  hairline dash where not, sticky first column and header. Beneath, two lines:

  Awqaf HQ deliberately cannot raise or verify mosque work because the fleet

  tier gets answers and the mosque tier does the work; and a technician cannot

  verify his own job because a fix is confirmed by the Imam who lives with it.

  Audit trail: dense chronological list, monospaced timestamps, tabular.

============================= 8. MOSQUE TWIN ===============================

react-three-fiber and drei. A generated mosque, not a loaded model: main hall

as a box with a half-sphere dome, smaller women's hall attached, ablution area,

open courtyard, minaret with a small dome cap, and a gold mihrab niche marking

the qibla wall. Scale from the mosque's real area and capacity so a grand

mosque renders larger than a daily one. Shell semi-transparent around 17% so

equipment inside is visible. Soft ground plane, warm hemisphere plus two

directional lights.

Equipment as small tinted shapes: main hall cooling, women's hall cooling, fire

panel, PA, lighting, ablution taps, carpet, doors. Green healthy, amber

warning, red faulty. Faulty parts glow and carry a soft halo so they are

visible from outside the building.

Hover shows a dark tooltip with status dot and part name. Click fades everything

else to a ghost and opens a detail panel over the canvas: what is wrong, SLA

meter, impact against feasibility, recommended action, next prayer-safe window,

and the reported photo. OrbitControls capped so it cannot go below ground.

Right sidebar: mosque name, zone and asset counts, faulty and warning chips, an

"Open the roof" slider that lifts the dome and fades the walls, and an Active

issues list where clicking selects that part. Legend bottom-left.

======================== 9. STATES AND FINAL AUDIT =========================

Design each of these properly, not as a spinner: loading (quiet skeletons

matching the real layout), empty (geometric mark at low opacity with one calm

line), permission denied ("Your role does not have access to this. The server

refused the request, so this is not a hidden button, the data never left it"),

offline (persistent but unobtrusive, mosque connectivity varies), SLA breached

/ at risk / met as visually distinct, and a job that cannot be done today for

lack of a prayer-safe window.

Then audit and fix: every screen in Arabic with mirrored navigation and

directional icons and no left/right in place of logical properties; Latin runs

inside Arabic bidi-isolated and not jumping; WCAG 2.1 AA contrast on every

text and background pair; 44px minimum touch targets on phone; full keyboard

navigation and visible focus rings on laptop; no meaning by colour alone; and

no em dashes, en dashes or middle dots anywhere in either language.

Report what you changed.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nasma.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/03568d6d-19fb-49b1-900d-5887966203de).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
