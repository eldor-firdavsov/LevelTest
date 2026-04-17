const englishPlacementTest = {
    meta: {
        title: "English Placement Test",
        totalQuestions: 30,
        totalScore: 30
    },

    parts: [
        {
            name: "multiple_choice",
            questions: [
                {
                    id: 1,
                    question: "She ___ to school every day.",
                    options: ["go", "goes", "going", "gone"],
                    correctAnswer: "goes",
                    score: 1
                },
                {
                    id: 2,
                    question: "They ___ football when it started to rain.",
                    options: ["play", "played", "were playing", "have played"],
                    correctAnswer: "were playing",
                    score: 1
                },
                {
                    id: 3,
                    question: "I have lived here ___ 2015.",
                    options: ["for", "since", "during", "while"],
                    correctAnswer: "since",
                    score: 1
                },
                {
                    id: 4,
                    question: "He said that he ___ tired.",
                    options: ["is", "was", "were", "has been"],
                    correctAnswer: "was",
                    score: 1
                },
                {
                    id: 5,
                    question: "If I ___ rich, I would travel the world.",
                    options: ["am", "was", "were", "will be"],
                    correctAnswer: "were",
                    score: 1
                },
                {
                    id: 6,
                    question: "She is ___ honest person I know.",
                    options: ["a", "an", "the", "—"],
                    correctAnswer: "the",
                    score: 1
                },
                {
                    id: 7,
                    question: "By the time we arrived, the film ___ already started.",
                    options: ["had", "has", "was", "did"],
                    correctAnswer: "had",
                    score: 1
                },
                {
                    id: 8,
                    question: "He ___ his homework yet.",
                    options: ["didn't finish", "hasn't finished", "doesn't finish", "hadn't finished"],
                    correctAnswer: "hasn't finished",
                    score: 1
                },
                {
                    id: 9,
                    question: "The report must ___ before Friday.",
                    options: ["submit", "submits", "be submitted", "have submitted"],
                    correctAnswer: "be submitted",
                    score: 1
                },
                {
                    id: 10,
                    question: "___ you mind if I opened the window?",
                    options: ["Will", "Would", "Do", "Should"],
                    correctAnswer: "Would",
                    score: 1
                }
            ]
        },

        {
            name: "gap_filling",
            questions: [
                { id: 11, question: "She (not / like) spicy food.", correctAnswer: "doesn't like", score: 1 },
                { id: 12, question: "By 2030, scientists (find) a cure.", correctAnswer: "will have found", score: 1 },
                { id: 13, question: "The documents (sign) yesterday.", correctAnswer: "were signed", score: 1 },
                { id: 14, question: "I wish I (study) harder.", correctAnswer: "had studied", score: 1 },
                { id: 15, question: "Despite (feel) tired...", correctAnswer: "feeling", score: 1 },
                { id: 16, question: "He is used to (wake) up early.", correctAnswer: "waking", score: 1 },
                { id: 17, question: "Not only ___ she speak French...", correctAnswer: "does", score: 1 },
                { id: 18, question: "He told me he (be) a doctor for ten years.", correctAnswer: "had been", score: 1 },
                { id: 19, question: "The more you practice, ___ you become.", correctAnswer: "the better", score: 1 },
                { id: 20, question: "She would rather (stay) home.", correctAnswer: "stay", score: 1 }
            ]
        },

        {
            name: "translation",
            questions: [
                {
                    id: 21,
                    question: "Men kecha erta uxladim.",
                    correctAnswer: "I went to sleep early yesterday.",
                    score: 1
                },
                {
                    id: 22,
                    question: "U hozir kitob o‘qiyapti.",
                    correctAnswer: "She is reading a book right now.",
                    score: 1
                },
                {
                    id: 23,
                    question: "Biz yil oxirida sayohat qilamiz.",
                    correctAnswer: "We will travel at the end of the year.",
                    score: 1
                },
                {
                    id: 24,
                    question: "Ular allaqachon nonushta qilishdi.",
                    correctAnswer: "They have already had breakfast.",
                    score: 1
                },
                {
                    id: 25,
                    question: "Agar havo yaxshi bo‘lsa, piyoda boramiz.",
                    correctAnswer: "If the weather is good, we will walk.",
                    score: 1
                },
                {
                    id: 26,
                    question: "U menga yordam berishimni so‘radi.",
                    correctAnswer: "He asked me to help him.",
                    score: 1
                },
                {
                    id: 27,
                    question: "Bu uy 1990-yilda qurilgan.",
                    correctAnswer: "This house was built in 1990.",
                    score: 1
                },
                {
                    id: 28,
                    question: "Men ingliz tilini o‘rganishni yaxshi ko‘raman.",
                    correctAnswer: "I love learning English.",
                    score: 1
                },
                {
                    id: 29,
                    question: "Ular kutilmaganda bizni ziyorat qildi.",
                    correctAnswer: "They visited us unexpectedly.",
                    score: 1
                },
                {
                    id: 30,
                    question: "Qancha ko‘p o‘qisang, shuncha ko‘p bilasan.",
                    correctAnswer: "The more you read, the more you know.",
                    score: 1
                }
            ]
        }
    ],

    grading: {
        levels: [
            { min: 27, max: 30, level: "C1/C2", label: "Advanced / Proficiency" },
            { min: 21, max: 26, level: "B2", label: "Upper-Intermediate" },
            { min: 15, max: 20, level: "B1", label: "Intermediate" },
            { min: 9, max: 14, level: "A2", label: "Elementary" },
            { min: 0, max: 8, level: "A1", label: "Beginner" }
        ]
    }
};

export default englishPlacementTest;