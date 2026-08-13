/**
 * Netflix UI clone (educational demo) — data.js
 * ------------------------------------------------------------------
 * The catalog uses real, well-known movie and series TITLES for realism
 * (titles are not copyrightable), but every description is original
 * wording, and all poster/backdrop/thumbnail artwork is procedurally
 * generated from each title's own gradient — no copyrighted imagery.
 *
 * This file is loaded as a classic (non-module) script BEFORE js/app.js
 * and defines two globals on window:
 *
 *   window.CATALOG    — array of 45 catalog items (movies & series).
 *   window.GENRE_ROWS — row headings used by app.js to build the
 *                       browsing grid (app.js maps each label to genres).
 *
 * Each catalog item exposes a CSS gradient pair used as the basis of its
 * generated artwork, plus metadata (title, year, rating, match %, genres,
 * duration, description) for the detail overlay.
 */

window.GENRE_ROWS = [
  "Trending Now",
  "New & Popular",
  "Popular on Netflix",
  "Action & Adventure",
  "Sci-Fi & Fantasy",
  "Comedies",
  "Dramas",
  "Horror & Thriller",
  "Documentaries"
];

window.CATALOG = [
  {
    id: "stranger-things",
    title: "Stranger Things",
    year: 2016,
    rating: "TV-14",
    match: 98,
    genres: ["Sci-Fi", "Horror", "Mystery"],
    duration: "4 Seasons",
    description: "A group of kids in a small Indiana town uncovers a secret lab, a girl with powers, and a terrifying world just beneath their own.",
    gradient: ["#1a0f2e", "#b3131b"]
  },
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    year: 2008,
    rating: "TV-MA",
    match: 99,
    genres: ["Crime", "Drama", "Thriller"],
    duration: "5 Seasons",
    description: "A mild-mannered chemistry teacher turns to cooking meth after a terminal diagnosis, and quietly becomes someone his family wouldn't recognize.",
    gradient: ["#1c2e1b", "#5c7a1f"]
  },
  {
    id: "the-office",
    title: "The Office",
    year: 2005,
    rating: "TV-14",
    match: 95,
    genres: ["Comedy"],
    duration: "9 Seasons",
    description: "A documentary crew films the day-to-day chaos of a small paper company run by the world's most confident, least self-aware boss.",
    gradient: ["#2c3e50", "#4ca1af"]
  },
  {
    id: "the-last-dance",
    title: "The Last Dance",
    year: 2020,
    rating: "TV-MA",
    match: 96,
    genres: ["Documentary", "Sports"],
    duration: "1 Season",
    description: "Unreleased footage and new interviews chart Michael Jordan's final championship season with the Chicago Bulls.",
    gradient: ["#3b0d0d", "#8c1f1f"]
  },
  {
    id: "planet-earth-ii",
    title: "Planet Earth II",
    year: 2016,
    rating: "TV-G",
    match: 97,
    genres: ["Documentary"],
    duration: "1 Season",
    description: "Cameras journey to islands, mountains, jungles, deserts, grasslands, and cities to capture wildlife like never before.",
    gradient: ["#0e2b1c", "#2e6e4f"]
  },
  {
    id: "the-crown",
    title: "The Crown",
    year: 2016,
    rating: "TV-MA",
    match: 94,
    genres: ["Drama", "History"],
    duration: "6 Seasons",
    description: "The reign of Queen Elizabeth II unfolds across decades — public ceremony, private sacrifice, and the family behind the crown.",
    gradient: ["#1b2a4a", "#8c6d1f"]
  },
  {
    id: "the-witcher",
    title: "The Witcher",
    year: 2019,
    rating: "TV-MA",
    match: 93,
    genres: ["Action", "Fantasy", "Drama"],
    duration: "3 Seasons",
    description: "A solitary monster hunter navigates a war-torn continent where humans are often more monstrous than the creatures he tracks.",
    gradient: ["#2b2b2b", "#7a8b8b"]
  },
  {
    id: "squid-game",
    title: "Squid Game",
    year: 2021,
    rating: "TV-MA",
    match: 97,
    genres: ["Drama", "Thriller"],
    duration: "2 Seasons",
    description: "Hundreds of cash-strapped players accept a mysterious invitation to children's games with deadly stakes and a life-changing prize.",
    gradient: ["#e50914", "#3d0508"]
  },
  {
    id: "black-mirror",
    title: "Black Mirror",
    year: 2011,
    rating: "TV-MA",
    match: 94,
    genres: ["Sci-Fi", "Thriller"],
    duration: "6 Seasons",
    description: "Standalone stories hold a dark mirror to modern life, exploring what happens when technology outpaces our humanity.",
    gradient: ["#101418", "#2e3c4a"]
  },
  {
    id: "arcane",
    title: "Arcane",
    year: 2021,
    rating: "TV-14",
    match: 98,
    genres: ["Animation", "Action", "Fantasy"],
    duration: "2 Seasons",
    description: "Two sisters find themselves on opposite sides of a war between the gleaming city of Piltover and the oppressed undercity of Zaun.",
    gradient: ["#0f2f4a", "#d98a2b"]
  },
  {
    id: "the-queens-gambit",
    title: "The Queen's Gambit",
    year: 2020,
    rating: "TV-MA",
    match: 96,
    genres: ["Drama"],
    duration: "1 Season",
    description: "An orphan chess prodigy climbs the ranks of a man's world while battling the addictions that fuel — and threaten — her gift.",
    gradient: ["#2a1a1a", "#7a4a2b"]
  },
  {
    id: "money-heist",
    title: "Money Heist",
    year: 2017,
    rating: "TV-MA",
    match: 92,
    genres: ["Crime", "Thriller"],
    duration: "5 Seasons",
    description: "A mastermind known as the Professor assembles eight thieves to pull off the most ambitious heist in recorded history.",
    gradient: ["#8c0b0b", "#d41f1f"]
  },
  {
    id: "the-dark-knight",
    title: "The Dark Knight",
    year: 2008,
    rating: "PG-13",
    match: 99,
    genres: ["Action", "Crime", "Drama"],
    duration: "2h 32m",
    description: "Batman faces an anarchist who can't be bought or reasoned with, forcing Gotham — and its hero — to their breaking point.",
    gradient: ["#0b1622", "#2e5a8c"]
  },
  {
    id: "mad-max-fury-road",
    title: "Mad Max: Fury Road",
    year: 2015,
    rating: "R",
    match: 95,
    genres: ["Action", "Adventure", "Sci-Fi"],
    duration: "2h 00m",
    description: "In a desert wasteland, a drifter and a renegade warrior flee a warlord across a chase that never lets up.",
    gradient: ["#3b2a0b", "#c45a1f"]
  },
  {
    id: "deadpool-and-wolverine",
    title: "Deadpool & Wolverine",
    year: 2024,
    rating: "R",
    match: 93,
    genres: ["Action", "Comedy", "Adventure"],
    duration: "2h 08m",
    description: "The Merc with a Mouth drags the most reluctant X-Man in existence across the multiverse to save the world he calls home.",
    gradient: ["#5c0f14", "#d4a017"]
  },
  {
    id: "top-gun-maverick",
    title: "Top Gun: Maverick",
    year: 2022,
    rating: "PG-13",
    match: 96,
    genres: ["Action", "Drama"],
    duration: "2h 10m",
    description: "Thirty years on, a legendary pilot trains a new generation of top guns — including the son of his lost wingman.",
    gradient: ["#1a2b4a", "#4a6a9e"]
  },
  {
    id: "raiders-of-the-lost-ark",
    title: "Raiders of the Lost Ark",
    year: 1981,
    rating: "PG",
    match: 95,
    genres: ["Action", "Adventure"],
    duration: "1h 55m",
    description: "An archaeologist races the Nazis across the globe to find the Ark of the Covenant before it becomes a weapon.",
    gradient: ["#4a2b0b", "#a86a1f"]
  },
  {
    id: "jurassic-park",
    title: "Jurassic Park",
    year: 1993,
    rating: "PG-13",
    match: 94,
    genres: ["Adventure", "Sci-Fi"],
    duration: "2h 07m",
    description: "A billionaire's dinosaur theme park turns into a nightmare when its cloned exhibits get loose and start hunting.",
    gradient: ["#14290f", "#3d6b2e"]
  },
  {
    id: "the-lord-of-the-rings",
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
    rating: "PG-13",
    match: 97,
    genres: ["Adventure", "Fantasy"],
    duration: "2h 58m",
    description: "A quiet hobbit inherits a ring of terrible power and sets out with eight companions to destroy it.",
    gradient: ["#2b2a1a", "#7a6b2e"]
  },
  {
    id: "inception",
    title: "Inception",
    year: 2010,
    rating: "PG-13",
    match: 98,
    genres: ["Sci-Fi", "Action", "Thriller"],
    duration: "2h 28m",
    description: "A thief who steals secrets from dreams takes on one last job: planting an idea so deep it can't be undone.",
    gradient: ["#1a1f2b", "#5a6b7a"]
  },
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    rating: "PG-13",
    match: 97,
    genres: ["Sci-Fi", "Drama", "Adventure"],
    duration: "2h 49m",
    description: "With Earth dying, a pilot leaves his daughter behind and travels through a wormhole in search of a new home.",
    gradient: ["#0b0f1a", "#2b3a5c"]
  },
  {
    id: "the-matrix",
    title: "The Matrix",
    year: 1999,
    rating: "R",
    match: 96,
    genres: ["Sci-Fi", "Action"],
    duration: "2h 16m",
    description: "A hacker learns his reality is a simulation and joins the rebellion fighting the machines that built it.",
    gradient: ["#0b2b1c", "#1f8c4a"]
  },
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    year: 2024,
    rating: "PG-13",
    match: 95,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    duration: "2h 46m",
    description: "Paul Atreides unites with the Fremen to wage war on the conspirators who destroyed his family — and confronts the prophecy he may fulfill.",
    gradient: ["#3b2a14", "#c48a3d"]
  },
  {
    id: "harry-potter-sorcerers-stone",
    title: "Harry Potter and the Sorcerer's Stone",
    year: 2001,
    rating: "PG",
    match: 94,
    genres: ["Fantasy", "Adventure", "Family"],
    duration: "2h 32m",
    description: "An eleven-year-old discovers he's a wizard and begins his first year at the school where his legend began.",
    gradient: ["#1a1a3b", "#6b3b8c"]
  },
  {
    id: "spirited-away",
    title: "Spirited Away",
    year: 2001,
    rating: "PG",
    match: 96,
    genres: ["Animation", "Fantasy", "Family"],
    duration: "2h 05m",
    description: "A girl lost in a world of spirits must work in a bathhouse and find the courage to free her parents and return home.",
    gradient: ["#2b3b5c", "#d44a7a"]
  },
  {
    id: "the-grand-budapest-hotel",
    title: "The Grand Budapest Hotel",
    year: 2014,
    rating: "R",
    match: 93,
    genres: ["Comedy", "Drama"],
    duration: "1h 39m",
    description: "A legendary concierge and his loyal lobby boy are swept into a caper involving a priceless painting and a stolen fortune.",
    gradient: ["#7a2b3b", "#e08aa0"]
  },
  {
    id: "inside-out-2",
    title: "Inside Out 2",
    year: 2024,
    rating: "PG",
    match: 95,
    genres: ["Animation", "Family", "Comedy"],
    duration: "1h 36m",
    description: "Teenage Riley's mind welcomes new emotions — including Anxiety — and everything she thought she knew gets rearranged.",
    gradient: ["#3b2b7a", "#e07a2b"]
  },
  {
    id: "toy-story",
    title: "Toy Story",
    year: 1995,
    rating: "G",
    match: 96,
    genres: ["Animation", "Family", "Comedy"],
    duration: "1h 21m",
    description: "A cowboy doll's world turns upside down when a flashy space ranger arrives and becomes the favorite toy.",
    gradient: ["#3b6ba0", "#e0b03b"]
  },
  {
    id: "frozen",
    title: "Frozen",
    year: 2013,
    rating: "PG",
    match: 92,
    genres: ["Animation", "Family", "Music"],
    duration: "1h 42m",
    description: "A princess sets off through an eternal winter to bring back her sister, whose icy secret froze the kingdom.",
    gradient: ["#1a3b5c", "#8cd0e0"]
  },
  {
    id: "the-lion-king",
    title: "The Lion King",
    year: 1994,
    rating: "G",
    match: 95,
    genres: ["Animation", "Family", "Drama"],
    duration: "1h 28m",
    description: "A young lion prince, exiled by a scheming uncle, must find his way back to claim his place in the circle of life.",
    gradient: ["#3b1f0b", "#d49a2b"]
  },
  {
    id: "spider-man-into-the-spider-verse",
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    rating: "PG",
    match: 97,
    genres: ["Animation", "Action", "Adventure"],
    duration: "1h 57m",
    description: "Teenager Miles Morales meets Spider-people from other dimensions and must become the hero his city needs.",
    gradient: ["#3b0b1a", "#e02b5c"]
  },
  {
    id: "the-shawshank-redemption",
    title: "The Shawshank Redemption",
    year: 1994,
    rating: "R",
    match: 99,
    genres: ["Drama"],
    duration: "2h 22m",
    description: "A banker sentenced to life for a crime he didn't commit finds hope, friendship, and a plan inside Shawshank.",
    gradient: ["#1a2b2b", "#4a6b6b"]
  },
  {
    id: "forrest-gump",
    title: "Forrest Gump",
    year: 1994,
    rating: "PG-13",
    match: 95,
    genres: ["Drama", "Romance"],
    duration: "2h 22m",
    description: "A kind-hearted man with an extraordinary life runs, fights, and loves his way through three decades of American history.",
    gradient: ["#3b2b1a", "#8c6b3b"]
  },
  {
    id: "the-godfather",
    title: "The Godfather",
    year: 1972,
    rating: "R",
    match: 98,
    genres: ["Crime", "Drama"],
    duration: "2h 55m",
    description: "The aging patriarch of a crime family transfers control to his reluctant youngest son, with violent consequences.",
    gradient: ["#0b0b0b", "#5c2b0b"]
  },
  {
    id: "parasite",
    title: "Parasite",
    year: 2019,
    rating: "R",
    match: 97,
    genres: ["Drama", "Thriller"],
    duration: "2h 12m",
    description: "A struggling family cons its way into a wealthy household — until a secret in the basement upends everything.",
    gradient: ["#1a3b1a", "#5c8c3b"]
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    year: 2023,
    rating: "R",
    match: 96,
    genres: ["Drama", "History", "Thriller"],
    duration: "3h 00m",
    description: "The brilliant, haunted physicist who led the Manhattan Project watches his creation change the world forever.",
    gradient: ["#1a140b", "#d48c2b"]
  },
  {
    id: "la-la-land",
    title: "La La Land",
    year: 2016,
    rating: "PG-13",
    match: 94,
    genres: ["Drama", "Romance", "Music"],
    duration: "2h 08m",
    description: "An aspiring actress and a jazz pianist chase their dreams in Los Angeles, trying not to lose each other along the way.",
    gradient: ["#2b1a4a", "#d44a8c"]
  },
  {
    id: "titanic",
    title: "Titanic",
    year: 1997,
    rating: "PG-13",
    match: 93,
    genres: ["Drama", "Romance"],
    duration: "3h 14m",
    description: "A penniless artist and a first-class passenger fall in love aboard the ship no one believed could sink.",
    gradient: ["#0b1a2b", "#4a7a9e"]
  },
  {
    id: "get-out",
    title: "Get Out",
    year: 2017,
    rating: "R",
    match: 97,
    genres: ["Horror", "Mystery", "Thriller"],
    duration: "1h 44m",
    description: "A young Black man meets his white girlfriend's family for the weekend — and realizes the visit is anything but welcoming.",
    gradient: ["#1a1a1a", "#7a1f1f"]
  },
  {
    id: "hereditary",
    title: "Hereditary",
    year: 2018,
    rating: "R",
    match: 94,
    genres: ["Horror", "Mystery", "Drama"],
    duration: "2h 07m",
    description: "After the family matriarch dies, a grieving household unravels as dark secrets surface through the generations.",
    gradient: ["#140f0b", "#4a2b1a"]
  },
  {
    id: "a-quiet-place",
    title: "A Quiet Place",
    year: 2018,
    rating: "PG-13",
    match: 95,
    genres: ["Horror", "Thriller", "Sci-Fi"],
    duration: "1h 30m",
    description: "In a world where monsters hunt by sound, a family lives in silence — until a new life breaks it.",
    gradient: ["#0f141a", "#3b4a5c"]
  },
  {
    id: "twisters",
    title: "Twisters",
    year: 2024,
    rating: "PG-13",
    match: 91,
    genres: ["Action", "Adventure", "Thriller"],
    duration: "2h 02m",
    description: "A storm chaser and a social-media star team up to test a system that could tame tornadoes — if the season doesn't kill them first.",
    gradient: ["#1a2b2b", "#5c7a6b"]
  },
  {
    id: "free-solo",
    title: "Free Solo",
    year: 2018,
    rating: "PG-13",
    match: 96,
    genres: ["Documentary", "Sports"],
    duration: "1h 40m",
    description: "Climber Alex Honnold prepares to scale El Capitan's 3,000-foot wall with no ropes — and no room for a single mistake.",
    gradient: ["#3b2b14", "#a86b2b"]
  },
  {
    id: "13th",
    title: "13th",
    year: 2016,
    rating: "TV-MA",
    match: 95,
    genres: ["Documentary", "History"],
    duration: "1h 40m",
    description: "Scholars, activists, and politicians examine the path from the 13th Amendment to today's era of mass incarceration.",
    gradient: ["#141414", "#5c1414"]
  },
  {
    id: "wicked",
    title: "Wicked",
    year: 2024,
    rating: "PG",
    match: 94,
    genres: ["Fantasy", "Music", "Romance"],
    duration: "2h 40m",
    description: "Before Dorothy arrived, a green-skinned student and a popular blonde formed an unlikely friendship that would shape all of Oz.",
    gradient: ["#1a3b2b", "#d46aa0"]
  }
];
