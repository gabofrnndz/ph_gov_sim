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

## Campaign, competition, and voter behavior

The Campaign tab covers party funds and the legal spending limit, organizers per province, advertising, surveys, electoral debates (with attend or skip choices), candidate selection for your party (President, Vice President, Senators, governors, vice governors), voter flow from the previous election, and regional versus national competition. Parties can be national, regional, or local; a regional or local party fields candidates only in its area. Candidate lists are created when filing closes and can be substituted until ballot printing begins. Candidate strength at the polls now includes party loyalty from the last election, campaign effort, and debate momentum.

Limits: the spending limit figure (PHP 5 per registered voter for a party, RA 7166 Sec. 13) is from general knowledge; confirm it. There are no independent candidates outside party-list. Debate performance is a simple skill-plus-preparation score.

## Maps and Article I

The New world dialog offers a generated archipelago or the Philippines with 82 real province boundaries (rasterized to the game grid; populations and municipalities are simulated, province and region names are real). Every area now shows its name once, and place names are unique. Barangays must have area on the map: new barangays are carved from existing ones, and barangays that lose all their area are removed.

Article I (National Territory) is modeled as land, internal waters (archipelagic doctrine), territorial sea, and exclusive economic zone. The widths and the doctrine are constitutional settings you can amend. The Territory map layer shows the zones, and other territories can be added with a sovereignty or jurisdiction claim.

## Barangay terms by start year, names, and skipping plebiscites

- Barangay and SK terms, term limits, and election dates follow the law in force for the simulation start year: RA 12326 (five-year terms, second Monday of November 2028 and every five years, two consecutive terms for barangay officials and one for SK officials) from 2025; RA 11462 and RA 11935 for 2023 and 2024; RA 9340 (three-year terms, last Monday of October) for 2005 to 2022; RA 9164, RA 8524, and RA 7160 for earlier years. The regime is shown in Settings. Era details come from a Wikipedia table of barangay elections and news reports; confirm each law before citing.
- First names, middle names, and surnames come from large Filipino name pools with regional flavors (Ilocano, Visayan, Bicolano, Kapampangan, Muslim, Chinese-Filipino, Igorot). Every full name is unique across all officials and candidates. Province, city, and municipality names are unique, and barangay names are unique within a province.
- In Edit mode, creating, merging, dividing, or abolishing LGUs (and creating autonomous regions) can skip the plebiscite. The box is ticked by default; Settings has a toggle for the default.

## Philippines map at the municipal level

Choosing "Philippines" in the New world dialog builds 82 provinces, 17 regions, and 1,647 cities and municipalities (137 cities) with real names and boundaries, drawn on a finer 260 by 380 grid. Province borders are the union of their municipalities. Municipal boundaries come from GADM-derived data (circa 2015), so newer LGUs and recent boundary changes are missing, and small LGUs get as little as one map cell. Populations (about 112 million in total), income, and officials are simulated. Barangays have no real boundaries: each municipality gets as many barangays as it has map cells (about 8,000 in total), laid out procedurally. Names that repeat across provinces carry the province in brackets. A Philippines world saves to roughly 18 MB and autosaves every two years of game time; use Saves for manual saves.

## Article II (Declaration of Principles and State Policies)

The Constitution tab quotes Sections 1 to 28 and scores the simulated country against them. Mechanics: the Armed Forces' loyalty (civilian supremacy, Sec. 3) with possible coup attempts; compulsory national service (Sec. 4); church-state review that strikes down laws favoring or burdening a religion (Sec. 6); foreign-policy alignment (Sec. 7); nuclear policy as a constitutional setting (Sec. 8); education priority in the budget (Sec. 17); local autonomy tied to the local share (Sec. 25); political dynasties, which are prohibited only once a law defines them, after which relatives of sitting officials cannot run in the same LGU (Sec. 26); and public disclosure levels (Sec. 28). The scorecard thresholds are simulation settings, not legal findings. Bill templates and the Bill Sandbox can change these policies.

## Latest changes

- Philippines map: Davao Occidental, Davao de Oro, Cotabato, Maguindanao del Norte, and Maguindanao del Sur are built in (Shariff Kabunsuan is gone). City and municipality names are plain, without the province in brackets, so some names repeat across provinces as they do in reality; the search list shows the province next to the name.
- Barangay view shows only the selected municipality's barangays; neighboring municipalities are hidden.
- Candidates without a party are Independent (IND). Independents run for Senate and local posts (not House district seats or the presidency) and win rarely. An independent senator joins the nearest party bloc in the chamber but is shown as IND in the results.
- A province or city with one legislative district calls it a Lone District (LEGDIST, PROVDIST, or DIST in documents).
- Cities can have council districts made of barangays. Large cities get several by default (population based), shown in the city panel, where you can set the number of districts. Council seats are shared equally and elected district by district; the Election files, ballot, and canvass follow the districts.
- Election files follow the COMELEC samples: Certified/Tentative List of Candidates (national, provincial, municipal), Official Ballot (two pages), National Canvass Report, Provincial and Municipal/City Certificates of Canvass, Lists of Elected Candidates (House, provincial, city/municipal), and Voter Turnout. Provincial and municipal canvass figures for national posts are apportioned from province totals by valid votes, and the seals, hashes, and officer names are simulated.

## Round 3 changes

- Tentative/certified list numbering restarts at 1 for each position (it continues only when one position runs onto another page).
- Municipal and city canvass certificates now include the Sangguniang Panlalawigan results of the provincial district (component municipalities only), with the House race(s) and local races. Figures for races above the municipal level are apportioned from the district or province totals.
- Ballot face template: fixed colors (blue and green headers print with backgrounds), narrow bold type, registration marks, and its own style names so it no longer collides with the practice-ballot style.
- New sidebar layout (collapses to a top bar on phones).
- Up to 30 parties in the New world dialog (more can be added in game) and up to 150 party-list groups (extra groups get generated names).
- Cities can have legislative districts of their own (default: one per 290,000 residents for cities of at least 250,000). Set the number in the city panel (Edit mode); extra districts are groups of barangays. Setting 0 returns the city to its province's districts.
- Elections tab: set the date of the next general election (Edit mode, at least 45 days away). The calendar is rebuilt, and the schedule is compressed if the date is close.

## Round 4 changes

- Metro Manila is the National Capital Region with its cities and the municipality of Pateros directly under it. It has no province: no governor, vice-governor, or provincial board, and the region view lists the cities. Internally it is a hidden placeholder province used for House districts.
- Municipal view shows the surrounding land in a plain neutral tone with no colors, borders, or labels.
- BARMM is now ARMM (Autonomous Region in Muslim Mindanao). Any region that becomes autonomous gets a Regional Governor, a Regional Vice-Governor, and Regional Assemblymen elected per regional legislative district. Those districts are separate from House districts and can be reapportioned in the region panel (Edit mode). Regional elections have their own date (the Elections tab) and their own certificate of canvass. By default they fall on the general election day.
- Barangay and SK election day can be set in the Elections tab (Edit mode, at least 30 days away).
- Capitals and city status: provincial capitals and the status of each city (33 highly urbanized cities, 5 independent component cities, 110 component cities) come from PSGC data via the ph-locations package (ISO 3166-2:PH). Two cities beyond the official 108 component cities slipped through name matching. Regional centers (for example Manila for the NCR and Cotabato City for ARMM) were set by hand.
- Income classes remain simulated. Provincial densities and development levels are tuned by hand so that richer and poorer provinces look right, and incomes are calibrated to a plausible spread of the five classes. The list is not the DOF classification of any real LGU, and the simulation does not load the real membership of legislative or provincial districts: districts are still generated by population and geography.

## Round 5 changes: official geographic data and autonomous region elections

- **Sources.** Populations (2020 Census of Population and Housing), income classifications, city classes (HUC, ICC, CC), barangay counts, and names come from the Philippine Statistics Authority's Philippine Standard Geographic Code (PSGC), read through the open `psgc-areas` package. Legislative district labels come from the PSGC publication of December 2017, read through the `jgngo/psgc-data` mirror. City classes and capitals were cross-checked against the ISO 3166-2:PH data in the `ph-locations` package. I could not open the PSA's own files directly, so confirm anything you need to cite against the PSA and BLGF publications.
- **Income classes.** All 1,626 cities and municipalities and all provinces start in the class the PSGC lists (PSGC uses the older six classes; 6th is merged into 5th here, and Manila's "Special" class becomes 1st). The simulation then reclassifies automatically under RA 11964 as incomes change. Provinces created after the data (Maguindanao del Norte and del Sur) share Maguindanao's class.
- **Districts.** Legislative districts follow the PSGC district labels: 231 districts, including a city's own districts (for example Manila 6, Quezon City 6, Davao City 3). The labels date from 2017, so districts created or changed since then (for example in Cavite and Camarines Sur) are missing. Provincial (Sangguniang Panlalawigan) districts are derived from them as the Local Government Code provides: coterminous with legislative districts, and a province with one district is split in two.
- **Names.** City and municipality names follow the PSGC spelling and use "X City" for all cities. Regions carry their official numbers.
- **Autonomous regions.** Ballot, Tentative/Certified List, Certificate of Canvass, and a separate List of Elected Autonomous Region Candidates now cover the Regional Governor, Regional Vice-Governor, and Regional Assemblymen per regional district. Candidate lists are drawn 120 days before the regional election. A consistency check confirms every municipality is in exactly one regional district of its region and that every Assemblyman has a valid district.

## Round 6 changes (9.4 electoral system and documentation)

- **Names.** The "City of" prefix and the "City" suffix are removed from city names (for example Cebu, Davao, Manila). Several LGUs now share a name with a province or another LGU, so check the province when searching.
- **Councils.** Sangguniang Panlungsod and Sangguniang Bayan follow the rules you gave. Councilor districts follow the city's legislative districts: Metro Manila cities with a lone district get two council districts of six; Metro Manila cities with several districts elect six per district (eight in Makati, Marikina, Muntinlupa, Parañaque, and Taguig); other cities elect twelve at large or eight per district; municipalities elect eight at large, and Pateros twelve (six per district). A city with fewer barangays on the map than districts gets equal-share districts. Barangay groupings for city legislative and council districts, and city/municipality groupings for regional districts, are set in the Edit mode dialogs.
- **Clustered precincts.** Each city or municipality has simulated clustered precinct codes (0001A, merged clusters such as 0002A 0002B) of up to 800 voters, each tied to a barangay voting center and its legislative, provincial, councilor, and regional districts. There is a List of Clustered Precincts document, and the ballot is generated for a chosen precinct, so the ballot follows the voter's districts. The codes are not real COMELEC codes.
- **Ballots (Legal, 8.5 x 13 in).** One four-column table per page, thick column lines, medium row lines, vertical numbering, unbolded numbers, two-line rows, a larger "OFFICIAL BALLOT", and party-list acronyms in alphabetical order (the full name when a group has no acronym). Everything else prints on A4. I checked the layout by rendering all document types to PDF in several random worlds: A4 and Legal page sizes are right and no sheet spills onto a second page.
- **Documents.** The National Canvass Report has a ranking column. New documents: Certificate of Canvass and Proclamation (national, provincial, municipal/city), List of Elected National Candidates, national party-list tentative list (alphabetical), Clustered Precincts, and Registered Political Parties. I could not read the COMELEC parties page (it returned only the home page), so that list uses a standard registry layout (name, acronym, level, chairperson), not the exact COMELEC format.
- **Candidates.** A Certificate of Candidacy dialog (CEF Form 1 style) files a candidate for any position at the national, regional, provincial, city, or municipal level, with duplicate and age checks. Slates reject repeated names. Candidates get a hidden generated middle name that never shows; a middle name appears only when entered on the form. Term-limited officials run for other offices, such as mayors for governor and governors for senator, and each person carries a career history that shows in the officials' records.
- **Autonomous regions.** The regional assembly also has proportionally elected party-list seats (Sainte-Laguë, 2% threshold, three seats at most per group), sectoral seats (women, youth, indigenous peoples), and reserved seats (non-Moro indigenous peoples and settler communities, appointed). They appear on the ballot, tentative list, canvass, and elected list.
- **City legislative seats.** The incumbent Representatives of a city's own districts can be edited in the city panel.

## Round 7 changes (9.5)

- **Map views.** The population view no longer recomputes the maximum for every cell (it was very slow with 1,600 LGUs) and uses a logarithmic scale. The governing-party view colors the National Capital Region by its leading mayoral party. Municipality and city names now show in the province view (placed largest first, skipping overlaps). New **Outlines** toggle and a brush slider (1 to 12 cells, starting at one cell) for painting.
- **Barangay view.** Selecting a barangay zooms to it and splits it into sitios, puroks, or zones (zones in cities and large barangays) with names and populations, drawn on the map and listed in the panel. These sub-areas are generated, not real data.
- **Barangay elections.** A "Barangay and SK Election Documents" file type opens a filter dialog (election, region, province, city or municipality, barangay, position, and document: list of elected officials, certificate of canvass and proclamation, or turnout report). Each barangay election now stores per-barangay results (about 2.6 MB per election in a Philippines world).
- **Map data.** Duplicate Hinunangan (Quezon) removed; Hinunangan is only in Southern Leyte. Lake Sebu (South Cotabato) and Kalayaan (Palawan) added; Kalayaan sits at the west edge of the map because the map does not extend to the Spratly Islands. Cotabato gains Pahamuddin, Kadayangan, Nabalawag, Old Kaabakan, Kapalawan, Malidegao, Tugunan, and Ligawasan. They stay in Cotabato for provincial and House representation but belong to the ARMM for regional districts and elections (each LGU can carry a region override). Their map cells and populations are approximate. Each shows one barangay on the map because it covers one cell. Valenzuela now keeps its two cells, the cell south of it goes to Malabon, and Caloocan has its two north cells.
- **Structure edits.** Changing the set of LGUs in a province (divide, merge, abolish, move, or transfer) now reapportions that province's legislative districts, and the Sangguniang Panlungsod/Bayan sizes follow the council rules after every edit. Regional districts are kept consistent after edits.
- **Merging into a chosen LGU.** Cities and municipalities can be merged into a chosen LGU (a plebiscite unless skipped), and barangays can be merged into a chosen LGU. The target keeps its name, officials, and status.
