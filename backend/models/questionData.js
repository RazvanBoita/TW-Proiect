class QuestionData{
    constructor(id, title, difficulty, answer, counter, description, rating)
    {
        this.id = id;
        this.title = title;
        this.difficulty = difficulty;
        this.answer = answer;
        this.counter = counter;
        this.description = description;
        this.rating = rating;
    }
}
module.exports = QuestionData;