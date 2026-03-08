/*
  =====================================================
  js/data.js  –  Friend Data for Innocent Gangsters
  =====================================================

  HOW TO ADD A NEW FRIEND:
  1. Copy one of the objects below and paste it inside the array
  2. Fill in the details
  3. Add their photos to: assets/friends/[their-name]/
     - photo1.jpg, photo2.jpg, photo3.jpg  (main gallery)
     - cover.jpg  (the card cover photo)
  4. Save and refresh the browser – done!

  WhatsApp number format: country code + number, no +, no spaces
  Example: Pakistan 03001234567 → "923001234567"
*/

const GANG = [
    {
        id: "usman",
        name: "Muhammad Usman",
        nickname: "The Boss",
        rank: "👑 Gang Leader",
        funnyIntro: "Acts like a CEO but still asks his mom for pocket money.",
        quote: "\"Work smart, not hard... but also not at all if possible.\"",
        phone: "923001234567",        // ← replace with real WhatsApp number
        coverPhoto: "assets/friends/usman/cover.jpg",
        photos: [
            "assets/friends/usman/photo1.jpg",
            "assets/friends/usman/photo2.jpg",
            "assets/friends/usman/photo3.jpg",
        ],
        biodata: {
            realName: "Muhammad Usman",
            age: "20",
            city: "Lahore",
            program: "BS Computer Science",
            hobbies: "Coding at 3am, pretending to study",
            biggestFear: "Waking up early",
            bestMemory: "That one chai session that lasted 6 hours",
            funFact: "Has watched the same 3 shows 10 times each",
            superpower: "Disappears when someone mentions work",
        },
        color: "#00ff87",             // ← card glow color (any hex)
    },

    {
        id: "ali",
        name: "Ali Hassan",
        nickname: "The Philosopher",
        rank: "🧠 Gang Thinker",
        funnyIntro: "Has a deep opinion about everything. Nobody asked.",
        quote: "\"If the universe is infinite, why does my WiFi not reach the bathroom?\"",
        phone: "923111234567",
        coverPhoto: "assets/friends/ali/cover.jpg",
        photos: [
            "assets/friends/ali/photo1.jpg",
            "assets/friends/ali/photo2.jpg",
            "assets/friends/ali/photo3.jpg",
        ],
        biodata: {
            realName: "Ali Hassan",
            age: "21",
            city: "Lahore",
            program: "BS Electrical Engineering",
            hobbies: "Overthinking, debating at 2am",
            biggestFear: "Silence (he fills it immediately)",
            bestMemory: "When he explained why samosas are technically a pyramid scheme",
            funFact: "Knows the lyrics to every 90s song",
            superpower: "Starts an argument and somehow wins while being completely wrong",
        },
        color: "#8b5cf6",
    },

    {
        id: "bilal",
        name: "Bilal Raza",
        nickname: "The Foodie",
        rank: "🍕 Chief Eating Officer",
        funnyIntro: "His entire personality is based on what he ate last.",
        quote: "\"I don't have a problem, I have a very developed relationship with food.\"",
        phone: "923211234567",
        coverPhoto: "assets/friends/bilal/cover.jpg",
        photos: [
            "assets/friends/bilal/photo1.jpg",
            "assets/friends/bilal/photo2.jpg",
            "assets/friends/bilal/photo3.jpg",
        ],
        biodata: {
            realName: "Bilal Raza",
            age: "20",
            city: "Rawalpindi",
            program: "BBA",
            hobbies: "Eating, thinking about eating, planning next meal",
            biggestFear: "Restaurant saying 'kitchen closed'",
            bestMemory: "Ate 12 parathas in one sitting and called it 'light breakfast'",
            funFact: "Has a mental map of every good dhaba in Lahore",
            superpower: "Smells biryani from 3 kilometres away",
        },
        color: "#ff6b35",
    },

    {
        id: "hassan",
        name: "Hassan Tariq",
        nickname: "The Sleeper",
        rank: "😴 Director of Naps",
        funnyIntro: "Can fall asleep anywhere. Literally anywhere.",
        quote: "\"I'm not lazy. I'm on energy-saving mode.\"",
        phone: "923311234567",
        coverPhoto: "assets/friends/hassan/cover.jpg",
        photos: [
            "assets/friends/hassan/photo1.jpg",
            "assets/friends/hassan/photo2.jpg",
            "assets/friends/hassan/photo3.jpg",
        ],
        biodata: {
            realName: "Hassan Tariq",
            age: "20",
            city: "Lahore",
            program: "BS Computer Science",
            hobbies: "Sleeping, sleeping with his eyes open, competitive napping",
            biggestFear: "8am classes",
            bestMemory: "Slept through an entire cricket match and woke up to celebrate the win",
            funFact: "His sleep schedule is classified information",
            superpower: "Falls asleep mid-sentence (both his own sentences and others)",
        },
        color: "#06b6d4",
    },

    {
        id: "kamran",
        name: "Kamran Sheikh",
        nickname: "The Rizz King",
        rank: "💅 Head of Swag",
        funnyIntro: "Genuinely believes he's the main character of the universe.",
        quote: "\"Mirror, mirror on the wall... yep, still me.\"",
        phone: "923451234567",
        coverPhoto: "assets/friends/kamran/cover.jpg",
        photos: [
            "assets/friends/kamran/photo1.jpg",
            "assets/friends/kamran/photo2.jpg",
            "assets/friends/kamran/photo3.jpg",
        ],
        biodata: {
            realName: "Kamran Sheikh",
            age: "21",
            city: "Lahore",
            program: "BS Computer Science",
            hobbies: "Being perceived, fixing hair, existing dramatically",
            biggestFear: "Bad lighting",
            bestMemory: "The time he walked in slow motion because the song was playing",
            funFact: "Has more mirror selfies than actual memories",
            superpower: "Makes any situation about himself within 30 seconds",
        },
        color: "#f59e0b",
    },
];
