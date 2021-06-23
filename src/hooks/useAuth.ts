import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function UseAuth() {
    const value = useContext(AuthContext);
    return value;
}