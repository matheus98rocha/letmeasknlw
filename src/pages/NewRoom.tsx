import { Link, useHistory } from 'react-router-dom';
import { FormEvent } from 'react'
import ilustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg'

import { database } from '../services/firebase';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { UseAuth } from '../hooks/useAuth';
import { useState } from 'react';

export function NewRoom() {

    const { user } = UseAuth();
    const history = useHistory();
    const [newRoom, SetNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {

        event.preventDefault();

        if (newRoom.trim() === "") {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        })

        history.push(`/admins/rooms/${firebaseRoom.key}`);
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={ilustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => SetNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em um sala existente? <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}