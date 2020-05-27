# MANYC Webhooks Doc
## JSON Specs

### MANYC Sends to Group

**POST** /some/ma/group/intake

*Basic Auth*

Adds a record to a mutual aid group. They handle translation themselves
Almost all fields from: https://mutualaid.nyc/request-assistance/

Status: Implemented

```js
{
  manyc: {
    status: "",
    id: "", // In manyc's system
    supportType: [],
    otherSupport: "",
    community: [],
    language: [],
    languageOther: "",
    phone: "",
    email: "",
    fullName: "",
    urgency: "",
    contactMethod: [],
    crossStreet: "",
    timestampCreated: "",
    timestampSent: "",
    source: "",
    sourceID: ""
  }
}
```
_______________________________________________________
### MANYC Updates Group - Delete

**POST** /some/ma/group/outtake

*Basic Auth*

Removes a record an MA group

```js
{
  manyc: {
    status: "delete"
    id: ""
  }
}
```
_______________________________________________________

#### Groups Update MANYC
**POST** mutualaid.nyc/callback
Basic Auth

Marks a request in manyc as assigned to the group that sent
```js
{
  manyc: {
    status: "" // justCant || completed || assigned || new-request
    id: ""
  }
}
```
_______________________________________________________

### Group Sends New Needs Request to MANYC
**POST** /some/ma/group/gateway-intake

Status:
```js
{
  manyc: {
    supportType: [], // From Our List
    otherSupport: "", // Not From Our List
    community: [], // Healthcare Workers, Elderly, etc.
    language: [], // From Our List
    languageOther: "",  // Not From Our List
    region: "",  // See below for options, others will error
    neighborhood: [],
    zip: "",
    phone: "",
    email: "",
    fullName: "",
    urgency: "",  // See below for options, others will error
    contactMethod: [], // phone, text, email
    crossStreet: "",
    timestampCreated: "",  // What time you received the Needs Request
    source: "",  //
    sourceID: "",
    notes: "",
  }
}
```
### Options

|language |
|-------------|
|Albanian: shqip|
|American Sign Language|
|Arabic: اللغة العربية|
|Bengali: বাঙালি|
|Cantonese: 廣東話|
|Chinese (Mandarin): 简体中文 / 繁體中文|
|French: français|
|Fulani: fulfulde|
|Greek: ελληνικα|
|Haitian Creole: kreyòl ayisyen|
|Hebrew: עברית|
|Hindi हिन्दी / Urdu: اردو|
|Ibo|
|Italian: italiano|
|Japanese: 日本語|
|Korean: 한국어|
|Lao: ລາວ|
|Pashto: پښتو|
|Polish: polski|
|Punjabi: ਪੰਜਾਬੀ|
|Russian: русский|
|Sinhala සිංහල|
|Spanish: español|
|Tadzhik: ТОҶИКӢ|
|Tagalog|
|Uzbek: o'zbekcha|
|Vietnamese|
|Yiddish: אידיש|

|supportType|
|---|
|Deliver groceries or supplies to me|
|Pick up a prescription for me|
|1 on 1 check-ins (such as a phone call or a Zoom chat)|
|Financial support|
|Translation and interpretation in a language other than English|
|Social services help (such as filing for Medicare, or unemployment benefits)|
|Other (please describe below)|

|community|
|---|
|Black / Indigenous / People of Color|
|Care workers and domestic workers|
|Healthcare workers|
|Immigrants|
|Incarcerated people and communities subject to over-policing |
|Low-wage workers & folks outside the formal economy|
|People who are homeless, housing unstable, or public housing residents|
|People with disabilities and chronic illnesses/immuno-compromised|
|Seniors & elders|
|Youth|

|neighborhood|
|---|
|Bronx: Allerton-Pelham Gardens|
|Bronx: Bedford Park-Fordham North|
|Bronx: Belmont|
|Bronx: Bronxdale|
|Bronx: Claremont-Bathgate|
|Bronx: Co-op City|
|Bronx: Crotona Park East|
|Bronx: East Concourse-Concourse Village|
|Bronx: East Tremont|
|Bronx: Eastchester-Edenwald-Baychester|
|Bronx: Fordham South|
|Bronx: Highbridge|
|Bronx: Hunts Point|
|Bronx: Kingsbridge Heights|
|Bronx: Longwood|
|Bronx: Melrose South-Mott Haven North|
|Bronx: Morrisania-Melrose|
|Bronx: Mott Haven-Port Morris|
|Bronx: Mount Hope|
|Bronx: North Riverdale-Fieldston-Riverdale|
|Bronx: Norwood|
|Bronx: park-cemetery-etc-Bronx|
|Bronx: Parkchester|
|Bronx: Pelham Bay-Country Club-City Island|
|Bronx: Pelham Parkway|
|Bronx: Rikers Island|
|Bronx: Schuylerville-Throgs Neck-Edgewater Park|
|Bronx: Soundview-Bruckner|
|Bronx: Soundview-Castle Hill-Clason Point-Harding Park|
|Bronx: Spuyten Duyvil-Kingsbridge|
|Bronx: University Heights-Morris Heights|
|Bronx: Van Cortlandt Village|
|Bronx: Van Nest-Morris Park-Westchester Square|
|Bronx: West Concourse|
|Bronx: West Farms-Bronx River|
|Bronx: Westchester-Unionport|
|Bronx: Williamsbridge-Olinville|
|Bronx: Woodlawn-Wakefield|
|Brooklyn: Bath Beach|
|Brooklyn: Bay Ridge|
|Brooklyn: Bedford|
|Brooklyn: Bensonhurst East|
|Brooklyn: Bensonhurst West|
|Brooklyn: Borough Park|
|Brooklyn: Brighton Beach|
|Brooklyn: Brooklyn Heights-Cobble Hill|
|Brooklyn: Brownsville|
|Brooklyn: Bushwick North|
|Brooklyn: Bushwick South|
|Brooklyn: Canarsie|
|Brooklyn: Carroll Gardens-Columbia Street-Red Hook|
|Brooklyn: Clinton Hill|
|Brooklyn: Crown Heights North|
|Brooklyn: Crown Heights South|
|Brooklyn: Cypress Hills-City Line|
|Brooklyn: DUMBO-Vinegar Hill-Downtown Brooklyn-Boerum Hill|
|Brooklyn: Dyker Heights|
|Brooklyn: East Flatbush-Farragut|
|Brooklyn: East New York|
|Brooklyn: East New York (Pennsylvania Ave)|
|Brooklyn: East Williamsburg|
|Brooklyn: Erasmus|
|Brooklyn: Flatbush|
|Brooklyn: Flatlands|
|Brooklyn: Fort Greene|
|Brooklyn: Georgetown-Marine Park-Bergen Beach-Mill Basin|
|Brooklyn: Gravesend|
|Brooklyn: Greenpoint|
|Brooklyn: Homecrest|
|Brooklyn: Kensington-Ocean Parkway|
|Brooklyn: Madison|
|Brooklyn: Midwood|
|Brooklyn: North Side-South Side|
|Brooklyn: Ocean Hill|
|Brooklyn: Ocean Parkway South|
|Brooklyn: Park Slope-Gowanus|
|Brooklyn: park-cemetery-etc-Brooklyn|
|Brooklyn: Prospect Heights|
|Brooklyn: Prospect Lefferts Gardens-Wingate|
|Brooklyn: Rugby-Remsen Village|
|Brooklyn: Seagate-Coney Island|
|Brooklyn: Sheepshead Bay-Gerritsen Beach-Manhattan Beach|
|Brooklyn: Starrett City|
|Brooklyn: Stuyvesant Heights|
|Brooklyn: Sunset Park East|
|Brooklyn: Sunset Park West|
|Brooklyn: West Brighton|
|Brooklyn: Williamsburg|
|Brooklyn: Windsor Terrace|
|Manhattan: Battery Park City-Lower Manhattan|
|Manhattan: Central Harlem North-Polo Grounds|
|Manhattan: Central Harlem South|
|Manhattan: Chinatown|
|Manhattan: Clinton|
|Manhattan: East Harlem North|
|Manhattan: East Harlem South|
|Manhattan: East Village|
|Manhattan: Gramercy|
|Manhattan: Hamilton Heights|
|Manhattan: Hudson Yards-Chelsea-Flatiron-Union Square|
|Manhattan: Lenox Hill-Roosevelt Island|
|Manhattan: Lincoln Square|
|Manhattan: Lower East Side|
|Manhattan: Manhattanville|
|Manhattan: Marble Hill-Inwood|
|Manhattan: Midtown-Midtown South|
|Manhattan: Morningside Heights|
|Manhattan: Murray Hill-Kips Bay|
|Manhattan: park-cemetery-etc-Manhattan|
|Manhattan: SoHo-TriBeCa-Civic Center-Little Italy|
|Manhattan: Stuyvesant Town-Cooper Village|
|Manhattan: Turtle Bay-East Midtown|
|Manhattan: Upper East Side-Carnegie Hill|
|Manhattan: Upper West Side|
|Manhattan: Washington Heights North|
|Manhattan: Washington Heights South|
|Manhattan: West Village|
|Manhattan: Yorkville|
|Queens: Airport|
|Queens: Astoria|
|Queens: Auburndale|
|Queens: Baisley Park|
|Queens: Bayside-Bayside Hills|
|Queens: Bellerose|
|Queens: Breezy Point-Belle Harbor-Rockaway Park-Broad Channel|
|Queens: Briarwood-Jamaica Hills|
|Queens: Cambria Heights|
|Queens: College Point|
|Queens: Corona|
|Queens: Douglas Manor-Douglaston-Little Neck|
|Queens: East Elmhurst|
|Queens: East Flushing|
|Queens: Elmhurst|
|Queens: Elmhurst-Maspeth|
|Queens: Far Rockaway-Bayswater|
|Queens: Flushing|
|Queens: Forest Hills|
|Queens: Fresh Meadows-Utopia|
|Queens: Ft. Totten-Bay Terrace-Clearview|
|Queens: Glen Oaks-Floral Park-New Hyde Park|
|Queens: Glendale|
|Queens: Hammels-Arverne-Edgemere|
|Queens: Hollis|
|Queens: Hunters Point-Sunnyside-West Maspeth|
|Queens: Jackson Heights|
|Queens: Jamaica|
|Queens: Jamaica Estates-Holliswood|
|Queens: Kew Gardens|
|Queens: Kew Gardens Hills|
|Queens: Laurelton|
|Queens: Lindenwood-Howard Beach|
|Queens: Maspeth|
|Queens: Middle Village|
|Queens: Murray Hill|
|Queens: North Corona|
|Queens: Oakland Gardens|
|Queens: Old Astoria|
|Queens: Ozone Park|
|Queens: park-cemetery-etc-Queens|
|Queens: Pomonok-Flushing Heights-Hillcrest|
|Queens: Queens Village|
|Queens: Queensboro Hill|
|Queens: Queensbridge-Ravenswood-Long Island City|
|Queens: Rego Park|
|Queens: Richmond Hill|
|Queens: Ridgewood|
|Queens: Rosedale|
|Queens: South Jamaica|
|Queens: South Ozone Park|
|Queens: Springfield Gardens North|
|Queens: Springfield Gardens South-Brookville|
|Queens: St. Albans|
|Queens: Steinway|
|Queens: Whitestone|
|Queens: Woodhaven|
|Queens: Woodside|
|Staten Island: Annadale-Huguenot-Prince's Bay-Eltingville|
|Staten Island: Arden Heights|
|Staten Island: Charleston-Richmond Valley-Tottenville|
|Staten Island: Grasmere-Arrochar-Ft. Wadsworth|
|Staten Island: Great Kills|
|Staten Island: Grymes Hill-Clifton-Fox Hills|
|Staten Island: Mariner's Harbor-Arlington-Port Ivory-Graniteville|
|Staten Island: New Brighton-Silver Lake|
|Staten Island: New Dorp-Midland Beach|
|Staten Island: New Springville-Bloomfield-Travis|
|Staten Island: Oakwood-Oakwood Beach|
|Staten Island: Old Town-Dongan Hills-South Beach|
|Staten Island: park-cemetery-etc-Staten Island|
|Staten Island: Port Richmond|
|Staten Island: Rossville-Woodrow|
|Staten Island: Stapleton-Rosebank|
|Staten Island: Todt Hill-Emerson Hill-Heartland Village-Lighthouse Hill|
|Staten Island: West New Brighton-New Brighton-St. George|
|Staten Island: Westerleigh|

|contactMethod|
|---|
|Text message|
|Phone Call|
|Email|

|region|
|---|
|Manhattan|
|Bronx|
|Staten Island|
|Brooklyn|
|Queens|
|Long Island|

|urgency|
|---|
|As soon as possible (1 - 3 Days)|
|In the next few days (3 - 5 Days)|
|Soon (5 - 7+ Days)|
