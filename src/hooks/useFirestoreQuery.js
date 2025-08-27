import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Custom hook for Firestore queries with React Query
export const useFirestoreQuery = (queryKey, queryFn, options = {}) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// Custom hook for Firestore mutations
export const useFirestoreMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries();
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Firestore mutation error:', error);
      options.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Predefined query functions for common Firestore operations
export const firestoreQueries = {
  // Get a single document
  getDocument: (collectionName, docId) => async () => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error('Document not found');
  },

  // Get documents from a collection
  getCollection: (collectionName, constraints = []) => async () => {
    const collectionRef = collection(db, collectionName);
    let q = collectionRef;
    
    if (constraints.length > 0) {
      q = query(collectionRef, ...constraints);
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get documents with where clause
  getWhere: (collectionName, field, operator, value) => async () => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },
};

// Predefined mutation functions
export const firestoreMutations = {
  // Add a document
  addDocument: (collectionName) => async (data) => {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    return { id: docRef.id, ...data };
  },

  // Update a document
  updateDocument: (collectionName) => async ({ id, ...data }) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    return { id, ...data };
  },

  // Delete a document
  deleteDocument: (collectionName) => async (id) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return id;
  },
};

// Example usage hooks for common operations
export const useStudents = (year, section) => {
  return useFirestoreQuery(
    ['students', year, section],
    firestoreQueries.getWhere('students', 'year', '==', year),
    {
      enabled: !!year && !!section,
    }
  );
};

export const useCourses = (instructorId) => {
  return useFirestoreQuery(
    ['courses', instructorId],
    firestoreQueries.getWhere('courses', 'instructor', '==', instructorId),
    {
      enabled: !!instructorId,
    }
  );
};

export const useAttendance = (courseId, date) => {
  return useFirestoreQuery(
    ['attendance', courseId, date],
    firestoreQueries.getWhere('attendance', 'courseId', '==', courseId),
    {
      enabled: !!courseId && !!date,
    }
  );
};

// Mutation hooks
export const useAddStudent = () => {
  return useFirestoreMutation(firestoreMutations.addDocument('students'));
};

export const useUpdateStudent = () => {
  return useFirestoreMutation(firestoreMutations.updateDocument('students'));
};

export const useDeleteStudent = () => {
  return useFirestoreMutation(firestoreMutations.deleteDocument('students'));
};

export const useAddAttendance = () => {
  return useFirestoreMutation(firestoreMutations.addDocument('attendance'));
};

export const useUpdateAttendance = () => {
  return useFirestoreMutation(firestoreMutations.updateDocument('attendance'));
};
