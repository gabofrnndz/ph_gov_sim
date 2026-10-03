const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const F=['Maria','Jose','Ana','Juan','Liza','Ramon','Luz','Andres','Carmela','Rafael','Teresita','Miguel','Dindo','Nena','Arnel','Josefa','Lito','Pilar','Esteban','Marites'];
const L=['Santos','Reyes','Cruz','Bautista','Garcia','Mendoza','Torres','Villanueva','Navarro','Castillo','Dizon','Salazar','Domingo','Pascual','Panganiban','Soriano','De Leon','Fernandez','Manalo','Aguilar'];
const SYL=['ba','la','ma','sa','ta','pa','ka','na','bu','lu','ri','gan','dan','tag','lig','bat','si','ya','ro','mi'];
const DEPTS=['Agrarian Reform','Agriculture','Budget and Management','Education','Energy','Environment and Natural Resources','Finance','Foreign Affairs','Health','Human Settlements','Information and Communications Technology','Interior and Local Government','Justice','Labor and Employment','National Defense','Public Works and Highways','Science and Technology','Social Welfare and Development','Tourism','Trade and Industry','Transportation','Migrant Workers'];
const PARTIES=[{name:'Alyansa Sinag',acr:'AS',color:'#E3A008',ideo:.3,pop:.28},{name:'Partido Tagumpay',acr:'PT',color:'#1B6B8A',ideo:-.4,pop:.26},{name:'Bagong Hangin',acr:'BH',color:'#3C7D52',ideo:-.8,pop:.18},{name:'Kilusang Lupa',acr:'KL',color:'#C23B2E',ideo:.8,pop:.16},{name:'Samahang Malaya',acr:'SM',color:'#7A5C99',ideo:0,pop:.12}];
const SL={approval:'Presidential approval (%)',growth:'GDP growth (%)',treasury:'Treasury (PHP trillion)',corruption:'Corruption index (lower is better)',order:'Public order (%)',poverty:'Poverty rate (%)',education:'Education index',health:'Health index',environment:'Environment index'};
const A=(id,t,i,tags,e,c)=>({id,t,i,tags,e:e||{},c});
const ART_LIB=[A(1,'School meals program',-.6,['education','budget'],{education:3,treasury:-.3,approval:2,poverty:-1}),
A(2,'Anti-red tape streamlining',.1,['governance'],{corruption:-5,growth:.3}),
A(3,'Rural road network',0,['infrastructure','budget'],{growth:.4,treasury:-.4}),
A(4,'National digital ID',.4,['governance'],{corruption:-3,approval:-1}),
A(5,'Minimum wage adjustment',-.7,['labor'],{approval:3,poverty:-2,growth:-.2}),
A(6,'Mining royalty reform',.5,['revenue','environment'],{treasury:.4,growth:.2,environment:-2}),
A(7,'Disaster resilience fund',-.2,['budget','environment'],{order:3,treasury:-.2,environment:1}),
A(8,'Anti-dynasty rules',-.5,['governance'],{corruption:-6,approval:2}),
A(9,'Universal health coverage expansion',-.5,['health','budget'],{health:4,treasury:-.4,approval:2}),
A(10,'Income tax adjustment',.6,['revenue'],{treasury:.5,approval:-2}),
A(11,'Public order and anti-crime measures',.7,['order'],{order:4,approval:-1}),
A(12,'Renewable energy incentives',-.4,['environment','revenue'],{environment:3,growth:.2,treasury:-.1}),
A(13,'Presidential term of 4 years with one reelection',.3,['governance'],{}, {presTerm:4,presReelect:1}),
A(14,'Single six-year presidential term',-.1,['governance'],{}, {presTerm:6,presReelect:0}),
A(15,'Senators may serve three consecutive terms',.3,['governance'],{}, {senLimit:3}),
A(16,'Impeachment needs one-fourth of the House',-.3,['governance'],{}, {impHouse:25}),
A(17,'Supreme Court of 17 justices',0,['governance'],{}, {scSize:17}),
A(18,'Party-list share raised to 30 percent',-.4,['governance'],{}, {plShare:30}),
A(19,'Four-year House terms',.1,['governance'],{}, {houseTerm:4})];
const BT=[['Universal School Meals Act',[1]],['Anti-Red Tape Streamlining Act',[2]],['Rural Road Network Act',[3]],['National Digital ID Act',[4]],['Minimum Wage Adjustment Act',[5]],['Fiscal Reform Act',[10,6]],['Disaster Resilience Act',[7]],['Anti-Political Dynasty Act',[8]],['Health and Welfare Package Act',[9,5]],['Public Safety Act',[11]],['Clean Energy Act',[12]],['Resolution on Presidential Term Reform',[13]],['Resolution on Party-List Expansion',[18]]];
const E=[['Typhoon',s=>{const p=pick(s.provs);s.stats.order-=2;s.stats.poverty+=.5;s.crisis=90;return `A typhoon batters ${p.name} Province; relief funds are drawn down.`}],
['Earthquake',s=>{const p=pick(s.provs);s.stats.order-=3;s.stats.approval-=1;s.crisis=90;return `An earthquake damages towns in ${p.name} Province.`}],
['Corruption scandal',s=>{const c=pick(s.cabinet),o=c.name;c.name=nm();s.stats.corruption+=6;s.stats.approval-=4;s.crisis=90;return `${o}, ${c.role} secretary, resigns amid a scandal. ${caConfirm(c.name,c.role)}`}],
['Economic boom',s=>{s.stats.growth+=.8;s.stats.treasury+=.3;return 'Exports and remittances surge, lifting growth.'}],
['Mass protest',s=>{s.stats.approval-=3;s.stats.order-=4;s.crisis=90;return 'Large protests demand wage and price relief.'}],
['Justice retires',s=>{const j=pick(s.justices),o=j.name;j.name=nm();j.lean=+(rnd()*2-1).toFixed(1);return `Justice ${o} retires; ${j.name} joins the Supreme Court. The Judicial and Bar Council submits a list and the President appoints (Art. VIII Sec. 9).`}]];
const CON0={presTerm:6,presReelect:0,senTerm:6,senLimit:2,senSize:24,houseTerm:3,houseLimit:3,scSize:15,plShare:20,plThreshold:2,plCap:3,impHouse:33.3,impSenate:66.7,amendVote:75,vetoOverride:66.7,plebiscite:50,lguLimit:3};
const CONL={presTerm:['President term (years)','Art. VII Sec. 4'],presReelect:['Presidential reelections allowed','Art. VII Sec. 4'],senTerm:['Senator term (years)','Art. VI Sec. 4'],senLimit:['Senator consecutive term limit','Art. VI Sec. 4'],senSize:['Senate seats','Art. VI Sec. 2'],houseTerm:['House term (years); sets the election cycle','Art. VI Sec. 7'],houseLimit:['House consecutive term limit','Art. VI Sec. 7'],scSize:['Supreme Court seats','Art. VIII Sec. 4'],plShare:['Party-list share of House (%)','Art. VI Sec. 5'],plThreshold:['Party-list vote threshold for a seat (%)','RA 7941'],plCap:['Party-list seat cap per group','RA 7941'],impHouse:['House votes to impeach (% of all members)','Art. XI Sec. 3'],impSenate:['Senate votes to convict (% of all members)','Art. XI Sec. 3'],amendVote:['Congress vote to propose an amendment (% of all members)','Art. XVII Sec. 1'],vetoOverride:['Veto override (% of all members of each house)','Art. VI Sec. 27'],plebiscite:['Plebiscite yes needed (%)','Art. XVII Sec. 4'],lguLimit:['Local official consecutive term limit','LGC Sec. 43']};
const ARTS=['National Territory','Declaration of Principles and State Policies','Bill of Rights','Citizenship','Suffrage','The Legislative Department','The Executive Department','The Judicial Department','Constitutional Commissions','Local Government','Accountability of Public Officers','National Economy and Patrimony','Social Justice and Human Rights','Education, Science and Technology, Arts, Culture and Sports','The Family','General Provisions','Amendments or Revisions','Transitory Provisions'];
const OCC=['Lawyer','Physician','Former mayor','Teacher','Businessperson','Farmer leader','Journalist','Retired officer','Labor organizer','Engineer','Barangay captain','Broadcaster'];
const HIST=['served two terms as a city councilor','led a disaster-relief drive','was cleared after a procurement complaint','authored a landmark local ordinance','switched parties once','chaired a provincial board committee','survived a close recount','won on an anti-corruption platform'];
const INT=['education','budget','revenue','health','labor','environment','governance','infrastructure','order'];
const PLN=[['Manggagawa Ngayon','Labor'],['Kababaihan Sulong','Women'],['Magsasaka Unlad','Farmers'],['Kabataan Una','Youth'],['Kalinga Matatanda','Senior citizens'],['OFW Sandigan','Overseas workers'],['Katutubo Lakas','Indigenous peoples'],['Mangingisda Alon','Fisherfolk'],['Guro Kasangga','Teachers'],['Kalusugan Muna','Health workers']];
const CMT=[['Appropriations','budget'],['Ways and Means','revenue'],['Justice and Constitutional Amendments','governance'],['Local Government','infrastructure'],['Health','health'],['Education','education'],['Labor','labor'],['Ecology','environment'],['Public Order','order']];
const STN={'H-Com':'House committee','H-2nd':'House second reading','H-3rd':'House third reading','S-Com':'Senate committee','S-3rd':'Senate third reading',Bicam:'Bicameral conference committee',Pres:'Awaiting the President',Plebiscite:'Awaiting plebiscite'};
const POS=[
['National','President','1','1987 Constitution Art. VII; elected nationwide, one 6-year term'],
['National','Vice President','1','Art. VII; 6 years, up to two consecutive terms'],
['National','Cabinet secretaries (22 departments in this sim)','varies','Art. VII Sec. 16; appointed with Commission on Appointments consent'],
['National','Senators','24','Art. VI Sec. 2; elected at large, 6-year terms, up to two consecutive'],
['National','House district representatives','about 253','Art. VI Sec. 5; 3-year terms, up to three consecutive'],
['National','Party-list representatives','up to 20% of House','Art. VI Sec. 5; RA 7941'],
['Judiciary','Supreme Court','15 (Chief Justice and 14)','Art. VIII Sec. 4; appointed from Judicial and Bar Council nominees'],
['Judiciary','Court of Appeals, Sandiganbayan, Court of Tax Appeals, trial courts','many','Art. VIII; BP 129'],
['Constitutional bodies','COMELEC','7 (Chairman and 6)','Art. IX-C'],
['Constitutional bodies','Commission on Audit','3','Art. IX-D'],
['Constitutional bodies','Civil Service Commission','3','Art. IX-B'],
['Constitutional bodies','Ombudsman','1 plus deputies','Art. XI'],
['Constitutional bodies','Commission on Human Rights','5','Art. XIII Sec. 17'],
['Regional','BARMM Parliament and Chief Minister','80 members','RA 11054 (Bangsamoro Organic Law)'],
['Province','Governor and Vice Governor','1 each','Local Government Code (RA 7160)'],
['Province','Sangguniang Panlalawigan elective members','10 (1st-2nd class), 8 (3rd-4th), 6 (5th-6th); 2 per district if over 5 districts','RA 8553 amending LGC Sec. 41(b)'],
['Province','Sangguniang Panlalawigan ex officio','Liga ng mga Barangay president, SK Federation president, league presidents of component city and municipal councilors','RA 8553'],
['City','Mayor and Vice Mayor','1 each','Local Government Code'],
['City','Sangguniang Panlungsod elective members','10 (component city), 12 (highly urbanized); verify against current COMELEC resolutions','Local Government Code'],
['Municipality','Mayor and Vice Mayor','1 each','Local Government Code'],
['Municipality','Sangguniang Bayan elective members','8','Local Government Code'],
['City / Municipality','Council ex officio members','Liga ng mga Barangay president and SK Federation president','RA 8553'],
['Barangay','Punong Barangay','1','Local Government Code'],
['Barangay','Sangguniang Barangay members (kagawad)','7, elected at large','Local Government Code'],
['Barangay','SK Chairperson and SK councilors','1 and 7','RA 10742'],
['Barangay','Barangay Secretary and Treasurer','appointed','Local Government Code'],
['Local councils','Sectoral representatives (women, labor, others)','as warranted; not modeled','Local Government Code']];

const CONB={presTerm:[1,10],presReelect:[0,3],senTerm:[1,12],senLimit:[1,6],senSize:[12,48],houseTerm:[1,6],houseLimit:[1,6],scSize:[9,25],plShare:[0,50],plThreshold:[0,10],plCap:[1,10],impHouse:[10,60],impSenate:[50,95],amendVote:[50,95],vetoOverride:[50,95],plebiscite:[40,80],lguLimit:[1,6]};
const MECH=['Art. VI Sec. 5: district seats plus party-list seats (up to 20 percent of the House); party-list seats follow RA 7941.',
'Art. VI Sec. 7 and 4: House terms of 3 years (3 consecutive terms) and Senate terms of 6 years (2 consecutive terms), enforced at each election.',
'Art. VI Sec. 15: regular session opens on the fourth Monday of July and adjourns 30 days before the next opening; votes cannot be held in recess unless the President calls a special session.',
'Art. VI Sec. 16: each House elects its presiding officer (Speaker, Senate President) by a majority of all its members.',
'Art. VI Sec. 17: the House Electoral Tribunal (3 Justices and 6 members) decides election protests after each election.',
'Art. VI Sec. 18 and Art. VII Sec. 16: the Commission on Appointments (12 senators and 12 representatives) confirms Cabinet and commissioner appointments.',
'Art. VI Sec. 24 and 27: revenue and appropriation bills originate in the House; the President may veto, with a line-item veto on appropriation bills; a veto is overridden by two-thirds of all members of each House; a bill lapses into law after 30 days without action.',
'Art. VI Sec. 25: if the General Appropriations Act is not passed by year end, the previous budget is re-enacted. The NEP is filed after the opening of the session.',
'Art. VII Sec. 4 and 8 to 9: the President serves one 6-year term; the Vice President succeeds, and a new Vice President is confirmed by both Houses voting separately.',
'Art. VII Sec. 18: martial law lasts at most 60 days; Congress, voting jointly by a majority of all members, may revoke or extend it; the Supreme Court may nullify it.',
'Art. VIII Sec. 9 and 11: Justices are appointed from Judicial and Bar Council lists and retire at 70.',
'Art. IX: commissioners serve fixed 7-year terms.',
'Art. X Sec. 10 and 18: creating, merging, or abolishing a province, and creating an autonomous region, needs the Local Government Code criteria and a plebiscite.',
'Art. XI Sec. 3: impeachment needs one-third of the House to impeach and two-thirds of the Senate to convict; one proceeding per year.',
'Art. XVII: amendments need three-fourths of all members of Congress and a plebiscite held 60 to 90 days after approval.'];
