const englishPlacementTest = {
  meta: {
    title: "English Placement Test",
    totalQuestions: 30,
    maxScore: 90,
    levels: ["A1", "A2", "B1", "B2", "C1"]
  },
  questions: [
    // A1 (Q1-6) - 1 point each
    {
      id: 1,
      level: "A1",
      type: "multiple_choice",
      prompt: "She ___ a teacher.",
      options: ["is", "am", "are", "be"],
      correctAnswer: "is",
      points: 1,
      autoGraded: true
    },
    {
      id: 2,
      level: "A1",
      type: "multiple_choice",
      prompt: "There ___ two books on the table.",
      options: ["is", "are", "am", "be"],
      correctAnswer: "are",
      points: 1,
      autoGraded: true
    },
    {
      id: 3,
      level: "A1",
      type: "fill_blank",
      prompt: "My name ___ Aziz. *(is/are)*",
      correctAnswer: ["is"],
      points: 1,
      autoGraded: true
    },
    {
      id: 4,
      level: "A1",
      type: "fill_blank",
      prompt: "I ___ a brother. *(have/has)*",
      correctAnswer: ["have"],
      points: 1,
      autoGraded: true
    },
    {
      id: 5,
      level: "A1",
      type: "translate",
      prompt: "Bu mening uyim.",
      correctAnswer: ["This is my house."],
      points: 1,
      autoGraded: false
    },
    {
      id: 6,
      level: "A1",
      type: "translate",
      prompt: "Men har kuni maktabga boraman.",
      correctAnswer: ["I go to school every day."],
      points: 1,
      autoGraded: false
    },
    // A2 (Q7-12) - 2 points each
    {
      id: 7,
      level: "A2",
      type: "multiple_choice",
      prompt: "Yesterday, I ___ to the cinema.",
      options: ["go", "went", "goes", "gone"],
      correctAnswer: "went",
      points: 2,
      autoGraded: true
    },
    {
      id: 8,
      level: "A2",
      type: "multiple_choice",
      prompt: "This book is ___ than that one.",
      options: ["cheap", "cheaper", "cheapest", "more cheap"],
      correctAnswer: "cheaper",
      points: 2,
      autoGraded: true
    },
    {
      id: 9,
      level: "A2",
      type: "fill_blank",
      prompt: "She usually ___ at 7. *(wake up)*",
      correctAnswer: ["wakes up"],
      points: 2,
      autoGraded: true
    },
    {
      id: 10,
      level: "A2",
      type: "fill_blank",
      prompt: "We ___ at the park last Sunday. *(be)*",
      correctAnswer: ["were"],
      points: 2,
      autoGraded: true
    },
    {
      id: 11,
      level: "A2",
      type: "translate",
      prompt: "U har doim ertalab choy ichadi.",
      correctAnswer: ["He always drinks tea in the morning.", "She always drinks tea in the morning."],
      points: 2,
      autoGraded: false
    },
    {
      id: 12,
      level: "A2",
      type: "translate",
      prompt: "Biz kecha do'stlarimiz bilan uchrashdik.",
      correctAnswer: ["We met our friends yesterday."],
      points: 2,
      autoGraded: false
    },
    // B1 (Q13-18) - 3 points each
    {
      id: 13,
      level: "B1",
      type: "multiple_choice",
      prompt: "I ___ never ___ to London.",
      options: ["have / been", "has / been", "had / being", "have / being"],
      correctAnswer: "have / been",
      points: 3,
      autoGraded: true
    },
    {
      id: 14,
      level: "B1",
      type: "multiple_choice",
      prompt: "If it rains tomorrow, we ___ stay home.",
      options: ["will", "would", "are", "were"],
      correctAnswer: "will",
      points: 3,
      autoGraded: true
    },
    {
      id: 15,
      level: "B1",
      type: "fill_blank",
      prompt: "You ___ study harder for the exam. *(should)*",
      correctAnswer: ["should"],
      points: 3,
      autoGraded: true
    },
    {
      id: 16,
      level: "B1",
      type: "fill_blank",
      prompt: "She has been living here ___ 2015.",
      correctAnswer: ["since"],
      points: 3,
      autoGraded: true
    },
    {
      id: 17,
      level: "B1",
      type: "translate",
      prompt: "Agar vaqtim bo'lsa, senga yordam beraman.",
      correctAnswer: ["If I have time, I will help you."],
      points: 3,
      autoGraded: false
    },
    {
      id: 18,
      level: "B1",
      type: "translate",
      prompt: "Men bu kitobni hali o'qib bo'lmadim.",
      correctAnswer: ["I haven't finished reading this book yet.", "I have not finished reading this book yet."],
      points: 3,
      autoGraded: false
    },
    // B2 (Q19-24) - 4 points each
    {
      id: 19,
      level: "B2",
      type: "multiple_choice",
      prompt: "The report ___ by the manager yesterday.",
      options: ["was written", "wrote", "is written", "has write"],
      correctAnswer: "was written",
      points: 4,
      autoGraded: true
    },
    {
      id: 20,
      level: "B2",
      type: "multiple_choice",
      prompt: "She said she ___ tired.",
      options: ["is", "was", "were", "be"],
      correctAnswer: "was",
      points: 4,
      autoGraded: true
    },
    {
      id: 21,
      level: "B2",
      type: "fill_blank",
      prompt: "If I ___ you, I would apologize. *(be)*",
      correctAnswer: ["were"],
      points: 4,
      autoGraded: true
    },
    {
      id: 22,
      level: "B2",
      type: "fill_blank",
      prompt: "He gave up smoking ___ his doctor's advice.",
      correctAnswer: ["because of", "due to"],
      points: 4,
      autoGraded: true
    },
    {
      id: 23,
      level: "B2",
      type: "translate",
      prompt: "Agar men boy bo'lganimda, dunyo bo'ylab sayohat qilardim.",
      correctAnswer: ["If I were rich, I would travel around the world."],
      points: 4,
      autoGraded: false
    },
    {
      id: 24,
      level: "B2",
      type: "translate",
      prompt: "U aytdi-ki, ertaga kelmaydi.",
      correctAnswer: ["He said that he would not come tomorrow.", "She said that she would not come tomorrow.", "He said he would not come tomorrow.", "She said she would not come tomorrow."],
      points: 4,
      autoGraded: false
    },
    // C1 (Q25-30) - 5 points each
    {
      id: 25,
      level: "C1",
      type: "multiple_choice",
      prompt: "Not only ___ late, but he also forgot the documents.",
      options: ["he was", "was he", "he is", "is he"],
      correctAnswer: "was he",
      points: 5,
      autoGraded: true
    },
    {
      id: 26,
      level: "C1",
      type: "multiple_choice",
      prompt: "It's high time we ___ a decision.",
      options: ["make", "made", "will make", "making"],
      correctAnswer: "made",
      points: 5,
      autoGraded: true
    },
    {
      id: 27,
      level: "C1",
      type: "fill_blank",
      prompt: "Had I known about the meeting, I ___ . *(attend)*",
      correctAnswer: ["would have attended"],
      points: 5,
      autoGraded: true
    },
    {
      id: 28,
      level: "C1",
      type: "fill_blank",
      prompt: "She is said ___ the best candidate for the job. *(be)*",
      correctAnswer: ["to be"],
      points: 5,
      autoGraded: true
    },
    {
      id: 29,
      level: "C1",
      type: "translate",
      prompt: "Agar men bu haqda oldinroq bilganimda, boshqacha qaror qabul qilgan bo'lardim.",
      correctAnswer: ["If I had known about this earlier, I would have made a different decision."],
      points: 5,
      autoGraded: false
    },
    {
      id: 30,
      level: "C1",
      type: "translate",
      prompt: "Uning fikricha, hukumat bu masalani jiddiy qabul qilishi kerak edi.",
      correctAnswer: ["In his opinion, the government should have taken this matter seriously.", "In her opinion, the government should have taken this matter seriously."],
      points: 5,
      autoGraded: false
    }
  ]
};

export default englishPlacementTest;
