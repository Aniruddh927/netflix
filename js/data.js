/**
 * Cloneflix — data.js
 * ------------------------------------------------------------------
 * Static content for the Cloneflix demo UI. All titles, people, and
 * descriptions are fictional and invented for this educational project.
 *
 * This file is loaded as a classic (non-module) script BEFORE js/app.js
 * and defines two globals on window:
 *
 *   window.CATALOG    — array of 45 catalog items (movies & series).
 *   window.GENRE_ROWS — row headings used by app.js to build the
 *                       browsing grid (app.js maps each label to genres).
 *
 * Each catalog item exposes a CSS gradient pair used as a poster
 * backdrop, plus metadata (title, year, rating, match %, genres,
 * duration, description) for the detail overlay.
 */

window.GENRE_ROWS = [
  "Trending Now",
  "Popular on Cloneflix",
  "Action & Adventure",
  "Sci-Fi & Fantasy",
  "Comedies",
  "Dramas",
  "Horror & Thriller",
  "Documentaries"
];

window.CATALOG = [
  {
    id: "neon-horizon",
    title: "Neon Horizon",
    year: 2024,
    rating: "TV-MA",
    match: 96,
    genres: ["Action", "Sci-Fi", "Thriller"],
    duration: "1h 58m",
    description: "A street racer who works the night shift discovers the city's AI traffic grid is rerouting more than cars — and it has learned her name.",
    gradient: ["#0f2027", "#2c5364"]
  },
  {
    id: "the-last-meridian",
    title: "The Last Meridian",
    year: 2021,
    rating: "TV-14",
    match: 92,
    genres: ["Drama", "Mystery", "Adventure"],
    duration: "2h 11m",
    description: "When a surveyor's institute receives a map of a place that should not exist, she walks the one meridian that could prove it — or end her.",
    gradient: ["#141e30", "#243b55"]
  },
  {
    id: "quantum-drift",
    title: "Quantum Drift",
    year: 2023,
    rating: "TV-14",
    match: 94,
    genres: ["Sci-Fi", "Mystery", "Drama"],
    duration: "3 Seasons",
    description: "Every fold the drift-ship Vela takes lands its crew in a slightly different universe — and each time, one of them comes back different.",
    gradient: ["#0a1931", "#2c0e37"]
  },
  {
    id: "midnight-courier",
    title: "Midnight Courier",
    year: 2022,
    rating: "TV-MA",
    match: 88,
    genres: ["Thriller", "Action", "Crime"],
    duration: "2 Seasons",
    description: "A motorcycle courier who only rides the graveyard shift keeps delivering packages that were never supposed to exist.",
    gradient: ["#1b2735", "#090a0f"]
  },
  {
    id: "paper-crowns",
    title: "Paper Crowns",
    year: 2019,
    rating: "TV-MA",
    match: 90,
    genres: ["Drama", "Crime"],
    duration: "2h 04m",
    description: "Three generations of a printing family fight over the last newspaper in a city that has decided it no longer needs the news.",
    gradient: ["#232526", "#414345"]
  },
  {
    id: "the-glass-harbor",
    title: "The Glass Harbor",
    year: 2020,
    rating: "PG-13",
    match: 86,
    genres: ["Drama", "Romance", "Adventure"],
    duration: "1h 52m",
    description: "A marine architect returns to the town that disowned her to rebuild a lighthouse out of salvage — and the secrets buried under its foundation.",
    gradient: ["#16222a", "#3a6073"]
  },
  {
    id: "static-bloom",
    title: "Static Bloom",
    year: 2023,
    rating: "TV-14",
    match: 86,
    genres: ["Comedy", "Music", "Drama"],
    duration: "2 Seasons",
    description: "Two failed pop stars inherit a pirate radio tower and accidentally become the most beloved band in the country.",
    gradient: ["#3a1c71", "#6d3b6e"]
  },
  {
    id: "ironwood-protocol",
    title: "Ironwood Protocol",
    year: 2024,
    rating: "TV-MA",
    match: 93,
    genres: ["Action", "Thriller", "Sci-Fi"],
    duration: "2h 19m",
    description: "The last human spy is activated to stop the machine uprising — but the machine is the only one who remembers how it started.",
    gradient: ["#0b1d33", "#124e78"]
  },
  {
    id: "saffron-skies",
    title: "Saffron Skies",
    year: 2018,
    rating: "TV-PG",
    match: 84,
    genres: ["Romance", "Drama", "History"],
    duration: "1h 49m",
    description: "In a golden-age port city, a spice trader's daughter falls for the harbor master sworn to arrest her family.",
    gradient: ["#3e2723", "#6d4c41"]
  },
  {
    id: "the-cartographers-daughter",
    title: "The Cartographer's Daughter",
    year: 2011,
    rating: "PG",
    match: 89,
    genres: ["Adventure", "History", "Drama"],
    duration: "2h 03m",
    description: "Her father mapped the edge of the known world; she sails beyond it to find what he left off the page.",
    gradient: ["#283048", "#4b5d6b"]
  },
  {
    id: "volt-and-ember",
    title: "Volt & Ember",
    year: 2026,
    rating: "TV-Y7",
    match: 97,
    genres: ["Animation", "Family", "Adventure"],
    duration: "2 Seasons",
    description: "A lightning sprite and a forge spirit are the only two beings who can keep their valley's lanterns lit — if they can ever stop bickering.",
    gradient: ["#1d2b64", "#42275a"]
  },
  {
    id: "beneath-the-ice-fields",
    title: "Beneath the Ice Fields",
    year: 2017,
    rating: "PG-13",
    match: 85,
    genres: ["Adventure", "Drama", "Thriller"],
    duration: "1h 56m",
    description: "An ice-core team drills two kilometers down and pulls up a signal that has been waiting a thousand years.",
    gradient: ["#0f0c29", "#24243e"]
  },
  {
    id: "sunset-syndicate",
    title: "Sunset Syndicate",
    year: 2021,
    rating: "TV-MA",
    match: 87,
    genres: ["Crime", "Thriller", "Drama"],
    duration: "3 Seasons",
    description: "By day they run a seaside diner; by dusk they run the city's most meticulous heists, one half-hour at a time.",
    gradient: ["#200122", "#6f0000"]
  },
  {
    id: "the-quiet-algorithm",
    title: "The Quiet Algorithm",
    year: 2024,
    rating: "TV-MA",
    match: 95,
    genres: ["Sci-Fi", "Thriller", "Mystery"],
    duration: "1h 51m",
    description: "A behavioral economist proves her city's traffic lights are making moral decisions — and someone intends to keep it that way.",
    gradient: ["#09203f", "#537895"]
  },
  {
    id: "ashfall-kingdom",
    title: "Ashfall Kingdom",
    year: 2022,
    rating: "TV-14",
    match: 91,
    genres: ["Fantasy", "Drama", "History"],
    duration: "2 Seasons",
    description: "The empire's volcano erupts on schedule, and the scribe who deciphers the calendar discovers it was written backwards.",
    gradient: ["#41295a", "#2f0743"]
  },
  {
    id: "lunar-lullabies",
    title: "Lunar Lullabies",
    year: 2010,
    rating: "TV-Y7",
    match: 79,
    genres: ["Animation", "Family", "Fantasy"],
    duration: "1h 24m",
    description: "A young night guard sings the moon down every evening — until the moon sings back.",
    gradient: ["#1a1a2e", "#461a4d"]
  },
  {
    id: "crimson-static",
    title: "Crimson Static",
    year: 2023,
    rating: "TV-MA",
    match: 89,
    genres: ["Horror", "Thriller", "Sci-Fi"],
    duration: "1h 43m",
    description: "A pirate television channel broadcasts disasters a day before they happen, and every signal resolves to the same address.",
    gradient: ["#4a0e0e", "#1f1c2c"]
  },
  {
    id: "the-borrowed-hour",
    title: "The Borrowed Hour",
    year: 2020,
    rating: "PG",
    match: 88,
    genres: ["Mystery", "Fantasy", "Family"],
    duration: "1h 38m",
    description: "An antique clockmaker lends people an extra hour of their lives — and every hour is borrowed from someone else.",
    gradient: ["#2f3e46", "#4a5d66"]
  },
  {
    id: "hollowpoint-bay",
    title: "Hollowpoint Bay",
    year: 2019,
    rating: "TV-MA",
    match: 86,
    genres: ["Crime", "Action", "Drama"],
    duration: "2h 01m",
    description: "A washed-up harbor cop and the daughter he abandoned chase the same smuggler to the same dock, twenty years apart.",
    gradient: ["#2b2d42", "#3d405b"]
  },
  {
    id: "emberline",
    title: "Emberline",
    year: 2024,
    rating: "TV-14",
    match: 92,
    genres: ["Action", "Fantasy", "Adventure"],
    duration: "3 Seasons",
    description: "Along the Emberline railway, a firefighter trains the last stokers who can keep the world's furnaces from going dark.",
    gradient: ["#3d0c02", "#1b0000"]
  },
  {
    id: "a-theory-of-foxes",
    title: "A Theory of Foxes",
    year: 2021,
    rating: "TV-PG",
    match: 90,
    genres: ["Fantasy", "Comedy", "Family"],
    duration: "1h 42m",
    description: "A disgraced zoologist claims the foxes hold a secret parliament — his only evidence is his grandmother's backyard.",
    gradient: ["#1f4037", "#245c4f"]
  },
  {
    id: "the-salt-district",
    title: "The Salt District",
    year: 2018,
    rating: "TV-MA",
    match: 88,
    genres: ["Crime", "Mystery", "Drama"],
    duration: "2 Seasons",
    description: "Every secret in the city is filed in the Salt District's archive — until the archivist starts filing herself.",
    gradient: ["#0b486b", "#3b8686"]
  },
  {
    id: "nightshift-radio",
    title: "Nightshift Radio",
    year: 2022,
    rating: "TV-14",
    match: 85,
    genres: ["Music", "Comedy", "Romance"],
    duration: "1h 46m",
    description: "Two graveyard-shift DJs fall in love over the one song that only ever plays when they are both on air.",
    gradient: ["#42275a", "#734b6d"]
  },
  {
    id: "pale-water",
    title: "Pale Water",
    year: 2012,
    rating: "TV-MA",
    match: 80,
    genres: ["Horror", "Mystery", "Thriller"],
    duration: "1h 37m",
    description: "A hydrologist samples the same lake every week, and the water keeps not being water.",
    gradient: ["#1b1b3a", "#6a0572"]
  },
  {
    id: "the-lighthouse-mechanic",
    title: "The Lighthouse Mechanic",
    year: 2008,
    rating: "PG",
    match: 87,
    genres: ["Drama", "Comedy", "Family"],
    duration: "1h 51m",
    description: "The man who maintains the automated lighthouse on Gull Point has one rule: never check which ships the light refuses to illuminate.",
    gradient: ["#0c0c0c", "#1f2833"]
  },
  {
    id: "gravitys-apprentice",
    title: "Gravity's Apprentice",
    year: 2023,
    rating: "TV-14",
    match: 93,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    duration: "1h 59m",
    description: "An orbital apprentice inherits a gravity wrench, a debt, and three minutes to save the sky.",
    gradient: ["#000428", "#004e92"]
  },
  {
    id: "kite-strings",
    title: "Kite Strings",
    year: 2006,
    rating: "TV-Y7",
    match: 78,
    genres: ["Animation", "Family", "Comedy"],
    duration: "1h 22m",
    description: "A little girl and her grandfather fly the biggest kite in the county, and the wind starts taking requests.",
    gradient: ["#0f3460", "#16213e"]
  },
  {
    id: "the-last-orchard",
    title: "The Last Orchard",
    year: 2016,
    rating: "TV-Y7",
    match: 84,
    genres: ["Animation", "Family", "Drama"],
    duration: "1h 35m",
    description: "The final orchard on Earth is a museum piece — until the trees start remembering the families who planted them.",
    gradient: ["#1e3c2f", "#0f241b"]
  },
  {
    id: "meridian-station",
    title: "Meridian Station",
    year: 2020,
    rating: "TV-14",
    match: 94,
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    duration: "3 Seasons",
    description: "The station at the end of the line between the two halves of the world is staffed by people who refused to leave.",
    gradient: ["#1f1a3d", "#3a2d6e"]
  },
  {
    id: "redacted",
    title: "Redacted",
    year: 2025,
    rating: "TV-MA",
    match: 96,
    genres: ["Sci-Fi", "Thriller", "Action"],
    duration: "2 Seasons",
    description: "The intelligence file on the Redacted Incident keeps rewriting itself, and the analyst assigned to it wrote the new version.",
    gradient: ["#1a2a6c", "#b21f1f"]
  },
  {
    id: "the-velvet-frequency",
    title: "The Velvet Frequency",
    year: 2019,
    rating: "TV-MA",
    match: 89,
    genres: ["Mystery", "Music", "Drama"],
    duration: "2 Seasons",
    description: "A velvet-voiced radio host solves the city's cold cases between records — no one has ever heard his real name.",
    gradient: ["#654ea3", "#352a5e"]
  },
  {
    id: "winters-ledger",
    title: "Winter's Ledger",
    year: 2021,
    rating: "TV-14",
    match: 88,
    genres: ["Crime", "Drama", "History"],
    duration: "1h 57m",
    description: "A small-town bookkeeper's ledger, kept over four decades, reveals who really ran the town and what it cost them.",
    gradient: ["#10343a", "#0a1c22"]
  },
  {
    id: "signal-fire",
    title: "Signal Fire",
    year: 2024,
    rating: "TV-PG",
    match: 90,
    genres: ["Documentary", "Music", "History"],
    duration: "1h 28m",
    description: "The story of the beacon towers, the last human relay network, and the families who kept the flames lit for two centuries.",
    gradient: ["#2f0743", "#5c258d"]
  },
  {
    id: "the-glass-apiary",
    title: "The Glass Apiary",
    year: 2020,
    rating: "PG",
    match: 86,
    genres: ["Fantasy", "Family", "Drama"],
    duration: "1h 47m",
    description: "Beekeepers who raise their hives in glass domes discover the bees aren't making honey — they're making maps.",
    gradient: ["#4d3a15", "#241c09"]
  },
  {
    id: "mothlight",
    title: "Mothlight",
    year: 2022,
    rating: "TV-MA",
    match: 91,
    genres: ["Horror", "Mystery", "Fantasy"],
    duration: "1h 40m",
    description: "Every lamp in the old theater burns for a different dead patron, and the projectionist knows whose turn it is tonight.",
    gradient: ["#3d1d3a", "#170b1a"]
  },
  {
    id: "copper-and-bone",
    title: "Copper & Bone",
    year: 2023,
    rating: "TV-MA",
    match: 87,
    genres: ["Crime", "Thriller", "Drama"],
    duration: "2h 08m",
    description: "A forensic metalsmith reads a life from the copper in a doorknob — and the city's most untraceable criminal is about to learn it.",
    gradient: ["#4a2c17", "#1d1208"]
  },
  {
    id: "the-seventh-tide",
    title: "The Seventh Tide",
    year: 2018,
    rating: "TV-MA",
    match: 84,
    genres: ["Horror", "Thriller", "Mystery"],
    duration: "1h 52m",
    description: "Once every seven years the tide goes out and does not come back. This year, something comes in.",
    gradient: ["#182240", "#341a4d"]
  },
  {
    id: "satellite-dreams",
    title: "Satellite Dreams",
    year: 2019,
    rating: "TV-PG",
    match: 92,
    genres: ["Documentary", "Sci-Fi", "History"],
    duration: "1h 36m",
    description: "The forgotten engineers of the first orbital relay remember the night they convinced the whole world to look up.",
    gradient: ["#0a1f33", "#1d4e6e"]
  },
  {
    id: "bitter-root",
    title: "Bitter Root",
    year: 2020,
    rating: "TV-14",
    match: 85,
    genres: ["Drama", "History", "Mystery"],
    duration: "2h 00m",
    description: "A chef returns to the farm town that made her and finds the soil is worth more than the food it grows.",
    gradient: ["#3a2b14", "#1c1408"]
  },
  {
    id: "the-paper-astronaut",
    title: "The Paper Astronaut",
    year: 2017,
    rating: "TV-Y7",
    match: 88,
    genres: ["Animation", "Family", "Sci-Fi"],
    duration: "1h 29m",
    description: "A girl builds her spaceship out of homework and patience, and the moon folds itself in half to let her land.",
    gradient: ["#16214a", "#0d1030"]
  },
  {
    id: "low-tide",
    title: "Low Tide",
    year: 2023,
    rating: "TV-14",
    match: 83,
    genres: ["Sports", "Drama", "Romance"],
    duration: "1h 48m",
    description: "A washed-up surfer gets one final season to prove the break belongs to the town — and to the wave.",
    gradient: ["#153b3c", "#0e2425"]
  },
  {
    id: "cerulean",
    title: "Cerulean",
    year: 2005,
    rating: "PG-13",
    match: 86,
    genres: ["Romance", "Drama", "Mystery"],
    duration: "1h 54m",
    description: "Two portrait painters share a studio, a name, and a lifelong argument over which of them is painting the truth.",
    gradient: ["#1d4e89", "#0e2a47"]
  },
  {
    id: "the-long-way-home",
    title: "The Long Way Home",
    year: 2012,
    rating: "PG-13",
    match: 89,
    genres: ["Sports", "Drama", "Adventure"],
    duration: "2h 06m",
    description: "An ultramarathoner runs the 2,400-mile route she walked home as a child, one phone call per mile.",
    gradient: ["#2b2b1e", "#141411"]
  },
  {
    id: "vermilion",
    title: "Vermilion",
    year: 2024,
    rating: "TV-MA",
    match: 95,
    genres: ["Crime", "Thriller", "Romance"],
    duration: "2h 02m",
    description: "A counterfeiter with perfect color memory returns to the one city where her pigment is still illegal.",
    gradient: ["#5c0f14", "#2b0a0d"]
  },
  {
    id: "the-unquiet-earth",
    title: "The Unquiet Earth",
    year: 2023,
    rating: "TV-PG",
    match: 93,
    genres: ["Documentary", "History", "Drama"],
    duration: "1h 31m",
    description: "Seismologists, cryptographers, and the world's oldest tree work together on the longest study of the ground beneath our feet.",
    gradient: ["#1a2e1e", "#0e1c12"]
  }
];
