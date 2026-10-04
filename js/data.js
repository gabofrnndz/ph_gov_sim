const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const F=['Maria','Jose','Ana','Juan','Liza','Ramon','Luz','Andres','Carmela','Rafael','Teresita','Miguel','Dindo','Nena','Arnel','Josefa','Lito','Pilar','Esteban','Marites'];
const L=['Santos','Reyes','Cruz','Bautista','Garcia','Mendoza','Torres','Villanueva','Navarro','Castillo','Dizon','Salazar','Domingo','Pascual','Panganiban','Soriano','De Leon','Fernandez','Manalo','Aguilar'];
const SYL=['ba','la','ma','sa','ta','pa','ka','na','bu','lu','ri','gan','dan','tag','lig','bat','si','ya','ro','mi'];
const DEPTS=['Agrarian Reform','Agriculture','Budget and Management','Education','Energy','Environment and Natural Resources','Finance','Foreign Affairs','Health','Human Settlements','Information and Communications Technology','Interior and Local Government','Justice','Labor and Employment','National Defense','Public Works and Highways','Science and Technology','Social Welfare and Development','Tourism','Trade and Industry','Transportation','Migrant Workers'];
const PARTIES=[{name:'Alyansa Sinag',acr:'AS',names:'',ni:0,color:'#E3A008',ideo:.3,pop:.28},{name:'Partido Tagumpay',acr:'PT',names:'',ni:0,color:'#1B6B8A',ideo:-.4,pop:.26},{name:'Bagong Hangin',acr:'BH',names:'',ni:0,color:'#3C7D52',ideo:-.8,pop:.18},{name:'Kilusang Lupa',acr:'KL',names:'',ni:0,color:'#C23B2E',ideo:.8,pop:.16},{name:'Samahang Malaya',acr:'SM',names:'',ni:0,color:'#7A5C99',ideo:0,pop:.12}];
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

const BUD0=[['edu','Education',520,{education:.6,growth:.05},'education',-.3],['hlt','Health',190,{health:.6,approval:.05},'health',-.4],['soc','Social welfare',290,{poverty:-.5,approval:.1},'budget',-.6],['inf','Infrastructure',700,{growth:.12,environment:-.05},'infrastructure',0],['def','Defense and public order',240,{order:.4},'order',.6],['agr','Agriculture',110,{poverty:-.2,growth:.03},'budget',-.2],['env','Environment and disaster resilience',70,{environment:.5,order:.1},'environment',-.3],['gov','Governance and courts',240,{corruption:-.3},'governance',.1],['debt','Debt service',1000,{},'budget',0]];
const LOCAL_LIB=[['Establishing a state college in {p}',{education:.4,approval:.1},'education',-.3,3],['Converting a provincial road in {p} into a national road',{growth:.1},'infrastructure',0,2],['Establishing a district hospital in {p}',{health:.4},'health',-.4,3],['Declaring a protected landscape in {p}',{environment:.5,growth:-.05},'environment',-.3,1],['Creating a regional trial court branch in {p}',{order:.3},'governance',.2,1],['Establishing a disaster response center in {p}',{order:.3},'order',-.1,2]];
const ORD_LIB=[['Curfew for minors',.5,{order:2,approval:-.3},['order'],0],['Single-use plastic ban',-.3,{environment:1.5,growth:-.05},['environment'],1],['Market and street vendor regulation',.2,{order:1,approval:-.2},['governance'],1],['Local scholarship program',-.5,{education:1,approval:.3},['education'],2],['Health station network',-.4,{health:1,approval:.3},['health'],2],['Local business tax adjustment',.4,{treasury:.2,approval:-.4},['revenue'],0],['Drainage and flood control',0,{environment:.5,order:.5},['infrastructure'],2],['Anti-littering drive',0,{environment:.6},['environment'],1]];
const LAWS=[
[1,'Revised Penal Code','Act No. 3815',1930,['RA 9346 (2006) abolished the death penalty','RA 10951 (2017) adjusted amounts and fines'],'Criminal law',{order:.03}],
[2,'Civil Code','RA 386',1949,[],'Civil law',{}],
[3,'Family Code','EO 209',1987,['RA 6809 (1989) set the age of majority at 18','RA 9255 (2004) lets illegitimate children use the father\'s surname'],'Civil law',{}],
[4,'Labor Code','PD 442',1974,['RA 6715 (1989) strengthened worker protection','RA 10151 (2011) rules on night work'],'Labor',{poverty:-.01}],
[5,'Local Government Code','RA 7160',1991,['RA 8553 (1998) provincial board composition','RA 9009 (2001) raised the city income requirement','Mandanas-Garcia ruling (2018) widened local shares to all national taxes from 2022'],'Local government',{corruption:-.01}],
[6,'Omnibus Election Code','BP 881',1985,['RA 6646 (1987) Electoral Reforms Law','RA 7166 (1991) synchronized elections','RA 9369 (2007) automated elections'],'Elections',{}],
[7,'Party-List System Act','RA 7941',1995,['Atong Paglaum v. COMELEC (2013) opened party-list to more groups'],'Elections',{}],
[8,'Fair Election Act','RA 9006',2001,[],'Elections',{corruption:-.01}],
[9,'Anti-Graft and Corrupt Practices Act','RA 3019',1960,['BP 195 (1982) extended the prescription period'],'Governance',{corruption:-.05}],
[10,'Code of Conduct and Ethical Standards for Public Officials','RA 6713',1989,[],'Governance',{corruption:-.03}],
[11,'Government Procurement Reform Act','RA 9184',2003,['RA 12009 (2024) New Government Procurement Act revised and replaced it'],'Governance',{corruption:-.05,growth:.01}],
[12,'National Internal Revenue Code','RA 8424',1997,['RA 9337 (2005) VAT reform','RA 10963 (2017) TRAIN','RA 11534 (2021) CREATE','RA 11976 (2024) Ease of Paying Taxes','RA 12066 (2024) CREATE MORE'],'Taxation',{treasury:.01,growth:.02}],
[13,'Universal Health Care Act','RA 11223',2019,[],'Health',{health:.08,treasury:-.003}],
[14,'Free Higher Education Act','RA 10931',2017,[],'Education',{education:.06,treasury:-.003}],
[15,'Data Privacy Act','RA 10173',2012,[],'Digital',{approval:.005}],
[16,'Cybercrime Prevention Act','RA 10175',2012,[],'Digital',{order:.02}],
[17,'Anti-Terrorism Act','RA 11479',2020,['Replaced the Human Security Act (RA 9372)'],'Security',{order:.05,approval:-.02}],
[18,'Comprehensive Agrarian Reform Law','RA 6657',1988,['RA 9700 (2009) CARPER extension','RA 11953 (2023) New Agrarian Emancipation Act condoned agrarian debts'],'Agriculture',{poverty:-.04}],
[19,'Agricultural Tariffication Act and Rice Tariffication Law','RA 8178, RA 11203',1996,['RA 11203 (2019) replaced rice import quotas with tariffs','RA 12078 (2024) amended the tariff framework'],'Agriculture',{growth:.01,poverty:-.01}],
[20,'Ease of Doing Business Act','RA 11032',2018,[],'Business',{corruption:-.03,growth:.02}],
[21,'Foreign Investments Act','RA 7042',1991,['RA 8179 (1996) amendments','RA 11647 (2022) liberalized foreign investment'],'Business',{growth:.02}],
[22,'Public Service Act','CA 146',1936,['RA 11659 (2022) opened most public services to foreign ownership'],'Business',{growth:.01}],
[23,'Retail Trade Liberalization Act','RA 8762',2000,['RA 11595 (2021) lowered the capital requirement'],'Business',{growth:.01}],
[24,'Anti-Money Laundering Act','RA 9160',2001,['RA 9194 (2003)','RA 10167 (2012)','RA 10365 (2013)','RA 10927 (2017) covered casinos','RA 11521 (2021)'],'Finance',{corruption:-.02}],
[25,'Disaster Risk Reduction and Management Act','RA 10121',2010,['RA 12076 (2024) Ligtas Pinoy Centers Act added evacuation centers'],'Disaster',{order:.02}],
[26,'Climate Change Act','RA 9729',2009,['RA 10174 (2012) People\'s Survival Fund'],'Environment',{environment:.03}],
[27,'Ecological Solid Waste Management Act','RA 9003',2000,[],'Environment',{environment:.03}],
[28,'Clean Air Act','RA 8749',1999,[],'Environment',{environment:.02,health:.01}],
[29,'Clean Water Act','RA 9275',2004,[],'Environment',{environment:.02,health:.01}],
[30,'Magna Carta of Women','RA 9710',2009,[],'Social',{poverty:-.01,approval:.01}],
[31,'Anti-Violence Against Women and Their Children Act','RA 9262',2004,[],'Social',{order:.01}],
[32,'Pantawid Pamilyang Pilipino Program Act','RA 11310',2019,[],'Social',{poverty:-.06,treasury:-.003}],
[33,'Social Security Act of 2018','RA 11199',2018,[],'Social',{poverty:-.02}],
[34,'Philippine Identification System Act','RA 11055',2018,[],'Governance',{corruption:-.02}],
[35,'SIM Registration Act','RA 11934',2022,[],'Digital',{order:.01}],
[36,'Maharlika Investment Fund Act','RA 11954',2023,[],'Finance',{growth:.01,treasury:-.002}],
[37,'Bangsamoro Organic Law','RA 11054',2018,[],'Autonomy',{order:.02}],
[38,'Sangguniang Kabataan Reform Act','RA 10742',2015,[],'Youth',{}],
[39,'Comprehensive Dangerous Drugs Act','RA 9165',2002,['RA 10640 (2014) revised the chain of custody rules'],'Security',{order:.03}],
[40,'Anti-Agricultural Economic Sabotage Act','RA 12022',2024,[],'Agriculture',{order:.01}],
[41,'Automatic Income Classification of Local Government Units Act','RA 11964',2023,['DOF Department Order 074-2024 (2024) made the first general reclassification, effective January 1, 2025'],'Local government',{}]];
const RULES_REF=[
['House and Senate','Each House determines the rules of its proceedings. Courts enforce them only where they carry out a constitutional requirement.','Art. VI Sec. 16(3); Arroyo v. De Venecia (1998)',false],
['House and Senate','A majority of each House is a quorum. Without one, only a smaller number may adjourn and compel attendance.','Art. VI Sec. 16(2)',true],
['House and Senate','The Speaker and the Senate President are elected by a majority of all members.','Art. VI Sec. 16(1)',true],
['House and Senate','Majority and minority floor leaders are chosen from the ruling bloc and the largest opposition party.','House and Senate rules',true],
['House and Senate','A bill needs three readings on separate days, and printed copies must be distributed three days before the final vote, unless the President certifies urgency.','Art. VI Sec. 26(2)',true],
['House','The Committee on Rules schedules bills; committees hold hearings and report bills out.','Rules of the House',true],
['House','Appropriation, revenue, tariff, public debt, local application, and private bills originate in the House.','Art. VI Sec. 24',true],
['House','The House impeaches with one-third of all members; the Senate tries and convicts with two-thirds.','Art. XI Sec. 3',true],
['Bicameral conference','Reconciles differences between House and Senate versions; it may not insert provisions found in neither version.','Rules of both Houses; Abakada v. Ermita (2005)',true],
['Veto','The President acts within 30 days, may veto, and has a line-item veto on appropriation bills. Two-thirds of all members of each House override.','Art. VI Sec. 27',true],
['Joint session','Congress meets jointly to review martial law, canvass presidential votes, and hear the State of the Nation Address.','Art. VII Sec. 18 and 23; Senate Rule XIV Sec. 42',true],
['Commission on Appointments','12 senators and 12 representatives, chaired by the Senate President, confirm Cabinet and commissioner appointments.','Art. VI Sec. 18',true],
['Electoral tribunals','Three Justices and six legislators decide election protests for each House.','Art. VI Sec. 17',true],
['Sanggunian (local councils)','A majority is a quorum; the local executive acts on an ordinance within 15 days (10 for barangays); a veto is overridden by two-thirds of all members.','Local Government Code Sec. 53 and 54',true],
['Sanggunian (local councils)','The provincial board reviews municipal and component city ordinances within 30 days.','Local Government Code Sec. 56',true],
['COMELEC, COA, CSC','Constitutional commissions decide en banc or in divisions; commissioners serve fixed 7-year terms.','Art. IX',true],
['Supreme Court','Sits en banc or in divisions of three, five, or seven; Justices retire at 70.','Art. VIII Sec. 4 and 11',true],
['Judicial and Bar Council','Seven members; submits at least three nominees for each vacancy and the President appoints within 90 days.','Art. VIII Sec. 8 and 9',false],
['Local government finance','Local governments get 40 percent of national taxes as their share, computed on all national taxes since 2022.','Local Government Code Sec. 284; Mandanas-Garcia (2018)',true]];

const MAX_PROVINCES=100;
const VERIFIED={11:'Checked against GPPB and LEDAC pages (RA 12009, July 20, 2024)',12:'RA 12066 (November 11, 2024) checked against LEDAC and PCO pages',19:'RA 12078 (December 9, 2024) checked against the Senate library and LEDAC',25:'RA 12076 checked against a PCO release (2024)',36:'RA 11954 (July 18, 2023) checked against LEDAC',40:'RA 12022 checked against a PCO release (2024)',41:'RA 11964 (October 26, 2023) text checked on the Supreme Court E-Library; DOF Department Order 074-2024 checked against news reports'};
const LEGAL=[{id:'const-1987',type:'constitution',number:'1987',title:'1987 Constitution of the Philippines',date:'1987',status:'amended',amends:[],amendedBy:[],repeals:[],repealedBy:[],institution:'Constitutional Commission',topic:'Fundamental law',provisions:MECH.map(m=>({ref:(m.match(/^Art\. [IVXL]+[^:]*/)||[''])[0],summary:m.replace(/^Art\. [^:]*:\s*/,'')})),gameMechanics:['Every provision listed is enforced by the simulation or editable as a constitutional setting.'],source:'Official Gazette text of the 1987 Constitution; summaries are paraphrased',real:true}]
.concat(LAWS.map(l=>({id:'law-'+l[0],lawId:l[0],type:/^Act|^CA|^PD|^EO|^BP/.test(l[2])?'code or decree':'republic act',number:l[2],title:l[1],date:String(l[3]),status:l[0]==11?'superseded':l[4].length?'amended':'active',amends:[],amendedBy:l[4],repeals:[],repealedBy:l[0]==11?['RA 12009 (2024)']:[],institution:'Congress',topic:l[5],provisions:[],gameMechanics:Object.keys(l[6]).length?['While in force: '+Object.keys(l[6]).map(k=>k+' '+(l[6][k]>0?'+':'')+l[6][k]+' per month').join(', ')]:[],source:VERIFIED[l[0]]||'Compiled from general knowledge; confirm on lawphil.net or officialgazette.gov.ph',verified:!!VERIFIED[l[0]],real:true})));
