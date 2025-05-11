// mocks/gameData.js
export const mockGames = [
    {
      id: 1,
      title: "The Legend of Zelda: Breath of the Wild",
      platform: "Nintendo Switch",
      status: "Completed",
      imageUrl: "/images/botw.jpg", // You can add placeholder images
      completionDate: "2023-05-15",
      rating: 9.5,
      hoursPlayed: 120
    },
    {
      id: 2,
      title: "Elden Ring",
      platform: "PlayStation 5",
      status: "In Progress",
      imageUrl: "/images/elden-ring.jpg",
      completionDate: null,
      rating: null,
      hoursPlayed: 45
    },
    {
      id: 3,
      title: "Baldur's Gate 3",
      platform: "PC",
      status: "In Progress",
      imageUrl: "/images/bg3.jpg",
      completionDate: null,
      rating: null,
      hoursPlayed: 60
    },
    {
      id: 4,
      title: "Starfield",
      platform: "Xbox Series X",
      status: "Not Started",
      imageUrl: "/images/starfield.jpg",
      completionDate: null,
      rating: null,
      hoursPlayed: 0
    },
    {
      id: 5,
      title: "Final Fantasy XVI",
      platform: "PlayStation 5",
      status: "Completed",
      imageUrl: "/images/ff16.jpg",
      completionDate: "2023-08-20",
      rating: 8.5,
      hoursPlayed: 85
    },
    {
      id: 6,
      title: "Cyberpunk 2077",
      platform: "PC",
      status: "Abandoned",
      imageUrl: "/images/cyberpunk.jpg",
      completionDate: null,
      rating: 6.0,
      hoursPlayed: 15
    },
    {
      id: 7,
      title: "God of War Ragnarök",
      platform: "PlayStation 5",
      status: "Completed",
      imageUrl: "/images/gow-ragnarok.jpg",
      completionDate: "2022-12-18",
      rating: 9.8,
      hoursPlayed: 40
    },
    {
      id: 8,
      title: "Hades",
      platform: "PC",
      status: "Completed",
      imageUrl: "/images/hades.jpg",
      completionDate: "2023-02-10",
      rating: 9.0,
      hoursPlayed: 65
    },
    {
      id: 9,
      title: "Hollow Knight",
      platform: "Nintendo Switch",
      status: "In Progress",
      imageUrl: "/images/hollow-knight.jpg",
      completionDate: null,
      rating: null,
      hoursPlayed: 22
    },
    {
      id: 10,
      title: "Red Dead Redemption 2",
      platform: "PlayStation 4",
      status: "Completed",
      imageUrl: "/images/rdr2.jpg",
      completionDate: "2022-06-30",
      rating: 10.0,
      hoursPlayed: 120
    }
  ];
  
  export const mockBacklogGames = [
    {
      id: 11,
      title: "Final Fantasy VII Rebirth",
      platform: "PlayStation 5",
      priority: "High",
      addedDate: "2023-09-10",
      notes: "Need to finish this after completing Final Fantasy XVI"
    },
    {
      id: 12,
      title: "Alan Wake 2",
      platform: "PC",
      priority: "Medium",
      addedDate: "2023-10-15",
      notes: "Waiting for a sale"
    },
    {
      id: 13,
      title: "Spider-Man 2",
      platform: "PlayStation 5",
      priority: "High",
      addedDate: "2023-10-20",
      notes: "Day one purchase"
    },
    {
      id: 14,
      title: "The Legend of Zelda: Tears of the Kingdom",
      platform: "Nintendo Switch",
      priority: "Medium",
      addedDate: "2023-05-12",
      notes: "Need to finish BOTW first"
    },
    {
      id: 15,
      title: "Starfield",
      platform: "Xbox Series X",
      priority: "Low",
      addedDate: "2023-09-06",
      notes: "Waiting for patches and mods"
    }
  ];
  
  export const mockLists = [
    {
      id: 1,
      name: "Favorite RPGs",
      games: [1, 2, 3, 5]
    },
    {
      id: 2,
      name: "Games to Stream",
      games: [2, 7, 9]
    },
    {
      id: 3,
      name: "Perfect 10s",
      games: [10]
    }
  ];