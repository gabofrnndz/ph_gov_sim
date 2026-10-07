# Republika Sandbox: Philippine Government Simulator

A static site with no build step. Folder layout:

- index.html
- css/style.css
- js/data.js (constants, party and position data)
- js/world.js (world and map generation)
- js/sim.js (monthly simulation, bills, elections)
- js/viz.js (seat charts and map)
- js/ui.js (screens, editing, PDF export)

## Deploy to Cloudflare Pages

Direct upload: Workers & Pages > Create > Pages > Upload assets. Drag in the ph-gov-sim folder (or the zip).

Git: push the folder to a repository, connect it in Pages, and set Framework preset to None, Build command empty, Build output directory `/`.

## Notes

- Export PDF opens the browser print dialog; choose Save as PDF.
- Fonts load from Google Fonts. Remove the link in index.html to run fully offline; system fonts are used as fallback.

## Clock

The calendar runs one day at a time and shows Month day, year. It keeps running on real time even when the tab is idle or in the background, and catches up when you return. Pause stops it. Step advances exactly one day.

## Calendar and legal rules modeled

- National and local elections: second Monday of May. Winners take office June 30. Barangay and SK elections: last Monday of October.
- Congress opens on the fourth Monday of July, when a new Congress elects its Speaker. Votes are postponed during recess, which starts 30 days before the next opening.
- Bills pass committee, second reading (article by article), third reading, the other chamber, a bicameral conference committee, then the President. Amendments pass Congress by the required share of all members, then a plebiscite.
- A bill can be filed as ordinary law or written into the Constitution. Enacted laws can be repealed; entrenched ones need a repeal amendment.
- Regions can be granted or stripped of autonomy, each with its own parliament and Chief Minister.

## Bill Sandbox analysis (optional Claude)

`functions/api/analyze.js` is a Cloudflare Pages Function. Add a secret named `ANTHROPIC_API_KEY` under Pages > Settings > Variables and Secrets (Production) and redeploy. The Bill Sandbox then asks Claude what each article affects. Without the key, or when running from a plain file, a built-in keyword analyzer is used instead. The key stays on the server and is never sent to the browser. To use the function, deploy with Git or Wrangler; drag-and-drop uploads of a plain folder do not include Functions.

## What is in this version

- Map: nation, region, province, city or municipality, barangay, with zoom, breadcrumbs, search, and capital markers. Tools: paint boundary, new municipality, group municipalities (new province or merge), group provinces (create, assign, or merge regions).
- Edit mode (Controls bar): unlocks scenario configuration. Governing actions work in both modes. Settings tab shows validation results.
- Provinces are capped at MAX_PROVINCES (100, defined in js/data.js).
- Income class of provinces, cities, and municipalities is automatic (RA 11964, DOF Department Order 074-2024) and never editable. Barangays are never classified.
- Legislative districts (House) and provincial districts (Sangguniang Panlalawigan) are separate. A province with one legislative district gets two provincial districts by default.
- Budget tab, Laws & Rules tab (statute book with amendments and sources, rules of Congress and other bodies), local bills by district representatives, and ordinances by provincial, city, municipal, and barangay councils.
- Preset candidate names per party (one per line). Candidate records have separate first, middle, last, suffix, age, gender, nationality, occupation, and education fields.

## Known limits

- This is a plain JavaScript project, not TypeScript. Checks were done with a simulated browser run, not a type checker.
- Some thresholds were inferred from partial texts (see Settings > Income classification).

## Election files and calendar (Omnibus Election Code)

The Elections tab has a calendar (filing of certificates of candidacy, tentative and certified lists, ballot face template, campaign periods, canvass, proclamation, statements of contributions and expenses) and four election files plus voter turnout:

- Tentative List of Candidates (national, province, or city/municipality)
- Ballot Face Template (per city or municipality; names appear as Last Name, First Name (party acronym or first three letters))
- Certificate of Canvass (national, province, or city/municipality, with registered voters, votes cast, and turnout)
- List of Elected Local Candidates (all or one province)
- Voter Turnout (registered voters versus ballots cast by area and over time)

Candidate lists are drawn up when filing closes. Votes are computed per candidate and per province. Legislative district votes use each district's own registered voters, and national totals equal the sum of the provinces.

Limits: barangay and SK elections have a calendar and results counts but no candidate-level files. Section references checked against the fetched Code text: 3, 11, 15, 16, 30, 59, 72, 75, 77, 78, 80, 99, 107. Sections 39, 40, 46, and 89, the campaign periods, and the exact dates COMELEC would set are from general knowledge or are simulation settings; confirm before citing.

## Structure operations (Edit mode)

On the Map tab, the Edit structure button (province, municipality, or barangay) offers divide, merge, abolish, and move. Each runs through a plebiscite unless you tick the scenario override. Tools: paint barangay boundary, new barangay, group barangays into a municipality or city, group municipalities into a province, group provinces into a region. Independent component cities are a flag on cities; their voters do not vote for provincial officials. Barangay and SK terms follow RA 12326 (five years, two consecutive terms for barangay officials, one for SK).
