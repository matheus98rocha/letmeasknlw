import React from 'react'

import { useParams } from 'react-router-dom'

import LogoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';

import { UseAuth } from '../hooks/useAuth';

import '../styles/room.scss';
import { RoomCode } from '../components/RoomCode';
import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { database } from '../services/firebase';
import { useEffect } from 'react';


type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;

}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;

}

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = UseAuth();

    const notify = () => toast("Você precisa estar logado para enviar uma perguntas.", {
        autoClose: 4000,
        closeOnClick: true,
        type: 'warning',

    })

    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    const params = useParams<RoomParams>();
    const roomId = params.id

    useEffect(() => {

        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {

            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            });
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestion);
        })

    }, [roomId]);

    async function handleSendQuestion(event: FormEvent) {

        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            notify();
            return;
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.photo,
            },
            isHighLighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');

    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LogoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala: {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {
                            user ? (
                                <div className="user-info">
                                    <img src={user.photo} alt={user.name} />
                                    <span>{user.name}</span>
                                </div>
                            ) : (
                                <span>Para enviar uma pergunta, <button className="login-btn">faça seu login.</button></span>
                            )
                        }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div >
    )
}
