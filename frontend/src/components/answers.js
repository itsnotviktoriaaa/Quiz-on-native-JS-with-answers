import {UrlManager} from "../utils/url-manager.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";

export class Answers {

    constructor() {
        this.currentQuestion = 1;
        this.testId = null;
        this.quiz = null;
        this.routeParams = UrlManager.getQueryParams();
        this.buttonBackToWatchResult = document.getElementById('back-result');
        this.answersResultChoice = document.getElementById('answers-result-choice');
        this.userDataElement = document.getElementById('user-data');

        this.init();
    }

    async init() {

        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }

                    const that = this;
                    this.quiz = result.test;
                    // console.log(this.quiz);

                    this.showAllAnswers();

                    this.buttonBackToWatchResult.onclick = function () {
                        that.backToWatchResult();
                    }

                    this.answersResultChoice.innerHTML = this.quiz.name;

                    this.userData();

                }
            } catch (error) {
                console.log(error);
            }
        }

    }

    showAllAnswers() {
        const answersQuestion = document.getElementById('answers-question');
        if (this.quiz) {
            this.quiz.questions.forEach(item => {
                // console.log(item);
                const testItem = document.createElement('div');
                testItem.className = 'test-item';

                const testQuestionTitle = document.createElement('div');
                testQuestionTitle.className = 'test-question-title';
                testQuestionTitle.innerHTML = '<span>Вопрос ' + this.currentQuestion++ + ': </span>' + item.question;

                const answersQuestionOptions = document.createElement('div');
                answersQuestionOptions.className = 'test-question-options answers-question-options';


                item.answers.forEach(answer => {
                    // console.log(answer);

                    const testQuestionOption = document.createElement('div');
                    testQuestionOption.className = 'test-question-option';

                    const inputOption = document.createElement('input');
                    inputOption.setAttribute('type', 'radio');
                    inputOption.setAttribute('disabled', 'disabled');
                    inputOption.setAttribute('id', answer.id);

                    const labelOption = document.createElement('label');
                    labelOption.setAttribute('for', answer.id);
                    labelOption.innerHTML = answer.answer;

                    testQuestionOption.appendChild(inputOption);
                    testQuestionOption.appendChild(labelOption);
                    answersQuestionOptions.appendChild(testQuestionOption);

                    if (answer.correct) {
                        labelOption.style.color = '#5FDC33';
                        inputOption.style.border = '6px solid #5FDC33';
                    } else if (answer.correct === false) {
                        labelOption.style.color = '#DC3333';
                        inputOption.style.border = '6px solid #DC3333';
                    }


                });


                testItem.appendChild(testQuestionTitle);
                testItem.appendChild(answersQuestionOptions);

                answersQuestion.appendChild(testItem);

            });
        } else {
            location.href = '#/';
        }

    }


    backToWatchResult() {
        location.href = '#/result?id=' + this.routeParams.id;
    }

    userData() {

        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        const userEmail = Auth.getUserEmail();
        if (!userEmail) {
            location.href = '#/';
        }

        this.userDataElement.innerHTML = 'Тест выполнил' + '<span> ' + userInfo.fullName + ', ' + userEmail + ' </span>';
    }
}

