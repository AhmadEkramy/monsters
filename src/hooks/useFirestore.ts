import { useState, useEffect } from 'react';
import {
    collection,
    query,
    onSnapshot,
    QueryConstraint,
    DocumentData,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useCollection<T = DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = []
) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(collection(db, collectionName), ...constraints);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: any[] = [];
            snapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            setData(items);
            setLoading(false);
        }, (err) => {
            setError(err);
            setLoading(false);
        });

        return unsubscribe;
    }, [collectionName]);

    const add = async (newData: Omit<T, 'id'>) => {
        return await addDoc(collection(db, collectionName), newData as any);
    };

    const update = async (id: string, updatedData: Partial<T>) => {
        const docRef = doc(db, collectionName, id);
        return await updateDoc(docRef, updatedData as any);
    };

    const remove = async (id: string) => {
        const docRef = doc(db, collectionName, id);
        return await deleteDoc(docRef);
    };

    return { data, loading, error, add, update, remove };
}
