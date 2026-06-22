const englishPlacementTest = {
    meta: {
        title: "English Placement Test",
        totalQuestions: 30
    },
    // We group questions inside their typical structural parts, 
    // but give every question an explicit CEFR level tag.
    parts: [
        {
            name: "multiple_choice",
            questions: [
                { id: 1, level: "A1", question: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], correctAnswer: "goes" },
                { id: 2, level: "A2", question: "They ___ football when it started to rain.", options: ["play", "played", "were playing", "have played"], correctAnswer: "were playing" },
                { id: 3, level: "B1", question: "I have lived here ___ 2015.", options: ["for", "since", "during", "while"], correctAnswer: "since" },
                { id: 4, level: "B2", question: "He said that he ___ tired.", options: ["is", "was", "were", "has been"], correctAnswer: "was" },
                { id: 5, level: "C1", question: "If I ___ rich, I would travel the world.", options: ["am", "was", "were", "will be"], correctAnswer: "were" },
                { id: 6, level: "A2", question: "She is ___ honest person I know.", options: ["a", "an", "the", "—"], correctAnswer: "the" },
                { id: 7, level: "B2", question: "By the time we arrived, the film ___ already started.", options: ["had", "has", "was", "did"], correctAnswer: "had" },
                { id: 8, level: "B1", question: "He ___ his homework yet.", options: ["didn't finish", "hasn't finished", "doesn't finish", "hadn't finished"], correctAnswer: "hasn't finished" },
                { id: 9, level: "C1", question: "The report must ___ before Friday.", options: ["submit", "submits", "be submitted", "have submitted"], correctAnswer: "be submitted" },
                { id: 10, level: "B2", question: "___ you mind if I opened the window?", options: ["Will", "Would", "Do", "Should"], correctAnswer: "Would" }
            ]
        },
        {
            name: "gap_filling",
            questions: [
                { id: 11, level: "A1", question: "She (not / like) spicy food.", correctAnswer: "doesn't like" },
                { id: 12, level: "C1", question: "By 2030, scientists (find) a cure.", correctAnswer: "will have found" },
                { id: 13, level: "B2", question: "The documents (sign) yesterday.", correctAnswer: "were signed" },
                { id: 14, level: "C1", question: "I wish I (study) harder.", correctAnswer: "had studied" },
                { id: 15, level: "B2", question: "Despite (feel) tired...", correctAnswer: "feeling" },
                { id: 16, level: "B1", question: "He is used to (wake) up early.", correctAnswer: "waking" },
                { id: 17, level: "C2", question: "Not only ___ she speak French...", correctAnswer: "does" },
                { id: 18, level: "B2", question: "He told me he (be) a doctor for ten years.", correctAnswer: "had been" },
                { id: 19, level: "C1", question: "The more you practice, ___ you become.", correctAnswer: "the better" },
                { id: 20, level: "C2", question: "She would rather (stay) home.", correctAnswer: "stay" }
            ]
        },
        {
            name: "translation",
            questions: [
                { id: 21, level: "A1", question: "Men kecha erta uxladim.", correctAnswer: "I went to sleep early yesterday." },
                { id: 22, level: "A2", question: "U hozir kitob o‘qiyapti.", correctAnswer: "She is reading a book right now." },
                { id: 23, level: "B1", question: "Biz yil oxirida sayohat qilamiz.", correctAnswer: "We will travel at the end of the year." },
                { id: 24, level: "B1", question: "Ular allaqachon nonushta qilishdi.", correctAnswer: "They have already had breakfast." },
                { id: 25, level: "B2", question: "Agar havo yaxshi bo‘lsa, piyoda boramiz.", correctAnswer: "If the weather is good, we will walk." },
                { id: 26, level: "A2", question: "U menga yordam berishimni so‘radi.", correctAnswer: "He asked me to help him." },
                { id: 27, level: "B2", question: "Bu uy 1990-yilda qurilgan.", correctAnswer: "This house was built in 1990." },
                { id: 28, level: "A1", question: "Men ingliz tilini o‘rganishni yaxshi ko‘raman.", correctAnswer: "I love learning English." },
                { id: 29, level: "B1", question: "Ular kutilmaganda bizni ziyorat qildi.", correctAnswer: "They visited us unexpectedly." },
                { id: 30, level: "C2", question: "Qancha ko‘p o‘qisang, shuncha ko‘p bilasan.", correctAnswer: "The more you read, the more you know." }
            ]
        }
    ]
};

export default englishPlacementTest;
