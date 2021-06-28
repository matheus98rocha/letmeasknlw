import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import LogoImg from '../assets/images/logo.svg';
// import { UseAuth } from '../hooks/useAuth';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss';
import { RoomCode } from '../components/RoomCode';

import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { Button } from '../components/Button';
import { database } from '../services/firebase';


type RoomParams = {
    id: string;
}

export function AdminRoom() {

    // const { user } = UseAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id
    const history = useHistory();

    const { title, questions } = useRoom(roomId);

    console.log(questions)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        // Usar o react modal
        if (window.confirm('Você tem certeza que deseja excluir essa pergunta')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {

        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });

    }

    async function handleHighlightQuestion(questionId: string) {

        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });

    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LogoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button
                            isOutlined
                            onClick={handleEndRoom}
                        >
                            Encerar sala
                        </Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala: {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {
                        questions.map(question => {
                            return (
                                <>
                                    <>
                                        <Question
                                            content={question.content}
                                            author={question.author}
                                            key={question.id}
                                            isAnswered={question.isAnswered}
                                            isHighlighted={question.isHighlighted}

                                        >
                                            {!question.isAnswered &&
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                                    >
                                                        <img src={checkImg} alt="Checar pergunta" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleHighlightQuestion(question.id)}
                                                    >
                                                        <img src={answerImg} alt="Responder pergunta" />
                                                    </button>
                                                </>
                                            }

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteQuestion(question.id)}
                                            >
                                                <img src={deleteImg} alt="Remover pergunta" />
                                            </button>
                                        </Question>
                                    </>
                                </>
                            );
                        })
                    }
                </div>
            </main>
        </div >
    )
}
